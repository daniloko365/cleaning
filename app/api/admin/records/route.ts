import { hasAdminAccess } from "@/lib/admin-auth";
import { clean, json, readJson } from "@/lib/http";

type Prepared = {
  bind(...values: unknown[]): Prepared;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
};
type Database = { prepare(query: string): Prepared };
type MediaBucket = { delete(keys: string | string[]): Promise<void> };

const records = {
  quote: { table: "quotes", media: true, statuses: new Set(["requested", "reviewing", "confirmed", "completed", "cancelled", "declined"]) },
  care: { table: "care_requests", media: false, statuses: new Set(["received", "reviewing", "resolved", "denied"]) },
  commercial: { table: "commercial_leads", media: true, statuses: new Set(["received", "reviewing", "proposal-sent", "won", "lost"]) },
  message: { table: "contact_messages", media: false, statuses: new Set(["received", "reviewing", "resolved"]) },
} as const;

type RecordType = keyof typeof records;

function parseKeys(value: unknown) {
  if (typeof value !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    if (!(await hasAdminAccess(request))) return json({ error: "Not found" }, { status: 404 });
    const body = await readJson<Record<string, unknown>>(request, 4_000);
    const type = clean(body.type, 20) as RecordType;
    const reference = clean(body.reference, 80).toUpperCase();
    const action = clean(body.action, 30);
    const spec = records[type];
    if (!spec || !/^[A-Z]+-[A-Z0-9-]+$/.test(reference)) return json({ error: "Invalid record." }, { status: 400 });

    const { env } = await import("cloudflare:workers");
    const bindings = env as unknown as { DB: Database; MEDIA?: MediaBucket };
    const existing = await bindings.DB.prepare(`SELECT legal_hold AS legalHold, ${spec.media ? "upload_keys" : "'[]'"} AS uploadKeys FROM ${spec.table} WHERE reference = ?`).bind(reference).first<{ legalHold: number; uploadKeys: string }>();
    if (!existing) return json({ error: "Record not found." }, { status: 404 });

    if (action === "status") {
      const status = clean(body.status, 30);
      if (!spec.statuses.has(status as never)) return json({ error: "Invalid status." }, { status: 400 });
      await bindings.DB.prepare(`UPDATE ${spec.table} SET status = ? WHERE reference = ?`).bind(status, reference).run();
      return json({ reference, status });
    }

    if (action === "legal-hold") {
      const legalHold = body.legalHold === true;
      await bindings.DB.prepare(`UPDATE ${spec.table} SET legal_hold = ? WHERE reference = ?`).bind(legalHold ? 1 : 0, reference).run();
      return json({ reference, legalHold });
    }

    if (action === "delete") {
      if (existing.legalHold) return json({ error: "Remove the legal hold before deletion." }, { status: 409 });
      const keys = spec.media ? parseKeys(existing.uploadKeys) : [];
      if (keys.length && bindings.MEDIA) await bindings.MEDIA.delete(keys);
      await bindings.DB.prepare(`DELETE FROM ${spec.table} WHERE reference = ?`).bind(reference).run();
      return json({ reference, deleted: true });
    }

    return json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    return json({ error: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "The request is too large." : "Unable to update the record." }, { status: 503 });
  }
}

