type MediaBucket = { put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown> };
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 42 * 1024 * 1024) return json({ error: "The upload request is too large." }, { status: 413 });
    const form = await request.formData();
    const files = form.getAll("files").filter((value): value is File => value instanceof File).slice(0, 5);
    if (!files.length) return json({ error: "No image files supplied." }, { status: 400 });
    const { env } = await import("cloudflare:workers");
    const bucket = (env as unknown as { MEDIA?: MediaBucket }).MEDIA;
    if (!bucket) return json({ error: "Upload storage is unavailable." }, { status: 503 });
    const keys: string[] = [];
    for (const file of files) {
      if (!allowed.has(file.type) || file.size > 8 * 1024 * 1024 || file.size < 16) return json({ error: "Use valid JPG, PNG or WebP images up to 8 MB each." }, { status: 400 });
      const sanitized = sanitizeImage(await file.arrayBuffer(), file.type);
      if (!sanitized) return json({ error: "An image signature or structure is invalid." }, { status: 400 });
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const key = `quotes/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
      await bucket.put(key, sanitized, { httpMetadata: { contentType: file.type } });
      keys.push(key);
    }
    return json({ keys }, { status: 201 });
  } catch {
    return json({ error: "Unable to process the upload." }, { status: 500 });
  }
}
import { json } from "@/lib/http";
import { sanitizeImage } from "@/lib/media-security";
