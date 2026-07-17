import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/portal", "/get-quote", "/book", "/launch-checklist", "/thank-you/", "/track", "/reschedule", "/claim"] }], sitemap: `${siteUrl}/sitemap.xml` };
}
