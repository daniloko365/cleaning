import type { MetadataRoute } from "next";
import { guides, servicePages } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://novacleanoc.com";
  const staticRoutes = ["", "/pricing", "/get-quote", "/book", "/how-it-works", "/service-area", "/results", "/reviews", "/about", "/team", "/contact", "/faq", "/services", "/fabrics", "/fabric-care-codes", "/what-we-do-not-clean", "/commercial", "/guides", "/prepare", "/aftercare", "/gift-cards", "/referral", "/care-plan", "/price-comparison-methodology", "/guarantee", "/privacy", "/notice-at-collection", "/photo-media-consent", "/terms", "/sms-terms", "/cancellation", "/commercial-terms", "/accessibility", "/licenses-insurance"];
  const fabricRoutes = ["microfiber", "polyester", "cotton-linen", "velvet", "wool", "leather"].map((slug) => `/fabrics/${slug}`);
  const commercialRoutes = ["property-managers", "offices", "multifamily-turnovers", "hospitality-seating", "request-bid"].map((slug) => `/commercial/${slug}`);
  const serviceRoutes = servicePages.map((service) => `/services/${service.slug}`);
  const guideRoutes = guides.map((guide) => `/guides/${guide.slug}`);
  return [...staticRoutes, ...serviceRoutes, ...fabricRoutes, ...commercialRoutes, ...guideRoutes].map((path) => ({ url: `${base}${path}`, changeFrequency: path.startsWith("/guides/") ? "monthly" : "weekly", priority: path === "" ? 1 : path === "/get-quote" || path === "/pricing" ? .9 : .7 }));
}
