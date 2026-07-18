import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { SiteConfigProvider } from "@/components/site-config-provider";
import { loadSiteConfig } from "@/lib/site-settings.server";
import { siteUrl } from "@/lib/site-url";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadSiteConfig();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${config.seo.homeTitleEn} | Novaclean`,
      template: "%s | Novaclean",
    },
    description: config.seo.defaultDescription,
    icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Novaclean",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Novaclean upholstery cleaning in Orange County",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: config.seo.googleSiteVerification
      ? { google: config.seo.googleSiteVerification }
      : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#102d2a",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await loadSiteConfig();
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Novaclean",
        description:
          "Mobile upholstery and textile cleaning in Orange County, California.",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Orange County, California",
        },
        logo: `${siteUrl}/apple-touch-icon.png`,
        image: `${siteUrl}/og.png`,
        priceRange: "$$",
        url: siteUrl,
        ...(config.business.phone ? { telephone: config.business.phone } : {}),
        ...(config.business.email ? { email: config.business.email } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Novaclean",
        url: siteUrl,
        inLanguage: ["en-US", "es-US"],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.mobile-conversion{display:none!important}`}</style>
        </noscript>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteConfigProvider value={config}>
          {children}
          <Analytics />
        </SiteConfigProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </body>
    </html>
  );
}
