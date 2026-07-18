import type { Metadata } from "next";
import { HomePageContent } from "@/components/home-page";
import { loadSiteConfig } from "@/lib/site-settings.server";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadSiteConfig();
  return {
    title: config.seo.homeTitleEn,
    description: config.seo.homeDescriptionEn,
    alternates: {
      canonical: "/",
      languages: { "en-US": "/", "es-US": "/es", "x-default": "/" },
    },
    openGraph: {
      title: `${config.seo.homeTitleEn} | Novaclean`,
      description: config.seo.homeDescriptionEn,
      url: "/",
      locale: "en_US",
    },
  };
}

export default function HomePage() {
  return <HomePageContent />;
}
