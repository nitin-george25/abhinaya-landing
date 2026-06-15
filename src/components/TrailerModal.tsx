"use client";

import type { ReactNode } from "react";
import Icon from "./Icon";

function Overlay({ children, onClose, max = 920 }: { children: ReactNode; onClose: () => void; max?: number }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,9,0.8)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 24, animation: "kitFade .25s var(--ease)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: max, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)", position: "relative" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-strong)", background: "rgba(21,21,21,0.6)", color: "var(--fg)", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="x" size={20} /></button>
        {children}
      </div>
    </div>
  );
}

/** Normalize a YouTube watch/share/shorts/embed URL to an autoplay embed. */
function youtubeEmbed(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v") as string;
    else if (u.pathname.includes("/embed/")) id = u.pathname.split("/embed/")[1];
    else if (u.pathname.includes("/shorts/")) id = u.pathname.split("/shorts/")[1];
    id = (id || "").split(/[/?&]/)[0];
    if (!id) return null;
    return "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1";
  } catch {
    return null;
  }
}

export default function TrailerModal({ onClose, trailerUrl }: { onClose: () => void; trailerUrl?: string | null }) {
  const embed = youtubeEmbed(trailerUrl);
  return (
    <Overlay onClose={onClose}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
        {embed ? (
          <iframe src={embed} title="Trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        ) : trailerUrl ? (
          <video src={trailerUrl} controls autoPlay playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--fg-muted)", fontFamily: "var(--font-text)" }}>Trailer coming soon.</div>
        )}
      </div>
    </Overlay>
  );
}
