/* eslint-disable @next/next/no-img-element -- these local WebP derivatives are already resized and compressed */
import Link from "next/link";
import { compareDate, faq, getPrice, getPriceSource, money, prices, servicePages } from "@/lib/site-data";
import { Reveal, TiltCard } from "@/components/motion";

export function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: React.ReactNode; copy?: React.ReactNode; light?: boolean }) {
  return (
    <Reveal className={`section-heading ${light ? "section-heading--light" : ""}`}>
      <div><p className={`eyebrow ${light ? "eyebrow--light" : ""}`}>{eyebrow}</p><h2>{title}</h2></div>
      {copy && <p className="section-heading__copy">{copy}</p>}
    </Reveal>
  );
}

export function Price({ id, compact = false, showEvidence = true }: { id: string; compact?: boolean; showEvidence?: boolean }) {
  const item = getPrice(id);
  const source = getPriceSource(item);
  return (
    <div className={`price-lockup ${compact ? "price-lockup--compact" : ""}`}>
      <span className="price-lockup__comparison"><s>{money(item.competitor)}{item.unit}</s><small>local published comparison</small></span>
      <strong>{money(item.price)}<small>{item.unit ?? ""}</small></strong>
      {showEvidence && <small className="price-lockup__evidence">Scope: {item.scope} · <a href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noreferrer" : undefined}>{source.name}</a> · checked {compareDate}</small>}
    </div>
  );
}

export function PriceCard({ id, index = 0 }: { id: string; index?: number }) {
  const item = getPrice(id);
  const source = getPriceSource(item);
  return (
    <Reveal delay={index * 70}>
      <TiltCard className="price-card">
        <div className="price-card__top"><span>{item.shortLabel}</span><b>30% below<br />comparison</b></div>
        <Price id={id} showEvidence={false} />
        <p>{item.scope}</p>
        <div className="price-card__foot"><small><a href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noreferrer" : undefined}>{source.name}</a> · checked {compareDate}</small><Link href={`/pricing#${id}`}>Details ↗</Link></div>
      </TiltCard>
    </Reveal>
  );
}

export function PriceGrid({ ids = ["sofa", "l-sectional", "mattress", "pet"] }: { ids?: string[] }) {
  return <div className="price-grid">{ids.map((id, index) => <PriceCard id={id} index={index} key={id} />)}</div>;
}

export function ServiceGrid({ limit }: { limit?: number }) {
  const list = limit ? servicePages.slice(0, limit) : servicePages;
  return (
    <div className="service-grid">
      {list.map((service, index) => (
        <Reveal key={service.slug} delay={(index % 3) * 70}>
          <Link href={`/services/${service.slug}`} className="service-card">
            <div className="service-card__media"><img src={service.image} alt="" loading="lazy" /></div>
            <div className="service-card__body"><span>0{index + 1}</span><div><h3>{service.name}</h3><p>{service.kicker}</p></div><b>↗</b></div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function ProcessRail() {
  const steps = [
    ["01", "Show the item", "Choose the textile, answer a few condition questions and add photos or a care tag."],
    ["02", "See the scope", "We turn item size, fabric and condition into a transparent estimate and minimum."],
    ["03", "Pick a window", "Choose an available arrival window and add access or parking notes."],
    ["04", "Pre-inspection", "The technician checks the fabric, confirms the scope and pauses if something differs."],
    ["05", "Clean + care", "We complete the agreed method, walk through the result and leave drying guidance."],
  ];
  return <div className="process-rail">{steps.map(([n, title, copy], index) => <Reveal delay={index * 55} key={n}><article><span>{n}</span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div>;
}

export function FAQ({ limit }: { limit?: number }) {
  return <div className="faq-list">{faq.slice(0, limit).map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span>{question}<b aria-hidden="true">+</b></summary><p>{answer}</p></details>)}</div>;
}

export function TrustStrip() {
  return (
    <div className="trust-strip">
      <span><b>01</b> Scope before arrival</span>
      <span><b>02</b> Fabric-first testing</span>
      <span><b>03</b> No surprise add-ons</span>
      <span><b>04</b> 7-day care window</span>
    </div>
  );
}

export function CTA({ title = "Your textile has a story. Start with a photo.", copy = "Most quotes take a few minutes. You will see the estimate before we ask for an appointment." }: { title?: string; copy?: string }) {
  return (
    <section className="cta-panel">
      <div className="shell cta-panel__inner">
        <p className="eyebrow eyebrow--light">Ready when you are</p>
        <h2>{title}</h2><p>{copy}</p>
        <div className="button-row"><Link className="button button--acid" href="/get-quote">Build my estimate ↗</Link><Link className="text-link text-link--light" href="/how-it-works">See how it works →</Link></div>
      </div>
    </section>
  );
}

export function PricingTable({ category }: { category?: string }) {
  const items = category ? prices.filter((item) => item.category === category) : prices;
  return (
    <div className="pricing-table">
      <div className="pricing-table__head"><span>Item / service</span><span>Published comparison</span><span>Novaclean launch</span><span>Scope</span></div>
      {items.map((item) => (
        <div className="pricing-table__row" id={item.id} key={item.id}>
          <strong>{item.label}</strong><s>{money(item.competitor)}{item.unit}</s><b>{money(item.price)}{item.unit}</b><p>{item.scope}<small>Source: <a href={getPriceSource(item).url} target={getPriceSource(item).url.startsWith("http") ? "_blank" : undefined} rel={getPriceSource(item).url.startsWith("http") ? "noreferrer" : undefined}>{getPriceSource(item).name}</a> · checked {compareDate}</small></p>
        </div>
      ))}
    </div>
  );
}

export function VerifyBlock({ legal = false }: { legal?: boolean }) {
  return (
    <aside className={`verify-block ${legal ? "verify-block--legal" : ""}`} role="note">
      <span>{legal ? "[VERIFY LEGAL]" : "[VERIFY BEFORE LAUNCH]"}</span>
      <div>
        <h3>{legal ? "Comparison-price review" : "Business facts and integrations"}</h3>
        <p>{legal
          ? "Confirm that every struck comparison remains current, representative and documented before public advertising; retain source URL, service scope and check date."
          : "Add the real business phone, text line, operator names/portraits, insurance details, verified review links and any SMS/payment keys. Until then, contact CTAs safely lead to the working photo-quote flow."}</p>
      </div>
    </aside>
  );
}
