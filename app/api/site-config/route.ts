import { loadSiteConfig } from "@/lib/site-settings.server";

export async function GET() {
  return Response.json(await loadSiteConfig(), {
    headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" },
  });
}

