import { getDb } from "@/db";
import { analyticsEvents } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { event?: string; path?: string; sessionId?: string; payload?: Record<string, unknown> };
    if (!body.event || !body.path || !body.sessionId) return new Response(null, { status: 204 });
    await (await getDb()).insert(analyticsEvents).values({ event: body.event.slice(0, 80), path: body.path.slice(0, 260), sessionId: body.sessionId.slice(0, 100), payload: body.payload ?? {} });
    return new Response(null, { status: 204 });
  } catch { return new Response(null, { status: 204 }); }
}
