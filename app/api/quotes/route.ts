import { getDb } from "@/db";
import { quotes } from "@/db/schema";
import { clean, json, readJson, validEmail } from "@/lib/http";
import { LEGAL_VERSION } from "@/lib/legal-content";
import { calculateEstimate } from "@/lib/site-data";

type QuotePayload = {
  zip?: string; itemId?: string; quantity?: number; fabric?: string; condition?: string; stain?: boolean; pet?: boolean;
  notes?: string; uploadKeys?: string[]; slot?: string; name?: string; email?: string;
  phone?: string; address?: string; access?: string; consent?: boolean; source?: string;
};

function reference() { return `NC-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`; }

export async function POST(request: Request) {
  try {
    const body = await readJson<QuotePayload & Record<string, unknown>>(request);
    const zip = clean(body.zip, 5);
    const email = clean(body.email, 180).toLowerCase();
    const phone = clean(body.phone, 40);
    const name = clean(body.name, 120);
    const address = clean(body.address, 300);
    const estimate = calculateEstimate({ zip, itemId: clean(body.itemId, 80), quantity: Number(body.quantity), stain: body.stain === true, pet: body.pet === true });
    const fabric = clean(body.fabric, 80);
    const condition = clean(body.condition, 80);
    const slot = clean(body.slot, 80);
    const [slotDate, slotWindow] = slot.split("|");
    const date = /^\d{4}-\d{2}-\d{2}$/.test(slotDate || "") ? new Date(`${slotDate}T12:00:00Z`) : null;
    const withinWindow = date && date.getTime() > Date.now() && date.getTime() < Date.now() + 90 * 24 * 60 * 60 * 1000;
    const validSlot = withinWindow && new Set(["8–11 AM", "12–3 PM"]).has(slotWindow);
    if (!estimate || !validEmail(email) || phone.replace(/\D/g, "").length < 10 || !name || !address || body.consent !== true || !new Set(["unknown", "synthetic", "natural", "delicate"]).has(fabric) || !new Set(["routine", "visible", "heavy", "restoration"]).has(condition) || !validSlot) {
      return json({ error: "Required quote fields are invalid." }, { status: 400 });
    }
    const id = reference();
    const db = await getDb();
    await db.insert(quotes).values({
      reference: id,
      source: body.source === "booking" ? "booking" : "quote",
      zip,
      itemId: estimate.item.id,
      quantity: estimate.quantity,
      fabric,
      condition,
      hasStain: Boolean(body.stain),
      hasPet: Boolean(body.pet),
      notes: clean(body.notes, 1500),
      uploadKeys: Array.isArray(body.uploadKeys) ? body.uploadKeys.slice(0, 5).map((value) => clean(value, 260)).filter((value) => /^quotes\/\d{4}-\d{2}-\d{2}\/[a-f\d-]+\.(jpg|png|webp)$/i.test(value)) : [],
      estimateTotal: estimate.total,
      comparisonTotal: estimate.comparison,
      requestedSlot: slot,
      customerName: name,
      email,
      phone,
      address,
      accessNotes: clean(body.access, 1000),
      consentAt: new Date().toISOString(),
      termsVersion: LEGAL_VERSION,
      privacyVersion: LEGAL_VERSION,
    });
    return json({ reference: id, status: "requested", estimate: estimate.total, comparison: estimate.comparison }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save quote";
    return json({ error: message === "PAYLOAD_TOO_LARGE" ? "The request is too large." : message.includes("no such table") ? "Quote storage is awaiting its database migration." : "Unable to save quote." }, { status: message === "PAYLOAD_TOO_LARGE" ? 413 : 503 });
  }
}
