import { getDb } from "@/db";
import { quotes, careRequests } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { clean, json, readJson, validEmail } from "@/lib/http";
import { LEGAL_VERSION } from "@/lib/legal-content";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request);
    const quoteReference = clean(body.quoteReference, 80).toUpperCase();
    const email = clean(body.email, 180).toLowerCase();
    const requestType = clean(body.requestType, 50);
    const message = clean(body.message, 1500);
    if (!/^NC-[A-Z0-9-]+$/.test(quoteReference) || !validEmail(email) || !new Set(["reschedule", "claim"]).has(requestType) || !message) return json({ error: "Enter a valid service reference, email, and request detail." }, { status: 400 });
    const db = await getDb();
    const [quote] = await db.select({ reference: quotes.reference }).from(quotes).where(and(eq(quotes.reference, quoteReference), eq(quotes.email, email))).limit(1);
    if (!quote) return json({ error: "No request matches that reference and email." }, { status: 404 });
    const reference = `CARE-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await db.insert(careRequests).values({ reference, quoteReference, requestType, email, message, privacyVersion: LEGAL_VERSION });
    return json({ reference, status: "received" }, { status: 201 });
  } catch (error) {
    return json({ error: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "The request is too large." : "Unable to save this care request." }, { status: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 503 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const quoteReference = clean(url.searchParams.get("quoteReference"), 80).toUpperCase();
    const email = clean(url.searchParams.get("email"), 180).toLowerCase();
    if (!/^NC-[A-Z0-9-]+$/.test(quoteReference) || !validEmail(email)) return json({ error: "Enter a valid reference and email." }, { status: 400 });
    const [quote] = await (await getDb()).select({ status: quotes.status }).from(quotes).where(and(eq(quotes.reference, quoteReference), eq(quotes.email, email))).limit(1);
    if (!quote) return json({ error: "No request matches that reference and email." }, { status: 404 });
    return json({ status: quote.status });
  } catch { return json({ error: "Status lookup is temporarily unavailable." }, { status: 503 }); }
}
