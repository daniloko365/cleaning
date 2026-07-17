import { getDb } from "@/db";
import { commercialLeads } from "@/db/schema";

function clean(value: unknown, limit = 500) { return typeof value === "string" ? value.trim().slice(0, limit) : ""; }
function number(value: unknown, max: number) { return Math.min(max, Math.max(0, Number(value) || 0)); }

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const company = clean(body.company, 200); const name = clean(body.name, 120); const email = clean(body.email, 180).toLowerCase(); const phone = clean(body.phone, 40);
    if (!company || !name || !email.includes("@") || phone.replace(/\D/g, "").length < 10 || body.consent !== true) return Response.json({ error: "Required commercial fields are invalid." }, { status: 400 });
    const reference = `B2B-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await (await getDb()).insert(commercialLeads).values({
      reference, company, customerName: name, role: clean(body.role, 120), email, phone,
      propertyType: clean(body.propertyType, 80) || "other", locations: Math.max(1, number(body.locations, 999)),
      seatingCount: number(body.seatingCount, 50000), carpetSqft: number(body.carpetSqft, 5000000),
      frequency: clean(body.frequency, 80) || "one-time", accessHours: clean(body.accessHours, 300), targetDate: clean(body.targetDate, 20),
      requiresCoi: body.coi === true, procurement: clean(body.procurement, 1200), notes: clean(body.notes, 2000),
      uploadKeys: Array.isArray(body.uploadKeys) ? body.uploadKeys.slice(0, 5).map((value) => clean(value, 260)) : [],
      consentAt: new Date().toISOString(),
    });
    return Response.json({ reference, status: "received" }, { status: 201 });
  } catch { return Response.json({ error: "Commercial intake storage is temporarily unavailable." }, { status: 503 }); }
}
