/* eslint-disable @next/next/no-img-element -- local pre-optimized media is served directly by the Sites asset layer */
import Link from "next/link";
import { CTA, FAQ, Price, PriceGrid, PricingTable, ProcessRail, SectionHeading, ServiceGrid, VerifyBlock } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { ZipChecker } from "@/components/zip-checker";
import { SiteShell } from "@/components/site-shell";
import { CareForm } from "@/components/care-form";
import { CommercialForm } from "@/components/commercial-form";
import { ContactForm } from "@/components/contact-form";
import type { LegalDocument } from "@/lib/legal-content";
import { cities, cityName, compareDate, faq as faqData, getPrice, getPriceSource, guides, minimums, money, prices, servicePages } from "@/lib/site-data";
import { siteUrl } from "@/lib/site-url";

export function PageHero({ eyebrow, title, dek, image, children }: { eyebrow: string; title: string; dek: string; image?: string; children?: React.ReactNode }) {
  return (
    <section className={`page-hero ${image ? "page-hero--image" : ""}`}>
      {image && <img className="page-hero__image" src={image} alt="" fetchPriority="high" />}
      <div className="shell page-hero__inner">
        <div className="page-hero__crumbs"><Link href="/">Home</Link><span>/</span><span>{eyebrow}</span></div>
        <Reveal><p className="eyebrow eyebrow--light">{eyebrow}</p><h1>{title}</h1><p className="page-hero__dek">{dek}</p>{children}</Reveal>
      </div>
    </section>
  );
}

export function GenericPage({ eyebrow, title, dek, intro, sections, cta = true, image }: { eyebrow: string; title: string; dek: string; intro?: string; sections: { title: string; body: string; bullets?: string[] }[]; cta?: boolean; image?: string }) {
  return (
    <SiteShell>
      <PageHero eyebrow={eyebrow} title={title} dek={dek} image={image}>
        <div className="page-hero__actions"><Link className="button button--acid" href="/get-quote">Build my estimate ↗</Link><Link className="text-link text-link--light" href="/contact">Ask a question →</Link></div>
      </PageHero>
      <section className="section section--ivory"><div className="shell content-layout"><article className="content-prose">{intro && <p className="lede">{intro}</p>}{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p>{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</article><aside className="content-aside" role="note"><p className="eyebrow">Useful next step</p><h3>Start with the item, not a sales call.</h3><p>Choose the textile, add photos and see the current price logic before scheduling.</p><Link className="button button--ink" href="/get-quote">Build my price ↗</Link></aside></div></section>
      {cta && <CTA />}
    </SiteShell>
  );
}

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <SiteShell>
      <PageHero eyebrow={document.eyebrow} title={document.title} dek={document.summary} />
      <section className="section section--ivory">
        <div className="shell legal-layout">
          <article className="content-prose legal-document">
            <div className="legal-version"><strong>Effective July 16, 2026</strong><span>Version 2026-07-16</span></div>
            {document.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}
            {document.sources && <section className="legal-sources"><h2>Official reference material</h2><p>These links explain the regulatory framework; they are not a substitute for advice about Novaclean’s final legal entity and operations.</p><ul>{document.sources.map((source) => <li key={source.url}><a className="text-link" href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></section>}
          </article>
          <aside className="content-aside legal-nav" role="note"><p className="eyebrow">Policy center</p><h3>Related records</h3><nav aria-label="Legal and policy pages"><Link href="/privacy">Privacy policy</Link><Link href="/notice-at-collection">Notice at collection</Link><Link href="/terms">Service terms</Link><Link href="/cookie-policy">Cookie & storage</Link><Link href="/photo-media-consent">Photo policy</Link><Link href="/cancellation">Cancellation</Link><Link href="/guarantee">Care guarantee</Link><Link href="/claims-damage">Claims & damage</Link><Link href="/accessibility">Accessibility</Link><Link href="/contact">Contact / request rights</Link></nav><p className="legal-note">California counsel must confirm the final entity name, public contact details, contracting language, insurance facts, and actual retention workflow before public launch.</p></aside>
        </div>
      </section>
    </SiteShell>
  );
}

export function ServicesHub() {
  return <SiteShell><PageHero eyebrow="Services" title="Textile care, item by item." dek="Each service names the price inputs, material checks, method, drying guidance and limitations before you commit." /><section className="section section--ivory"><div className="shell"><SectionHeading eyebrow="Residential services" title={<>Built around the textile.<br /><em>Not a generic package.</em></>} /><ServiceGrid /></div></section><CTA /></SiteShell>;
}

export function ServicePage({ slug }: { slug: string }) {
  const service = servicePages.find((item) => item.slug === slug)!;
  const price = getPrice(service.priceId);
  const source = getPriceSource(price);
  const serviceSchema = { "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.problem, areaServed: { "@type": "AdministrativeArea", name: "Orange County, California" }, provider: { "@type": "Organization", name: "Novaclean", url: siteUrl }, offers: { "@type": "Offer", price: price.price, priceCurrency: "USD", url: `${siteUrl}/services/${service.slug}`, description: price.scope } };
  return (
    <SiteShell>
      <PageHero eyebrow={service.kicker} title={service.name} dek={`Mobile ${service.name.toLowerCase()} across Orange County, with a photo-built scope before the visit.`} image={service.image}>
        <div className="page-hero__actions"><Link className="button button--acid" href={`/get-quote?service=${service.priceId}`}>Price my item ↗</Link><Price id={service.priceId} compact /></div>
        <div className="page-hero__meta"><div><small>Launch price</small><strong>{money(price.price)} · {price.scope}</strong></div><div><small>Published comparison</small><strong><s>{money(price.competitor)}</s> · <a href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noreferrer" : undefined}>{source.name}</a> · checked {compareDate}</strong></div><div><small>Price rule</small><strong>At least 30% lower</strong></div></div>
      </PageHero>
      <section className="section section--ivory"><div className="shell content-layout"><article className="content-prose"><h2>What this service solves</h2><p>{service.problem}. The goal is {service.outcome}—without pretending every permanent stain, dye loss or deep source can be reversed.</p><div className="price-feature"><div><p className="eyebrow">Transparent launch price</p><Price id={service.priceId} /></div><div><h3>What is included</h3><p>{price.scope}. The photo flow checks material, construction, condition, access and service-zone minimum before booking.</p><Link className="text-link" href="/price-comparison-methodology">Comparison method →</Link></div></div><h2>The method</h2><p>{service.method}</p><div className="feature-grid">{[["01", "Eligibility first", "Care code, fiber, backing and dye behavior determine the safe method."], ["02", "Scope lock", "The photo-built scope is confirmed before work—not after a half-finished item."], ["03", "Real aftercare", "You receive airflow, use and drying guidance matched to the actual item."]].map(([n,t,b]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div><h2>What can change the scope</h2><ul><li>Delicate or undocumented material, unstable dye or damaged backing</li><li>Pet contamination below the surface fabric</li><li>Previous spotters, coatings or protectors that alter fiber response</li><li>Access, parking or item size that differs from the submitted details</li></ul><h2>What we will not promise</h2><p>We do not guarantee complete stain or odor removal, use “non-toxic” as an absolute claim, or proceed with a risky method just to preserve a booking. If the item needs specialist care, the useful answer may be a referral.</p></article><aside className="content-aside" role="note"><p className="eyebrow">Price this item</p><h3>{service.name}</h3><Price id={service.priceId} /><p>No core-zone visit minimum for sofa, sectional or mattress. Add-ons and dining-chair minimums appear before confirmation.</p><Link className="button button--ink" href={`/get-quote?service=${service.priceId}`}>Start quote ↗</Link></aside></div></section>
      <section className="section section--sand"><div className="shell"><SectionHeading eyebrow="Every visit" title={<>The same five<br /><em>decision points.</em></>} /><ProcessRail /></div></section>
      <CTA title={`Price your ${service.name.toLowerCase()} from photos.`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </SiteShell>
  );
}

export function PricingPage() {
  return (
    <SiteShell>
      <PageHero eyebrow="Pricing" title="The whole price menu. No phone gate." dek={`Novaclean launch rates are at least 30% below documented local published comparisons after downward rounding, checked ${compareDate}.`}><div className="page-hero__actions"><Link className="button button--acid" href="/get-quote">Build my estimate ↗</Link><Link className="text-link text-link--light" href="/price-comparison-methodology">Read methodology →</Link></div></PageHero>
      <section className="section section--ivory"><div className="shell"><SectionHeading eyebrow="Popular starting points" title={<>Fast anchors.<br /><em>Full scope below.</em></>} /><PriceGrid ids={["sofa", "l-sectional", "mattress", "carpet-3"]} /><div style={{ height: "5rem" }} /><PricingTable /></div></section>
      <section className="section section--sand"><div className="shell"><SectionHeading eyebrow="Minimums and rules" title={<>The honest part<br /><em>beside the number.</em></>} /><div className="feature-grid"><article><span>01</span><h3>Core zone</h3><p>No visit minimum for sofa, sectional or mattress. Dining chairs start at four; small treatments are add-ons.</p></article><article><span>02</span><h3>Extended zone</h3><p><s>${minimums.extendedComparison}</s> comparison → ${minimums.extended} launch minimum, shown after ZIP.</p></article><article><span>03</span><h3>Scope changes</h3><p>No extra work starts without an explanation, price and explicit approval.</p></article></div></div></section>
      <CTA />
    </SiteShell>
  );
}

export function ServiceAreaPage() {
  return <SiteShell><PageHero eyebrow="Service area" title="Orange County, checked by ZIP." dek="The zone and minimum appear before contact details. City pages remain non-indexed until they contain real local proof."><div className="page-hero__actions"><ZipChecker dark /></div></PageHero><section className="section section--ivory"><div className="shell"><SectionHeading eyebrow="Coverage directory" title={<>Local routes.<br /><em>No invented ETAs.</em></>} copy="These launch-area pages explain coverage and pricing. A city becomes indexable only after a real case, local note and verified availability are added." /><div className="city-grid">{cities.map((city, index) => <Link href={`/service-area/${city}`} key={city}><small>OC · {String(index + 1).padStart(2,"0")}</small><strong>{cityName(city)}</strong><span>Check ZIP ↗</span></Link>)}</div></div></section><CTA /></SiteShell>;
}

export function CityPage({ slug }: { slug: string }) {
  const name = cityName(slug);
  return <SiteShell><PageHero eyebrow="Orange County service area" title={`${name} textile cleaning`} dek={`Photo-first upholstery, mattress, rug and carpet estimates for ${name} households and property teams.`}><div className="page-hero__actions"><ZipChecker dark /></div></PageHero><section className="section section--ivory"><div className="shell content-layout"><article className="content-prose"><h2>Start with the address zone</h2><p>Enter the service ZIP to see the applicable minimum before contact details. Route timing is confirmed against the real service calendar; this page does not invent “same day” capacity.</p><h2>Popular services</h2><ul><li>Sofa and sectional care priced from item photos</li><li>Mattress and upholstered headboard cleaning</li><li>Pet stain and odor assessment by contamination level</li><li>Carpet and move-in / move-out bundles</li></ul><h2>Why this page is not yet indexed</h2><p>Novaclean does not publish near-duplicate city pages as local proof. This route becomes indexable after a verified {name} job case, service note, city-specific availability statement and internal result link are present.</p></article><aside className="content-aside" role="note"><p className="eyebrow">{name}</p><h3>Check the real zone.</h3><p>No core-zone minimum for sofa, sectional or mattress. Extended-zone minimum ${minimums.extended}.</p><Link className="button button--ink" href="/get-quote">Check ZIP ↗</Link></aside></div></section><CTA title={`Price a ${name} service from photos.`} /></SiteShell>;
}

export function GuidesHub() {
  return <SiteShell><PageHero eyebrow="Field guides" title="Useful answers before the quote." dek="Cost, care codes, drying, stains, pets and preparation—written to help a customer decide, not to create fear." /><section className="section section--ivory"><div className="shell"><div className="guide-grid">{guides.map((guide, index) => <Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><small>Guide {String(index + 1).padStart(2,"0")}</small><h3>{guide.title}</h3><p>{guide.dek}</p><span>Read guide ↗</span></Link>)}</div></div></section><CTA /></SiteShell>;
}

export function GuidePage({ slug }: { slug: string }) {
  const guide = guides.find((item) => item.slug === slug)!;
  return <GenericPage eyebrow="Novaclean field guide" title={guide.title} dek={guide.dek} intro="This launch guide establishes the decision framework. Product-specific claims, technician quotes and local case data are added only when they can be verified." sections={[{ title: "The short answer", body: "The safe and useful answer depends on item construction, material, condition and the result you are trying to achieve. One universal number or promise usually hides those inputs." }, { title: "What changes the recommendation", body: "Photos and care tags help separate routine cleaning from stain chemistry, odor-source treatment or specialist handling.", bullets: ["Fiber and care code", "Cushion, backing and fill construction", "Age and source of the issue", "Previous treatments", "Airflow and use constraints"] }, { title: "How Novaclean handles it", body: "The quote flow asks for the decision-making evidence first, shows the applicable price rule, and pauses for review if the textile falls outside routine eligibility." }, { title: "When to stop and refer", body: "Unstable dye, damaged backing, unknown coatings, deep pet contamination and specialist fibers can make a limited method or referral safer than a standard cleaning appointment." }]} />;
}

export function CommercialPage({ segment }: { segment?: string }) {
  const title = segment === "property-managers" ? "Textile turns for property managers" : segment === "offices" ? "Office seating care" : segment === "multifamily-turnovers" ? "Multifamily turnover textiles" : segment === "hospitality-seating" ? "Hospitality seating programs" : segment === "request-bid" ? "Request a commercial walkthrough" : "Commercial textile care, documented.";
  return <SiteShell><PageHero eyebrow="Commercial" title={title} dek="Photo inventory, repeatable scope, route windows and a service record built for operational handoff."><div className="page-hero__actions"><Link className="button button--acid" href="/commercial/request-bid">Request a walkthrough ↗</Link><Link className="text-link text-link--light" href="/services">Residential services →</Link></div></PageHero><section className="section section--ivory"><div className="shell"><SectionHeading eyebrow="B2B operating system" title={<>One brief in.<br /><em>One record out.</em></>} /><div className="feature-grid">{[["01","Site brief","Locations, item counts, materials, access constraints and service windows."],["02","Walkthrough scope","Priorities, exclusions, spot-treatment limits and an approval-ready estimate."],["03","Service record","Completed-item log, condition notes, issues, photos and aftercare handoff."],["04","Turnover cadence","Recurring or unit-turn work grouped into route-efficient windows."],["05","Vendor packet","W-9, COI and requested procurement facts are attached after verification."],["06","Escalation path","Damage concern and re-clean requests follow a named record, not a lost text thread."]].map(([n,t,b]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div></div></section><section className="section section--sand"><div className="shell content-layout"><article className="content-prose"><h2>What the intake needs</h2><ul><li>Property type and service locations</li><li>Approximate item / room counts</li><li>Materials and known recurring issues</li><li>Access, parking, elevator and service-hour constraints</li><li>Required insurance or vendor documents</li><li>Target date and approval owner</li></ul><h2>How pricing works</h2><p>Standard items can use the public matrix. Volume, access, recurring cadence and non-standard textiles are scoped after the walkthrough—never hidden behind “contact for price” when a public anchor is available.</p></article><aside className="content-aside" role="note"><p className="eyebrow">Commercial intake</p><h3>Send the operating brief.</h3><p>A bid request creates a trackable lead record and captures procurement needs.</p><Link className="button button--ink" href="/commercial/request-bid">Start B2B request ↗</Link></aside></div></section>{segment === "request-bid" && <section className="section section--ivory"><div className="shell"><SectionHeading eyebrow="Walkthrough brief" title={<>Give operations<br /><em>the full picture.</em></>} copy="Upload site photos or a floor plan, name access constraints and procurement requirements, and receive a trackable B2B reference." /><CommercialForm /></div></section>}<CTA title="Make textile care easier to hand off." /></SiteShell>;
}

export function FAQPage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <SiteShell><PageHero eyebrow="FAQ" title="Direct answers. Useful limits." dek="The questions that determine price, eligibility, access, drying, aftercare and what happens if a result needs review." /><section className="section section--ivory"><div className="shell"><FAQ /></div></section><CTA /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></SiteShell>;
}

export function MethodologyPage() {
  return <SiteShell><PageHero eyebrow="Pricing transparency" title="How the 30% comparison is built." dek="A documented, scope-matched launch rule—not an invented reference price." /><section className="section section--ivory"><div className="shell content-layout"><article className="content-prose"><h2>The rule</h2><p>For each line item, Novaclean uses a publicly visible local competitor price or offer with an identifiable scope. The launch price equals 70% of that comparison and is rounded down to the displayed whole dollar; small per-unit rates can retain cents. That makes the effective discount at least 30%.</p><h2>Required record</h2><ul><li>Competitor / publisher name and public URL</li><li>Observed price and exact service scope</li><li>Checked date and market geography</li><li>Novaclean matched scope and calculation</li><li>Review / retirement date if the source changes</li></ul><h2>What the strike-through does not mean</h2><p>It is not a claim that every Orange County cleaner charges the same amount, or that the comparison is a former Novaclean price. It is a local published comparison that must remain current and like-for-like.</p><VerifyBlock legal /><h2>Customer-facing display</h2><p>Comparison, Novaclean price, unit, scope and checked month appear together. The same central price records power the home page, pricing table, service pages and estimator.</p></article><aside className="content-aside" role="note"><p className="eyebrow">Checked</p><h3>{compareDate}</h3><p>{prices.length} public price lines and bundle records in the launch matrix.</p><Link className="button button--ink" href="/pricing">View prices ↗</Link></aside></div></section></SiteShell>;
}

export function LaunchChecklistPage() {
  return <SiteShell><PageHero eyebrow="Launch control" title="The only business facts still waiting." dek="The site avoids fake phones, reviews, people and credentials. These launch inputs are consolidated here instead of scattered as placeholders." /><section className="section section--ivory"><div className="shell"><VerifyBlock /><div className="policy-grid"><article><h3>Identity</h3><p>Legal business entity, public phone/text line, business email routing and service address disclosure policy.</p></article><article><h3>People</h3><p>Owner and technician names, roles, portraits, relevant experience and any background-check program wording.</p></article><article><h3>Trust</h3><p>Insurance certificate details, verified credentials, real review profiles, permissioned snippets and result pairs.</p></article><article><h3>Integrations</h3><p>Email sender/domain, SMS provider and consent copy, payment provider if deposits are enabled, and calendar capacity source.</p></article></div></div></section></SiteShell>;
}

export function CarePage({ type }: { type: "track" | "reschedule" | "claim" }) {
  const content = {
    track: ["Track a service reference.", "Use the NC reference and booking email. The lookup exposes only the request status."],
    reschedule: ["Move the window without losing the brief.", "A reschedule request keeps the item scope, photos and access notes attached."],
    claim: ["Show us what needs another look.", "Submit within the 7-day care window after full drying, with the service reference and useful detail."],
  }[type];
  return <SiteShell><PageHero eyebrow="Customer care" title={content[0]} dek={content[1]} /><section className="section section--ivory"><div className="shell content-layout"><article className="content-prose"><h2>{type === "track" ? "Find the current state" : "Keep the context attached"}</h2><p>{type === "claim" ? "The care path reviews the agreed scope, post-dry condition and safe improvement options. It is not a generic inbox or an automatic admission of damage." : type === "reschedule" ? "Send preferred alternatives. A new window is requested until it is checked against the real route calendar." : "Requested, confirmed, en route, in service, completed and care review are separate operational states."}</p><CareForm type={type} /></article><aside className="content-aside" role="note"><p className="eyebrow">Privacy</p><h3>Reference + booking email</h3><p>Status lookup does not reveal address, price, phone or item details.</p><Link className="text-link" href="/privacy">Privacy approach →</Link></aside></div></section></SiteShell>;
}

export function PortalPage() {
  const tools = [
    ["01", "Find the current state", "Reference + booking email reveals only the operational state.", "/track", "Track request"],
    ["02", "Prepare the textile", "Access, airflow, pets, fragile items and pre-service spotter guidance.", "/prepare", "Open preparation"],
    ["03", "Request a new window", "Keep the original item scope and access brief attached.", "/reschedule", "Request reschedule"],
    ["04", "Use the care window", "Send a post-dry concern into the documented re-clean review path.", "/claim", "Start care request"],
    ["05", "Review aftercare", "Drying, ventilation, first use and when to contact the care team.", "/aftercare", "Read aftercare"],
    ["06", "Book another item", "Start a new photo-built scope without changing the original record.", "/get-quote", "Price another item"],
  ];
  return (
    <SiteShell>
      <PageHero eyebrow="Customer portal" title="One reference. Every next step." dek="The launch portal uses low-friction reference access: no password account, no public address or item details, and no unconfirmed ETA claim.">
        <div className="page-hero__actions"><Link className="button button--acid" href="/track">Open my request ↗</Link><Link className="text-link text-link--light" href="/contact">Get help →</Link></div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell portal-layout">
          <div><SectionHeading eyebrow="Self-service care" title={<>The useful controls.<br /><em>Nothing exposed.</em></>} copy="Appointment detail, technician/ETA, invoices, payment and job photos can attach to the same reference once their verified systems are connected. The current launch view keeps customer data private." /></div>
          <div className="portal-grid">{tools.map(([number, title, body, href, label]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p><Link className="text-link" href={href}>{label} →</Link></article>)}</div>
          <div className="portal-status"><div><p className="eyebrow">Private lookup</p><h2>Check the service state.</h2><p>Use the reference shown after submission and the exact booking email.</p></div><CareForm type="track" /></div>
        </div>
      </section>
    </SiteShell>
  );
}

export function ContactPage() {
  return <SiteShell><PageHero eyebrow="Contact" title="Start with the item. Ask anything else here." dek="Estimate requests use the photo flow. General, privacy and accessibility questions create a trackable message reference."><div className="page-hero__actions"><Link className="button button--acid" href="/get-quote">Build my estimate ↗</Link><Link className="text-link text-link--light" href="/track">Track a request →</Link></div></PageHero><section className="section section--ivory"><div className="shell content-layout"><article className="content-prose"><h2>Send a direct message</h2><p>The verified public phone/text line is added in the consolidated launch check. This form works now and stores the purpose, consent time and a customer reference without inventing contact details.</p><ContactForm /></article><aside className="content-aside" role="note"><p className="eyebrow">Choose the right path</p><h3>Price, care or business?</h3><p>Use photo quote for a new item, the NC reference routes for an existing job, and commercial intake for properties or workplaces.</p><Link className="text-link" href="/commercial/request-bid">Commercial brief →</Link></aside></div></section></SiteShell>;
}
