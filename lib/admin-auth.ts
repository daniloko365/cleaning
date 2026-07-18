const COOKIE_NAME = "novaclean_admin";
const SESSION_SECONDS = 12 * 60 * 60;

async function sameSecret(left: string, right: string) {
  const encoded = (value: string) =>
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [a, b] = await Promise.all([encoded(left), encoded(right)]);
  const first = new Uint8Array(a);
  const second = new Uint8Array(b);
  let difference = left.length === right.length ? 0 : 1;
  for (let index = 0; index < first.length; index++)
    difference |= first[index] ^ second[index];
  return difference === 0;
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(
    new Uint8Array(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)),
    ),
  );
}

async function authEnv() {
  const { env } = await import("cloudflare:workers");
  return env as unknown as {
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD?: string;
    ADMIN_SESSION_SECRET?: string;
    ADMIN_ACCESS_TOKEN?: string;
  };
}

export async function validAdminCredentials(username: string, password: string) {
  const env = await authEnv();
  const expectedUsername = env.ADMIN_USERNAME || "admin";
  return Boolean(
    env.ADMIN_PASSWORD &&
      username &&
      password &&
      (await sameSecret(username, expectedUsername)) &&
      (await sameSecret(password, env.ADMIN_PASSWORD)),
  );
}

export async function createAdminSession(username: string) {
  const env = await authEnv();
  if (!env.ADMIN_SESSION_SECRET) throw new Error("Admin session secret missing.");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${encodeURIComponent(username)}.${expires}`;
  return `${payload}.${await sign(payload, env.ADMIN_SESSION_SECRET)}`;
}

function cookieValue(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  for (const part of cookies.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE_NAME) return value.join("=");
  }
  return "";
}

async function validSession(request: Request) {
  const session = cookieValue(request);
  const [username, expiresText, signature] = session.split(".");
  const expires = Number(expiresText);
  if (!username || !signature || !Number.isFinite(expires)) return false;
  if (expires <= Math.floor(Date.now() / 1000)) return false;
  const env = await authEnv();
  if (!env.ADMIN_SESSION_SECRET) return false;
  const payload = `${username}.${expiresText}`;
  return sameSecret(signature, await sign(payload, env.ADMIN_SESSION_SECRET));
}

export async function hasAdminAccess(request: Request) {
  if (await validSession(request)) return true;
  const env = await authEnv();
  const supplied =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  return Boolean(
    env.ADMIN_ACCESS_TOKEN &&
      supplied.length >= 20 &&
      (await sameSecret(supplied, env.ADMIN_ACCESS_TOKEN)),
  );
}

export function adminSessionCookie(request: Request, value: string) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`;
}

export function clearAdminSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

