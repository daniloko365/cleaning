"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ZipChecker({ dark = false }: { dark?: boolean }) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^9\d{4}$/.test(zip)) { setError("Enter a 5-digit ZIP"); return; }
    router.push(`/get-quote?zip=${zip}`);
  }
  return (
    <form className={`zip-checker ${dark ? "zip-checker--dark" : ""}`} onSubmit={submit} noValidate>
      <label htmlFor={dark ? "zip-dark" : "zip-home"}>Check your ZIP</label>
      <div><input id={dark ? "zip-dark" : "zip-home"} inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="92618" value={zip} onChange={(event) => { setZip(event.target.value.replace(/\D/g, "")); setError(""); }} aria-describedby={error ? "zip-error" : undefined} /><button type="submit">Build estimate <span aria-hidden="true">↗</span></button></div>
      {error && <small id="zip-error" role="alert">{error}</small>}
    </form>
  );
}
