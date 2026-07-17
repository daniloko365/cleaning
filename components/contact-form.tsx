"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "", topic: "question", message: "", consent: false });
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState("");
  const patch = (next: Partial<typeof form>) => { setForm((current) => ({ ...current, ...next })); setError(""); };
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setResult("");
    if (!form.name || !/^\S+@\S+\.\S+$/.test(form.email) || !form.message || !form.consent) { setError("Add your name, valid email, message and consent."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to save message.");
      setResult(`Message ${payload.reference} was received.`); setForm({ name: "", email: "", phone: "", zip: "", topic: "question", message: "", consent: false });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save message."); }
    finally { setBusy(false); }
  }
  return <form className="contact-form" onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" autoComplete="name" value={form.name} onChange={(e) => patch({ name: e.target.value })} required /></div><div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" autoComplete="email" value={form.email} onChange={(e) => patch({ email: e.target.value })} required /></div><div className="field"><label htmlFor="contact-phone">Phone (optional)</label><input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => patch({ phone: e.target.value })} /></div><div className="field"><label htmlFor="contact-zip">Service ZIP (optional)</label><input id="contact-zip" inputMode="numeric" maxLength={5} value={form.zip} onChange={(e) => patch({ zip: e.target.value.replace(/\D/g, "") })} /></div><div className="field"><label htmlFor="contact-topic">Topic</label><select id="contact-topic" value={form.topic} onChange={(e) => patch({ topic: e.target.value })}><option value="question">General question</option><option value="fabric">Fabric eligibility</option><option value="existing">Existing request</option><option value="accessibility">Accessibility</option><option value="privacy">Privacy request</option></select></div></div><div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" value={form.message} onChange={(e) => patch({ message: e.target.value })} required /></div><label className="consent"><input type="checkbox" checked={form.consent} onChange={(e) => patch({ consent: e.target.checked })} required /><span>I authorize Novaclean to use this information to respond to this message. See the notice at collection.</span></label><button className="button button--ink" disabled={busy}>{busy ? "Saving…" : "Send message ↗"}</button>{error && <p className="quote-error" role="alert">{error}</p>}{result && <p className="care-result" role="status">{result}</p>}</form>;
}
