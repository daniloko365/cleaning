import { getDb } from "@/db";
import { quotes, careRequests } from "@/db/schema";
import { and, eq } from "drizzle-orm";

function clean(value: unknown, limit = 500) { return typeof value === "string" ? value.trim().slice(0, limit) : ""; }

export async function POST(request: Request) {
  try {
    const body = await request.json() as { quoteReference?: string; requestType?: string; email?: string; message?: string };
    const quoteReference = clean(body.quoteReference, 80).toUpperCase();
    const email = clean(body.email, 180).toLowerCase();
    if (!quoteReference.startsWith("NC-") || !email.includes("@")) return Response.json({ error: "Enter a valid service reference and email." }, { status: 400 });
    const reference = `CARE-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await (await getDb()).insert(careRequests).values({ reference, quoteReference, requestType: clean(body.requestType, 50) || "care", email, message: clean(body.message, 1500) });
    return Response.json({ reference, status: "received" }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to save this care request." }, { status: 503 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const quoteReference = clean(url.searchParams.get("quoteReference"), 80).toUpperCase();
    const email = clean(url.searchParams.get("email"), 180).toLowerCase();
    if (!quoteReference.startsWith("NC-") || !email.includes("@")) return Response.json({ error: "Enter a valid reference and email." }, { status: 400 });
    const [quote] = await (await getDb()).select({ status: quotes.status }).from(quotes).where(and(eq(quotes.reference, quoteReference), eq(quotes.email, email))).limit(1);
    if (!quote) return Response.json({ error: "No request matches that reference and email." }, { status: 404 });
    return Response.json({ status: quote.status });
  } catch { return Response.json({ error: "Status lookup is temporarily unavailable." }, { status: 503 }); }
}
