import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";

function clean(value: unknown, limit = 500) { return typeof value === "string" ? value.trim().slice(0, limit) : ""; }

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = clean(body.name, 120); const email = clean(body.email, 180).toLowerCase(); const message = clean(body.message, 2000);
    if (!name || !email.includes("@") || !message || body.consent !== true) return Response.json({ error: "Required message fields are invalid." }, { status: 400 });
    const reference = `MSG-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await (await getDb()).insert(contactMessages).values({ reference, customerName: name, email, phone: clean(body.phone, 40), zip: clean(body.zip, 5), topic: clean(body.topic, 80), message, consentAt: new Date().toISOString() });
    return Response.json({ reference, status: "received" }, { status: 201 });
  } catch { return Response.json({ error: "Message storage is temporarily unavailable." }, { status: 503 }); }
}
