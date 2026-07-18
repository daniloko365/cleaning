import type { Metadata } from "next";
import { HomePageContent } from "@/components/home-page";

export const metadata: Metadata = {
  title: "Upholstery & Textile Cleaning in Orange County",
  description:
    "Instant menu-based estimates for mobile sofa, sectional, mattress, rug and carpet cleaning across Orange County, with photo review before confirmation.",
  alternates: { canonical: "/", languages: { "en-US": "/", "es-US": "/es" } },
};

export default function HomePage() {
  return <HomePageContent />;
}
