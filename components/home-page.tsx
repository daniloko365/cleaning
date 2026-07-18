/* eslint-disable @next/next/no-img-element -- local pre-cropped WebP assets avoid runtime image transformations */
import Link from "next/link";
import { PricePulse, Reveal } from "@/components/motion";
import { ZipChecker } from "@/components/zip-checker";
import {
  CTA,
  FAQ,
  Price,
  PriceGrid,
  ProcessRail,
  SectionHeading,
  ServiceGrid,
  TrustStrip,
} from "@/components/ui";
import { SiteShell } from "@/components/site-shell";
import { QuoteResume } from "@/components/quote-resume";
import {
  defaultLocale,
  homeMessages,
  localizedPath,
  type Locale,
} from "@/lib/i18n";

function SplitTitle({ text }: { text: string }) {
  const [first, ...rest] = text.split(". ");
  return (
    <>
      {first}.<br />
      <em>{rest.join(". ")}</em>
    </>
  );
}

export function HomePageContent({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const copy = homeMessages[locale];
  return (
    <SiteShell locale={locale}>
      <section className="hero">
        <img
          className="hero__image"
          src="/media/final/novaclean-hero.webp"
          alt={
            locale === "es"
              ? "Sofá seccional iluminado en una sala tranquila"
              : "Sunlit sectional sofa in a calm living room"
          }
          fetchPriority="high"
        />
        <div className="hero__veil" />
        <div className="shell hero__inner">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">{copy.heroEyebrow}</p>
            <h1>
              <SplitTitle text={copy.heroTitle} />
            </h1>
            <p className="hero__dek">{copy.heroDek}</p>
            <div className="hero__price">
              <PricePulse>{copy.heroPrice}</PricePulse>
              <Price id="sofa" compact locale={locale} />
            </div>
            <ZipChecker dark locale={locale} />
          </div>
          <aside className="hero__note" role="note">
            <span>{copy.priceNoteLabel}</span>
            <p>{copy.priceNote}</p>
          </aside>
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span>{copy.scroll}</span>
          <i />
        </div>
      </section>

      {locale === "en" && <QuoteResume />}
      <TrustStrip locale={locale} />

      <section className="section section--ivory" id="pricing">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.priceEyebrow}
            title={<SplitTitle text={copy.priceTitle} />}
            copy={copy.priceCopy}
          />
          <PriceGrid locale={locale} />
          <div className="section-foot">
            <p>{copy.priceFoot}</p>
            <Link
              className="text-link"
              href={localizedPath(locale, "/pricing")}
            >
              {copy.fullPricing}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ink problem-section">
        <div className="shell">
          <SectionHeading
            light
            eyebrow={copy.problemEyebrow}
            title={<SplitTitle text={copy.problemTitle} />}
            copy={copy.problemCopy}
          />
          <div className="problem-list">
            {copy.problems.map(([title, href, meta], index) => (
              <Reveal delay={index * 45} key={title}>
                <Link href={localizedPath(locale, href)}>
                  <small>0{index + 1}</small>
                  <strong>{title}</strong>
                  <span>{meta}</span>
                  <b>↗</b>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section proof-standard">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.proofEyebrow}
            title={<SplitTitle text={copy.proofTitle} />}
            copy={copy.proofCopy}
          />
          <div className="proof-standard__grid">
            {copy.proofCards.map(([title, body], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="center-action">
            <Link
              className="text-link"
              href={localizedPath(locale, "/results")}
            >
              {copy.proofLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.processEyebrow}
            title={<SplitTitle text={copy.processTitle} />}
          />
          <ProcessRail locale={locale} />
          <div className="center-action">
            <Link
              className="button button--ink"
              href={localizedPath(locale, "/get-quote")}
            >
              {copy.startEstimate}
            </Link>
          </div>
        </div>
      </section>

      <section className="section image-story image-story--pet">
        <div className="shell image-story__grid">
          <Reveal className="image-story__media">
            <img
              src="/media/final/pet-safe.webp"
              alt={
                locale === "es"
                  ? "Perro descansando en casa"
                  : "Bernese mountain dog relaxing at home"
              }
              loading="lazy"
            />
          </Reveal>
          <Reveal className="image-story__copy" delay={90}>
            <p className="eyebrow">{copy.petEyebrow}</p>
            <h2>
              <SplitTitle text={copy.petTitle} />
            </h2>
            <p>{copy.petCopy}</p>
            <ul>
              {copy.petBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              className="button button--ink"
              href={localizedPath(locale, "/services/pet-stain-odor-removal")}
            >
              {copy.petLink}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow={copy.servicesEyebrow}
            title={<SplitTitle text={copy.servicesTitle} />}
            copy={copy.servicesCopy}
          />
          <ServiceGrid limit={6} locale={locale} />
          <div className="center-action">
            <Link
              className="text-link"
              href={localizedPath(locale, "/services")}
            >
              {copy.servicesLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="section safety-section">
        <div className="shell safety-grid">
          <Reveal>
            <p className="eyebrow">{copy.fabricEyebrow}</p>
            <h2>
              <SplitTitle text={copy.fabricTitle} />
            </h2>
            <p>{copy.fabricCopy}</p>
            <Link
              className="text-link"
              href={localizedPath(locale, "/fabric-care-codes")}
            >
              {copy.fabricLink}
            </Link>
          </Reveal>
          <div className="code-cards">
            {[
              [
                "W",
                locale === "es"
                  ? "Los métodos con agua pueden ser compatibles"
                  : "Water-based methods may be compatible",
              ],
              [
                "S",
                locale === "es"
                  ? "Puede requerirse cuidado con solvente"
                  : "Solvent-based care may be required",
              ],
              [
                "WS",
                locale === "es"
                  ? "Ambas familias pueden ser posibles"
                  : "Either family may be possible",
              ],
              [
                "X",
                locale === "es"
                  ? "Solo aspirado o revisión especializada"
                  : "Vacuum-only / specialist review",
              ],
            ].map(([code, text]) => (
              <Reveal key={code}>
                <article>
                  <strong>{code}</strong>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink service-area-tease">
        <div className="shell area-grid">
          <Reveal>
            <p className="eyebrow eyebrow--light">{copy.areaEyebrow}</p>
            <h2>
              <SplitTitle text={copy.areaTitle} />
            </h2>
            <p>{copy.areaCopy}</p>
            <ZipChecker dark locale={locale} />
            <Link
              className="text-link text-link--light"
              href={localizedPath(locale, "/service-area")}
            >
              {copy.areaLink}
            </Link>
          </Reveal>
          <Reveal className="area-orbit" delay={100}>
            <div className="area-orbit__ring">
              <span>Irvine</span>
              <span>Newport Beach</span>
              <span>Anaheim</span>
              <span>Mission Viejo</span>
            </div>
            <div className="area-orbit__center">
              <b>OC</b>
              <small>mobile care</small>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="shell faq-layout">
          <SectionHeading
            eyebrow={copy.faqEyebrow}
            title={<SplitTitle text={copy.faqTitle} />}
            copy={copy.faqCopy}
          />
          <FAQ limit={6} locale={locale} />
          <Link className="text-link" href={localizedPath(locale, "/faq")}>
            {copy.faqLink}
          </Link>
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}
