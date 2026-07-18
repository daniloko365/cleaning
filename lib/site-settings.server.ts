import {
  defaultSiteConfig,
  normalizeSiteConfig,
  type PublicSiteConfig,
} from "@/lib/site-config";

type Prepared = {
  bind(...values: unknown[]): Prepared;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
};

type Database = { prepare(query: string): Prepared };

async function database(): Promise<Database | null> {
  try {
    const { env } = await import("cloudflare:workers");
    return (env as unknown as { DB?: Database }).DB ?? null;
  } catch {
    return null;
  }
}

export async function loadSiteConfig(): Promise<PublicSiteConfig> {
  try {
    const db = await database();
    if (!db) return defaultSiteConfig;
    const row = await db
      .prepare("SELECT value FROM site_settings WHERE key = ?")
      .bind("public_config")
      .first<{ value: string }>();
    return row?.value
      ? normalizeSiteConfig(JSON.parse(row.value))
      : defaultSiteConfig;
  } catch {
    return defaultSiteConfig;
  }
}

export async function saveSiteConfig(input: unknown) {
  const config = normalizeSiteConfig(input);
  const db = await database();
  if (!db) throw new Error("Site settings database is unavailable.");
  await db
    .prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `)
    .bind("public_config", JSON.stringify(config))
    .run();
  return config;
}

