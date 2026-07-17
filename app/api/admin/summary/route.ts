import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { analyticsEvents, careRequests, commercialLeads, contactMessages, quotes } from "@/db/schema";

async function sameSecret(left: string, right: string) {
  const encoded = (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [a, b] = await Promise.all([encoded(left), encoded(right)]);
  const first = new Uint8Array(a); const second = new Uint8Array(b);
  let difference = left.length === right.length ? 0 : 1;
  for (let index = 0; index < first.length; index++) difference |= first[index] ^ second[index];
  return difference === 0;
}

export async function GET(request: Request) {
  try {
    const { env } = await import("cloudflare:workers");
    const expected = (env as unknown as { ADMIN_ACCESS_TOKEN?: string }).ADMIN_ACCESS_TOKEN;
    const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!expected || supplied.length < 20 || !(await sameSecret(supplied, expected))) return Response.json({ error: "Not found" }, { status: 404 });
    const db = await getDb();
    const [quoteRows, careRows, commercialRows, messageRows, eventRows] = await Promise.all([
      db.select({ value: count() }).from(quotes).where(eq(quotes.status, "requested")),
      db.select({ value: count() }).from(careRequests).where(eq(careRequests.status, "received")),
      db.select({ value: count() }).from(commercialLeads).where(eq(commercialLeads.status, "received")),
      db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.status, "received")),
      db.select({ value: count() }).from(analyticsEvents),
    ]);
    return Response.json({
      generatedAt: new Date().toISOString(),
      queues: [
        { label: "Unreviewed photo quotes", count: quoteRows[0]?.value ?? 0, state: "live" },
        { label: "Open care / re-clean requests", count: careRows[0]?.value ?? 0, state: "live" },
        { label: "Commercial briefs", count: commercialRows[0]?.value ?? 0, state: "live" },
        { label: "General / privacy messages", count: messageRows[0]?.value ?? 0, state: "live" },
        { label: "First-party analytics events", count: eventRows[0]?.value ?? 0, state: "live" },
      ],
      controls: [
        { label: "Calendar capacity / conflict detection", state: "request-only", detail: "Windows remain requested until the verified calendar provider confirms route capacity; this prevents false double-booking claims." },
        { label: "SMS and email delivery failures", state: "provider-ready", detail: "Notification templates exist; delivery/failure signals activate with the verified sender, domain and SMS provider." },
        { label: "Payment failures and final-price variance", state: "deferred", detail: "No payment is collected in the launch flow, so payment failures and estimate-vs-final variance are not fabricated." },
        { label: "Price source expiry", state: "manual gate", detail: "All public comparisons show source and checked month; legal launch verification owns refresh/expiry." },
        { label: "Abandoned requests", state: "local fallback", detail: "Drafts save and resume in the customer browser without collecting contact data prematurely." },
        { label: "City-page proof threshold", state: "protected", detail: "All city routes stay noindex until a real case, service note, availability fact and internal proof link exist." },
      ],
    }, { headers: { "cache-control": "no-store" } });
  } catch { return Response.json({ error: "Not found" }, { status: 404 }); }
}
