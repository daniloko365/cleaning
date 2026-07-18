import { clearAdminSessionCookie } from "@/lib/admin-auth";
import { json } from "@/lib/http";

export async function POST(request: Request) {
  return json(
    { authenticated: false },
    { headers: { "set-cookie": clearAdminSessionCookie(request) } },
  );
}

