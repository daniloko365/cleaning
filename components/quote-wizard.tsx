"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/site-shell";
import {
  calculateEstimate,
  compareDate,
  getPrice,
  getPriceSource,
  minimums,
  money,
  quoteItemIds,
  serviceZone,
} from "@/lib/site-data";
import {
  defaultLocale,
  localizedPath,
  quoteMessages,
  translatedPrice,
  type Locale,
} from "@/lib/i18n";

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
  zip: "",
  itemId: "sofa",
  quantity: 1,
  fabric: "unknown",
  condition: "routine",
  stain: false,
  pet: false,
  notes: "",
  uploadKeys: [],
  slot: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  access: "",
  consent: false,
};

const itemIds: readonly string[] = quoteItemIds;

function nextSlots(locale: Locale) {
  const slots: { value: string; date: string; window: string }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (slots.length < 6) {
    if (cursor.getDay() !== 0) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      const date = cursor.toLocaleDateString(
        locale === "es" ? "es-US" : "en-US",
        { weekday: "short", month: "short", day: "numeric" },
      );
      const window = slots.length % 2 ? "12–3 PM" : "8–11 AM";
      slots.push({ value: `${iso}|${window}`, date, window });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return slots;
}

export function QuoteWizard({
  initialZip = "",
  initialService = "",
  bookingMode = false,
  locale = defaultLocale,
}: {
  initialZip?: string;
  initialService?: string;
  bookingMode?: boolean;
  locale?: Locale;
}) {
  const copy = quoteMessages[locale];
  const serviceItem = itemIds.includes(initialService)
    ? initialService
    : initialService === "move-reset"
      ? "carpet-3"
      : initial.itemId;
  const [step, setStep] = useState(
    bookingMode && serviceZone(initialZip) !== "out" ? 1 : 0,
  );
  const [data, setData] = useState<QuoteData>({
    ...initial,
    zip: initialZip,
    itemId: serviceItem,
    pet: initialService === "pet",
    stain: initialService === "stain",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const slots = useMemo(() => nextSlots(locale), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es-US" : "en-US";
  }, [locale]);

  useEffect(() => {
    const saved = localStorage.getItem("novaclean-quote");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        data?: Partial<QuoteData>;
        step?: number;
        savedAt?: string;
      };
      if (
        !parsed.savedAt ||
        Date.now() - Date.parse(parsed.savedAt) > 7 * 24 * 60 * 60 * 1000
      ) {
        localStorage.removeItem("novaclean-quote");
        return;
      }
      queueMicrotask(() => {
        if (parsed.data)
          setData({
            ...initial,
            ...parsed.data,
            zip: initialZip || parsed.data.zip || "",
            itemId: initialService
              ? serviceItem
              : parsed.data.itemId || initial.itemId,
            pet: initialService === "pet" || Boolean(parsed.data.pet),
            stain: initialService === "stain" || Boolean(parsed.data.stain),
          });
        if (!bookingMode && typeof parsed.step === "number" && parsed.step < 5)
          setStep(parsed.step);
      });
    } catch {
      /* ignore malformed local state */
    }
  }, [bookingMode, initialService, initialZip, serviceItem]);

  useEffect(() => {
    if (step >= 6) {
      localStorage.removeItem("novaclean-quote");
      return;
    }
    const safeDraft = {
      zip: data.zip,
      itemId: data.itemId,
      quantity: data.quantity,
      fabric: data.fabric,
      condition: data.condition,
      stain: data.stain,
      pet: data.pet,
      slot: data.slot,
    };
    localStorage.setItem(
      "novaclean-quote",
      JSON.stringify({
        data: safeDraft,
        step: Math.min(step, 4),
        savedAt: new Date().toISOString(),
      }),
    );
  }, [data, step]);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
    window.dispatchEvent(
      new CustomEvent("novaclean:event", {
        detail: {
          event: "quote_step_view",
          payload: { step, label: copy.steps[step] ?? "complete" },
        },
      }),
    );
  }, [copy.steps, step]);

  const estimate =
    calculateEstimate({
      zip: data.zip,
      itemId: data.itemId,
      quantity: data.quantity,
      stain: data.stain,
      pet: data.pet,
    }) ??
    calculateEstimate({
      zip: "92618",
      itemId: data.itemId,
      quantity: data.quantity,
      stain: data.stain,
      pet: data.pet,
    })!;
  const base = translatedPrice(estimate.item, locale);
  const baseSource = getPriceSource(estimate.item);
  const itemTotal = estimate.item.price * Math.max(1, estimate.quantity);
  const additions =
    (data.stain ? getPrice("stain").price : 0) +
    (data.pet ? getPrice("pet").price : 0);
  const serviceMinimum =
    estimate.zone === "core" ? minimums.core : minimums.extended;
  const total = estimate.total;

  function patchData(next: Partial<QuoteData>) {
    setData((current) => ({ ...current, ...next }));
    setError("");
  }

  async function upload() {
    if (!files.length) return true;
    setBusy(true);
    setUploadNote(
      locale === "es" ? "Subiendo de forma segura…" : "Uploading securely…",
    );
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error("upload failed");
      const payload = (await response.json()) as { keys: string[] };
      patchData({ uploadKeys: payload.keys });
      setUploadNote(
        locale === "es"
          ? `${payload.keys.length} archivo(s) adjunto(s).`
          : `${payload.keys.length} file${payload.keys.length === 1 ? "" : "s"} attached.`,
      );
      return true;
    } catch {
      setUploadNote(
        locale === "es"
          ? "Las fotos no se subieron. Puedes continuar; las pediremos de nuevo si hacen falta."
          : "The photos were not uploaded. You can continue; we will request them again if needed.",
      );
      return true;
    } finally {
      setBusy(false);
    }
  }

  function validate() {
    if (step === 0) {
      if (!/^\d{5}$/.test(data.zip)) {
        setError(copy.invalidZip);
        return false;
      }
      if (serviceZone(data.zip) === "out") {
        setError(copy.outside);
        return false;
      }
    }
    if (step === 1 && !data.itemId) {
      setError(copy.itemRequired);
      return false;
    }
    if (step === 4 && !data.slot) {
      setError(copy.windowRequired);
      return false;
    }
    if (
      step === 5 &&
      (!data.name.trim() ||
        !/^\S+@\S+\.\S+$/.test(data.email) ||
        data.phone.replace(/\D/g, "").length < 10 ||
        !data.address.trim() ||
        !data.consent)
    ) {
      setError(copy.contactRequired);
      return false;
    }
    return true;
  }

  async function next() {
    setError("");
    if (!validate()) return;
    if (step === 2) await upload();
    if (step < 5) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: bookingMode ? "booking" : `quote-${locale}`,
        }),
      });
      const payload = (await response.json()) as {
        reference?: string;
        error?: string;
      };
      if (!response.ok || !payload.reference)
        throw new Error(
          payload.error ||
            (locale === "es"
              ? "No se pudo guardar la solicitud."
              : "Unable to save the request."),
        );
      setReference(payload.reference);
      setStep(6);
      localStorage.removeItem("novaclean-quote");
      window.dispatchEvent(
        new CustomEvent("novaclean:event", {
          detail: {
            event: "quote_submitted",
            payload: { itemId: data.itemId, total },
          },
        }),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (cause) {
      setError(
        `${cause instanceof Error ? cause.message : "Unable to save the request."} ${locale === "es" ? "No se envió nada; inténtalo de nuevo." : "Nothing was submitted; please try again."}`,
      );
    } finally {
      setBusy(false);
    }
  }

  const conditionOptions =
    locale === "es"
      ? [
          ["routine", "Rutina", "Suciedad diaria"],
          ["visible", "Visible", "Varias manchas"],
          ["heavy", "Intenso", "Acumulación de uso"],
          ["restoration", "Revisión", "Desconocido / delicado"],
        ]
      : [
          ["routine", "Routine", "Everyday soil"],
          ["visible", "Visible", "Several spots"],
          ["heavy", "Heavy", "Traffic buildup"],
          ["restoration", "Review", "Unknown / delicate"],
        ];

  return (
    <main
      id="main-content"
      className="quote-shell"
      tabIndex={-1}
      lang={locale === "es" ? "es" : "en"}
    >
      <aside className="quote-rail">
        <Logo inverse locale={locale} />
        <h2>{copy.railTitle}</h2>
        <p>{copy.railCopy}</p>
        <div
          className="quote-progress"
          aria-label={
            locale === "es" ? "Progreso del cálculo" : "Estimate progress"
          }
        >
          {copy.steps.map((label, index) => (
            <span
              className={
                index === step ? "is-active" : index < step ? "is-done" : ""
              }
              key={label}
            >
              {label}
            </span>
          ))}
        </div>
      </aside>
      <section className="quote-main">
        <div className="quote-top">
          <Link href={localizedPath(locale, "/")}>← {copy.backSite}</Link>
          <span aria-live="polite">
            {step < 6 ? `${copy.step} ${step + 1} / 6` : copy.complete}
          </span>
        </div>
        <div className={`quote-step ${step === 6 ? "quote-confirmation" : ""}`}>
          {step === 0 && (
            <>
              <p className="eyebrow">{copy.coverageEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.coverageTitle}
              </h1>
              <p>{copy.coverageCopy}</p>
              <div className="quote-fields">
                <div className="field">
                  <label htmlFor="quote-zip">{copy.zip}</label>
                  <input
                    id="quote-zip"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={data.zip}
                    onChange={(event) =>
                      patchData({ zip: event.target.value.replace(/\D/g, "") })
                    }
                    placeholder="92618"
                    required
                  />
                </div>
              </div>
              {error === copy.outside && (
                <Link
                  className="text-link"
                  href={localizedPath(locale, "/out-of-area")}
                >
                  {copy.outsideLink}
                </Link>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <p className="eyebrow">{copy.itemEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.itemTitle}
              </h1>
              <p>{copy.itemCopy}</p>
              <div className="quote-fields">
                <div className="field">
                  <label htmlFor="quote-item">{copy.itemLabel}</label>
                  <select
                    id="quote-item"
                    value={data.itemId}
                    onChange={(event) =>
                      patchData({
                        itemId: event.target.value,
                        quantity: event.target.value === "dining-chair" ? 4 : 1,
                      })
                    }
                  >
                    {itemIds.map((id) => {
                      const item = translatedPrice(getPrice(id), locale);
                      return (
                        <option key={id} value={id}>
                          {item.label} — {money(item.price)}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {data.itemId === "dining-chair" && (
                  <div className="field">
                    <label htmlFor="quantity">{copy.quantity}</label>
                    <input
                      id="quantity"
                      type="number"
                      min={4}
                      max={24}
                      value={data.quantity}
                      onChange={(event) =>
                        patchData({
                          quantity: Math.max(4, Number(event.target.value)),
                        })
                      }
                    />
                  </div>
                )}
              </div>
              <div className="selected-item-summary">
                <span>{copy.startingAt}</span>
                <strong>{money(base.price)}</strong>
                <p>{base.scope}</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="eyebrow">{copy.detailEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.detailTitle}
              </h1>
              <p>{copy.detailCopy}</p>
              <div className="quote-fields quote-fields--split">
                <div className="field">
                  <label htmlFor="fabric">{copy.fabric}</label>
                  <select
                    id="fabric"
                    value={data.fabric}
                    onChange={(event) =>
                      patchData({ fabric: event.target.value })
                    }
                  >
                    <option value="unknown">
                      {locale === "es" ? "No lo sé" : "I don’t know"}
                    </option>
                    <option value="synthetic">
                      {locale === "es"
                        ? "Microfibra / poliéster"
                        : "Microfiber / polyester"}
                    </option>
                    <option value="natural">
                      {locale === "es"
                        ? "Algodón / lino / lana"
                        : "Cotton / linen / wool"}
                    </option>
                    <option value="delicate">
                      {locale === "es"
                        ? "Terciopelo / cuero / código X"
                        : "Velvet / leather / code X"}
                    </option>
                  </select>
                </div>
              </div>
              <p className="field-label">{copy.condition}</p>
              <div className="condition-scale">
                {conditionOptions.map(([value, label, note]) => (
                  <label className="option-card" key={value}>
                    <input
                      type="radio"
                      name="condition"
                      checked={data.condition === value}
                      onChange={() => patchData({ condition: value })}
                    />
                    <strong>{label}</strong>
                    <span>{note}</span>
                  </label>
                ))}
              </div>
              <div className="option-grid">
                <label className="option-card">
                  <input
                    type="checkbox"
                    checked={data.stain}
                    onChange={(event) =>
                      patchData({ stain: event.target.checked })
                    }
                  />
                  <strong>{copy.stain}</strong>
                  <span>+ {money(getPrice("stain").price)}</span>
                </label>
                <label className="option-card">
                  <input
                    type="checkbox"
                    checked={data.pet}
                    onChange={(event) =>
                      patchData({ pet: event.target.checked })
                    }
                  />
                  <strong>{copy.pet}</strong>
                  <span>+ {money(getPrice("pet").price)}</span>
                </label>
              </div>
              <div className="quote-fields">
                <div className="field">
                  <label htmlFor="notes">{copy.notes}</label>
                  <textarea
                    id="notes"
                    value={data.notes}
                    onChange={(event) =>
                      patchData({ notes: event.target.value })
                    }
                    placeholder={copy.notesPlaceholder}
                  />
                </div>
              </div>
              <div className="quote-photo-block">
                <h2>{copy.photos}</h2>
                <p>
                  {copy.photoCopy}{" "}
                  <Link
                    className="text-link"
                    href={localizedPath(locale, "/photo-media-consent")}
                  >
                    {locale === "es" ? "Política de fotos →" : "Photo policy →"}
                  </Link>
                </p>
                <label className="upload-zone">
                  <span>
                    <b>{copy.choosePhotos}</b>
                    <small>{copy.photoLibrary}</small>
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) =>
                      setFiles(Array.from(event.target.files ?? []).slice(0, 5))
                    }
                  />
                </label>
                {files.length > 0 && (
                  <p>{files.map((file) => file.name).join(" · ")}</p>
                )}
                {uploadNote && <p role="status">{uploadNote}</p>}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="eyebrow">{copy.estimateEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.estimateTitle}
              </h1>
              <p>{copy.estimateCopy}</p>
              <div className="estimate-card">
                <div className="estimate-card__head">
                  <div>
                    <small>{copy.estimateLabel}</small>
                    <strong>{money(total)}</strong>
                  </div>
                  <div>
                    <small>{locale === "es" ? "Estado" : "Status"}</small>
                    <b>
                      {locale === "es"
                        ? "Pendiente de revisión"
                        : "Pending review"}
                    </b>
                  </div>
                </div>
                <div className="estimate-card__body">
                  <div className="estimate-card__row">
                    <span>
                      {base.label}
                      {estimate.quantity > 1 ? ` × ${estimate.quantity}` : ""}
                    </span>
                    <b>{money(itemTotal)}</b>
                  </div>
                  {data.stain && (
                    <div className="estimate-card__row">
                      <span>{copy.stain}</span>
                      <b>{money(getPrice("stain").price)}</b>
                    </div>
                  )}
                  {data.pet && (
                    <div className="estimate-card__row">
                      <span>{copy.pet}</span>
                      <b>{money(getPrice("pet").price)}</b>
                    </div>
                  )}
                  {itemTotal + additions < serviceMinimum && (
                    <div className="estimate-card__row">
                      <span>{copy.minimum}</span>
                      <b>{money(serviceMinimum)}</b>
                    </div>
                  )}
                  <div className="estimate-card__row">
                    <span>{copy.scope}</span>
                    <b>{base.scope}</b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.benchmark}</span>
                    <b>
                      <a
                        className="text-link"
                        href={baseSource.url}
                        target={
                          baseSource.url.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          baseSource.url.startsWith("http")
                            ? "noreferrer"
                            : undefined
                        }
                      >
                        {baseSource.name}
                      </a>{" "}
                      · {compareDate}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.zone}</span>
                    <b>
                      {serviceZone(data.zip) === "core"
                        ? copy.core
                        : `${copy.extended} · ${money(minimums.extended)} ${copy.minimum}`}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.material}</span>
                    <b>
                      {data.fabric} · {data.condition}
                    </b>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="eyebrow">{copy.windowEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.windowTitle}
              </h1>
              <p>{copy.windowCopy}</p>
              <div className="availability-grid">
                {slots.map((slot) => (
                  <label className="option-card" key={slot.value}>
                    <input
                      type="radio"
                      name="slot"
                      checked={data.slot === slot.value}
                      onChange={() => patchData({ slot: slot.value })}
                    />
                    <time>{slot.date}</time>
                    <span>
                      {slot.window} {copy.preference}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <p className="eyebrow">{copy.contactEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.contactTitle}
              </h1>
              <p>{copy.contactCopy}</p>
              <div className="quote-fields">
                <div className="field">
                  <label htmlFor="name">{copy.name}</label>
                  <input
                    id="name"
                    autoComplete="name"
                    value={data.name}
                    onChange={(event) =>
                      patchData({ name: event.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">{copy.email}</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(event) =>
                      patchData({ email: event.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">{copy.phone}</label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(event) =>
                      patchData({ phone: event.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="address">{copy.address}</label>
                  <input
                    id="address"
                    autoComplete="street-address"
                    value={data.address}
                    onChange={(event) =>
                      patchData({ address: event.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="access">{copy.access}</label>
                  <textarea
                    id="access"
                    value={data.access}
                    onChange={(event) =>
                      patchData({ access: event.target.value })
                    }
                  />
                </div>
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(event) =>
                    patchData({ consent: event.target.checked })
                  }
                  required
                />
                <span>
                  {copy.consent}{" "}
                  <Link href="/terms" hrefLang="en-US">
                    {locale === "es" ? "Términos (EN)" : "Terms"}
                  </Link>{" "}
                  ·{" "}
                  <Link href="/privacy" hrefLang="en-US">
                    {locale === "es" ? "Privacidad (EN)" : "Privacy"}
                  </Link>
                </span>
              </label>
            </>
          )}

          {step === 6 && (
            <>
              <div className="quote-confirmation__mark" aria-hidden="true">
                ✓
              </div>
              <p className="eyebrow">{copy.receivedEye}</p>
              <h1 ref={headingRef} tabIndex={-1}>
                {copy.receivedTitle}
              </h1>
              <p>
                {copy.receivedCopy} <strong>{reference}</strong>.
              </p>
              <div className="estimate-card">
                <div className="estimate-card__body">
                  <div className="estimate-card__row">
                    <span>{copy.requested}</span>
                    <b>
                      {base.label}
                      {estimate.quantity > 1 ? ` × ${estimate.quantity}` : ""}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.estimate}</span>
                    <b>{money(total)}</b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.scope}</span>
                    <b>{base.scope}</b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.source}</span>
                    <b>
                      <a
                        className="text-link"
                        href={baseSource.url}
                        target={
                          baseSource.url.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          baseSource.url.startsWith("http")
                            ? "noreferrer"
                            : undefined
                        }
                      >
                        {baseSource.name}
                      </a>{" "}
                      · {compareDate}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.zipZone}</span>
                    <b>
                      {serviceZone(data.zip) === "core"
                        ? "Core"
                        : copy.extended}{" "}
                      · {data.zip}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.preferred}</span>
                    <b>{data.slot.split("|").join(" · ")}</b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.addressAccess}</span>
                    <b>
                      {data.address}
                      {data.access ? ` · ${data.access}` : ""}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.photos}</span>
                    <b>
                      {data.uploadKeys.length
                        ? `${data.uploadKeys.length} ${copy.attached}`
                        : copy.none}
                    </b>
                  </div>
                  <div className="estimate-card__row">
                    <span>{copy.confirmation}</span>
                    <b>{data.email}</b>
                  </div>
                </div>
              </div>
              <div
                className="button-row"
                style={{ justifyContent: "center", marginTop: "2rem" }}
              >
                <Link
                  className="button button--ink"
                  href={localizedPath(locale, "/prepare")}
                >
                  {copy.prepare}
                </Link>
                <Link className="text-link" href={localizedPath(locale, "/")}>
                  {copy.return}
                </Link>
              </div>
            </>
          )}

          {error && (
            <p className="quote-error" role="alert">
              {error}
            </p>
          )}
          {step < 6 && (
            <div className="quote-actions">
              <button
                className="back-button"
                type="button"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
              >
                ← {copy.back}
              </button>
              <button
                className="button button--ink"
                type="button"
                onClick={next}
                disabled={busy}
              >
                {busy ? copy.saving : step === 5 ? copy.save : copy.continue}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
