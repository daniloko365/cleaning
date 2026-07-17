import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { clean, json, readJson, validEmail } from "@/lib/http";
import { LEGAL_VERSION } from "@/lib/legal-content";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request, 16_000);
    const name = clean(body.name, 120); const email = clean(body.email, 180).toLowerCase(); const message = clean(body.message, 2000);
    const zip = clean(body.zip, 5); const topic = clean(body.topic, 80);
    if (!name || !validEmail(email) || !message || body.consent !== true || (zip && !/^\d{5}$/.test(zip)) || !new Set(["question", "fabric", "existing", "accessibility", "privacy"]).has(topic)) return json({ error: "Required message fields are invalid." }, { status: 400 });
    const reference = `MSG-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await (await getDb()).insert(contactMessages).values({ reference, customerName: name, email, phone: clean(body.phone, 40), zip, topic, message, consentAt: new Date().toISOString(), privacyVersion: LEGAL_VERSION });
    return json({ reference, status: "received" }, { status: 201 });
  } catch (error) { return json({ error: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "The request is too large." : "Message storage is temporarily unavailable." }, { status: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 503 }); }
}
