"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale, localizedPath, type Locale } from "@/lib/i18n";

export function ZipChecker({
  dark = false,
  locale = defaultLocale,
}: {
  dark?: boolean;
  locale?: Locale;
}) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const id = useId();
  const inputId = `zip-${id.replace(/:/g, "")}`;
  const errorId = `${inputId}-error`;
  const router = useRouter();
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^9\d{4}$/.test(zip)) {
      setError(
        locale === "es"
          ? "Introduce un ZIP de 5 dígitos"
          : "Enter a 5-digit ZIP",
      );
      return;
    }
    router.push(`${localizedPath(locale, "/get-quote")}?zip=${zip}`);
  }
  return (
    <form
      className={`zip-checker ${dark ? "zip-checker--dark" : ""}`}
      onSubmit={submit}
      noValidate
    >
      <label htmlFor={inputId}>
        {locale === "es" ? "Comprobar ZIP" : "Check your ZIP"}
      </label>
      <div>
        <input
          id={inputId}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="92618"
          value={zip}
          onChange={(event) => {
            setZip(event.target.value.replace(/\D/g, ""));
            setError("");
          }}
          aria-describedby={error ? errorId : undefined}
        />
        <button type="submit">
          {locale === "es" ? "Calcular precio" : "Build estimate"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      {error && (
        <small id={errorId} role="alert">
          {error}
        </small>
      )}
    </form>
  );
}
