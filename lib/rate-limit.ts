type D1Prepared = {
  bind(...values: unknown[]): D1Prepared;
  first<T>(): Promise<T | null>;
};

type D1Like = {
  prepare(query: string): D1Prepared;
};

type RateLimitPolicy = {
  key: string;
  limit: number;
  windowSeconds: number;
};

const WRITE_POLICIES: Record<string, RateLimitPolicy> = {
  "/api/upload": { key: "upload", limit: 10, windowSeconds: 15 * 60 },
  "/api/quotes": { key: "quote", limit: 8, windowSeconds: 15 * 60 },
  "/api/commercial": { key: "commercial", limit: 10, windowSeconds: 15 * 60 },
  "/api/contact": { key: "contact", limit: 10, windowSeconds: 15 * 60 },
  "/api/care": { key: "care-write", limit: 10, windowSeconds: 15 * 60 },
  "/api/events": { key: "event", limit: 60, windowSeconds: 10 * 60 },
};

export function rateLimitPolicy(request: Request): RateLimitPolicy | null {
  const { pathname } = new URL(request.url);
  if (request.method === "POST" && WRITE_POLICIES[pathname]) return WRITE_POLICIES[pathname];
  if (request.method === "GET" && pathname === "/api/care") return { key: "care-read", limit: 30, windowSeconds: 10 * 60 };
  if (pathname.startsWith("/api/admin/")) return { key: "admin", limit: 30, windowSeconds: 5 * 60 };
  return null;
}

async function fingerprint(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const rotation = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${rotation}|novaclean-rate-limit|${forwarded}`),
  );
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function enforceRateLimit(request: Request, db: D1Like): Promise<Response | null> {
  const policy = rateLimitPolicy(request);
  if (!policy) return null;

  const nowSeconds = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(nowSeconds / policy.windowSeconds);
  const expiresAt = new Date((bucket + 1) * policy.windowSeconds * 1000).toISOString();
  const key = `${policy.key}:${bucket}:${await fingerprint(request)}`;
  const row = await db.prepare(`
    INSERT INTO rate_limits (key, hits, expires_at)
    VALUES (?, 1, ?)
    ON CONFLICT(key) DO UPDATE SET hits = hits + 1
    RETURNING hits
  `).bind(key, expiresAt).first<{ hits: number }>();

  if (!row || row.hits <= policy.limit) return null;
  const retryAfter = Math.max(1, Math.ceil(new Date(expiresAt).getTime() / 1000 - nowSeconds));
  return Response.json(
    { error: "Too many requests. Please wait and try again." },
    { status: 429, headers: { "cache-control": "no-store", "retry-after": String(retryAfter) } },
  );
}

