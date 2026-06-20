"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { Beam, Button } from "./primitives";
import { Reveal, StaggerGroup, StaggerItem } from "./motion";

// Counts from 0 up to the numeric part of a stat the first time it scrolls into
// view (e.g. "50+" counts to 50 and keeps the "+"). Static when the visitor
// prefers reduced motion.
function StatNumber({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const match = value.match(/^(\d[\d,]*)(.*)$/);
  const numeric = !!match;
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : NaN;
  const suffix = match ? match[2] : "";
  // Start from the real value so the SSR HTML (and any no-JS visitor) shows
  // "1968" / "50+" rather than "0". The client resets to 0 below the fold and
  // counts up once the stat scrolls into view.
  const [display, setDisplay] = useState(value);

  // Deps are all primitives — `match` is a fresh array each render, so depending
  // on it would restart the count from 0 on every re-render.
  useEffect(() => {
    if (reduce || !numeric) return;
    if (!inView) { setDisplay(`0${suffix}`); return; }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, numeric, target, suffix]);

  return <span ref={ref} className={className} style={style}>{display}</span>;
}

export default function Legacy() {
  const stats = [
    { n: "1968", l: "Established in Kottayam" },
    { n: "50+", l: "Years of stories" },
    { n: "4", l: "Curated auditoriums" },
  ];
  return (
    <section id="legacy" style={{ position: "relative", background: "var(--ink-950)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
      <Beam width={16} skew={0} style={{ position: "absolute", left: 0, top: 0, height: "100%" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "110px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: 56, alignItems: "center" }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Our legacy</div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(2.2rem,4.4vw,3.6rem)", lineHeight: 0.94 }}>
            Where Heritage Meets the Future of Cinema
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "var(--fg-muted)", marginTop: 22, maxWidth: 520 }}>
            Born in Kottayam, Abhinaya has been a family-owned landmark for over five
            decades. Today it steps into a new era — reimagined as a boutique cinema where the
            nostalgia of classic film meets premium comfort, design and service.
          </p>
          <div style={{ marginTop: 30 }}><Button variant="ghost" icon="arrow-right">Read Our Story</Button></div>
        </Reveal>
        <StaggerGroup style={{ display: "flex", flexDirection: "column", gap: 2, border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--bg-surface)" }}>
          {stats.map((s, i) => (
            <StaggerItem key={s.n} style={{ display: "flex", alignItems: "baseline", gap: 22, padding: "28px 32px", borderBottom: i < stats.length - 1 ? "1px solid var(--border)" : 0 }}>
              <StatNumber value={s.n} className="screen-text" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2.6rem,5vw,4rem)", lineHeight: 1 }} />
              <span style={{ fontFamily: "var(--font-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 14, color: "var(--fg-muted)" }}>{s.l}</span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
