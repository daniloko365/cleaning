"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/site-data";
import {
  defaultLocale,
  localizedPath,
  messages,
  type Locale,
} from "@/lib/i18n";
import { useSiteConfig } from "@/components/site-config-provider";

export function Logo({
  inverse = false,
  locale = defaultLocale,
}: {
  inverse?: boolean;
  locale?: Locale;
}) {
  return (
    <Link
      className={`logo ${inverse ? "logo--inverse" : ""}`}
      href={localizedPath(locale, "/")}
      aria-label={`${brand.name} home`}
    >
      <span className="logo__mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="logo__type">
        nova<span>clean</span>
      </span>
    </Link>
  );
}

export function Header({ locale = defaultLocale }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() || "/";
  const copy = messages[locale];
  const otherLocale: Locale = locale === "en" ? "es" : "en";
  const basePath =
    pathname === "/es"
      ? "/"
      : pathname.startsWith("/es/")
        ? pathname.slice(3)
        : pathname;
  const languageHref = localizedPath(otherLocale, basePath);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="shell header-inner">
          <Logo locale={locale} />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {copy.shell.nav.map(([label, href]) => (
              <Link href={localizedPath(locale, href)} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              className="language-link"
              href={languageHref}
              hrefLang={otherLocale === "en" ? "en-US" : "es-US"}
              aria-label={
                otherLocale === "en" ? "Switch to English" : "Cambiar a español"
              }
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link
              className="button button--ink button--small"
              href={localizedPath(locale, "/get-quote")}
            >
              {copy.shell.estimate} <span aria-hidden="true">↗</span>
            </Link>
            <button
              ref={menuButton}
              className="menu-button"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <span>{open ? copy.shell.close : copy.shell.menu}</span>
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          id="mobile-menu"
          className={`mobile-menu ${open ? "is-open" : ""}`}
          role="dialog"
          aria-modal={open ? "true" : undefined}
          aria-label={copy.shell.menu}
        >
          <nav aria-label="Mobile navigation">
            {copy.shell.nav.map(([label, href], index) => (
              <Link
                href={localizedPath(locale, href)}
                key={href}
                onClick={() => setOpen(false)}
              >
                <small>0{index + 1}</small>
                {label}
                <span>↗</span>
              </Link>
            ))}
            <Link
              href={localizedPath(locale, "/commercial")}
              onClick={() => setOpen(false)}
            >
              <small>07</small>
              {copy.shell.commercial}
              <span>↗</span>
            </Link>
            <Link
              href={languageHref}
              hrefLang={otherLocale === "en" ? "en-US" : "es-US"}
              onClick={() => setOpen(false)}
            >
              <small>08</small>
              {otherLocale === "en" ? "English" : "Español"}
              <span>↗</span>
            </Link>
          </nav>
          <div className="mobile-menu__foot">
            <p>{copy.shell.mobileTagline}</p>
            <Link
              className="button button--acid"
              href={localizedPath(locale, "/get-quote")}
              onClick={() => setOpen(false)}
            >
              {copy.shell.startPhotos}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer({ locale = defaultLocale }: { locale?: Locale }) {
  const year = new Date().getFullYear();
  const copy = messages[locale];
  const config = useSiteConfig();
  return (
    <footer className="site-footer">
      <div className="shell footer-lead">
        <p className="eyebrow eyebrow--light">{copy.shell.betterStep}</p>
        <h2>
          {copy.shell.footerTitle.split("\n").map((line, index) =>
            index ? (
              <em key={line}>{line}</em>
            ) : (
              <span key={line}>
                {line}
                <br />
              </span>
            ),
          )}
        </h2>
        <Link
          className="round-link"
          href={localizedPath(locale, "/get-quote")}
          aria-label={copy.shell.estimate}
        >
          <span>{copy.shell.quickEstimate}</span>
          <b>↗</b>
        </Link>
      </div>
      <div className="shell footer-grid">
        <div>
          <Logo inverse locale={locale} />
          <p>{copy.shell.footerIntro}</p>
          {(config.business.phone ||
            config.business.email ||
            config.business.hours) && (
            <address className="footer-contact">
              {config.business.phone && (
                <a
                  href={`tel:${config.business.phone.replace(/[^+\d]/g, "")}`}
                >
                  {config.business.phone}
                </a>
              )}
              {config.business.email && (
                <a href={`mailto:${config.business.email}`}>
                  {config.business.email}
                </a>
              )}
              {config.business.hours && <span>{config.business.hours}</span>}
            </address>
          )}
        </div>
        <div>
          <h3>{copy.shell.explore}</h3>
          <Link href={localizedPath(locale, "/services")}>
            {locale === "es" ? "Servicios" : "Services"}
          </Link>
          <Link href={localizedPath(locale, "/pricing")}>
            {locale === "es" ? "Precios" : "Pricing"}
          </Link>
          <Link href={localizedPath(locale, "/how-it-works")}>
            {locale === "es" ? "Cómo funciona" : "How it works"}
          </Link>
          <Link href={localizedPath(locale, "/faq")}>
            {locale === "es" ? "Preguntas" : "FAQ"}
          </Link>
        </div>
        <div>
          <h3>{copy.shell.care}</h3>
          <Link href={localizedPath(locale, "/prepare")}>
            {locale === "es" ? "Preparación" : "Prepare"}
          </Link>
          <Link href={localizedPath(locale, "/aftercare")}>
            {locale === "es" ? "Cuidados posteriores" : "Aftercare"}
          </Link>
          <Link href={localizedPath(locale, "/claim")}>
            {locale === "es" ? "Solicitud de cuidado" : "Care request"}
          </Link>
          <Link href={localizedPath(locale, "/reviews")}>
            {locale === "es" ? "Reseñas" : "Reviews"}
          </Link>
        </div>
        <div>
          <h3>{copy.shell.business}</h3>
          <Link href={localizedPath(locale, "/commercial")}>
            {copy.shell.commercial}
          </Link>
          <Link href={localizedPath(locale, "/service-area")}>
            {locale === "es" ? "Área de servicio" : "Service area"}
          </Link>
          <Link href={localizedPath(locale, "/contact")}>
            {locale === "es" ? "Contacto" : "Contact"}
          </Link>
          <Link href={localizedPath(locale, "/about")}>
            {locale === "es" ? "Nosotros" : "About"}
          </Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {year} Novaclean</span>
        <span>{brand.region}</span>
        <span>
          <Link href="/privacy" hrefLang="en-US">
            {locale === "es" ? "Privacidad (EN)" : "Privacy"}
          </Link>{" "}
          ·{" "}
          <Link href="/terms" hrefLang="en-US">
            {locale === "es" ? "Términos (EN)" : "Terms"}
          </Link>{" "}
          ·{" "}
          <Link href="/cookie-policy" hrefLang="en-US">
            Cookies{locale === "es" ? " (EN)" : ""}
          </Link>{" "}
          ·{" "}
          <Link href="/accessibility" hrefLang="en-US">
            {locale === "es" ? "Accesibilidad (EN)" : "Accessibility"}
          </Link>
        </span>
      </div>
      <div className="footer-word" aria-hidden="true" />
    </footer>
  );
}

export function MobileConversionBar({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const copy = messages[locale].shell;
  return (
    <nav className="mobile-conversion" aria-label="Quick actions">
      <Link href={localizedPath(locale, "/contact")}>{copy.message}</Link>
      <Link href={localizedPath(locale, "/how-it-works")}>
        {copy.addPhotos}
      </Link>
      <Link className="is-primary" href={localizedPath(locale, "/get-quote")}>
        {copy.quickEstimate}
      </Link>
    </nav>
  );
}

export function SiteShell({
  children,
  locale = defaultLocale,
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const config = useSiteConfig();
  const noticeText =
    locale === "es" ? config.notice.textEs : config.notice.textEn;
  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es-US" : "en-US";
  }, [locale]);
  return (
    <div lang={locale === "es" ? "es" : "en"}>
      {config.notice.enabled && noticeText && (
        <div className="service-notice" role="status">
          {config.notice.href ? (
            <Link href={config.notice.href}>{noticeText} →</Link>
          ) : (
            noticeText
          )}
        </div>
      )}
      <Header locale={locale} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale} />
      <MobileConversionBar locale={locale} />
    </div>
  );
}
