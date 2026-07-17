"use client";

import { FormEvent, useState } from "react";

type Summary = {
  generatedAt: string;
  queues: { label: string; count: number; state: string }[];
  controls: { label: string; state: string; detail: string }[];
};

export function AdminDashboard() {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/summary", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 404 ? "Admin access is not configured or the token is invalid." : "Dashboard unavailable.");
      setSummary(await response.json() as Summary); setToken("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Dashboard unavailable.");
    } finally {
      setBusy(false);
    }
  }

  if (!summary) {
    return (
      <form className="admin-login" onSubmit={unlock}>
        <p className="eyebrow">Operations access</p>
        <h1>Novaclean control room</h1>
        <p>Aggregate counts only. Customer PII is not rendered in this dashboard.</p>
        <div className="field">
          <label htmlFor="admin-token">Access token</label>
          <input id="admin-token" type="password" autoComplete="current-password" value={token} onChange={(event) => setToken(event.target.value)} required />
        </div>
        <button className="button button--acid" disabled={busy}>{busy ? "Checking…" : "Open dashboard ↗"}</button>
        {error && <p className="quote-error" role="alert">{error}</p>}
      </form>
    );
  }

  return (
    <div className="admin-summary">
      <header>
        <div><p className="eyebrow">Operations · aggregate view</p><h1>Control room</h1></div>
        <div><small>Generated</small><time>{new Date(summary.generatedAt).toLocaleString()}</time></div>
      </header>
      <section><h2>Live queues</h2><div className="admin-metrics">{summary.queues.map((item) => <article key={item.label}><span>{item.state}</span><strong>{item.count}</strong><p>{item.label}</p></article>)}</div></section>
      <section><h2>Control registry</h2><div className="admin-controls">{summary.controls.map((item) => <article key={item.label}><span>{item.state}</span><div><h3>{item.label}</h3><p>{item.detail}</p></div></article>)}</div></section>
    </div>
  );
}
