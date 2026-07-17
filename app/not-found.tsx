import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return <SiteShell><section className="page-hero"><div className="shell page-hero__inner"><p className="eyebrow eyebrow--light">404 · page not found</p><h1>This route needs a better address.</h1><p className="page-hero__dek">The quote you started is still saved in this browser.</p><div className="page-hero__actions"><Link className="button button--acid" href="/">Return home</Link><Link className="text-link text-link--light" href="/get-quote">Continue quote →</Link></div></div></section></SiteShell>;
}
