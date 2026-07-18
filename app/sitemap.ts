import type { MetadataRoute } from "next";
import { servicePages } from "@/lib/site-data";
import { legalPaths } from "@/lib/legal-content";
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
    "/price-comparison-methodology",
    ...legalPaths.map((path) => `/${path}`),
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
    "/price-comparison-methodology",
    ...serviceRoutes,
  ].map((path) => `/es${path}`);
  return [...staticRoutes, ...serviceRoutes, ...spanishCore].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority:
      path === "" || path === "/es" ? 1 : path.endsWith("/pricing") ? 0.9 : 0.7,
  }));
}
