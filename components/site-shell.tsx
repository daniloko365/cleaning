"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand, nav } from "@/lib/site-data";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`logo ${inverse ? "logo--inverse" : ""}`} href="/" aria-label={`${brand.name} home`}>
      <span className="logo__mark" aria-hidden="true"><i /><i /><i /></span>
      <span className="logo__type">nova<span>clean</span></span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="signal-bar" role="region" aria-label="Pricing transparency notice">
        <span className="signal-dot" aria-hidden="true" />
        Transparent launch pricing · sources and scope shown
        <Link href="/price-comparison-methodology">See how prices are set</Link>
      </div>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link className="language-link" href="/es" aria-label="Cambiar a español">ES</Link>
            <Link className="button button--ink button--small" href="/get-quote">Build estimate <span aria-hidden="true">↗</span></Link>
            <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
              <span>{open ? "Close" : "Menu"}</span><i aria-hidden="true" />
            </button>
          </div>
        </div>
        <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`}>
          <nav aria-label="Mobile navigation">
            {nav.map(([label, href], index) => <Link href={href} key={href} onClick={() => setOpen(false)}><small>0{index + 1}</small>{label}<span>↗</span></Link>)}
            <Link href="/commercial" onClick={() => setOpen(false)}><small>07</small>Commercial<span>↗</span></Link>
          </nav>
          <div className="mobile-menu__foot">
            <p>Orange County<br />mobile textile care</p>
            <Link className="button button--acid" href="/get-quote" onClick={() => setOpen(false)}>Start with photos</Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="shell footer-lead">
        <p className="eyebrow eyebrow--light">A better first step</p>
        <h2>Show us the textile.<br /><em>See the price.</em></h2>
        <Link className="round-link" href="/get-quote" aria-label="Build a service estimate"><span>Estimate</span><b>↗</b></Link>
      </div>
      <div className="shell footer-grid">
        <div><Logo inverse /><p>Mobile upholstery, mattress, rug and carpet care built around clear scope—not door-step surprises.</p></div>
        <div><h3>Explore</h3><Link href="/services">Services</Link><Link href="/pricing">Pricing</Link><Link href="/results">Results</Link><Link href="/guides">Guides</Link></div>
        <div><h3>Care</h3><Link href="/portal">Customer portal</Link><Link href="/prepare">Prepare</Link><Link href="/aftercare">Aftercare</Link><Link href="/claim">Care request</Link></div>
        <div><h3>Business</h3><Link href="/commercial">Commercial</Link><Link href="/service-area">Service area</Link><Link href="/contact">Contact</Link><Link href="/launch-checklist">Launch facts</Link></div>
      </div>
      <div className="shell footer-bottom">
        <span>© {year} Novaclean</span>
        <span>{brand.region}</span>
        <span><Link href="/privacy">Privacy</Link> · <Link href="/notice-at-collection">Collection notice</Link> · <Link href="/terms">Terms</Link> · <Link href="/cookie-policy">Cookies</Link> · <Link href="/claims-damage">Claims</Link> · <Link href="/accessibility">Accessibility</Link></span>
      </div>
      <div className="footer-word" aria-hidden="true" />
    </footer>
  );
}

export function MobileConversionBar() {
  return (
    <nav className="mobile-conversion" aria-label="Quick actions">
      <Link href="/contact">Message</Link>
      <Link href="/get-quote?mode=photos">Add photos</Link>
      <Link className="is-primary" href="/get-quote">Estimate</Link>
    </nav>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /><MobileConversionBar /></>;
}
