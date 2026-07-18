"use client";
import { FormEvent, useState } from "react";

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
type Summary = {
  generatedAt: string;
  queues: { label: string; count: number; state: string }[];
  controls: { label: string; state: string; detail: string }[];
  records: { quotes: RecordItem[]; care: RecordItem[]; commercial: RecordItem[]; messages: RecordItem[] };
  retention: { status: string; startedAt: string; completedAt?: string | null } | null;
};

const statuses: Record<RecordType, string[]> = {
  quote: ["requested", "reviewing", "confirmed", "completed", "cancelled", "declined"],
  care: ["received", "reviewing", "resolved", "denied"],
  commercial: ["received", "reviewing", "proposal-sent", "won", "lost"],
  message: ["received", "reviewing", "resolved"],
};

function recordDetails(record: RecordItem) {
  return [
    record.customerName,
    record.company,
    record.email,
    record.phone,
    record.zip ? `ZIP ${record.zip}` : "",
    record.itemId ? `${record.itemId}${record.quantity && record.quantity > 1 ? ` × ${record.quantity}` : ""}` : "",
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

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(accessToken: string) {
    const response = await fetch("/api/admin/summary", { headers: { authorization: `Bearer ${accessToken}` }, cache: "no-store" });
    if (!response.ok) throw new Error(response.status === 404 ? "Admin access is not configured or the token is invalid." : "Dashboard unavailable.");
    setSummary(await response.json() as Summary);
  }

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await load(token);
      setSessionToken(token);
      setToken("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Dashboard unavailable.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRecord(type: RecordType, record: RecordItem, action: "status" | "legal-hold" | "delete", value?: string | boolean) {
    if (action === "delete" && !window.confirm(`Permanently delete ${record.reference}? This also removes attached media and cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/records", {
        method: "POST",
        headers: { authorization: `Bearer ${sessionToken}`, "content-type": "application/json" },
        body: JSON.stringify({ type, reference: record.reference, action, status: action === "status" ? value : undefined, legalHold: action === "legal-hold" ? value : undefined }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Record update failed.");
      await load(sessionToken);
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
      const response = await fetch("/api/admin/retention", { method: "POST", headers: { authorization: `Bearer ${sessionToken}` } });
      if (!response.ok) throw new Error("Retention cleanup failed.");
      await load(sessionToken);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Retention cleanup failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!summary) {
    return (
      <form className="admin-login" onSubmit={unlock}>
        <p className="eyebrow">Operations access</p>
        <h1>Novaclean control room</h1>
        <p>Private customer records and operational controls. The token is kept only in this open tab.</p>
        <div className="field">
          <label htmlFor="admin-token">Access token</label>
          <input id="admin-token" type="password" autoComplete="current-password" value={token} onChange={(event) => setToken(event.target.value)} required />
        </div>
        <button className="button button--acid" disabled={busy}>{busy ? "Checking…" : "Open dashboard ↗"}</button>
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
        <div><p className="eyebrow">Operations · protected view</p><h1>Control room</h1></div>
        <div><small>Generated</small><time>{new Date(summary.generatedAt).toLocaleString()}</time></div>
      </header>
      <section><h2>Live queues</h2><div className="admin-metrics">{summary.queues.map((item) => <article key={item.label}><span>{item.state}</span><strong>{item.count}</strong><p>{item.label}</p></article>)}</div></section>
      <section><div className="admin-section-heading"><h2>Customer records</h2><p>Newest 30 per queue. Status and legal hold changes are immediate.</p></div><div className="admin-record-groups">{groups.map((group) => <section key={group.type} className="admin-record-group"><h3>{group.title} <span>{group.items.length}</span></h3>{group.items.length ? group.items.map((record) => <article className="admin-record" key={record.reference}><header><div><strong>{record.reference}</strong><time>{new Date(record.createdAt).toLocaleString()}</time></div><select aria-label={`Status for ${record.reference}`} value={record.status} disabled={busy} onChange={(event) => changeRecord(group.type, record, "status", event.target.value)}>{statuses[group.type].map((status) => <option key={status}>{status}</option>)}</select></header><p>{recordDetails(record).join(" · ") || "No additional record detail"}</p>{(record.notes || record.message) && <blockquote>{record.notes || record.message}</blockquote>}<footer><label><input type="checkbox" checked={record.legalHold} disabled={busy} onChange={(event) => changeRecord(group.type, record, "legal-hold", event.target.checked)} /> Legal hold</label><button type="button" disabled={busy || record.legalHold} onClick={() => changeRecord(group.type, record, "delete")}>Delete record</button></footer></article>) : <p className="admin-empty">No records in this queue.</p>}</section>)}</div></section>
      <section><div className="admin-section-heading"><div><h2>Control registry</h2><p>Retention runs daily at 08:17 UTC and can be tested here.</p></div><button type="button" className="button button--ink" disabled={busy} onClick={runRetentionNow}>{busy ? "Working…" : "Run retention now"}</button></div><div className="admin-controls">{summary.controls.map((item) => <article key={item.label}><span>{item.state}</span><div><h3>{item.label}</h3><p>{item.detail}</p></div></article>)}</div></section>
      {error && <p className="quote-error" role="alert">{error}</p>}
    </div>
  );
}
