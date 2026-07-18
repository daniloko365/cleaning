import { hasAdminAccess } from "@/lib/admin-auth";
import { json, readJson } from "@/lib/http";
import { loadSiteConfig, saveSiteConfig } from "@/lib/site-settings.server";

export async function GET(request: Request) {
  if (!(await hasAdminAccess(request)))
    return json({ error: "Authentication required." }, { status: 401 });
  return json({ config: await loadSiteConfig() });
}

export async function PUT(request: Request) {
  try {
    if (!(await hasAdminAccess(request)))
      return json({ error: "Authentication required." }, { status: 401 });
    const body = await readJson<Record<string, unknown>>(request, 64_000);
    const config = await saveSiteConfig(body.config);
    return json({ config, savedAt: new Date().toISOString() });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error && error.message === "PAYLOAD_TOO_LARGE"
            ? "Settings payload is too large."
            : "Unable to save settings.",
      },
      { status: 503 },
    );
  }
}

