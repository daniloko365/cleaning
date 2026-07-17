"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/site-shell";
import { calculateEstimate, compareDate, getPrice, getPriceSource, minimums, money, quoteItemIds, serviceZone } from "@/lib/site-data";

type QuoteData = {
  zip: string;
  itemId: string;
  quantity: number;
  fabric: string;
  condition: string;
  stain: boolean;
  pet: boolean;
  notes: string;
  uploadKeys: string[];
  slot: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  access: string;
  consent: boolean;
};

const initial: QuoteData = {
  zip: "", itemId: "sofa", quantity: 1, fabric: "unknown", condition: "routine", stain: false, pet: false,
  notes: "", uploadKeys: [], slot: "", name: "", email: "", phone: "", address: "", access: "", consent: false,
};

const steps = ["ZIP", "Item", "Fabric", "Condition", "Photos", "Estimate", "Window", "Contact"];
const itemIds: readonly string[] = quoteItemIds;

function nextSlots() {
  const slots: { value: string; date: string; window: string }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (slots.length < 6) {
    if (cursor.getDay() !== 0) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      const date = cursor.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const window = slots.length % 2 ? "12–3 PM" : "8–11 AM";
      slots.push({ value: `${iso}|${window}`, date, window });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return slots;
}

export function QuoteWizard({ initialZip = "", initialService = "", bookingMode = false }: { initialZip?: string; initialService?: string; bookingMode?: boolean }) {
  const serviceItem = itemIds.includes(initialService) ? initialService : initialService === "move-reset" ? "carpet-3" : initial.itemId;
  const [step, setStep] = useState(bookingMode && serviceZone(initialZip) !== "out" ? 1 : 0);
  const [data, setData] = useState<QuoteData>({ ...initial, zip: initialZip, itemId: serviceItem, pet: initialService === "pet", stain: initialService === "stain" });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const slots = useMemo(() => nextSlots(), []);

  useEffect(() => {
    const saved = localStorage.getItem("novaclean-quote");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { data?: Partial<QuoteData>; step?: number; savedAt?: string };
      if (!parsed.savedAt || Date.now() - Date.parse(parsed.savedAt) > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem("novaclean-quote");
        return;
      }
      queueMicrotask(() => {
        if (parsed.data) setData({ ...initial, ...parsed.data, zip: initialZip || parsed.data.zip || "", itemId: initialService ? serviceItem : parsed.data.itemId || initial.itemId, pet: initialService === "pet" || Boolean(parsed.data.pet), stain: initialService === "stain" || Boolean(parsed.data.stain) });
        if (!bookingMode && typeof parsed.step === "number" && parsed.step < 7) setStep(parsed.step);
      });
    } catch { /* ignore malformed local state */ }
  }, [bookingMode, initialService, initialZip, serviceItem]);

  useEffect(() => {
    if (step >= 8) { localStorage.removeItem("novaclean-quote"); return; }
    const safeDraft = { zip: data.zip, itemId: data.itemId, quantity: data.quantity, fabric: data.fabric, condition: data.condition, stain: data.stain, pet: data.pet, slot: data.slot };
    localStorage.setItem("novaclean-quote", JSON.stringify({ data: safeDraft, step: Math.min(step, 6), savedAt: new Date().toISOString() }));
  }, [data, step]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("novaclean:event", { detail: { event: "quote_step_view", payload: { step, label: steps[step] ?? "complete" } } }));
  }, [step]);

  const estimate = calculateEstimate({ zip: data.zip, itemId: data.itemId, quantity: data.quantity, stain: data.stain, pet: data.pet })
    ?? calculateEstimate({ zip: "92618", itemId: data.itemId, quantity: data.quantity, stain: data.stain, pet: data.pet })!;
  const base = estimate.item;
  const baseSource = getPriceSource(base);
  const itemTotal = base.price * Math.max(1, data.quantity);
  const additions = (data.stain ? getPrice("stain").price : 0) + (data.pet ? getPrice("pet").price : 0);
  const serviceMinimum = estimate.zone === "core" ? minimums.core : minimums.extended;
  const total = estimate.total;
  const comparison = estimate.comparison;

  function patchData(next: Partial<QuoteData>) { setData((current) => ({ ...current, ...next })); setError(""); }

  async function upload() {
    if (!files.length) return true;
    setBusy(true); setUploadNote("Uploading securely…");
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      const response = await fetch("/api/upload", { method: "POST", body: form });
      if (!response.ok) throw new Error("upload failed");
      const payload = await response.json() as { keys: string[] };
      patchData({ uploadKeys: payload.keys });
      setUploadNote(`${payload.keys.length} file${payload.keys.length === 1 ? "" : "s"} attached.`);
      return true;
    } catch {
      setUploadNote("The photos were not uploaded. You can continue; we will request them again if they are needed for review.");
      return true;
    } finally { setBusy(false); }
  }

  function validate() {
    if (step === 0) {
      if (!/^\d{5}$/.test(data.zip)) { setError("Enter a valid 5-digit ZIP."); return false; }
      if (serviceZone(data.zip) === "out") { setError("This ZIP is outside the current Orange County launch route. Use the out-of-area page to keep your request without an availability claim."); return false; }
    }
    if (step === 1 && !data.itemId) { setError("Choose an item to continue."); return false; }
    if (step === 6 && !data.slot) { setError("Choose an arrival window."); return false; }
    if (step === 7 && (!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email) || data.phone.replace(/\D/g, "").length < 10 || !data.address.trim() || !data.consent)) { setError("Add your name, valid email, phone and service address, then accept the service terms."); return false; }
    return true;
  }

  async function next() {
    setError("");
    if (!validate()) return;
    if (step === 4) await upload();
    if (step < 7) { setStep((current) => current + 1); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/quotes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, source: bookingMode ? "booking" : "quote" }) });
      const payload = await response.json() as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) throw new Error(payload.error || "Unable to save the request.");
      setReference(payload.reference);
      setStep(8); localStorage.removeItem("novaclean-quote"); window.dispatchEvent(new CustomEvent("novaclean:event", { detail: { event: "quote_submitted", payload: { itemId: data.itemId, total } } })); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      setError(`${cause instanceof Error ? cause.message : "Unable to save the request."} Nothing was submitted; your non-contact draft remains on this device. Please try again.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="quote-shell">
      <aside className="quote-rail">
        <Logo inverse />
        <h2>Your item,<br /><em>priced plainly.</em></h2>
        <p>The estimate is built from your item, size, fabric, condition and service zone.</p>
        <div className="quote-progress" aria-label="Quote progress">
          {steps.map((label, index) => <span className={index === step ? "is-active" : index < step ? "is-done" : ""} key={label}>{label}</span>)}
        </div>
      </aside>
      <section className="quote-main">
        <div className="quote-top"><Link href="/">← Back to site</Link><span>{step < 8 ? `Step ${Math.min(step + 1, 8)} / 8` : "Complete"}</span></div>
        <div className={`quote-step ${step === 8 ? "quote-confirmation" : ""}`}>
          {step === 0 && <><p className="eyebrow">Coverage first</p><h1>Where should we come?</h1><p>Your ZIP decides the service zone and minimum before we ask for contact details.</p><div className="quote-fields"><div className="field"><label htmlFor="quote-zip">Service ZIP</label><input id="quote-zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={data.zip} onChange={(e) => patchData({ zip: e.target.value.replace(/\D/g, "") })} placeholder="92618" required /></div></div>{error.includes("outside") && <Link className="text-link" href="/out-of-area">Open out-of-area route →</Link>}</>}
          {step === 1 && <><p className="eyebrow">Choose the item</p><h1>What needs care?</h1><p>Start with the primary item. Stain and pet treatments can be added after condition.</p><div className="option-grid">{itemIds.map((id) => { const item = getPrice(id); return <label className="option-card" key={id}><input type="radio" name="item" checked={data.itemId === id} onChange={() => patchData({ itemId: id, quantity: id === "dining-chair" ? 4 : 1 })} /><strong>{item.shortLabel}</strong><span>From {money(item.price)} · {item.scope}</span></label>; })}</div>{data.itemId === "dining-chair" && <div className="quote-fields"><div className="field"><label htmlFor="quantity">How many chairs? (4 minimum)</label><input id="quantity" type="number" min={4} max={24} value={data.quantity} onChange={(e) => patchData({ quantity: Math.max(4, Number(e.target.value)) })} /></div></div>}</>}
          {step === 2 && <><p className="eyebrow">Fabric check</p><h1>What is it made of?</h1><p>If you are unsure, choose “I don’t know” and photograph the care tag on the next step.</p><div className="option-grid">{[["unknown", "I don’t know", "A tag photo is perfect"], ["synthetic", "Microfiber / polyester", "Common performance fabrics"], ["natural", "Cotton / linen / wool", "Needs dye and shrinkage review"], ["delicate", "Velvet / leather / code X", "Manual eligibility review"]].map(([value,label,note]) => <label className="option-card" key={value}><input type="radio" name="fabric" checked={data.fabric === value} onChange={() => patchData({ fabric: value })} /><strong>{label}</strong><span>{note}</span></label>)}</div></>}
          {step === 3 && <><p className="eyebrow">Condition</p><h1>How much is going on?</h1><p>Condition does not trigger an automatic upsell. It tells us which questions and photos matter.</p><div className="condition-scale">{[["routine", "Routine", "Everyday soil"], ["visible", "Visible", "Several spots"], ["heavy", "Heavy", "Traffic buildup"], ["restoration", "Review", "Unknown / delicate"]].map(([value,label,note]) => <label className="option-card" key={value}><input type="radio" name="condition" checked={data.condition === value} onChange={() => patchData({ condition: value })} /><strong>{label}</strong><span>{note}</span></label>)}</div><div className="option-grid"><label className="option-card"><input type="checkbox" checked={data.stain} onChange={(e) => patchData({ stain: e.target.checked })} /><strong>Targeted stain area</strong><span>+ {money(getPrice("stain").price)} when approved</span></label><label className="option-card"><input type="checkbox" checked={data.pet} onChange={(e) => patchData({ pet: e.target.checked })} /><strong>Pet incident / odor</strong><span>+ {money(getPrice("pet").price)} surface treatment</span></label></div><div className="quote-fields"><div className="field"><label htmlFor="notes">What should the technician know? (optional)</label><textarea id="notes" value={data.notes} onChange={(e) => patchData({ notes: e.target.value })} placeholder="Location, age of spot, previous products…" /></div></div></>}
          {step === 4 && <><p className="eyebrow">Photos</p><h1>Show the whole item and the detail.</h1><p>Best set: one full-item photo, one close-up, and one care-tag photo. JPG, PNG or WebP; up to 8 MB each. Avoid faces and unrelated private details; quote uploads are not marketing consent. <Link className="text-link" href="/photo-media-consent">Photo policy →</Link></p><label className="upload-zone"><span><b>Choose photos</b><small>Camera or photo library</small></span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))} /></label>{files.length > 0 && <p>{files.map((file) => file.name).join(" · ")}</p>}{uploadNote && <p role="status">{uploadNote}</p>}</>}
          {step === 5 && <><p className="eyebrow">Your estimate</p><h1>Clear now. Confirmed before work.</h1><p>This estimate assumes the item and condition match the details provided. We never add work without your approval.</p><div className="estimate-card"><div className="estimate-card__head"><div><small>Novaclean estimate</small><strong>{money(total)}</strong></div><div><small>Published comparison</small><s>{money(comparison)}</s></div></div><div className="estimate-card__body"><div className="estimate-card__row"><span>{base.label}{data.quantity > 1 ? ` × ${data.quantity}` : ""}</span><b>{money(itemTotal)}</b></div>{data.stain && <div className="estimate-card__row"><span>Targeted stain treatment</span><b>{money(getPrice("stain").price)}</b></div>}{data.pet && <div className="estimate-card__row"><span>Surface pet enzyme treatment</span><b>{money(getPrice("pet").price)}</b></div>}{itemTotal + additions < serviceMinimum && <div className="estimate-card__row"><span>{serviceZone(data.zip) === "core" ? "Core-zone" : "Extended-zone"} service minimum</span><b>{money(serviceMinimum)}</b></div>}<div className="estimate-card__row"><span>Comparable scope</span><b>{base.scope}</b></div><div className="estimate-card__row"><span>Comparison evidence</span><b><a className="text-link" href={baseSource.url} target={baseSource.url.startsWith("http") ? "_blank" : undefined} rel={baseSource.url.startsWith("http") ? "noreferrer" : undefined}>{baseSource.name}</a> · checked {compareDate}</b></div><div className="estimate-card__row"><span>Service zone</span><b>{serviceZone(data.zip) === "core" ? "Core · no primary-item visit minimum" : `Extended · ${money(minimums.extended)} minimum`}</b></div><div className="estimate-card__row"><span>Fabric / condition</span><b>{data.fabric} · {data.condition}</b></div></div></div></>}
          {step === 6 && <><p className="eyebrow">Preferred arrival window</p><h1>Choose a useful preference.</h1><p>These windows are preferences, not live availability. Your request is confirmed only after it is checked against the real route calendar.</p><div className="availability-grid">{slots.map((slot) => <label className="option-card" key={slot.value}><input type="radio" name="slot" checked={data.slot === slot.value} onChange={() => patchData({ slot: slot.value })} /><time>{slot.date}</time><span>{slot.window} preferred arrival</span></label>)}</div></>}
          {step === 7 && <><p className="eyebrow">Reserve the request</p><h1>Who should receive confirmation?</h1><p>We collect only what is needed to route and confirm this request. Contact details are never saved in the browser draft. No payment is required at this launch stage. <Link className="text-link" href="/notice-at-collection">Notice at collection →</Link></p><div className="quote-fields"><div className="field"><label htmlFor="name">Name</label><input id="name" autoComplete="name" value={data.name} onChange={(e) => patchData({ name: e.target.value })} required /></div><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" value={data.email} onChange={(e) => patchData({ email: e.target.value })} required /></div><div className="field"><label htmlFor="phone">Mobile phone</label><input id="phone" type="tel" autoComplete="tel" value={data.phone} onChange={(e) => patchData({ phone: e.target.value })} required /></div><div className="field"><label htmlFor="address">Service address</label><input id="address" autoComplete="street-address" value={data.address} onChange={(e) => patchData({ address: e.target.value })} required /></div><div className="field"><label htmlFor="access">Parking / gate / access notes (optional)</label><textarea id="access" value={data.access} onChange={(e) => patchData({ access: e.target.value })} /></div></div><label className="consent"><input type="checkbox" checked={data.consent} onChange={(e) => patchData({ consent: e.target.checked })} required /><span>I agree to the <Link href="/terms">service terms</Link> and acknowledge the <Link href="/privacy">privacy policy</Link>. The estimate is confirmed against the actual item before work begins.</span></label></>}
          {step === 8 && <><div className="quote-confirmation__mark" aria-hidden="true">✓</div><p className="eyebrow">Request received</p><h1>We have your service brief.</h1><p>Reference <strong>{reference}</strong>. Keep this number with your estimate. The route window is requested, not yet a claim of live availability.</p><div className="estimate-card"><div className="estimate-card__body"><div className="estimate-card__row"><span>Requested service</span><b>{base.label}{data.quantity > 1 ? ` × ${data.quantity}` : ""}</b></div><div className="estimate-card__row"><span>Comparable scope</span><b>{base.scope}</b></div><div className="estimate-card__row"><span>Material / condition</span><b>{data.fabric} · {data.condition}</b></div>{data.stain && <div className="estimate-card__row"><span>Add-on</span><b>Targeted stain treatment</b></div>}{data.pet && <div className="estimate-card__row"><span>Add-on</span><b>Surface pet enzyme treatment</b></div>}<div className="estimate-card__row"><span>Estimate / comparison</span><b>{money(total)} / <s>{money(comparison)}</s></b></div><div className="estimate-card__row"><span>Comparison source</span><b><a className="text-link" href={baseSource.url} target={baseSource.url.startsWith("http") ? "_blank" : undefined} rel={baseSource.url.startsWith("http") ? "noreferrer" : undefined}>{baseSource.name}</a> · checked {compareDate}</b></div><div className="estimate-card__row"><span>Zone / ZIP</span><b>{serviceZone(data.zip) === "core" ? "Core" : "Extended"} · {data.zip}</b></div><div className="estimate-card__row"><span>Preferred window</span><b>{data.slot.split("|").join(" · ")}</b></div><div className="estimate-card__row"><span>Address / access</span><b>{data.address || "Added on confirmation"}{data.access ? ` · ${data.access}` : ""}</b></div><div className="estimate-card__row"><span>Photos</span><b>{data.uploadKeys.length ? `${data.uploadKeys.length} attached` : "None attached"}</b></div><div className="estimate-card__row"><span>Confirmation</span><b>{data.email}</b></div></div></div><div className="button-row" style={{ justifyContent: "center", marginTop: "2rem" }}><Link className="button button--ink" href="/prepare">How to prepare</Link><Link className="text-link" href="/">Return home</Link></div></>}
          {error && <p className="quote-error" role="alert">{error}</p>}
          {step < 8 && <div className="quote-actions"><button className="back-button" type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Back</button><button className="button button--ink" type="button" onClick={next} disabled={busy}>{busy ? "Saving…" : step === 7 ? "Reserve request ↗" : "Continue →"}</button></div>}
        </div>
      </section>
    </main>
  );
}
