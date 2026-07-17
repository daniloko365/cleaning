"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={`tilt-card ${className}`}
      onPointerMove={(event) => {
        const node = ref.current;
        if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 5;
        const y = ((event.clientY - rect.top) / rect.height - .5) * -5;
        node.style.setProperty("--rx", `${y}deg`);
        node.style.setProperty("--ry", `${x}deg`);
        node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        node.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}>
      {children}
    </div>
  );
}

export function BeforeAfter() {
  const [position, setPosition] = useState(56);
  return (
    <div className="before-after" style={{ "--split": `${position}%` } as React.CSSProperties}>
      <div className="before-after__image before-after__after" role="img" aria-label="Refreshed charcoal sofa after cleaning" />
      <div className="before-after__image before-after__before" role="img" aria-label="Charcoal sofa before cleaning with visible everyday soil" />
      <div className="before-after__labels" aria-hidden="true"><span>Before</span><span>After</span></div>
      <div className="before-after__line" aria-hidden="true"><b>↔</b></div>
      <input type="range" min="10" max="90" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Move before and after comparison slider" />
    </div>
  );
}

export function PricePulse({ children }: { children: React.ReactNode }) {
  return <span className="price-pulse"><i aria-hidden="true" />{children}</span>;
}
