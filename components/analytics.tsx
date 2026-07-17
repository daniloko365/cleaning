"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global { interface Navigator { globalPrivacyControl?: boolean } }

function session() {
  const existing = sessionStorage.getItem("novaclean-session");
  if (existing) return existing;
  const value = crypto.randomUUID(); sessionStorage.setItem("novaclean-session", value); return value;
}

function eventForHref(href: string) {
  if (href.startsWith("/get-quote")) return "quote_start";
  if (href.startsWith("/book")) return "booking_start";
  if (href.startsWith("/pricing")) return "pricing_view";
  if (href.startsWith("/commercial/request-bid")) return "commercial_start";
  if (href.startsWith("/contact")) return "contact_start";
  return "navigation_click";
}

export function Analytics() {
  const path = usePathname();
  useEffect(() => {
    if (navigator.globalPrivacyControl || navigator.doNotTrack === "1") return;
    const send = (event: string, payload: Record<string, unknown> = {}) => {
      fetch("/api/events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event, path: window.location.pathname, sessionId: session(), payload }), keepalive: true }).catch(() => {});
    };
    send("page_view", { title: document.title });
    const click = (input: MouseEvent) => {
      const target = input.target as HTMLElement | null;
      const control = target?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!control) return;
      const href = control instanceof HTMLAnchorElement ? control.getAttribute("href") ?? "" : "";
      send(href ? eventForHref(href) : "button_click", { href, label: control.textContent?.trim().slice(0, 120) });
    };
    const custom = (input: Event) => { const detail = (input as CustomEvent<{ event: string; payload?: Record<string, unknown> }>).detail; if (detail?.event) send(detail.event, detail.payload); };
    document.addEventListener("click", click);
    window.addEventListener("novaclean:event", custom);
    return () => { document.removeEventListener("click", click); window.removeEventListener("novaclean:event", custom); };
  }, [path]);
  return null;
}
