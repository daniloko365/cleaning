/* eslint-disable @next/next/no-img-element -- pre-cropped local WebP assets avoid the unavailable preview image binding */
import type { Metadata } from "next";
import Link from "next/link";
import { BeforeAfter, PricePulse, Reveal } from "@/components/motion";
import { ZipChecker } from "@/components/zip-checker";
import { CTA, FAQ, Price, PriceGrid, ProcessRail, SectionHeading, ServiceGrid, TrustStrip } from "@/components/ui";
import { SiteShell } from "@/components/site-shell";
import { QuoteResume } from "@/components/quote-resume";

export const metadata: Metadata = {
  title: "Novaclean | Upholstery & Textile Cleaning in Orange County",
  description: "Photo-first pricing for mobile sofa, sectional, mattress, rug and carpet cleaning across Orange County. See scope and estimate before you book.",
  alternates: { canonical: "/", languages: { "en-US": "/", "es-US": "/es" } },
};

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero">
        <img className="hero__image" src="/media/final/novaclean-hero.webp" alt="Sunlit sectional sofa in a calm living room" fetchPriority="high" />
        <div className="hero__veil" />
        <div className="shell hero__inner">
          <Reveal className="hero__copy">
            <p className="eyebrow eyebrow--light">Orange County · mobile textile care</p>
            <h1>Clean fabric.<br /><em>Clear price.</em></h1>
            <p className="hero__dek">Sofas, sectionals, mattresses and carpets—priced from photos before we step through the door.</p>
            <div className="hero__price"><PricePulse>Launch price</PricePulse><Price id="sofa" compact /></div>
            <ZipChecker dark />
          </Reveal>
          <Reveal className="hero__note" delay={180}>
            <span>Price lock</span><p>Your estimate holds when the item, photos and condition match. No surprise work without approval.</p>
          </Reveal>
        </div>
        <div className="hero__scroll" aria-hidden="true"><span>Scroll to explore</span><i /></div>
      </section>

      <QuoteResume />

      <TrustStrip />

      <section className="section section--ivory" id="pricing">
        <div className="shell">
          <SectionHeading eyebrow="Fast price anchors" title={<>Start with the item.<br /><em>Know the number.</em></>} copy="Every launch price is at least 30% below its documented local published comparison after downward rounding. Scope still matters—so the details sit beside the price." />
          <PriceGrid />
          <div className="section-foot"><p>No core-zone visit minimum for sofa, sectional or mattress service. Comparison sources and checked dates are public.</p><Link className="text-link" href="/pricing">Open full pricing →</Link></div>
        </div>
      </section>

      <section className="section section--ink problem-section">
        <div className="shell">
          <SectionHeading light eyebrow="Choose the problem" title={<>Don’t learn our menu.<br /><em>Tell us what happened.</em></>} copy="The right branch asks different questions: pet odor is not a routine refresh, and a sectional should not be a surprise piece-count at the door." />
          <div className="problem-list">
            {[
              ["My sofa looks tired", "/services/sofa-couch-cleaning", "Everyday soil + spots"],
              ["I have pet odor", "/services/pet-stain-odor-removal", "Source-level assessment"],
              ["I need a sleep reset", "/services/mattress-cleaning", "Mattress + headboard"],
              ["I am moving", "/services/move-in-move-out", "Multi-surface plan"],
              ["I manage properties", "/commercial/property-managers", "Repeatable B2B care"],
            ].map(([title, href, meta], index) => <Reveal delay={index * 45} key={title}><Link href={href}><small>0{index + 1}</small><strong>{title}</strong><span>{meta}</span><b>↗</b></Link></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section results-tease">
        <div className="shell">
          <SectionHeading eyebrow="The proof standard" title={<>Same angle. Same light.<br /><em>Move the line.</em></>} copy="A useful result shows the textile, issue, method and remaining limitation—not an exaggerated color shift. This launch demo establishes the intended gallery interaction; real job pairs replace it before proof claims go live." />
          <div className="result-layout">
            <BeforeAfter />
            <aside role="note"><p className="eyebrow">Result record · demo format</p><h3>Charcoal performance weave</h3><dl><div><dt>Item</dt><dd>3-seat sofa</dd></div><div><dt>Issue</dt><dd>Everyday soil</dd></div><div><dt>Method</dt><dd>Controlled extraction</dd></div><div><dt>Limit</dt><dd>No fabricated outcome claim</dd></div></dl><Link className="text-link" href="/results">See proof requirements →</Link></aside>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="shell">
          <SectionHeading eyebrow="From photo to aftercare" title={<>A five-step service.<br /><em>Nothing hidden.</em></>} />
          <ProcessRail />
          <div className="center-action"><Link className="button button--ink" href="/get-quote">Start with photos ↗</Link></div>
        </div>
      </section>

      <section className="section image-story image-story--pet">
        <div className="shell image-story__grid">
          <Reveal className="image-story__media"><img src="/media/final/pet-safe.webp" alt="Bernese mountain dog relaxing at home" loading="lazy" /></Reveal>
          <Reveal className="image-story__copy" delay={90}><p className="eyebrow">Pet homes need diagnosis</p><h2>Odor is a source,<br /><em>not a scent.</em></h2><p>We separate surface deodorizing, enzyme treatment and suspected deep contamination. If cleaning cannot reach the source, we say so before selling another add-on.</p><ul><li>Photo-led severity questions</li><li>Surface vs cushion/core assessment</li><li>Clear treatment limits</li><li>Dry-time and pet-access guidance</li></ul><Link className="button button--ink" href="/services/pet-stain-odor-removal">Assess pet odor ↗</Link></Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading eyebrow="What we clean" title={<>One care system.<br /><em>Built around fabric.</em></>} copy="Every page names eligibility, method, limits and the price inputs it needs. That is more useful than a generic service list." />
          <ServiceGrid limit={6} />
          <div className="center-action"><Link className="text-link" href="/services">Explore every service →</Link></div>
        </div>
      </section>

      <section className="section safety-section">
        <div className="shell safety-grid">
          <Reveal><p className="eyebrow">Fabric before chemistry</p><h2>The tag helps.<br /><em>Testing decides.</em></h2><p>W, S, WS and X are manufacturer care codes—not blanket permission. We pair the code with fiber, backing, dye and a hidden-area test.</p><Link className="text-link" href="/fabric-care-codes">Read the care-code guide →</Link></Reveal>
          <div className="code-cards">{[["W", "Water-based methods may be compatible"], ["S", "Solvent-based care may be required"], ["WS", "Either family may be possible"], ["X", "Vacuum-only / specialist review"]].map(([code, text]) => <Reveal key={code}><article><strong>{code}</strong><p>{text}</p></article></Reveal>)}</div>
        </div>
      </section>

      <section className="section section--ink service-area-tease">
        <div className="shell area-grid">
          <Reveal><p className="eyebrow eyebrow--light">Orange County coverage</p><h2>ZIP first.<br /><em>No contact wall.</em></h2><p>See your service zone and minimum before entering a name, email or phone.</p><ZipChecker dark /><Link className="text-link text-link--light" href="/service-area">Explore the service area →</Link></Reveal>
          <Reveal className="area-orbit" delay={100}>
            <div className="area-orbit__ring"><span>Irvine</span><span>Newport Beach</span><span>Anaheim</span><span>Mission Viejo</span></div>
            <div className="area-orbit__center"><b>OC</b><small>mobile care</small></div>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="shell faq-layout">
          <SectionHeading eyebrow="Questions, answered plainly" title={<>Good service starts<br /><em>before the visit.</em></>} copy="No absolute stain promise, vague drying guarantee or hidden minimum." />
          <FAQ limit={6} />
          <Link className="text-link" href="/faq">Read all FAQs →</Link>
        </div>
      </section>
      <CTA />
    </SiteShell>
  );
}
