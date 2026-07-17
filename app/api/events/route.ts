import { getDb } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { clean, readJson } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request, 8_000);
    const event = clean(body.event, 80); const path = clean(body.path, 260); const sessionId = clean(body.sessionId, 100);
    if (!event || !path.startsWith("/") || !sessionId) return new Response(null, { status: 204 });
    const payload = body.payload && typeof body.payload === "object" && !Array.isArray(body.payload) ? body.payload as Record<string, unknown> : {};
    await (await getDb()).insert(analyticsEvents).values({ event, path, sessionId, payload });
    return new Response(null, { status: 204 });
  } catch { return new Response(null, { status: 204 }); }
}
