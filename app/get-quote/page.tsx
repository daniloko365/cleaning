import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote-wizard";

export const metadata: Metadata = { title: "Build a Service Estimate", description: "Build a photo-first Novaclean estimate before requesting a service window.", alternates: { canonical: "/get-quote" }, robots: { index: false, follow: true } };

export default async function GetQuotePage({ searchParams }: { searchParams: Promise<{ zip?: string; service?: string }> }) {
  const query = await searchParams;
  return <QuoteWizard initialZip={(query.zip ?? "").slice(0, 5)} initialService={query.service ?? ""} />;
}
