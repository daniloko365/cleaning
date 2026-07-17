import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/launch-checklist", "/thank-you/", "/track", "/reschedule", "/claim"] }], sitemap: "https://novacleanoc.com/sitemap.xml" };
}
