import { getDb } from "@/db";
import { quotes } from "@/db/schema";

type QuotePayload = {
  zip?: string; itemId?: string; quantity?: number; fabric?: string; condition?: string; stain?: boolean; pet?: boolean;
  notes?: string; uploadKeys?: string[]; total?: number; comparison?: number; slot?: string; name?: string; email?: string;
  phone?: string; address?: string; access?: string; consent?: boolean; source?: string;
};

function clean(value: unknown, limit = 500) { return typeof value === "string" ? value.trim().slice(0, limit) : ""; }
function reference() { return `NC-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`; }

export async function POST(request: Request) {
  try {
    const body = await request.json() as QuotePayload;
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 40);
    if (!/^\d{5}$/.test(clean(body.zip, 5)) || !email.includes("@") || phone.replace(/\D/g, "").length < 10 || !body.consent || !Number.isFinite(body.total)) {
      return Response.json({ error: "Required quote fields are invalid." }, { status: 400 });
    }
    const id = reference();
    const db = await getDb();
    await db.insert(quotes).values({
      reference: id,
      source: clean(body.source, 30) || "quote",
      zip: clean(body.zip, 5),
      itemId: clean(body.itemId, 80),
      quantity: Math.min(24, Math.max(1, Number(body.quantity) || 1)),
      fabric: clean(body.fabric, 80),
      condition: clean(body.condition, 80),
      hasStain: Boolean(body.stain),
      hasPet: Boolean(body.pet),
      notes: clean(body.notes, 1500),
      uploadKeys: Array.isArray(body.uploadKeys) ? body.uploadKeys.slice(0, 5).map((value) => clean(value, 260)) : [],
      estimateTotal: Number(body.total),
      comparisonTotal: Number(body.comparison) || Number(body.total),
      requestedSlot: clean(body.slot, 80),
      customerName: clean(body.name, 120),
      email,
      phone,
      address: clean(body.address, 300),
      accessNotes: clean(body.access, 1000),
      consentAt: new Date().toISOString(),
    });
    return Response.json({ reference: id, status: "requested" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save quote";
    return Response.json({ error: message.includes("no such table") ? "Quote storage is awaiting its database migration." : "Unable to save quote." }, { status: 503 });
  }
}
