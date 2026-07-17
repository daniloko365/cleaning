"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Lead = {
  company: string; name: string; role: string; email: string; phone: string; propertyType: string; locations: string;
  seatingCount: string; carpetSqft: string; frequency: string; accessHours: string; targetDate: string; coi: boolean;
  procurement: string; notes: string; consent: boolean;
};

const blank: Lead = { company: "", name: "", role: "", email: "", phone: "", propertyType: "office", locations: "1", seatingCount: "", carpetSqft: "", frequency: "one-time", accessHours: "", targetDate: "", coi: false, procurement: "", notes: "", consent: false };

export function CommercialForm() {
  const [lead, setLead] = useState(blank);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const patch = (next: Partial<Lead>) => { setLead((current) => ({ ...current, ...next })); setError(""); };
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setStatus("");
    if (!lead.company || !lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || lead.phone.replace(/\D/g, "").length < 10 || !lead.consent) { setError("Add company, contact, valid email/phone and consent."); return; }
    setBusy(true);
    try {
      let uploadKeys: string[] = [];
      if (files.length) {
        const form = new FormData(); files.slice(0, 5).forEach((file) => form.append("files", file));
        const upload = await fetch("/api/upload", { method: "POST", body: form });
        if (upload.ok) uploadKeys = ((await upload.json()) as { keys: string[] }).keys;
      }
      const response = await fetch("/api/commercial", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...lead, uploadKeys }) });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to save request.");
      setStatus(`Commercial brief ${payload.reference} was received.`); setLead(blank); setFiles([]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save request."); }
    finally { setBusy(false); }
  }
  return (
    <form className="commercial-form" onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="company">Company / property</label><input id="company" value={lead.company} onChange={(e) => patch({ company: e.target.value })} required /></div>
        <div className="field"><label htmlFor="contact-name">Contact name</label><input id="contact-name" autoComplete="name" value={lead.name} onChange={(e) => patch({ name: e.target.value })} required /></div>
        <div className="field"><label htmlFor="role">Role</label><input id="role" value={lead.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Property manager, facilities…" /></div>
        <div className="field"><label htmlFor="property-type">Property type</label><select id="property-type" value={lead.propertyType} onChange={(e) => patch({ propertyType: e.target.value })}><option value="office">Office</option><option value="multifamily">Multifamily</option><option value="hospitality">Hospitality</option><option value="rental-portfolio">Rental portfolio</option><option value="other">Other</option></select></div>
        <div className="field"><label htmlFor="business-email">Work email</label><input id="business-email" type="email" autoComplete="email" value={lead.email} onChange={(e) => patch({ email: e.target.value })} required /></div>
        <div className="field"><label htmlFor="business-phone">Phone</label><input id="business-phone" type="tel" autoComplete="tel" value={lead.phone} onChange={(e) => patch({ phone: e.target.value })} required /></div>
        <div className="field"><label htmlFor="locations">Locations / units</label><input id="locations" type="number" min="1" value={lead.locations} onChange={(e) => patch({ locations: e.target.value })} /></div>
        <div className="field"><label htmlFor="seating-count">Approx. chairs / sofas</label><input id="seating-count" type="number" min="0" value={lead.seatingCount} onChange={(e) => patch({ seatingCount: e.target.value })} /></div>
        <div className="field"><label htmlFor="carpet-sqft">Approx. carpet sq ft</label><input id="carpet-sqft" type="number" min="0" value={lead.carpetSqft} onChange={(e) => patch({ carpetSqft: e.target.value })} /></div>
        <div className="field"><label htmlFor="frequency">Frequency</label><select id="frequency" value={lead.frequency} onChange={(e) => patch({ frequency: e.target.value })}><option value="one-time">One-time</option><option value="turnovers">As turnovers occur</option><option value="quarterly">Quarterly</option><option value="biannual">Twice yearly</option><option value="custom">Custom cadence</option></select></div>
        <div className="field"><label htmlFor="access-hours">Access / service hours</label><input id="access-hours" value={lead.accessHours} onChange={(e) => patch({ accessHours: e.target.value })} placeholder="After 6 PM, weekends requested…" /></div>
        <div className="field"><label htmlFor="target-date">Target date</label><input id="target-date" type="date" value={lead.targetDate} onChange={(e) => patch({ targetDate: e.target.value })} /></div>
      </div>
      <label className="consent"><input type="checkbox" checked={lead.coi} onChange={(e) => patch({ coi: e.target.checked })} /><span>COI / vendor packet will be required.</span></label>
      <div className="field"><label htmlFor="procurement">Procurement / payment terms (optional)</label><textarea id="procurement" value={lead.procurement} onChange={(e) => patch({ procurement: e.target.value })} /></div>
      <div className="field"><label htmlFor="commercial-notes">Scope notes</label><textarea id="commercial-notes" value={lead.notes} onChange={(e) => patch({ notes: e.target.value })} placeholder="Materials, recurring issues, parking, elevators, approval process…" /></div>
      <div className="field"><label htmlFor="commercial-files">Photos or floor plan (JPG, PNG, WebP)</label><input id="commercial-files" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))} /></div>
      <label className="consent"><input type="checkbox" checked={lead.consent} onChange={(e) => patch({ consent: e.target.checked })} required /><span>I authorize Novaclean to review and respond to this request under the <Link href="/notice-at-collection">notice at collection</Link>, <Link href="/privacy">privacy policy</Link>, and <Link href="/commercial-terms">commercial terms</Link>.</span></label>
      <button className="button button--ink" disabled={busy}>{busy ? "Saving brief…" : "Request walkthrough ↗"}</button>
      {error && <p className="quote-error" role="alert">{error}</p>}{status && <p className="care-result" role="status">{status}</p>}
    </form>
  );
}
