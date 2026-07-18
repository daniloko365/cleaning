import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/portal",
          "/launch-checklist",
          "/thank-you/",
          "/track",
          "/reschedule",
          "/claim",
          "/reviews-preview",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
