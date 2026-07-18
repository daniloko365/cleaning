import {
  adminSessionCookie,
  createAdminSession,
  validAdminCredentials,
} from "@/lib/admin-auth";
import { clean, json, readJson } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, unknown>>(request, 2_000);
    const username = clean(body.username, 80);
    const password = clean(body.password, 200);
    if (!(await validAdminCredentials(username, password)))
      return json({ error: "Incorrect login or password." }, { status: 401 });
    const session = await createAdminSession(username);
    return json(
      { authenticated: true },
      { headers: { "set-cookie": adminSessionCookie(request, session) } },
    );
  } catch {
    return json({ error: "Unable to sign in." }, { status: 503 });
  }
}

