"use client";

import { FormEvent, useEffect, useState } from "react";
import { prices } from "@/lib/site-data";
import type { PublicSiteConfig } from "@/lib/site-config";

type RecordItem = {
  reference: string;
  status: string;
  createdAt: string;
  legalHold: boolean;
  customerName?: string;
  email?: string;
  phone?: string;
  zip?: string;
  itemId?: string;
  quantity?: number;
  requestedSlot?: string;
  estimateTotal?: number;
  address?: string;
  notes?: string;
  quoteReference?: string;
  requestType?: string;
  message?: string;
  company?: string;
  propertyType?: string;
  targetDate?: string;
  topic?: string;
};

type RecordType = "quote" | "care" | "commercial" | "message";
type Tab = "overview" | "leads" | "website" | "pricing" | "seo" | "system";
type Summary = {
  generatedAt: string;
  queues: { label: string; count: number; state: string }[];
  controls: { label: string; state: string; detail: string }[];
  records: {
    quotes: RecordItem[];
    care: RecordItem[];
    commercial: RecordItem[];
    messages: RecordItem[];
  };
  retention: {
    status: string;
    startedAt: string;
    completedAt?: string | null;
  } | null;
};

const statuses: Record<RecordType, string[]> = {
  quote: ["requested", "reviewing", "confirmed", "completed", "cancelled", "declined"],
  care: ["received", "reviewing", "resolved", "denied"],
  commercial: ["received", "reviewing", "proposal-sent", "won", "lost"],
  message: ["received", "reviewing", "resolved"],
};

const tabs: [Tab, string][] = [
  ["overview", "Overview"],
  ["leads", "Leads"],
  ["website", "Website"],
  ["pricing", "Prices"],
  ["seo", "SEO"],
  ["system", "System"],
];

function recordDetails(record: RecordItem) {
  return [
    record.customerName,
    record.company,
    record.email,
    record.phone,
    record.zip ? `ZIP ${record.zip}` : "",
    record.itemId
      ? `${record.itemId}${record.quantity && record.quantity > 1 ? ` × ${record.quantity}` : ""}`
      : "",
    record.estimateTotal != null ? `$${record.estimateTotal}` : "",
    record.requestedSlot?.replace("|", " · "),
    record.propertyType,
    record.targetDate,
    record.topic,
    record.requestType,
    record.quoteReference,
    record.address,
  ].filter(Boolean) as string[];
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

async function payload<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new Error(data.error || "The admin request could not be completed.");
  return data;
}

export function AdminDashboard() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [config, setConfig] = useState<PublicSiteConfig | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(silent = false) {
    try {
      const [summaryResponse, settingsResponse] = await Promise.all([
        fetch("/api/admin/summary", { cache: "no-store" }),
        fetch("/api/admin/settings", { cache: "no-store" }),
      ]);
      if (summaryResponse.status === 401 || settingsResponse.status === 401) {
        setAuthenticated(false);
        return;
      }
      const [nextSummary, settings] = await Promise.all([
        payload<Summary>(summaryResponse),
        payload<{ config: PublicSiteConfig }>(settingsResponse),
      ]);
      setSummary(nextSummary);
      setConfig(settings.config);
      setAuthenticated(true);
    } catch (cause) {
      if (!silent)
        setError(cause instanceof Error ? cause.message : "Dashboard unavailable.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await payload(
        await fetch("/api/admin/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password }),
        }),
      );
      setPassword("");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setSummary(null);
    setConfig(null);
    setNotice("");
  }

  async function saveSettings() {
    if (!config) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await payload<{ config: PublicSiteConfig }>(
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ config }),
        }),
      );
      setConfig(result.config);
      setNotice("Saved. New page loads now use these settings.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save settings.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRecord(
    type: RecordType,
    record: RecordItem,
    action: "status" | "legal-hold" | "delete",
    value?: string | boolean,
  ) {
    if (
      action === "delete" &&
      !window.confirm(
        `Permanently delete ${record.reference}? Attached media is also removed.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await payload(
        await fetch("/api/admin/records", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            type,
            reference: record.reference,
            action,
            status: action === "status" ? value : undefined,
            legalHold: action === "legal-hold" ? value : undefined,
          }),
        }),
      );
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Record update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function runRetentionNow() {
    setBusy(true);
    setError("");
    try {
      await payload(await fetch("/api/admin/retention", { method: "POST" }));
      await load();
      setNotice("Retention cleanup completed.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Retention cleanup failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!authenticated || !summary || !config) {
    return (
      <form className="admin-login" onSubmit={unlock}>
        <p className="eyebrow">Owner access</p>
        <h1>Novaclean admin</h1>
        <p>Manage leads, site copy, prices, booking controls and search metadata.</p>
        <div className="field">
          <label htmlFor="admin-username">Login</label>
          <input
            id="admin-username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button className="button button--acid" disabled={busy}>
          {busy ? "Checking…" : "Open dashboard ↗"}
        </button>
        {error && <p className="quote-error" role="alert">{error}</p>}
      </form>
    );
  }

  const groups: { type: RecordType; title: string; items: RecordItem[] }[] = [
    { type: "quote", title: "Photo quotes", items: summary.records.quotes },
    { type: "care", title: "Care / claims", items: summary.records.care },
    { type: "commercial", title: "Commercial briefs", items: summary.records.commercial },
    { type: "message", title: "Contact / privacy", items: summary.records.messages },
  ];

  return (
    <div className="admin-summary">
      <header>
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1>Control room</h1>
        </div>
        <div className="admin-head-actions">
          <a href="/" target="_blank" rel="noreferrer">Open site ↗</a>
          <button type="button" onClick={logout}>Log out</button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={tab === value ? "is-active" : ""}
            onClick={() => { setTab(value); setError(""); setNotice(""); }}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <>
          <section>
            <div className="admin-section-heading">
              <div><h2>Live queues</h2><p>Current records and first-party events.</p></div>
              <button className="button button--ink" type="button" onClick={() => load()} disabled={busy}>Refresh</button>
            </div>
            <div className="admin-metrics">
              {summary.queues.map((item) => (
                <article key={item.label}>
                  <span>{item.state}</span><strong>{item.count}</strong><p>{item.label}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <div className="admin-section-heading"><div><h2>Quick controls</h2><p>Use Website, Prices and SEO for detailed changes.</p></div></div>
            <div className="admin-controls">
              <article><span>{config.conversion.bookingEnabled ? "live" : "paused"}</span><div><h3>Online estimate requests</h3><p>{config.conversion.bookingEnabled ? "Customers can submit photo estimates." : "New online submissions are paused."}</p></div></article>
              <article><span>{config.notice.enabled ? "visible" : "off"}</span><div><h3>Service notice</h3><p>{config.notice.enabled ? config.notice.textEn || "Enabled without English text." : "No announcement is shown above the site."}</p></div></article>
              <article><span>${config.conversion.extendedMinimum}</span><div><h3>Extended-zone minimum</h3><p>Used by the quote calculator and public pricing explanation.</p></div></article>
              <article><span>{config.business.phone ? "set" : "needed"}</span><div><h3>Public contact details</h3><p>{config.business.phone || "Add the verified business phone in Website settings."}</p></div></article>
            </div>
          </section>
        </>
      )}

      {tab === "leads" && (
        <section>
          <div className="admin-section-heading"><div><h2>Customer records</h2><p>Newest 30 per queue. Status and legal hold changes are immediate.</p></div></div>
          <div className="admin-record-groups">
            {groups.map((group) => (
              <section key={group.type} className="admin-record-group">
                <h3>{group.title} <span>{group.items.length}</span></h3>
                {group.items.length ? group.items.map((record) => (
                  <article className="admin-record" key={record.reference}>
                    <header>
                      <div><strong>{record.reference}</strong><time>{new Date(record.createdAt).toLocaleString()}</time></div>
                      <select aria-label={`Status for ${record.reference}`} value={record.status} disabled={busy} onChange={(event) => changeRecord(group.type, record, "status", event.target.value)}>
                        {statuses[group.type].map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </header>
                    <p>{recordDetails(record).join(" · ") || "No additional record detail"}</p>
                    {(record.notes || record.message) && <blockquote>{record.notes || record.message}</blockquote>}
                    <footer>
                      <label><input type="checkbox" checked={record.legalHold} disabled={busy} onChange={(event) => changeRecord(group.type, record, "legal-hold", event.target.checked)} /> Legal hold</label>
                      <button type="button" disabled={busy || record.legalHold} onClick={() => changeRecord(group.type, record, "delete")}>Delete record</button>
                    </footer>
                  </article>
                )) : <p className="admin-empty">No records in this queue.</p>}
              </section>
            ))}
          </div>
        </section>
      )}

      {tab === "website" && (
        <section className="admin-settings">
          <div className="admin-section-heading"><div><h2>Website and conversion</h2><p>Public contact details, homepage message and request availability.</p></div></div>
          <div className="admin-form-card">
            <h3>Business contact</h3>
            <div className="admin-form-grid">
              <Field label="Public phone" hint="Shown only after you enter a verified number."><input value={config.business.phone} onChange={(e) => setConfig({ ...config, business: { ...config.business, phone: e.target.value } })} placeholder="(949) 555-0123" /></Field>
              <Field label="Public email"><input type="email" value={config.business.email} onChange={(e) => setConfig({ ...config, business: { ...config.business, email: e.target.value } })} placeholder="hello@example.com" /></Field>
              <Field label="Service hours"><input value={config.business.hours} onChange={(e) => setConfig({ ...config, business: { ...config.business, hours: e.target.value } })} placeholder="Mon–Sat · 8 AM–6 PM" /></Field>
              <Field label="Extended-zone minimum"><input type="number" min="0" step="1" value={config.conversion.extendedMinimum} onChange={(e) => setConfig({ ...config, conversion: { ...config.conversion, extendedMinimum: Number(e.target.value) } })} /></Field>
            </div>
          </div>
          <div className="admin-form-card">
            <h3>Homepage — English</h3>
            <Field label="Eyebrow"><input value={config.home.eyebrowEn} onChange={(e) => setConfig({ ...config, home: { ...config.home, eyebrowEn: e.target.value } })} /></Field>
            <Field label="Main headline"><input value={config.home.titleEn} onChange={(e) => setConfig({ ...config, home: { ...config.home, titleEn: e.target.value } })} /></Field>
            <Field label="Intro"><textarea value={config.home.descriptionEn} onChange={(e) => setConfig({ ...config, home: { ...config.home, descriptionEn: e.target.value } })} /></Field>
          </div>
          <div className="admin-form-card">
            <h3>Homepage — Spanish</h3>
            <Field label="Eyebrow"><input value={config.home.eyebrowEs} onChange={(e) => setConfig({ ...config, home: { ...config.home, eyebrowEs: e.target.value } })} /></Field>
            <Field label="Main headline"><input value={config.home.titleEs} onChange={(e) => setConfig({ ...config, home: { ...config.home, titleEs: e.target.value } })} /></Field>
            <Field label="Intro"><textarea value={config.home.descriptionEs} onChange={(e) => setConfig({ ...config, home: { ...config.home, descriptionEs: e.target.value } })} /></Field>
          </div>
          <div className="admin-form-card">
            <h3>Availability and optional service notice</h3>
            <label className="admin-toggle"><input type="checkbox" checked={config.conversion.bookingEnabled} onChange={(e) => setConfig({ ...config, conversion: { ...config.conversion, bookingEnabled: e.target.checked } })} /><span>Accept new online estimate requests</span></label>
            <Field label="Paused message — English"><textarea value={config.conversion.pausedMessageEn} onChange={(e) => setConfig({ ...config, conversion: { ...config.conversion, pausedMessageEn: e.target.value } })} /></Field>
            <Field label="Paused message — Spanish"><textarea value={config.conversion.pausedMessageEs} onChange={(e) => setConfig({ ...config, conversion: { ...config.conversion, pausedMessageEs: e.target.value } })} /></Field>
            <label className="admin-toggle"><input type="checkbox" checked={config.notice.enabled} onChange={(e) => setConfig({ ...config, notice: { ...config.notice, enabled: e.target.checked } })} /><span>Show a short service notice above the header</span></label>
            <Field label="Notice — English"><input value={config.notice.textEn} onChange={(e) => setConfig({ ...config, notice: { ...config.notice, textEn: e.target.value } })} placeholder="Holiday schedule updated" /></Field>
            <Field label="Notice — Spanish"><input value={config.notice.textEs} onChange={(e) => setConfig({ ...config, notice: { ...config.notice, textEs: e.target.value } })} /></Field>
            <Field label="Optional notice link" hint="Use a path such as /contact or a full HTTPS URL."><input value={config.notice.href} onChange={(e) => setConfig({ ...config, notice: { ...config.notice, href: e.target.value } })} /></Field>
          </div>
        </section>
      )}

      {tab === "pricing" && (
        <section className="admin-settings">
          <div className="admin-section-heading"><div><h2>Prices and scope</h2><p>Changes affect public price cards, tables, the calculator and saved estimate totals.</p></div></div>
          <div className="admin-price-list">
            {prices.map((item) => {
              const row = config.prices[item.id];
              return (
                <article key={item.id}>
                  <header><div><strong>{item.label}</strong><small>{item.id} · {item.category}</small></div><label>$ <input type="number" min="0" step="0.01" value={row.price} onChange={(e) => setConfig({ ...config, prices: { ...config.prices, [item.id]: { ...row, price: Number(e.target.value) } } })} /></label></header>
                  <div className="admin-form-grid">
                    <Field label="English scope" hint={`Default: ${item.scope}`}><input value={row.scopeEn} onChange={(e) => setConfig({ ...config, prices: { ...config.prices, [item.id]: { ...row, scopeEn: e.target.value } } })} placeholder={item.scope} /></Field>
                    <Field label="Spanish scope" hint="Leave blank to keep the built-in translation."><input value={row.scopeEs} onChange={(e) => setConfig({ ...config, prices: { ...config.prices, [item.id]: { ...row, scopeEs: e.target.value } } })} /></Field>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {tab === "seo" && (
        <section className="admin-settings">
          <div className="admin-section-heading"><div><h2>Search appearance</h2><p>Edit concise titles and descriptions. Service pages keep their own optimized metadata.</p></div></div>
          <div className="admin-form-card">
            <h3>English homepage</h3>
            <Field label="SEO title" hint={`${config.seo.homeTitleEn.length}/80 characters`}><input value={config.seo.homeTitleEn} onChange={(e) => setConfig({ ...config, seo: { ...config.seo, homeTitleEn: e.target.value } })} /></Field>
            <Field label="Meta description" hint={`${config.seo.homeDescriptionEn.length}/200 characters`}><textarea value={config.seo.homeDescriptionEn} onChange={(e) => setConfig({ ...config, seo: { ...config.seo, homeDescriptionEn: e.target.value } })} /></Field>
          </div>
          <div className="admin-form-card">
            <h3>Spanish homepage</h3>
            <Field label="SEO title" hint={`${config.seo.homeTitleEs.length}/80 characters`}><input value={config.seo.homeTitleEs} onChange={(e) => setConfig({ ...config, seo: { ...config.seo, homeTitleEs: e.target.value } })} /></Field>
            <Field label="Meta description" hint={`${config.seo.homeDescriptionEs.length}/200 characters`}><textarea value={config.seo.homeDescriptionEs} onChange={(e) => setConfig({ ...config, seo: { ...config.seo, homeDescriptionEs: e.target.value } })} /></Field>
          </div>
          <div className="admin-form-card">
            <h3>Site-wide</h3>
            <Field label="Default meta description"><textarea value={config.seo.defaultDescription} onChange={(e) => setConfig({ ...config, seo: { ...config.seo, defaultDescription: e.target.value } })} /></Field>
            <Field label="Google Search Console verification token" hint="Paste only the token value, not the full meta tag."><input value={config.seo.googleSiteVerification} onChange={(e) => setConfig({ ...config, seo: { ...config.seo, googleSiteVerification: e.target.value } })} /></Field>
            <div className="admin-seo-links"><a href="/sitemap.xml" target="_blank">Open sitemap ↗</a><a href="/robots.txt" target="_blank">Open robots.txt ↗</a></div>
          </div>
        </section>
      )}

      {tab === "system" && (
        <section>
          <div className="admin-section-heading"><div><h2>System and privacy controls</h2><p>Retention runs daily at 08:17 UTC and can be run here.</p></div><button type="button" className="button button--ink" disabled={busy} onClick={runRetentionNow}>{busy ? "Working…" : "Run retention now"}</button></div>
          <div className="admin-controls">{summary.controls.map((item) => <article key={item.label}><span>{item.state}</span><div><h3>{item.label}</h3><p>{item.detail}</p></div></article>)}</div>
        </section>
      )}

      {(tab === "website" || tab === "pricing" || tab === "seo") && (
        <div className="admin-savebar">
          <div>{notice || "Changes are drafts until you save."}</div>
          <button type="button" className="button button--acid" disabled={busy} onClick={saveSettings}>{busy ? "Saving…" : "Save changes"}</button>
        </div>
      )}
      {error && <p className="admin-global-error" role="alert">{error}</p>}
    </div>
  );
}
