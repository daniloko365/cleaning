/** Cloudflare Worker entry point for the vinext-starter template. */
import {
  handleImageOptimization,
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { enforceRateLimit } from "../lib/rate-limit";
import { runRetention } from "../lib/retention";

type MediaBucket = {
  list(options: { prefix: string; cursor?: string; limit?: number }): Promise<{
    objects: { key: string; uploaded: Date | string }[];
    truncated: boolean;
    cursor?: string;
  }>;
  delete(keys: string | string[]): Promise<void>;
};

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: MediaBucket;
  NEXT_PUBLIC_SITE_URL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface ScheduledController {
  cron: string;
  scheduledTime: number;
}

function secure(response: Response, request: Request) {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    url.protocol === "https:" ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ");
  headers.set("content-security-policy", csp);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  headers.set("x-frame-options", "DENY");
  headers.set("cross-origin-opener-policy", "same-origin");
  if (url.protocol === "https:")
    headers.set(
      "strict-transport-security",
      "max-age=31536000; includeSubDomains",
    );
  if (url.pathname.startsWith("/api/"))
    headers.set("cache-control", "no-store");
  if (
    /^\/(?:es\/)?(api|admin|portal|track|reschedule|claim|get-quote|book|launch-checklist|reviews-preview)(\/|$)/.test(
      url.pathname,
    )
  )
    headers.set("x-robots-tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(
    request: Request,
    env: Env = {} as Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const canonicalUrl = new URL(
      env.NEXT_PUBLIC_SITE_URL || "https://daniilnizhelskyi.com",
    );

    const alternateHostname =
      url.hostname !== canonicalUrl.hostname &&
      (url.hostname === `www.${canonicalUrl.hostname}` ||
        url.hostname.endsWith(".workers.dev"));
    const canonicalProtocolMismatch =
      url.hostname === canonicalUrl.hostname &&
      url.protocol !== canonicalUrl.protocol;

    if (canonicalProtocolMismatch || alternateHostname) {
      const target = new URL(`${url.pathname}${url.search}`, canonicalUrl);
      return secure(Response.redirect(target, 308), request);
    }

    if (url.pathname.startsWith("/api/")) {
      try {
        const limited = await enforceRateLimit(request, env.DB);
        if (limited) return secure(limited, request);
      } catch {
        return secure(
          Response.json(
            { error: "The request security check is temporarily unavailable." },
            { status: 503, headers: { "cache-control": "no-store" } },
          ),
          request,
        );
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(
        request,
        {
          fetchAsset: (path) =>
            env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
      return secure(response, request);
    }

    return secure(await handler.fetch(request, env, ctx), request);
  },

  async scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(runRetention(env));
  },
};

export default worker;
