import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the conversion homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Clean fabric\./);
  assert.match(html, /Clear price\./);
  assert.match(html, /Orange County/);
  assert.match(html, /\$69/);
  assert.match(html, /Get exact price/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|react-loading-skeleton/);
});

test("pricing and service pages use the public comparison language", async () => {
  const [pricing, service] = await Promise.all([render("/pricing"), render("/services/sofa-couch-cleaning")]);
  assert.equal(pricing.status, 200); assert.equal(service.status, 200);
  const pricingHtml = await pricing.text(); const serviceHtml = await service.text();
  assert.match(pricingHtml, /Published comparison/i);
  assert.match(pricingHtml, /at least 30%/i);
  assert.match(pricingHtml, /\$99/);
  assert.match(pricingHtml, /\$69/);
  assert.match(serviceHtml, /Sofa &amp; couch cleaning/);
  assert.match(serviceHtml, /application\/ld\+json/);
});

test("quote route exposes the first accessible step", async () => {
  const response = await render("/get-quote");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Where should we come\?/);
  assert.match(html, /Service ZIP/);
  assert.match(html, /Step 1 \/ 8/);
});

test("portal and admin routes are private, useful and server-rendered", async () => {
  const [portal, admin] = await Promise.all([render("/portal"), render("/admin")]);
  assert.equal(portal.status, 200); assert.equal(admin.status, 200);
  const portalHtml = await portal.text(); const adminHtml = await admin.text();
  assert.match(portalHtml, /One reference\. Every next step\./);
  assert.match(portalHtml, /noindex/i);
  assert.match(adminHtml, /Novaclean control room/);
  assert.match(adminHtml, /noindex/i);
});

test("project includes storage, migrations, favicon, OG and only two verify labels", async () => {
  const [hosting, ui, data, schema] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../components/ui.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);
  const hostingConfig = JSON.parse(hosting);
  assert.match(hostingConfig.project_id, /^appgprj_/);
  assert.equal(hostingConfig.d1, "DB");
  assert.equal(hostingConfig.r2, "MEDIA");
  assert.match(ui, /\[VERIFY LEGAL\]/); assert.match(ui, /\[VERIFY BEFORE LAUNCH\]/);
  assert.equal((ui.match(/\[VERIFY/g) ?? []).length, 2);
  assert.match(data, /core:\s*0/);
  assert.match(schema, /commercialLeads/); assert.match(schema, /contactMessages/); assert.match(schema, /analyticsEvents/); assert.match(schema, /careRequests/);
  await Promise.all([
    access(new URL("../public/favicon.png", import.meta.url)),
    access(new URL("../public/apple-touch-icon.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../drizzle/0000_cultured_phalanx.sql", import.meta.url)),
    access(new URL("../drizzle/0001_military_zaladane.sql", import.meta.url)),
    access(new URL("../drizzle/0002_complete_lucky_pierre.sql", import.meta.url)),
  ]);
});

test("every canonical launch price follows the 70 percent rule and names a source", async () => {
  const data = await readFile(new URL("../lib/site-data.ts", import.meta.url), "utf8");
  const rows = [...data.matchAll(/competitor:\s*([\d.]+),\s*price:\s*([\d.]+),[^\n]+source:\s*"([^"]+)"/g)];
  assert.equal(rows.length, 23);
  for (const [, competitorText, priceText, source] of rows) {
    const competitor = Number(competitorText); const price = Number(priceText);
    const expected = competitor < 10 ? Number((competitor * .7).toFixed(2)) : Math.floor(competitor * .7);
    assert.equal(price, expected, `${source}: ${competitor} should display ${expected}`);
    assert.ok(source.length > 0);
  }
});
