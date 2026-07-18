"use client";
/* eslint-disable @next/next/no-img-element -- these local WebP derivatives are already resized and compressed */
import Link from "next/link";
import {
  faq,
  getPrice,
  money,
  prices,
  servicePages,
} from "@/lib/site-data";
import { Reveal, TiltCard } from "@/components/motion";
import {
  configuredPrice,
  useSiteConfig,
} from "@/components/site-config-provider";
import {
  defaultLocale,
  faqMessages,
  localizedPath,
  messages,
  translatedPrice,
  translatedService,
  type Locale,
} from "@/lib/i18n";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Reveal
      className={`section-heading ${light ? "section-heading--light" : ""}`}
    >
      <div>
        <p className={`eyebrow ${light ? "eyebrow--light" : ""}`}>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {copy && <p className="section-heading__copy">{copy}</p>}
    </Reveal>
  );
}

export function Price({
  id,
  compact = false,
  showEvidence = true,
  locale = defaultLocale,
}: {
  id: string;
  compact?: boolean;
  showEvidence?: boolean;
  locale?: Locale;
}) {
  const baseItem = getPrice(id);
  const config = useSiteConfig();
  const item = configuredPrice(
    translatedPrice(baseItem, locale),
    locale,
    config,
  );
  const copy = messages[locale].common;
  return (
    <div className={`price-lockup ${compact ? "price-lockup--compact" : ""}`}>
      <span className="price-lockup__label">
        <small>{copy.currentPrice}</small>
      </span>
      <strong>
        {money(item.price)}
        <small>{item.unit ?? ""}</small>
      </strong>
      {showEvidence && (
        <small className="price-lockup__evidence">
          {copy.scope}: {item.scope}
        </small>
      )}
    </div>
  );
}

export function PriceCard({
  id,
  index = 0,
  locale = defaultLocale,
}: {
  id: string;
  index?: number;
  locale?: Locale;
}) {
  const baseItem = getPrice(id);
  const config = useSiteConfig();
  const item = configuredPrice(
    translatedPrice(baseItem, locale),
    locale,
    config,
  );
  const copy = messages[locale].common;
  return (
    <Reveal delay={index * 70}>
      <TiltCard className="price-card">
        <div className="price-card__top">
          <span>{item.shortLabel}</span>
          <b>{locale === "es" ? "Precio de menú" : "Menu price"}</b>
        </div>
        <Price id={id} showEvidence={false} locale={locale} />
        <p>{item.scope}</p>
        <div className="price-card__foot">
          <small>
            {locale === "es"
              ? "Alcance revisado con fotos antes del servicio"
              : "Scope reviewed from photos before service"}
          </small>
          <Link href={`${localizedPath(locale, "/pricing")}#${id}`}>
            {copy.details}
          </Link>
        </div>
      </TiltCard>
    </Reveal>
  );
}

export function PriceGrid({
  ids = ["sofa", "l-sectional", "mattress", "pet"],
  locale = defaultLocale,
}: {
  ids?: string[];
  locale?: Locale;
}) {
  return (
    <div className="price-grid">
      {ids.map((id, index) => (
        <PriceCard id={id} index={index} locale={locale} key={id} />
      ))}
    </div>
  );
}

export function ServiceGrid({
  limit,
  locale = defaultLocale,
}: {
  limit?: number;
  locale?: Locale;
}) {
  const list = limit ? servicePages.slice(0, limit) : servicePages;
  return (
    <div className="service-grid">
      {list.map((baseService, index) => {
        const service = translatedService(baseService, locale);
        return (
          <Reveal key={service.slug} delay={(index % 3) * 70}>
            <Link
              href={localizedPath(locale, `/services/${service.slug}`)}
              className="service-card"
            >
              <div className="service-card__media">
                <img src={service.image} alt="" loading="lazy" />
              </div>
              <div className="service-card__body">
                <span>0{index + 1}</span>
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.kicker}</p>
                </div>
                <b>↗</b>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

export function ProcessRail({ locale = defaultLocale }: { locale?: Locale }) {
  const steps =
    locale === "es"
      ? [
          [
            "01",
            "Muestra el artículo",
            "Elige el textil, responde preguntas sobre su estado y añade fotos o la etiqueta.",
          ],
          [
            "02",
            "Revisa el alcance",
            "El precio de menú se combina con tamaño, tejido, estado y mínimo de zona.",
          ],
          [
            "03",
            "Pide una franja",
            "Elige una preferencia de llegada y añade notas de acceso o estacionamiento.",
          ],
          [
            "04",
            "Inspección previa",
            "El técnico revisa el tejido, confirma el alcance y se detiene si algo no coincide.",
          ],
          [
            "05",
            "Limpieza y cuidado",
            "Completamos el método acordado y dejamos instrucciones de secado.",
          ],
        ]
      : [
          [
            "01",
            "Show the item",
            "Choose the textile, answer a few condition questions and add photos or a care tag.",
          ],
          [
            "02",
            "See the scope",
            "We turn item size, fabric and condition into a transparent estimate and minimum.",
          ],
          [
            "03",
            "Pick a window",
            "Choose an available arrival window and add access or parking notes.",
          ],
          [
            "04",
            "Pre-inspection",
            "The technician checks the fabric, confirms the scope and pauses if something differs.",
          ],
          [
            "05",
            "Clean + care",
            "We complete the agreed method, walk through the result and leave drying guidance.",
          ],
        ];
  return (
    <div className="process-rail">
      {steps.map(([n, title, copy], index) => (
        <Reveal delay={index * 55} key={n}>
          <article>
            <span>{n}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function FAQ({
  limit,
  locale = defaultLocale,
}: {
  limit?: number;
  locale?: Locale;
}) {
  const list = locale === "es" ? faqMessages.es : faq;
  return (
    <div className="faq-list">
      {list.slice(0, limit).map(([question, answer], index) => (
        <details key={question} open={index === 0}>
          <summary>
            <span>0{index + 1}</span>
            {question}
            <b aria-hidden="true">+</b>
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function TrustStrip({ locale = defaultLocale }: { locale?: Locale }) {
  const items =
    locale === "es"
      ? [
          "Alcance antes de llegar",
          "Prueba según el tejido",
          "Sin extras sorpresa",
          "Ventana de cuidado de 7 días",
        ]
      : [
          "Scope before arrival",
          "Fabric-first testing",
          "No surprise add-ons",
          "7-day care window",
        ];
  return (
    <div className="trust-strip">
      {items.map((item, index) => (
        <span key={item}>
          <b>0{index + 1}</b> {item}
        </span>
      ))}
    </div>
  );
}

export function CTA({
  title,
  copy,
  locale = defaultLocale,
}: {
  title?: string;
  copy?: string;
  locale?: Locale;
}) {
  const common = messages[locale].common;
  const finalTitle =
    title ??
    (locale === "es"
      ? "Tu textil tiene una historia. Empieza con el artículo."
      : "Your textile has a story. Start with the item.");
  const finalCopy =
    copy ??
    (locale === "es"
      ? "El cálculo tarda pocos minutos. Verás el precio antes de pedir una cita."
      : "Most estimates take a few minutes. You will see the price before requesting an appointment.");
  return (
    <section className="cta-panel">
      <div className="shell cta-panel__inner">
        <p className="eyebrow eyebrow--light">{common.ready}</p>
        <h2>{finalTitle}</h2>
        <p>{finalCopy}</p>
        <div className="button-row">
          <Link
            className="button button--acid"
            href={localizedPath(locale, "/get-quote")}
          >
            {common.buildEstimate}
          </Link>
          <Link
            className="text-link text-link--light"
            href={localizedPath(locale, "/how-it-works")}
          >
            {common.howItWorks}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PricingTable({
  category,
  locale = defaultLocale,
}: {
  category?: string;
  locale?: Locale;
}) {
  const config = useSiteConfig();
  const items = category
    ? prices.filter((item) => item.category === category)
    : prices;
  return (
    <div className="pricing-table">
      <div className="pricing-table__head">
        <span>
          {locale === "es" ? "Artículo / servicio" : "Item / service"}
        </span>
        <span>{locale === "es" ? "Precio Novaclean" : "Novaclean price"}</span>
        <span>
          {locale === "es" ? "Qué incluye" : "What is included"}
        </span>
      </div>
      {items.map((baseItem) => {
        const item = configuredPrice(
          translatedPrice(baseItem, locale),
          locale,
          config,
        );
        return (
          <div className="pricing-table__row" id={item.id} key={item.id}>
            <strong>{item.label}</strong>
            <b>
              {money(item.price)}
              {item.unit}
            </b>
            <p>
              {item.scope}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function VerifyBlock({ legal = false }: { legal?: boolean }) {
  return (
    <aside
      className={`verify-block ${legal ? "verify-block--legal" : ""}`}
      role="note"
    >
      <span>{legal ? "[VERIFY LEGAL]" : "[VERIFY BEFORE LAUNCH]"}</span>
      <div>
        <h3>
          {legal
            ? "Pricing-language review"
            : "Business facts and integrations"}
        </h3>
        <p>
          {legal
            ? "Confirm that menu prices, inclusions, exclusions and approval language remain accurate before public advertising."
            : "Add the real business phone, text line, operator names/portraits, insurance details, verified review links and any SMS/payment keys. Until then, contact CTAs safely lead to the working photo-quote flow."}
        </p>
      </div>
    </aside>
  );
}
