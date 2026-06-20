"use client";

import type { ReactNode } from "react";
import { Badge, Pill, ImgSlot, Button, SectionHeader } from "./primitives";
import { Reveal, StaggerGroup, StaggerItem } from "./motion";
import { openBms } from "@/lib/site";
import type { MovieCardData, Programme } from "@/lib/movies";

function Poster({ url, alt, children }: { url: string | null; alt: string; children?: ReactNode }) {
  if (url) {
    return (
      <div style={{ aspectRatio: "2/3", overflow: "hidden", position: "relative", background: "#0a0a09" }}>
        <img src={url} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {children}
      </div>
    );
  }
  return <ImgSlot label="poster · 2:3" radius="0" style={{ borderRadius: 0 }}>{children}</ImgSlot>;
}

function MovieCard({ m }: { m: MovieCardData }) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden", transition: "all .28s var(--ease)" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      <Poster url={m.posterUrl} alt={m.title}>
        {m.badge && <div style={{ position: "absolute", top: 14, left: 14 }}><Badge tone={m.badge.tone}>{m.badge.t}</Badge></div>}
        {m.date && <div style={{ position: "absolute", top: 14, right: 14, fontFamily: "var(--font-text)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: "var(--fg)", background: "rgba(21,21,21,0.72)", padding: "5px 10px", borderRadius: "var(--r-xs)", backdropFilter: "blur(4px)" }}>{m.date}</div>}
      </Poster>
      <div style={{ padding: 18 }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: 26, lineHeight: 0.95 }}>{m.title}</h3>
        <div className="meta" style={{ marginTop: 8 }}>{[m.lang, m.runtime].filter(Boolean).join(" · ")}</div>
        {m.times.length > 0 ? (
          <div style={{ display: "flex", gap: 7, marginTop: 16, flexWrap: "wrap" }}>
            {m.times.slice(0, 3).map((t) => <Pill key={t} onClick={openBms}>{t}</Pill>)}
            {m.times.length > 3 && <Pill dim onClick={openBms}>+{m.times.length - 3}</Pill>}
          </div>
        ) : (
          <div style={{ marginTop: 16 }}><Button size="sm" variant="quiet" icon="bell">Notify Me</Button></div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 24px", border: "1px dashed var(--border)", borderRadius: "var(--r-lg)", color: "var(--fg-muted)" }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{tab}</div>
      <p style={{ margin: 0, fontFamily: "var(--font-text)", fontSize: 15 }}>Programme being finalised. Check back shortly.</p>
    </div>
  );
}

export default function NowShowing({ movies, tab, setTab }: { movies: Programme; tab: "Now Showing" | "Coming Soon"; setTab: (t: "Now Showing" | "Coming Soon") => void }) {
  const list = movies[tab] || [];
  return (
    <section id="programme" style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 32px" }}>
      <Reveal>
        <SectionHeader eyebrow="What's on" title={tab} right={
          <div style={{ display: "flex", gap: 10 }}>
            <Pill active={tab === "Now Showing"} onClick={() => setTab("Now Showing")}>Now Showing</Pill>
            <Pill active={tab === "Coming Soon"} onClick={() => setTab("Coming Soon")}>Coming Soon</Pill>
          </div>
        } />
      </Reveal>
      {/* key={tab} remounts the group so the cards re-stagger when the user
          flips between Now Showing and Coming Soon. */}
      <StaggerGroup key={tab} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(248px,100%),1fr))", gap: 24 }}>
        {list.length === 0 ? (
          <StaggerItem style={{ gridColumn: "1 / -1" }}><EmptyState tab={tab} /></StaggerItem>
        ) : (
          list.map((m) => <StaggerItem key={m.title}><MovieCard m={m} /></StaggerItem>
          )
        )}
      </StaggerGroup>
    </section>
  );
}
