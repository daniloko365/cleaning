async function sameSecret(left: string, right: string) {
  const encoded = (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [a, b] = await Promise.all([encoded(left), encoded(right)]);
  const first = new Uint8Array(a);
  const second = new Uint8Array(b);
  let difference = left.length === right.length ? 0 : 1;
  for (let index = 0; index < first.length; index++) difference |= first[index] ^ second[index];
  return difference === 0;
}

export async function hasAdminAccess(request: Request) {
  const { env } = await import("cloudflare:workers");
  const expected = (env as unknown as { ADMIN_ACCESS_TOKEN?: string }).ADMIN_ACCESS_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  return Boolean(expected && supplied.length >= 20 && await sameSecret(supplied, expected));
}

