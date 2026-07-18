import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the conversion homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Clean fabric[\s\S]*Clear price\./);
  assert.match(html, /Orange County/);
  assert.match(html, /\$99/);
  assert.match(html, /Build my estimate/i);
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /frame-ancestors 'none'/,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.doesNotMatch(
    html,
    /Your site is taking shape|Codex is working|react-loading-skeleton/,
  );
});

test("pricing and service pages use matched public benchmark language without discount theater", async () => {
  const [pricing, service] = await Promise.all([
    render("/pricing"),
    render("/services/sofa-couch-cleaning"),
  ]);
  assert.equal(pricing.status, 200);
  assert.equal(service.status, 200);
  const pricingHtml = await pricing.text();
  const serviceHtml = await service.text();
  assert.match(pricingHtml, /Published benchmark/i);
  assert.doesNotMatch(pricingHtml, /30%|strike-through/i);
  assert.match(pricingHtml, /\$99/);
  assert.match(pricingHtml, /Public-rate match/i);
  assert.match(serviceHtml, /Sofa &amp; couch cleaning/);
  assert.match(serviceHtml, /application\/ld\+json/);
});

test("quote route exposes the first accessible step", async () => {
  const response = await render("/get-quote");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Where should we come\?/);
  assert.match(html, /Service ZIP/);
  assert.match(html, /Step 1 \/ 6/);
});

test("portal and admin routes are private, useful and server-rendered", async () => {
  const [portal, admin] = await Promise.all([
    render("/portal"),
    render("/admin"),
  ]);
  assert.equal(portal.status, 200);
  assert.equal(admin.status, 200);
  const portalHtml = await portal.text();
  const adminHtml = await admin.text();
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
  assert.match(ui, /\[VERIFY LEGAL\]/);
  assert.match(ui, /\[VERIFY BEFORE LAUNCH\]/);
  assert.equal((ui.match(/\[VERIFY/g) ?? []).length, 2);
  assert.match(data, /core:\s*0/);
  assert.match(schema, /commercialLeads/);
  assert.match(schema, /contactMessages/);
  assert.match(schema, /analyticsEvents/);
  assert.match(schema, /careRequests/);
  await Promise.all([
    access(new URL("../public/favicon.png", import.meta.url)),
    access(new URL("../public/apple-touch-icon.png", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../drizzle/0000_cultured_phalanx.sql", import.meta.url)),
    access(new URL("../drizzle/0001_military_zaladane.sql", import.meta.url)),
    access(
      new URL("../drizzle/0002_complete_lucky_pierre.sql", import.meta.url),
    ),
    access(new URL("../drizzle/0003_odd_gargoyle.sql", import.meta.url)),
    access(
      new URL("../drizzle/0004_dazzling_albert_cleary.sql", import.meta.url),
    ),
  ]);
});

test("every canonical price matches its public benchmark and names a source", async () => {
  const data = await readFile(
    new URL("../lib/site-data.ts", import.meta.url),
    "utf8",
  );
  const rows = [
    ...data.matchAll(
      /\{\s*id:[\s\S]*?benchmark:\s*([\d.]+),[\s\S]*?price:\s*([\d.]+),[\s\S]*?source:\s*"([^"]+)"[\s\S]*?\},/g,
    ),
  ];
  assert.equal(rows.length, 22);
  for (const [, benchmarkText, priceText, source] of rows) {
    const benchmark = Number(benchmarkText);
    const price = Number(priceText);
    assert.equal(price, benchmark, `${source}: ${benchmark} should be matched`);
    assert.ok(source.length > 0);
  }
});

test("legal center renders current, source-backed privacy and claims records", async () => {
  const [privacy, notice, cookie, claims] = await Promise.all([
    render("/privacy"),
    render("/notice-at-collection"),
    render("/cookie-policy"),
    render("/claims-damage"),
  ]);
  for (const response of [privacy, notice, cookie, claims])
    assert.equal(response.status, 200);
  assert.match(await privacy.text(), /California privacy choices/);
  assert.match(
    await notice.text(),
    /Categories, purposes, and intended retention/,
  );
  assert.match(
    await cookie.text(),
    /does not persist name, email, phone, address/,
  );
  assert.match(await claims.text(), /Preserve evidence and mitigate/);
});

test("sitemap excludes conversion, private, and proof-pending routes", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.doesNotMatch(xml, /\/get-quote|\/book|\/results|\/reviews|\/team/);
  assert.match(xml, /\/privacy/);
  assert.match(xml, /\/claims-damage/);
});

test("quote implementation never fabricates a local submission reference and recalculates on the server", async () => {
  const [wizard, route, data] = await Promise.all([
    readFile(
      new URL("../components/quote-wizard.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/api/quotes/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-data.ts", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(wizard, /localReference/);
  assert.match(wizard, /Nothing was submitted/);
  assert.match(wizard, /step >= 6/);
  assert.match(wizard, /removeItem\("novaclean-quote"\)/);
  assert.match(route, /calculateEstimate/);
  assert.doesNotMatch(route, /body\.total|body\.comparison/);
  assert.match(data, /const coreZips = new Set/);
});

test("Spanish routes share one locale architecture and declare their language", async () => {
  const [home, quote, legal, i18n] = await Promise.all([
    render("/es"),
    render("/es/get-quote"),
    render("/es/privacy"),
    readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8"),
  ]);
  assert.equal(home.status, 200);
  assert.equal(quote.status, 200);
  assert.match(await home.text(), /lang="es"[\s\S]*Textiles limpios/);
  assert.match(await quote.text(), /lang="es"[\s\S]*¿A dónde vamos\?/);
  assert.ok([307, 308].includes(legal.status));
  assert.equal(
    new URL(legal.headers.get("location"), "http://localhost").pathname,
    "/privacy",
  );
  assert.match(i18n, /export const locales = \["en", "es"\] as const/);
  assert.match(i18n, /export function localizedPath/);
  assert.match(i18n, /export function routeLocale/);
  assert.match(i18n, /export const homeMessages/);
  assert.match(i18n, /export const quoteMessages/);
});

test("hero and editorial imagery are not reused across unrelated blocks", async () => {
  const [home, data] = await Promise.all([
    readFile(new URL("../components/home-page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-data.ts", import.meta.url), "utf8"),
  ]);
  const publicImageReferences = `${home}\n${data}`;
  assert.equal(
    (publicImageReferences.match(/novaclean-hero\.webp/g) ?? []).length,
    1,
  );
  assert.equal(
    (publicImageReferences.match(/pet-home-editorial\.webp/g) ?? []).length,
    1,
  );
  assert.equal(
    (publicImageReferences.match(/pet-safe\.webp/g) ?? []).length,
    1,
  );
  assert.doesNotMatch(
    publicImageReferences,
    /cleaning-process|dining-home|BeforeAfter/,
  );
  await access(
    new URL("../public/media/final/pet-home-editorial.webp", import.meta.url),
  );
});

test("review placeholders are explicit, noindexed, and absent from the public empty state", async () => {
  const [preview, reviews, templates] = await Promise.all([
    render("/reviews-preview"),
    render("/reviews"),
    readFile(
      new URL("../components/page-templates.tsx", import.meta.url),
      "utf8",
    ),
  ]);
  assert.equal(preview.status, 200);
  assert.equal(reviews.status, 200);
  assert.match(preview.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.match(
    await preview.text(),
    /INTERNAL UI PREVIEW — NOT CUSTOMER FEEDBACK/,
  );
  assert.doesNotMatch(await reviews.text(), /Not Reviews Yet/);
  assert.equal((templates.match(/— placeholder"/g) ?? []).length, 6);
  assert.match(
    templates,
    /Not Reviews Yet\. Not Reviews Yet\. Not Reviews Yet\. Not Reviews Yet\. Not Reviews Yet\. Not Reviews Yet\. Not Reviews Yet\. /,
  );
});
