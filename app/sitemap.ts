import type { MetadataRoute } from "next";
import { servicePages } from "@/lib/site-data";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const staticRoutes = [
    "",
    "/pricing",
    "/how-it-works",
    "/service-area",
    "/about",
    "/contact",
    "/faq",
    "/services",
    "/fabric-care-codes",
    "/what-we-do-not-clean",
    "/commercial",
    "/prepare",
    "/aftercare",
  ];
  const serviceRoutes = servicePages.map(
    (service) => `/services/${service.slug}`,
  );
  const spanishCore = [
    "",
    "/pricing",
    "/how-it-works",
    "/service-area",
    "/about",
    "/contact",
    "/faq",
    "/services",
    ...serviceRoutes,
  ].map((path) => `/es${path}`);
  return [...staticRoutes, ...serviceRoutes, ...spanishCore].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-07-18T00:00:00.000Z"),
    changeFrequency: "weekly",
    priority:
      path === "" || path === "/es" ? 1 : path.endsWith("/pricing") ? 0.9 : 0.7,
  }));
}
