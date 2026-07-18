/* eslint-disable @next/next/no-img-element -- local pre-optimized media is served directly by the Sites asset layer */
import Link from "next/link";
import {
  CTA,
  FAQ,
  Price,
  PriceGrid,
  PricingTable,
  ProcessRail,
  SectionHeading,
  ServiceGrid,
  VerifyBlock,
} from "@/components/ui";
import { ZipChecker } from "@/components/zip-checker";
import { SiteShell } from "@/components/site-shell";
import { CareForm } from "@/components/care-form";
import { CommercialForm } from "@/components/commercial-form";
import { ContactForm } from "@/components/contact-form";
import { LEGAL_VERSION, type LegalDocument } from "@/lib/legal-content";
import {
  cities,
  cityName,
  compareDate,
  faq as faqData,
  getPrice,
  getPriceSource,
  guides,
  minimums,
  money,
  prices,
  servicePages,
} from "@/lib/site-data";
import { siteUrl } from "@/lib/site-url";
import {
  defaultLocale,
  faqMessages,
  localizedPath,
  messages,
  translatedService,
  type Locale,
} from "@/lib/i18n";

export function PageHero({
  eyebrow,
  title,
  dek,
  image,
  children,
  locale = defaultLocale,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  image?: string;
  children?: React.ReactNode;
  locale?: Locale;
}) {
  return (
    <section className={`page-hero ${image ? "page-hero--image" : ""}`}>
      {image && (
        <img
          className="page-hero__image"
          src={image}
          alt=""
          fetchPriority="high"
        />
      )}
      <div className="shell page-hero__inner">
        <div className="page-hero__crumbs">
          <Link href={localizedPath(locale, "/")}>
            {messages[locale].common.home}
          </Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <div>
          <p className="eyebrow eyebrow--light">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero__dek">{dek}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

export function GenericPage({
  eyebrow,
  title,
  dek,
  intro,
  sections,
  cta = true,
  image,
  locale = defaultLocale,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  intro?: string;
  sections: { title: string; body: string; bullets?: string[] }[];
  cta?: boolean;
  image?: string;
  locale?: Locale;
}) {
  const common = messages[locale].common;
  return (
    <SiteShell locale={locale}>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        dek={dek}
        image={image}
        locale={locale}
      >
        <div className="page-hero__actions">
          <Link
            className="button button--acid"
            href={localizedPath(locale, "/get-quote")}
          >
            {common.buildEstimate}
          </Link>
          <Link
            className="text-link text-link--light"
            href={localizedPath(locale, "/contact")}
          >
            {common.askQuestion}
          </Link>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell content-layout">
          <article className="content-prose">
            {intro && <p className="lede">{intro}</p>}
            {sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.bullets && (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">
              {locale === "es" ? "Siguiente paso" : "Useful next step"}
            </p>
            <h3>
              {locale === "es"
                ? "Empieza por el artículo, no por una llamada de ventas."
                : "Start with the item, not a sales call."}
            </h3>
            <p>
              {locale === "es"
                ? "Elige el textil, añade fotos y revisa el precio antes de solicitar una cita."
                : "Choose the textile, add photos and see the current price before requesting a window."}
            </p>
            <Link
              className="button button--ink"
              href={localizedPath(locale, "/get-quote")}
            >
              {locale === "es" ? "Calcular precio ↗" : "Build my price ↗"}
            </Link>
          </aside>
        </div>
      </section>
      {cta && <CTA locale={locale} />}
    </SiteShell>
  );
}

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <SiteShell>
      <PageHero
        eyebrow={document.eyebrow}
        title={document.title}
        dek={document.summary}
      />
      <section className="section section--ivory">
        <div className="shell legal-layout">
          <article className="content-prose legal-document">
            <div className="legal-version">
              <strong>Effective July 17, 2026</strong>
              <span>Version {LEGAL_VERSION}</span>
            </div>
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {document.sources && (
              <section className="legal-sources">
                <h2>Official reference material</h2>
                <p>
                  These links explain the regulatory framework; they are not a
                  substitute for advice about Novaclean’s final legal entity and
                  operations.
                </p>
                <ul>
                  {document.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        className="text-link"
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
          <aside className="content-aside legal-nav" role="note">
            <p className="eyebrow">Policy center</p>
            <h3>Related records</h3>
            <nav aria-label="Legal and policy pages">
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/notice-at-collection">Notice at collection</Link>
              <Link href="/terms">Service terms</Link>
              <Link href="/cookie-policy">Cookie & storage</Link>
              <Link href="/photo-media-consent">Photo policy</Link>
              <Link href="/cancellation">Cancellation</Link>
              <Link href="/guarantee">Care guarantee</Link>
              <Link href="/claims-damage">Claims & damage</Link>
              <Link href="/accessibility">Accessibility</Link>
              <Link href="/contact">Contact / request rights</Link>
            </nav>
            <p className="legal-note">
              California counsel must confirm the final entity name, public
              contact details, contracting language, insurance facts, retention
              periods, and accountable operations owner before unrestricted
              public launch.
            </p>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

export function ServicesHub({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Servicios" : "Services"}
        title={
          locale === "es"
            ? "Cuidado textil, artículo por artículo."
            : "Textile care, item by item."
        }
        dek={
          locale === "es"
            ? "Cada servicio explica precio, material, método, secado y límites antes de que te comprometas."
            : "Each service names the price inputs, material checks, method, drying guidance and limitations before you commit."
        }
      />
      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow={
              locale === "es"
                ? "Servicios residenciales"
                : "Residential services"
            }
            title={
              locale === "es" ? (
                <>
                  Diseñados para el tejido.
                  <br />
                  <em>No es un paquete genérico.</em>
                </>
              ) : (
                <>
                  Built around the textile.
                  <br />
                  <em>Not a generic package.</em>
                </>
              )
            }
          />
          <ServiceGrid locale={locale} />
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}

export function ServicePage({
  slug,
  locale = defaultLocale,
}: {
  slug: string;
  locale?: Locale;
}) {
  const service = translatedService(
    servicePages.find((item) => item.slug === slug)!,
    locale,
  );
  const price = getPrice(service.priceId);
  const source = getPriceSource(price);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.problem,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Orange County, California",
    },
    provider: { "@type": "Organization", name: "Novaclean", url: siteUrl },
    offers: {
      "@type": "Offer",
      price: price.price,
      priceCurrency: "USD",
      url: `${siteUrl}/services/${service.slug}`,
      description: price.scope,
    },
  };
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={service.kicker}
        title={service.name}
        dek={
          locale === "es"
            ? `Servicio móvil en Orange County con precio de menú inmediato y revisión de fotos antes de confirmar.`
            : `Mobile ${service.name.toLowerCase()} across Orange County, with an instant menu estimate and photo review before confirmation.`
        }
        image={service.image}
      >
        <div className="page-hero__actions">
          <Link
            className="button button--acid"
            href={`${localizedPath(locale, "/get-quote")}?service=${service.priceId}`}
          >
            {locale === "es" ? "Calcular mi artículo ↗" : "Price my item ↗"}
          </Link>
          <Price id={service.priceId} compact locale={locale} />
        </div>
        <div className="page-hero__meta">
          <div>
            <small>{locale === "es" ? "Precio actual" : "Current price"}</small>
            <strong>
              {money(price.price)} · {price.scope}
            </strong>
          </div>
          <div>
            <small>
              {locale === "es"
                ? "Referencia pública igualada"
                : "Matched public benchmark"}
            </small>
            <strong>
              {money(price.benchmark)} ·{" "}
              <a
                href={source.url}
                target={source.url.startsWith("http") ? "_blank" : undefined}
                rel={source.url.startsWith("http") ? "noreferrer" : undefined}
              >
                {source.name}
              </a>{" "}
              · {locale === "es" ? "consultado" : "checked"} {compareDate}
            </strong>
          </div>
          <div>
            <small>{locale === "es" ? "Confirmación" : "Confirmation"}</small>
            <strong>
              {locale === "es"
                ? "Alcance revisado con fotos"
                : "Scope reviewed from photos"}
            </strong>
          </div>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell content-layout">
          <article className="content-prose">
            <h2>
              {locale === "es"
                ? "Qué resuelve este servicio"
                : "What this service solves"}
            </h2>
            <p>
              {service.problem}.{" "}
              {locale === "es"
                ? `El objetivo es ${service.outcome}, sin fingir que toda mancha permanente, pérdida de color u origen profundo puede revertirse.`
                : `The goal is ${service.outcome}—without pretending every permanent stain, dye loss or deep source can be reversed.`}
            </p>
            <div className="price-feature">
              <div>
                <p className="eyebrow">
                  {locale === "es"
                    ? "Precio transparente"
                    : "Transparent price"}
                </p>
                <Price id={service.priceId} locale={locale} />
              </div>
              <div>
                <h3>
                  {locale === "es" ? "Qué está incluido" : "What is included"}
                </h3>
                <p>
                  {price.scope}.{" "}
                  {locale === "es"
                    ? "Las fotos confirman material, construcción, estado, acceso y mínimo de zona antes de aceptar el trabajo."
                    : "Photos confirm material, construction, condition, access and the service-zone minimum before the request is accepted."}
                </p>
                <Link
                  className="text-link"
                  href={localizedPath(locale, "/price-comparison-methodology")}
                >
                  {locale === "es" ? "Método de precios →" : "Pricing method →"}
                </Link>
              </div>
            </div>
            <h2>{locale === "es" ? "El método" : "The method"}</h2>
            <p>{service.method}</p>
            <div className="feature-grid">
              {(locale === "es"
                ? [
                    [
                      "01",
                      "Primero la elegibilidad",
                      "Código, fibra, respaldo y tinte determinan el método seguro.",
                    ],
                    [
                      "02",
                      "Alcance confirmado",
                      "El artículo y las fotos se revisan antes de trabajar.",
                    ],
                    [
                      "03",
                      "Cuidado posterior real",
                      "Recibes guía de ventilación, uso y secado para el artículo.",
                    ],
                  ]
                : [
                    [
                      "01",
                      "Eligibility first",
                      "Care code, fiber, backing and dye behavior determine the safe method.",
                    ],
                    [
                      "02",
                      "Scope confirmation",
                      "The item and photos are reviewed before work begins.",
                    ],
                    [
                      "03",
                      "Real aftercare",
                      "You receive airflow, use and drying guidance matched to the actual item.",
                    ],
                  ]
              ).map(([n, t, b]) => (
                <article key={n}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
            <h2>
              {locale === "es"
                ? "Qué puede cambiar el alcance"
                : "What can change the scope"}
            </h2>
            <ul>
              <li>
                {locale === "es"
                  ? "Material delicado o sin documentar, tinte inestable o respaldo dañado"
                  : "Delicate or undocumented material, unstable dye or damaged backing"}
              </li>
              <li>
                {locale === "es"
                  ? "Contaminación de mascotas bajo la tela"
                  : "Pet contamination below the surface fabric"}
              </li>
              <li>
                {locale === "es"
                  ? "Productos o recubrimientos anteriores"
                  : "Previous spotters, coatings or protectors that alter fiber response"}
              </li>
              <li>
                {locale === "es"
                  ? "Acceso, estacionamiento o tamaño diferente"
                  : "Access, parking or item size that differs from the submitted details"}
              </li>
            </ul>
            <h2>
              {locale === "es"
                ? "Lo que no prometemos"
                : "What we will not promise"}
            </h2>
            <p>
              {locale === "es"
                ? "No garantizamos la eliminación completa de manchas u olores ni usamos «no tóxico» como afirmación absoluta. Si el artículo necesita un especialista, la respuesta útil puede ser una derivación."
                : "We do not guarantee complete stain or odor removal, use “non-toxic” as an absolute claim, or proceed with a risky method just to preserve a booking. If the item needs specialist care, the useful answer may be a referral."}
            </p>
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">
              {locale === "es" ? "Calcula este artículo" : "Price this item"}
            </p>
            <h3>{service.name}</h3>
            <Price id={service.priceId} locale={locale} />
            <p>
              {locale === "es"
                ? "Sin mínimo de visita en zona principal para sofá, seccional o colchón. Los extras aparecen antes de confirmar."
                : "No core-zone visit minimum for sofa, sectional or mattress. Add-ons and dining-chair minimums appear before confirmation."}
            </p>
            <Link
              className="button button--ink"
              href={`${localizedPath(locale, "/get-quote")}?service=${service.priceId}`}
            >
              {locale === "es" ? "Iniciar cálculo ↗" : "Start estimate ↗"}
            </Link>
          </aside>
        </div>
      </section>
      <section className="section section--sand">
        <div className="shell">
          <SectionHeading
            eyebrow={locale === "es" ? "Cada visita" : "Every visit"}
            title={
              locale === "es" ? (
                <>
                  Los mismos cinco
                  <br />
                  <em>puntos de decisión.</em>
                </>
              ) : (
                <>
                  The same five
                  <br />
                  <em>decision points.</em>
                </>
              )
            }
          />
          <ProcessRail locale={locale} />
        </div>
      </section>
      <CTA
        locale={locale}
        title={
          locale === "es"
            ? `Calcula el precio de ${service.name.toLowerCase()}.`
            : `Price your ${service.name.toLowerCase()}.`
        }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </SiteShell>
  );
}

export function PricingPage({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Precios" : "Pricing"}
        title={
          locale === "es"
            ? "Todo el menú. Sin obligarte a llamar."
            : "The whole price menu. No phone gate."
        }
        dek={
          locale === "es"
            ? `Novaclean iguala referencias públicas locales de alcance comparable, consultadas en ${compareDate}.`
            : `Novaclean matches documented local public rates for comparable scope, checked ${compareDate}.`
        }
      >
        <div className="page-hero__actions">
          <Link
            className="button button--acid"
            href={localizedPath(locale, "/get-quote")}
          >
            {messages[locale].common.buildEstimate}
          </Link>
          <Link
            className="text-link text-link--light"
            href={localizedPath(locale, "/price-comparison-methodology")}
          >
            {locale === "es" ? "Leer metodología →" : "Read methodology →"}
          </Link>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow={
              locale === "es" ? "Puntos de partida" : "Popular starting points"
            }
            title={
              locale === "es" ? (
                <>
                  Referencias rápidas.
                  <br />
                  <em>Alcance completo abajo.</em>
                </>
              ) : (
                <>
                  Fast anchors.
                  <br />
                  <em>Full scope below.</em>
                </>
              )
            }
          />
          <PriceGrid
            locale={locale}
            ids={["sofa", "l-sectional", "mattress", "carpet-3"]}
          />
          <div style={{ height: "5rem" }} />
          <PricingTable locale={locale} />
        </div>
      </section>
      <section className="section section--sand">
        <div className="shell">
          <SectionHeading
            eyebrow={
              locale === "es" ? "Mínimos y reglas" : "Minimums and rules"
            }
            title={
              locale === "es" ? (
                <>
                  La parte honesta
                  <br />
                  <em>junto al número.</em>
                </>
              ) : (
                <>
                  The honest part
                  <br />
                  <em>beside the number.</em>
                </>
              )
            }
          />
          <div className="feature-grid">
            <article>
              <span>01</span>
              <h3>{locale === "es" ? "Zona principal" : "Core zone"}</h3>
              <p>
                {locale === "es"
                  ? "Sin mínimo de visita para sofá, seccional o colchón. Las sillas de comedor empiezan en cuatro."
                  : "No visit minimum for sofa, sectional or mattress. Dining chairs start at four; small treatments are add-ons."}
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>{locale === "es" ? "Zona extendida" : "Extended zone"}</h3>
              <p>
                {locale === "es"
                  ? `Mínimo de visita de $${minimums.extended}, visible después de consultar el ZIP.`
                  : `$${minimums.extended} visit minimum, shown after ZIP.`}
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>
                {locale === "es" ? "Cambios de alcance" : "Scope changes"}
              </h3>
              <p>
                {locale === "es"
                  ? "Nada adicional empieza sin explicación, precio y aprobación explícita."
                  : "No extra work starts without an explanation, price and explicit approval."}
              </p>
            </article>
          </div>
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}

export function ServiceAreaPage({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Área de servicio" : "Service area"}
        title={
          locale === "es"
            ? "Orange County, comprobado por ZIP."
            : "Orange County, checked by ZIP."
        }
        dek={
          locale === "es"
            ? "La zona y el mínimo aparecen antes de tus datos de contacto. La disponibilidad se confirma con la ruta real."
            : "The zone and minimum appear before contact details. Availability is confirmed against the real route."
        }
      >
        <div className="page-hero__actions">
          <ZipChecker dark locale={locale} />
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow={
              locale === "es" ? "Directorio de cobertura" : "Coverage directory"
            }
            title={
              locale === "es" ? (
                <>
                  Rutas locales.
                  <br />
                  <em>Sin tiempos inventados.</em>
                </>
              ) : (
                <>
                  Local routes.
                  <br />
                  <em>No invented ETAs.</em>
                </>
              )
            }
            copy={
              locale === "es"
                ? "Consulta el ZIP antes de compartir datos personales. Una franja solicitada se confirma solo con capacidad real."
                : "Check the ZIP before sharing personal details. A requested window is confirmed only against real capacity."
            }
          />
          <div className="city-grid">
            {cities.map((city, index) => (
              <Link
                href={localizedPath(locale, `/service-area/${city}`)}
                key={city}
              >
                <small>OC · {String(index + 1).padStart(2, "0")}</small>
                <strong>{cityName(city)}</strong>
                <span>
                  {locale === "es" ? "Comprobar ZIP ↗" : "Check ZIP ↗"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}

export function CityPage({
  slug,
  locale = defaultLocale,
}: {
  slug: string;
  locale?: Locale;
}) {
  const name = cityName(slug);
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={
          locale === "es"
            ? "Área de servicio de Orange County"
            : "Orange County service area"
        }
        title={
          locale === "es"
            ? `Limpieza textil en ${name}`
            : `${name} textile cleaning`
        }
        dek={
          locale === "es"
            ? `Cálculos de tapicería, colchones, alfombras y moquetas para hogares y propiedades de ${name}.`
            : `Menu-based upholstery, mattress, rug and carpet estimates for ${name} households and property teams.`
        }
      >
        <div className="page-hero__actions">
          <ZipChecker dark locale={locale} />
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell content-layout">
          <article className="content-prose">
            <h2>
              {locale === "es"
                ? "Empieza por la zona de la dirección"
                : "Start with the address zone"}
            </h2>
            <p>
              {locale === "es"
                ? "Introduce el ZIP para ver el mínimo antes de compartir datos. Los tiempos se confirman con la ruta real; esta página no inventa disponibilidad para el mismo día."
                : "Enter the service ZIP to see the applicable minimum before contact details. Route timing is confirmed against the real service calendar; this page does not invent “same day” capacity."}
            </p>
            <h2>
              {locale === "es" ? "Servicios populares" : "Popular services"}
            </h2>
            <ul>
              <li>
                {locale === "es"
                  ? "Cuidado de sofás y seccionales"
                  : "Sofa and sectional care with public menu prices"}
              </li>
              <li>
                {locale === "es"
                  ? "Limpieza de colchones y cabeceros tapizados"
                  : "Mattress and upholstered headboard cleaning"}
              </li>
              <li>
                {locale === "es"
                  ? "Evaluación de manchas y olores de mascotas"
                  : "Pet stain and odor assessment by contamination level"}
              </li>
              <li>
                {locale === "es"
                  ? "Moquetas y paquetes de mudanza"
                  : "Carpet and move-in / move-out bundles"}
              </li>
            </ul>
            <h2>
              {locale === "es"
                ? "Por qué esta página aún no está indexada"
                : "Why this page is not yet indexed"}
            </h2>
            <p>
              {locale === "es" ? (
                `Novaclean no usa páginas de ciudad casi duplicadas como prueba local. Esta ruta será indexable después de contar con un caso real verificado en ${name}, una nota de servicio y disponibilidad específica.`
              ) : (
                <>
                  Novaclean does not publish near-duplicate city pages as local
                  proof. This route becomes indexable after a verified {name}{" "}
                  job case, service note, city-specific availability statement
                  and internal result link are present.
                </>
              )}
            </p>
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">{name}</p>
            <h3>
              {locale === "es"
                ? "Comprueba la zona real."
                : "Check the real zone."}
            </h3>
            <p>
              {locale === "es"
                ? `Sin mínimo en zona principal para sofá, seccional o colchón. Mínimo de zona extendida: $${minimums.extended}.`
                : `No core-zone minimum for sofa, sectional or mattress. Extended-zone minimum $${minimums.extended}.`}
            </p>
            <Link
              className="button button--ink"
              href={localizedPath(locale, "/get-quote")}
            >
              {locale === "es" ? "Comprobar ZIP ↗" : "Check ZIP ↗"}
            </Link>
          </aside>
        </div>
      </section>
      <CTA
        locale={locale}
        title={
          locale === "es"
            ? `Calcula un servicio en ${name}.`
            : `Price a ${name} service.`
        }
      />
    </SiteShell>
  );
}

export function GuidesHub() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Field guides"
        title="Useful answers before the quote."
        dek="Cost, care codes, drying, stains, pets and preparation—written to help a customer decide, not to create fear."
      />
      <section className="section section--ivory">
        <div className="shell">
          <div className="guide-grid">
            {guides.map((guide, index) => (
              <Link
                className="guide-card"
                href={`/guides/${guide.slug}`}
                key={guide.slug}
              >
                <small>Guide {String(index + 1).padStart(2, "0")}</small>
                <h3>{guide.title}</h3>
                <p>{guide.dek}</p>
                <span>Read guide ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </SiteShell>
  );
}

export function GuidePage({ slug }: { slug: string }) {
  const guide = guides.find((item) => item.slug === slug)!;
  return (
    <GenericPage
      eyebrow="Novaclean field guide"
      title={guide.title}
      dek={guide.dek}
      intro="This launch guide establishes the decision framework. Product-specific claims, technician quotes and local case data are added only when they can be verified."
      sections={[
        {
          title: "The short answer",
          body: "The safe and useful answer depends on item construction, material, condition and the result you are trying to achieve. One universal number or promise usually hides those inputs.",
        },
        {
          title: "What changes the recommendation",
          body: "Photos and care tags help separate routine cleaning from stain chemistry, odor-source treatment or specialist handling.",
          bullets: [
            "Fiber and care code",
            "Cushion, backing and fill construction",
            "Age and source of the issue",
            "Previous treatments",
            "Airflow and use constraints",
          ],
        },
        {
          title: "How Novaclean handles it",
          body: "The quote flow asks for the decision-making evidence first, shows the applicable price rule, and pauses for review if the textile falls outside routine eligibility.",
        },
        {
          title: "When to stop and refer",
          body: "Unstable dye, damaged backing, unknown coatings, deep pet contamination and specialist fibers can make a limited method or referral safer than a standard cleaning appointment.",
        },
      ]}
    />
  );
}

export function CommercialPage({ segment }: { segment?: string }) {
  const title =
    segment === "property-managers"
      ? "Textile turns for property managers"
      : segment === "offices"
        ? "Office seating care"
        : segment === "multifamily-turnovers"
          ? "Multifamily turnover textiles"
          : segment === "hospitality-seating"
            ? "Hospitality seating programs"
            : segment === "request-bid"
              ? "Request a commercial walkthrough"
              : "Commercial textile care, documented.";
  return (
    <SiteShell>
      <PageHero
        eyebrow="Commercial"
        title={title}
        dek="Photo inventory, repeatable scope, route windows and a service record built for operational handoff."
        image="/media/final/commercial.webp"
      >
        <div className="page-hero__actions">
          <Link className="button button--acid" href="/commercial/request-bid">
            Request a walkthrough ↗
          </Link>
          <Link className="text-link text-link--light" href="/services">
            Residential services →
          </Link>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow="B2B operating system"
            title={
              <>
                One brief in.
                <br />
                <em>One record out.</em>
              </>
            }
          />
          <div className="feature-grid">
            {[
              [
                "01",
                "Site brief",
                "Locations, item counts, materials, access constraints and service windows.",
              ],
              [
                "02",
                "Walkthrough scope",
                "Priorities, exclusions, spot-treatment limits and an approval-ready estimate.",
              ],
              [
                "03",
                "Service record",
                "Completed-item log, condition notes, issues, photos and aftercare handoff.",
              ],
              [
                "04",
                "Turnover cadence",
                "Recurring or unit-turn work grouped into route-efficient windows.",
              ],
              [
                "05",
                "Vendor packet",
                "W-9, COI and requested procurement facts are attached after verification.",
              ],
              [
                "06",
                "Escalation path",
                "Damage concern and re-clean requests follow a named record, not a lost text thread.",
              ],
            ].map(([n, t, b]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--sand">
        <div className="shell content-layout">
          <article className="content-prose">
            <h2>What the intake needs</h2>
            <ul>
              <li>Property type and service locations</li>
              <li>Approximate item / room counts</li>
              <li>Materials and known recurring issues</li>
              <li>Access, parking, elevator and service-hour constraints</li>
              <li>Required insurance or vendor documents</li>
              <li>Target date and approval owner</li>
            </ul>
            <h2>How pricing works</h2>
            <p>
              Standard items can use the public matrix. Volume, access,
              recurring cadence and non-standard textiles are scoped after the
              walkthrough—never hidden behind “contact for price” when a public
              anchor is available.
            </p>
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">Commercial intake</p>
            <h3>Send the operating brief.</h3>
            <p>
              A bid request creates a trackable lead record and captures
              procurement needs.
            </p>
            <Link className="button button--ink" href="/commercial/request-bid">
              Start B2B request ↗
            </Link>
          </aside>
        </div>
      </section>
      {segment === "request-bid" && (
        <section className="section section--ivory">
          <div className="shell">
            <SectionHeading
              eyebrow="Walkthrough brief"
              title={
                <>
                  Give operations
                  <br />
                  <em>the full picture.</em>
                </>
              }
              copy="Upload site photos or a floor plan, name access constraints and procurement requirements, and receive a trackable B2B reference."
            />
            <CommercialForm />
          </div>
        </section>
      )}
      <CTA title="Make textile care easier to hand off." />
    </SiteShell>
  );
}

export function FAQPage({ locale = defaultLocale }: { locale?: Locale }) {
  const list = locale === "es" ? faqMessages.es : faqData;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow="FAQ"
        title={
          locale === "es"
            ? "Respuestas directas. Límites útiles."
            : "Direct answers. Useful limits."
        }
        dek={
          locale === "es"
            ? "Precio, elegibilidad, acceso, secado, cuidados y qué ocurre si un resultado necesita revisión."
            : "The questions that determine price, eligibility, access, drying, aftercare and what happens if a result needs review."
        }
      />
      <section className="section section--ivory">
        <div className="shell">
          <FAQ locale={locale} />
        </div>
      </section>
      <CTA locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </SiteShell>
  );
}

export function MethodologyPage({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={
          locale === "es" ? "Transparencia de precios" : "Pricing transparency"
        }
        title={
          locale === "es"
            ? "Cómo igualamos referencias públicas."
            : "How public-rate matching works."
        }
        dek={
          locale === "es"
            ? "Una referencia local documentada y con alcance comparable, no un precio anterior inventado."
            : "A documented local benchmark with comparable scope—not an invented former price."
        }
      />
      <section className="section section--ivory">
        <div className="shell content-layout">
          <article className="content-prose">
            <h2>{locale === "es" ? "La regla" : "The rule"}</h2>
            <p>
              {locale === "es"
                ? "Para cada línea, Novaclean usa un precio u oferta pública local con alcance identificable. El precio de Novaclean iguala esa referencia para el mismo alcance; no se muestra como descuento ni como precio anterior."
                : "For each line item, Novaclean uses a publicly visible local price or offer with identifiable scope. The Novaclean price matches that benchmark for the same scope; it is not presented as a discount or a former price."}
            </p>
            <h2>
              {locale === "es" ? "Registro necesario" : "Required record"}
            </h2>
            <ul>
              <li>
                {locale === "es"
                  ? "Nombre del publicador y URL pública"
                  : "Publisher name and public URL"}
              </li>
              <li>
                {locale === "es"
                  ? "Precio observado y alcance exacto"
                  : "Observed price and exact service scope"}
              </li>
              <li>
                {locale === "es"
                  ? "Fecha de consulta y geografía"
                  : "Checked date and market geography"}
              </li>
              <li>
                {locale === "es"
                  ? "Alcance equivalente de Novaclean"
                  : "Novaclean matched scope"}
              </li>
              <li>
                {locale === "es"
                  ? "Fecha de revisión si cambia la fuente"
                  : "Review date if the source changes"}
              </li>
            </ul>
            <h2>
              {locale === "es" ? "Lo que no afirmamos" : "What we do not claim"}
            </h2>
            <p>
              {locale === "es"
                ? "No afirmamos que todos los limpiadores de Orange County cobren lo mismo. La referencia es un punto público local que debe mantenerse vigente y comparable."
                : "We do not claim every Orange County cleaner charges the same amount. The benchmark is a local public reference that must remain current and like-for-like."}
            </p>
            <h2>
              {locale === "es"
                ? "Presentación al cliente"
                : "Customer-facing display"}
            </h2>
            <p>
              {locale === "es"
                ? "Precio, unidad, alcance, fuente y mes de consulta aparecen juntos. Los mismos registros alimentan inicio, tabla, servicios y calculadora."
                : "Price, unit, scope, source and checked month appear together. The same central records power the home page, table, service pages and estimator."}
            </p>
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">
              {locale === "es" ? "Consultado" : "Checked"}
            </p>
            <h3>{compareDate}</h3>
            <p>
              {prices.length}{" "}
              {locale === "es"
                ? "líneas de precio y paquetes en la matriz pública."
                : "public price lines and bundle records in the matrix."}
            </p>
            <Link
              className="button button--ink"
              href={localizedPath(locale, "/pricing")}
            >
              {locale === "es" ? "Ver precios ↗" : "View prices ↗"}
            </Link>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

export function HowItWorksPage({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={
          locale === "es" ? "El proceso Novaclean" : "The Novaclean process"
        }
        title={
          locale === "es"
            ? "Precio primero. Fotos para confirmar. Servicio después."
            : "Price first. Photos to confirm. Service third."
        }
        dek={
          locale === "es"
            ? "Un recorrido que aclara precio, riesgo del material, acceso y expectativas antes de limpiar."
            : "A path that settles price, material risk, access and expectations before cleaning begins."
        }
      >
        <div className="page-hero__actions">
          <Link
            className="button button--acid"
            href={localizedPath(locale, "/get-quote")}
          >
            {messages[locale].common.buildEstimate}
          </Link>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow={
              locale === "es"
                ? "Cinco puntos de control"
                : "Five control points"
            }
            title={
              locale === "es" ? (
                <>
                  Cada decisión
                  <br />
                  <em>en el momento correcto.</em>
                </>
              ) : (
                <>
                  Each decision
                  <br />
                  <em>at the right moment.</em>
                </>
              )
            }
          />
          <ProcessRail locale={locale} />
        </div>
      </section>
      <section className="section section--sand">
        <div className="shell proof-standard__grid">
          {(locale === "es"
            ? [
                [
                  "01",
                  "Cálculo inmediato",
                  "El menú combina artículo, cantidad, extras y mínimo de zona.",
                ],
                [
                  "02",
                  "Revisión humana",
                  "Las fotos, el tejido y el estado confirman elegibilidad y alcance antes de aceptar.",
                ],
                [
                  "03",
                  "Aprobación explícita",
                  "Si la realidad difiere, explicamos el cambio y no trabajamos sin permiso.",
                ],
              ]
            : [
                [
                  "01",
                  "Instant estimate",
                  "The menu combines item, quantity, add-ons and the service-zone minimum.",
                ],
                [
                  "02",
                  "Human review",
                  "Photos, fabric and condition confirm eligibility and scope before acceptance.",
                ],
                [
                  "03",
                  "Explicit approval",
                  "If reality differs, we explain the change and do not proceed without permission.",
                ],
              ]
          ).map(([n, t, b]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{b}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}

export function AboutPage({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Sobre Novaclean" : "About Novaclean"}
        title={
          locale === "es"
            ? "Cuidado textil diseñado para reducir la incertidumbre."
            : "Textile care designed to remove uncertainty."
        }
        dek={
          locale === "es"
            ? "Alcance visible, límites honestos y un registro útil desde el cálculo hasta el cuidado posterior."
            : "Visible scope, honest limitations and a useful record from estimate through aftercare."
        }
        image="/media/final/about-textile.webp"
      />
      <section className="section section--ivory">
        <div className="shell">
          <SectionHeading
            eyebrow={
              locale === "es" ? "Principios operativos" : "Operating principles"
            }
            title={
              locale === "es" ? (
                <>
                  La confianza nace
                  <br />
                  <em>de decisiones visibles.</em>
                </>
              ) : (
                <>
                  Trust comes from
                  <br />
                  <em>visible decisions.</em>
                </>
              )
            }
          />
          <div className="feature-grid">
            {(locale === "es"
              ? [
                  [
                    "01",
                    "Precio antes que presión",
                    "Consulta un precio y el alcance antes de compartir todos tus datos.",
                  ],
                  [
                    "02",
                    "Tejido antes que química",
                    "La etiqueta ayuda; la fibra, el tinte y una prueba segura deciden.",
                  ],
                  [
                    "03",
                    "Evidencia antes que afirmaciones",
                    "Sin resultados simulados, reseñas inventadas ni credenciales sin verificar.",
                  ],
                  [
                    "04",
                    "Aprobación antes que extras",
                    "Si el alcance cambia, paramos y pedimos permiso.",
                  ],
                  [
                    "05",
                    "Cuidado después del servicio",
                    "El secado y la ventana de atención forman parte del trabajo.",
                  ],
                  [
                    "06",
                    "Datos con propósito",
                    "Pedimos solo lo necesario para calcular, revisar y coordinar.",
                  ],
                ]
              : [
                  [
                    "01",
                    "Price before pressure",
                    "See a price and scope before handing over every contact detail.",
                  ],
                  [
                    "02",
                    "Fabric before chemistry",
                    "The tag helps; fiber, dye and a safe test decide.",
                  ],
                  [
                    "03",
                    "Evidence before claims",
                    "No simulated results, invented reviews or unverified credentials.",
                  ],
                  [
                    "04",
                    "Approval before add-ons",
                    "If scope changes, we pause and ask permission.",
                  ],
                  [
                    "05",
                    "Aftercare is service",
                    "Drying guidance and a care window are part of the job.",
                  ],
                  [
                    "06",
                    "Purposeful data",
                    "We ask only for what is needed to estimate, review and coordinate.",
                  ],
                ]
            ).map(([n, t, b]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}

export function ResultsPage({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Resultados" : "Results"}
        title={
          locale === "es"
            ? "La galería empieza cuando existen pruebas reales."
            : "The gallery starts when real proof exists."
        }
        dek={
          locale === "es"
            ? "No usamos stock, IA ni filtros como si fueran trabajos de Novaclean."
            : "No stock, AI or filtered image is presented as a Novaclean job."
        }
      />
      <section className="section section--ivory">
        <div className="shell empty-proof">
          <span aria-hidden="true">00</span>
          <div>
            <p className="eyebrow">
              {locale === "es" ? "Estado de la galería" : "Gallery status"}
            </p>
            <h2>
              {locale === "es"
                ? "Aún no hay casos publicados."
                : "No cases published yet."}
            </h2>
            <p>
              {locale === "es"
                ? "Cada futuro caso necesita permiso, fotos comparables, material, problema, método, resultado, límite y fecha."
                : "Every future case requires permission, comparable photos, material, issue, method, outcome, limitation and date."}
            </p>
            <Link
              className="text-link"
              href={localizedPath(locale, "/photo-media-consent")}
            >
              {locale === "es"
                ? "Ver política de imágenes →"
                : "Read the image policy →"}
            </Link>
          </div>
        </div>
      </section>
      <CTA locale={locale} />
    </SiteShell>
  );
}

export function ReviewsPage({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Reseñas" : "Reviews"}
        title={
          locale === "es"
            ? "Reseñas verificables, cuando existan."
            : "Verifiable reviews, when they exist."
        }
        dek={
          locale === "es"
            ? "Cada reseña publicada enlazará a su plataforma original. No fabricamos prueba social."
            : "Every published review will link to its original platform. We do not manufacture social proof."
        }
      />
      <section className="section section--ivory">
        <div className="shell empty-proof">
          <span aria-hidden="true">00</span>
          <div>
            <p className="eyebrow">
              {locale === "es" ? "Estado público" : "Public status"}
            </p>
            <h2>
              {locale === "es"
                ? "Todavía no hay reseñas de clientes publicadas."
                : "No customer reviews are published yet."}
            </h2>
            <p>
              {locale === "es"
                ? "Cuando estén disponibles, mostraremos la fuente, fecha y enlace original sin reescribir la experiencia."
                : "When available, we will show source, date and original link without rewriting the customer’s experience."}
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

const placeholderReview =
  "Not Reviews Yet. Not Reviews Yet. Not Reviews Yet. Not Reviews Yet. Not Reviews Yet. Not Reviews Yet. Not Reviews Yet. ";

export function ReviewPreviewPage() {
  const names = [
    "Alex R. — placeholder",
    "María S. — placeholder",
    "Jordan T. — placeholder",
    "Chris M. — placeholder",
    "Taylor K. — placeholder",
    "Sam P. — placeholder",
  ];
  return (
    <SiteShell>
      <PageHero
        eyebrow="Internal layout preview"
        title="Review-card design only."
        dek="This noindex page contains no customer feedback. Every name and card below is a labeled placeholder."
      />
      <section className="section section--ivory">
        <div className="shell">
          <div className="preview-warning" role="note">
            <strong>INTERNAL UI PREVIEW — NOT CUSTOMER FEEDBACK</strong>
            <p>
              Do not use these cards as social proof. Replace only with
              attributable reviews linked to their original platforms.
            </p>
          </div>
          <div className="review-preview-grid">
            {names.map((name, index) => (
              <article key={name}>
                <span>
                  UI sample {String(index + 1).padStart(2, "0")} · not a review
                </span>
                <h3>{name}</h3>
                <p>{placeholderReview}</p>
                <small>Placeholder card · no rating · no platform claim</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function LaunchChecklistPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Launch control"
        title="The only business facts still waiting."
        dek="The site avoids fake phones, reviews, people and credentials. These launch inputs are consolidated here instead of scattered as placeholders."
      />
      <section className="section section--ivory">
        <div className="shell">
          <VerifyBlock />
          <div className="policy-grid">
            <article>
              <h3>Identity</h3>
              <p>
                Legal business entity, public phone/text line, business email
                routing and service address disclosure policy.
              </p>
            </article>
            <article>
              <h3>People</h3>
              <p>
                Owner and technician names, roles, portraits, relevant
                experience and any background-check program wording.
              </p>
            </article>
            <article>
              <h3>Trust</h3>
              <p>
                Insurance certificate details, verified credentials, real review
                profiles, permissioned snippets and result pairs.
              </p>
            </article>
            <article>
              <h3>Integrations</h3>
              <p>
                Email sender/domain, SMS provider and consent copy, payment
                provider if deposits are enabled, and calendar capacity source.
              </p>
            </article>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function CarePage({ type }: { type: "track" | "reschedule" | "claim" }) {
  const content = {
    track: [
      "Track a service reference.",
      "Use the NC reference and booking email. The lookup exposes only the request status.",
    ],
    reschedule: [
      "Move the window without losing the brief.",
      "A reschedule request keeps the item scope, photos and access notes attached.",
    ],
    claim: [
      "Show us what needs another look.",
      "Submit within the 7-day care window after full drying, with the service reference and useful detail.",
    ],
  }[type];
  return (
    <SiteShell>
      <PageHero eyebrow="Customer care" title={content[0]} dek={content[1]} />
      <section className="section section--ivory">
        <div className="shell content-layout">
          <article className="content-prose">
            <h2>
              {type === "track"
                ? "Find the current state"
                : "Keep the context attached"}
            </h2>
            <p>
              {type === "claim"
                ? "The care path reviews the agreed scope, post-dry condition and safe improvement options. It is not a generic inbox or an automatic admission of damage."
                : type === "reschedule"
                  ? "Send preferred alternatives. A new window is requested until it is checked against the real route calendar."
                  : "Requested, confirmed, en route, in service, completed and care review are separate operational states."}
            </p>
            <CareForm type={type} />
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">Privacy</p>
            <h3>Reference + booking email</h3>
            <p>
              Status lookup does not reveal address, price, phone or item
              details.
            </p>
            <Link className="text-link" href="/privacy">
              Privacy approach →
            </Link>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

export function PortalPage() {
  const tools = [
    [
      "01",
      "Find the current state",
      "Reference + booking email reveals only the operational state.",
      "/track",
      "Track request",
    ],
    [
      "02",
      "Prepare the textile",
      "Access, airflow, pets, fragile items and pre-service spotter guidance.",
      "/prepare",
      "Open preparation",
    ],
    [
      "03",
      "Request a new window",
      "Keep the original item scope and access brief attached.",
      "/reschedule",
      "Request reschedule",
    ],
    [
      "04",
      "Use the care window",
      "Send a post-dry concern into the documented re-clean review path.",
      "/claim",
      "Start care request",
    ],
    [
      "05",
      "Review aftercare",
      "Drying, ventilation, first use and when to contact the care team.",
      "/aftercare",
      "Read aftercare",
    ],
    [
      "06",
      "Book another item",
      "Start a new estimate without changing the original record.",
      "/get-quote",
      "Price another item",
    ],
  ];
  return (
    <SiteShell>
      <PageHero
        eyebrow="Customer portal"
        title="One reference. Every next step."
        dek="The launch portal uses low-friction reference access: no password account, no public address or item details, and no unconfirmed ETA claim."
      >
        <div className="page-hero__actions">
          <Link className="button button--acid" href="/track">
            Open my request ↗
          </Link>
          <Link className="text-link text-link--light" href="/contact">
            Get help →
          </Link>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell portal-layout">
          <div>
            <SectionHeading
              eyebrow="Self-service care"
              title={
                <>
                  The useful controls.
                  <br />
                  <em>Nothing exposed.</em>
                </>
              }
              copy="Appointment detail, technician/ETA, invoices, payment and job photos can attach to the same reference once their verified systems are connected. The current launch view keeps customer data private."
            />
          </div>
          <div className="portal-grid">
            {tools.map(([number, title, body, href, label]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <Link className="text-link" href={href}>
                  {label} →
                </Link>
              </article>
            ))}
          </div>
          <div className="portal-status">
            <div>
              <p className="eyebrow">Private lookup</p>
              <h2>Check the service state.</h2>
              <p>
                Use the reference shown after submission and the exact booking
                email.
              </p>
            </div>
            <CareForm type="track" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function ContactPage({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <SiteShell locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={locale === "es" ? "Contacto" : "Contact"}
        title={
          locale === "es"
            ? "Empieza por el artículo. Pregunta lo demás aquí."
            : "Start with the item. Ask anything else here."
        }
        dek={
          locale === "es"
            ? "Los cálculos usan el flujo de precios. Las preguntas generales, de privacidad y accesibilidad reciben una referencia rastreable."
            : "Estimate requests use the pricing flow. General, privacy and accessibility questions create a trackable message reference."
        }
      >
        <div className="page-hero__actions">
          <Link
            className="button button--acid"
            href={localizedPath(locale, "/get-quote")}
          >
            {locale === "es" ? "Calcular precio ↗" : "Build my estimate ↗"}
          </Link>
          <Link
            className="text-link text-link--light"
            href={localizedPath(locale, "/track")}
          >
            {locale === "es" ? "Seguir solicitud →" : "Track a request →"}
          </Link>
        </div>
      </PageHero>
      <section className="section section--ivory">
        <div className="shell content-layout">
          <article className="content-prose">
            <h2>
              {locale === "es"
                ? "Enviar un mensaje directo"
                : "Send a direct message"}
            </h2>
            <p>
              {locale === "es"
                ? "Este formulario es el canal público actual y genera una referencia del servidor. El teléfono se añadirá cuando esté conectado y verificado."
                : "This working form is the current public channel and creates a server-issued reference. A phone/text line will be added when connected and verified."}
            </p>
            <ContactForm locale={locale} />
          </article>
          <aside className="content-aside" role="note">
            <p className="eyebrow">
              {locale === "es"
                ? "Elige la ruta correcta"
                : "Choose the right path"}
            </p>
            <h3>
              {locale === "es"
                ? "¿Precio, cuidado o empresa?"
                : "Price, care or business?"}
            </h3>
            <p>
              {locale === "es"
                ? "Usa el cálculo para un artículo nuevo, la referencia NC para una solicitud existente y el formulario comercial para propiedades o lugares de trabajo."
                : "Use the estimate for a new item, the NC reference routes for an existing request, and commercial intake for properties or workplaces."}
            </p>
            <Link
              className="text-link"
              href={localizedPath(locale, "/commercial/request-bid")}
            >
              {locale === "es" ? "Solicitud comercial →" : "Commercial brief →"}
            </Link>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
