"use client";

import { FormEvent, useState } from "react";

export function CareForm({ type }: { type: "track" | "reschedule" | "claim" }) {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setResult("");
    if (!reference.toUpperCase().startsWith("NC-") || !/^\S+@\S+\.\S+$/.test(email)) { setError("Enter the NC service reference and booking email."); return; }
    setBusy(true);
    try {
      const response = type === "track"
        ? await fetch(`/api/care?quoteReference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`)
        : await fetch("/api/care", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ quoteReference: reference, email, requestType: type, message }) });
      const payload = await response.json() as { status?: string; reference?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "Request unavailable");
      setResult(type === "track" ? `Current request status: ${payload.status}.` : `Care reference ${payload.reference} was received.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to submit the request."); }
    finally { setBusy(false); }
  }
  return (
    <form className="care-form" onSubmit={submit}>
      <div className="field"><label htmlFor={`${type}-reference`}>NC service reference</label><input id={`${type}-reference`} value={reference} onChange={(e) => setReference(e.target.value.toUpperCase())} placeholder="NC-…" required /></div>
      <div className="field"><label htmlFor={`${type}-email`}>Booking email</label><input id={`${type}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      {type !== "track" && <div className="field"><label htmlFor={`${type}-message`}>{type === "claim" ? "What needs another look?" : "Preferred new windows"}</label><textarea id={`${type}-message`} value={message} onChange={(e) => setMessage(e.target.value)} required /></div>}
      <button className="button button--ink" disabled={busy}>{busy ? "Checking…" : type === "track" ? "Check status ↗" : "Send request ↗"}</button>
      {error && <p className="quote-error" role="alert">{error}</p>}{result && <p className="care-result" role="status">{result}</p>}
    </form>
  );
}
