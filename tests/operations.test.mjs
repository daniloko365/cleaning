import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { enforceRateLimit, rateLimitPolicy } from "../lib/rate-limit.ts";
import { runRetention } from "../lib/retention.ts";

test("API rate policies protect writes and return retry guidance", async () => {
  assert.deepEqual(rateLimitPolicy(new Request("https://example.com/api/quotes", { method: "POST" })), { key: "quote", limit: 8, windowSeconds: 900 });
  assert.equal(rateLimitPolicy(new Request("https://example.com/pricing")), null);

  let hits = 0;
  const db = {
    prepare() {
      return {
        bind() { return this; },
        async first() { hits += 1; return { hits }; },
      };
    },
  };
  const request = new Request("https://example.com/api/quotes", { method: "POST", headers: { "cf-connecting-ip": "192.0.2.1" } });
  for (let index = 0; index < 8; index++) assert.equal(await enforceRateLimit(request, db), null);
  const limited = await enforceRateLimit(request, db);
  assert.equal(limited?.status, 429);
  assert.ok(Number(limited?.headers.get("retry-after")) > 0);
});

test("retention deletes expired rows and only orphaned media", async () => {
  const statements = [];
  const deletedKeys = [];
  const db = {
    prepare(query) {
      const statement = {
        values: [],
        bind(...values) { this.values = values; return this; },
        async all() { return { results: [{ uploadKeys: JSON.stringify(["quotes/kept.png"]) }] }; },
        async run() {
          statements.push(query);
          if (query.includes("INSERT INTO retention_runs")) return { meta: { last_row_id: 7, changes: 1 } };
          if (query.includes("DELETE FROM analytics_events")) return { meta: { changes: 2 } };
          if (query.includes("DELETE FROM contact_messages")) return { meta: { changes: 3 } };
          if (query.includes("DELETE FROM commercial_leads")) return { meta: { changes: 4 } };
          if (query.includes("DELETE FROM care_requests")) return { meta: { changes: 5 } };
          if (query.includes("DELETE FROM quotes")) return { meta: { changes: 6 } };
          return { meta: { changes: 0 } };
        },
      };
      return statement;
    },
  };
  const old = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const bucket = {
    async list() { return { truncated: false, objects: [{ key: "quotes/kept.png", uploaded: old }, { key: "quotes/orphan.png", uploaded: old }] }; },
    async delete(keys) { deletedKeys.push(...(Array.isArray(keys) ? keys : [keys])); },
  };
  const result = await runRetention({ DB: db, MEDIA: bucket });
  assert.deepEqual(result, { analyticsDeleted: 2, contactDeleted: 3, commercialDeleted: 4, careDeleted: 5, quoteDeleted: 6, mediaDeleted: 1 });
  assert.deepEqual(deletedKeys, ["quotes/orphan.png"]);
  assert.ok(statements.some((query) => query.includes("legal_hold = 0")));
});

test("migration, cron and protected admin record controls ship together", async () => {
  const [migration, worker, prepare, records] = await Promise.all([
    readFile(new URL("../drizzle/0004_dazzling_albert_cleary.sql", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/prepare-cloudflare-config.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/records/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(migration, /CREATE TABLE `rate_limits`/);
  assert.match(migration, /CREATE TABLE `retention_runs`/);
  assert.match(migration, /`legal_hold`/);
  assert.match(worker, /enforceRateLimit/);
  assert.match(worker, /async scheduled/);
  assert.match(worker, /workers\.dev/);
  assert.match(worker, /canonicalProtocolMismatch/);
  assert.match(worker, /Response\.redirect\(target, 308\)/);
  assert.match(prepare, /17 8 \* \* \*/);
  assert.match(prepare, /custom_domain: true/);
  assert.match(prepare, /daniilnizhelskyi\.com,www\.daniilnizhelskyi\.com/);
  assert.match(records, /Remove the legal hold before deletion/);
  await access(new URL("../app/api/admin/retention/route.ts", import.meta.url));
});
