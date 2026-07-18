type D1Result = { meta?: { changes?: number; last_row_id?: number } };
type D1All<T> = { results?: T[] };
type D1Prepared = {
  bind(...values: unknown[]): D1Prepared;
  all<T>(): Promise<D1All<T>>;
  run(): Promise<D1Result>;
};
type D1Like = { prepare(query: string): D1Prepared };

type R2ObjectLike = { key: string; uploaded: Date | string };
type R2List = { objects: R2ObjectLike[]; truncated: boolean; cursor?: string };
type R2Like = {
  list(options: { prefix: string; cursor?: string; limit?: number }): Promise<R2List>;
  delete(keys: string | string[]): Promise<void>;
};

export type RetentionEnvironment = { DB: D1Like; MEDIA?: R2Like };
export type RetentionResult = {
  analyticsDeleted: number;
  contactDeleted: number;
  commercialDeleted: number;
  careDeleted: number;
  quoteDeleted: number;
  mediaDeleted: number;
};

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const changes = (result: D1Result) => Number(result.meta?.changes || 0);

async function deleteExpired(db: D1Like, sql: string, cutoff: string) {
  return changes(await db.prepare(sql).bind(cutoff).run());
}

function parseKeys(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

async function referencedMedia(db: D1Like) {
  const rows = await db.prepare(`
    SELECT upload_keys AS uploadKeys FROM quotes
    UNION ALL
    SELECT upload_keys AS uploadKeys FROM commercial_leads
  `).all<{ uploadKeys: unknown }>();
  return new Set((rows.results || []).flatMap((row) => parseKeys(row.uploadKeys)));
}

async function deleteOrphanedMedia(db: D1Like, bucket?: R2Like) {
  if (!bucket) return 0;
  const referenced = await referencedMedia(db);
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let cursor: string | undefined;
  let deleted = 0;

  do {
    const page = await bucket.list({ prefix: "quotes/", cursor, limit: 1000 });
    const expired = page.objects
      .filter((object) => new Date(object.uploaded).getTime() < cutoff && !referenced.has(object.key))
      .map((object) => object.key);
    for (let index = 0; index < expired.length; index += 100) {
      const batch = expired.slice(index, index + 100);
      if (batch.length) await bucket.delete(batch);
      deleted += batch.length;
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  return deleted;
}

export async function runRetention(env: RetentionEnvironment): Promise<RetentionResult> {
  const started = await env.DB.prepare("INSERT INTO retention_runs (status) VALUES ('running')").run();
  const runId = Number(started.meta?.last_row_id || 0);

  try {
    const analyticsDeleted = await deleteExpired(
      env.DB,
      "DELETE FROM analytics_events WHERE created_at < datetime(?)",
      daysAgo(396),
    );
    const contactDeleted = await deleteExpired(
      env.DB,
      "DELETE FROM contact_messages WHERE legal_hold = 0 AND created_at < datetime(?)",
      daysAgo(730),
    );
    const commercialDeleted = await deleteExpired(
      env.DB,
      "DELETE FROM commercial_leads WHERE legal_hold = 0 AND created_at < datetime(?)",
      daysAgo(730),
    );
    const careDeleted = await deleteExpired(
      env.DB,
      "DELETE FROM care_requests WHERE legal_hold = 0 AND created_at < datetime(?)",
      daysAgo(730),
    );
    const quoteDeleted = changes(await env.DB.prepare(`
      DELETE FROM quotes
      WHERE legal_hold = 0 AND (
        (status IN ('completed', 'paid', 'closed') AND created_at < datetime(?))
        OR
        (status NOT IN ('completed', 'paid', 'closed') AND created_at < datetime(?))
      )
    `).bind(daysAgo(2557), daysAgo(730)).run());
    await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < datetime(?)").bind(daysAgo(2)).run();
    const mediaDeleted = await deleteOrphanedMedia(env.DB, env.MEDIA);
    const result = { analyticsDeleted, contactDeleted, commercialDeleted, careDeleted, quoteDeleted, mediaDeleted };

    if (runId) {
      await env.DB.prepare(`
        UPDATE retention_runs SET
          status = 'completed', analytics_deleted = ?, contact_deleted = ?, commercial_deleted = ?,
          care_deleted = ?, quote_deleted = ?, media_deleted = ?, completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(analyticsDeleted, contactDeleted, commercialDeleted, careDeleted, quoteDeleted, mediaDeleted, runId).run();
    }
    return result;
  } catch (error) {
    if (runId) {
      await env.DB.prepare(`
        UPDATE retention_runs SET status = 'failed', error = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(error instanceof Error ? error.message.slice(0, 500) : "Unknown retention failure", runId).run();
    }
    throw error;
  }
}

