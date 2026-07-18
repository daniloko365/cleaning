import { hasAdminAccess } from "@/lib/admin-auth";
import { json } from "@/lib/http";
import { runRetention } from "@/lib/retention";

export async function POST(request: Request) {
  try {
    if (!(await hasAdminAccess(request))) return json({ error: "Authentication required." }, { status: 401 });
    const { env } = await import("cloudflare:workers");
    const result = await runRetention(env as never);
    return json({ status: "completed", ...result });
  } catch {
    return json({ error: "Retention cleanup could not complete." }, { status: 503 });
  }
}
