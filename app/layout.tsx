import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://novacleanoc.com"),
  title: { default: "Novaclean | Orange County Textile Care", template: "%s | Novaclean" },
  description: "Photo-first pricing for mobile upholstery, mattress, rug and carpet care in Orange County.",
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: { type: "website", locale: "en_US", siteName: "Novaclean", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Novaclean — clean fabric, clear price" }] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#102d2a", colorScheme: "light" };

const organization = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Novaclean",
  description: "Mobile upholstery and textile cleaning in Orange County, California.",
  areaServed: { "@type": "AdministrativeArea", name: "Orange County, California" },
  priceRange: "$$",
  url: "https://novacleanoc.com",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        <noscript><style>{`.reveal{opacity:1!important;transform:none!important}.mobile-conversion{display:none!important}`}</style></noscript>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div id="main-content">{children}</div>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </body>
    </html>
  );
}
