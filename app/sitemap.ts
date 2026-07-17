import type { MetadataRoute } from "next";
import { guides, servicePages } from "@/lib/site-data";
import { legalPaths } from "@/lib/legal-content";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const staticRoutes = ["", "/pricing", "/how-it-works", "/service-area", "/about", "/contact", "/faq", "/services", "/fabrics", "/fabric-care-codes", "/what-we-do-not-clean", "/commercial", "/guides", "/prepare", "/aftercare", "/price-comparison-methodology", ...legalPaths.map((path) => `/${path}`)];
  const fabricRoutes = ["microfiber", "polyester", "cotton-linen", "velvet", "wool", "leather"].map((slug) => `/fabrics/${slug}`);
  const commercialRoutes = ["property-managers", "offices", "multifamily-turnovers", "hospitality-seating"].map((slug) => `/commercial/${slug}`);
  const serviceRoutes = servicePages.map((service) => `/services/${service.slug}`);
  const guideRoutes = guides.map((guide) => `/guides/${guide.slug}`);
  return [...staticRoutes, ...serviceRoutes, ...fabricRoutes, ...commercialRoutes, ...guideRoutes].map((path) => ({ url: `${base}${path}`, changeFrequency: path.startsWith("/guides/") ? "monthly" : "weekly", priority: path === "" ? 1 : path === "/pricing" ? .9 : .7 }));
}
