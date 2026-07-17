"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="fatal-error"><p className="eyebrow">500 · service interruption</p><h1>The page lost its place.</h1><p>Your local quote answers remain in this browser. Retry the page without starting over.</p><button className="button button--ink" onClick={reset}>Try again</button></main>;
}
