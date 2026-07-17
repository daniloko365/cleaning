"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function QuoteResume() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("novaclean-quote");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { step?: number };
      if ((parsed.step ?? 0) > 0 && (parsed.step ?? 0) < 8) queueMicrotask(() => setVisible(true));
    } catch { /* ignore malformed local state */ }
  }, []);
  if (!visible) return null;
  return <aside className="resume-banner"><div className="shell"><span><b>Quote saved</b>Your item details are still in this browser.</span><div><Link className="text-link" href="/get-quote">Continue quote →</Link><button type="button" onClick={() => { localStorage.removeItem("novaclean-quote"); setVisible(false); }}>Dismiss</button></div></div></aside>;
}
