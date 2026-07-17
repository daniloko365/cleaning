import { getDb } from "@/db";
import { commercialLeads } from "@/db/schema";
import { clean, json, readJson, validEmail } from "@/lib/http";
import { LEGAL_VERSION } from "@/lib/legal-content";
function number(value: unknown, max: number) { return Math.min(max, Math.max(0, Number(value) || 0)); }

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request, 32_000);
    const company = clean(body.company, 200); const name = clean(body.name, 120); const email = clean(body.email, 180).toLowerCase(); const phone = clean(body.phone, 40);
    const propertyType = clean(body.propertyType, 80); const frequency = clean(body.frequency, 80); const targetDate = clean(body.targetDate, 20);
    if (!company || !name || !validEmail(email) || phone.replace(/\D/g, "").length < 10 || body.consent !== true || !new Set(["office", "multifamily", "hospitality", "rental-portfolio", "other"]).has(propertyType) || !new Set(["one-time", "turnovers", "quarterly", "biannual", "custom"]).has(frequency) || (targetDate && !/^\d{4}-\d{2}-\d{2}$/.test(targetDate))) return json({ error: "Required commercial fields are invalid." }, { status: 400 });
    const reference = `B2B-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await (await getDb()).insert(commercialLeads).values({
      reference, company, customerName: name, role: clean(body.role, 120), email, phone,
      propertyType, locations: Math.max(1, number(body.locations, 999)),
      seatingCount: number(body.seatingCount, 50000), carpetSqft: number(body.carpetSqft, 5000000),
      frequency, accessHours: clean(body.accessHours, 300), targetDate,
      requiresCoi: body.coi === true, procurement: clean(body.procurement, 1200), notes: clean(body.notes, 2000),
      uploadKeys: Array.isArray(body.uploadKeys) ? body.uploadKeys.slice(0, 5).map((value) => clean(value, 260)).filter((value) => /^quotes\/\d{4}-\d{2}-\d{2}\/[a-f\d-]+\.(jpg|png|webp)$/i.test(value)) : [],
      consentAt: new Date().toISOString(),
      privacyVersion: LEGAL_VERSION,
    });
    return json({ reference, status: "received" }, { status: 201 });
  } catch (error) { return json({ error: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? "The request is too large." : "Commercial intake storage is temporarily unavailable." }, { status: error instanceof Error && error.message === "PAYLOAD_TOO_LARGE" ? 413 : 503 }); }
}
