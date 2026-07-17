import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote-wizard";

export const metadata: Metadata = { title: "Book Textile Cleaning", description: "Choose your item, see the scope and request an Orange County arrival window.", alternates: { canonical: "/book" }, robots: { index: false, follow: true } };

export default async function BookPage({ searchParams }: { searchParams: Promise<{ zip?: string; service?: string }> }) {
  const query = await searchParams;
  return <QuoteWizard initialZip={(query.zip ?? "").slice(0, 5)} initialService={query.service ?? ""} bookingMode />;
}
