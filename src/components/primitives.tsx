"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Icon from "./Icon";
import { SOCIALS } from "@/lib/site";

const LOGO_BASE = "/site/assets/";

export function LogoMark({ size = 34, tone = "cream", style }: { size?: number; tone?: "cream" | "dark"; style?: CSSProperties }) {
  const src = LOGO_BASE + (tone === "dark" ? "logo-symbol-dark.png" : "logo-symbol-cream.png");
  return <img src={src} alt="Abhinaya Cinemas" style={{ height: size * 1.18, width: "auto", display: "block", ...style }} />;
}

export function LogoLockup({ size = 34, tone = "cream", style }: { size?: number; tone?: "cream" | "dark"; style?: CSSProperties }) {
  const src = LOGO_BASE + (tone === "dark" ? "logo-lockup-dark.png" : "logo-lockup-cream.png");
  return <img src={src} alt="Abhinaya Cinemas" style={{ height: size * 1.5, width: "auto", display: "block", ...style }} />;
}

export function SocialLinks({ size = 20, color = "var(--fg-muted)", gap = 16, style }: { size?: number; color?: string; gap?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", gap, color, ...style }}>
      {Object.entries(SOCIALS).map(([key, url]) => (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={key}
          style={{ color: "inherit", display: "inline-flex", transition: "color .18s var(--ease)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
          <Icon name={key} size={size} />
        </a>
      ))}
    </div>
  );
}

type ButtonVariant = "primary" | "solid" | "ghost" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  children, variant = "primary", size = "md", icon, onClick, style,
}: {
  children?: ReactNode; variant?: ButtonVariant; size?: ButtonSize; icon?: string;
  onClick?: () => void; style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const sizes: Record<ButtonSize, CSSProperties> = {
    sm: { padding: "10px 18px", fontSize: 12 },
    md: { padding: "14px 26px", fontSize: 14 },
    lg: { padding: "17px 34px", fontSize: 16 },
  };
  const base: CSSProperties = {
    fontFamily: "var(--font-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
    border: 0, cursor: "pointer", borderRadius: "var(--r-pill)", display: "inline-flex", alignItems: "center",
    gap: 10, transition: "all .2s var(--ease)", whiteSpace: "nowrap", ...sizes[size],
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: "var(--screen-gradient)", color: "var(--spring-wood)", boxShadow: hover ? "var(--glow-accent)" : "none", transform: hover ? "translateY(-1px)" : "none" },
    solid: { background: hover ? "var(--accent-press)" : "var(--accent)", color: "var(--spring-wood)" },
    ghost: { background: "transparent", color: "var(--fg)", border: "1.5px solid", borderColor: hover ? "var(--fg)" : "var(--border-strong)" },
    quiet: { background: "var(--bg-surface)", color: "var(--fg)", border: "1px solid var(--border)" },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ ...base, ...variants[variant], ...style }}>
      {children}
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
    </button>
  );
}

export function Badge({ children, tone = "accent" }: { children?: ReactNode; tone?: "accent" | "yellow" | "blue" | "quiet" }) {
  const tones: Record<string, CSSProperties> = {
    accent: { background: "var(--accent)", color: "var(--spring-wood)" },
    yellow: { background: "var(--selective-yellow)", color: "#151515" },
    blue: { background: "var(--lochmara)", color: "#fff" },
    quiet: { background: "var(--bg-elevated)", color: "var(--fg-muted)", border: "1px solid var(--border)" },
  };
  return <span style={{ fontFamily: "var(--font-text)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11, padding: "5px 10px", borderRadius: "var(--r-xs)", ...tones[tone] }}>{children}</span>;
}

export function Pill({ children, active, dim, onClick }: { children?: ReactNode; active?: boolean; dim?: boolean; onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13, whiteSpace: "nowrap",
        padding: "9px 16px", borderRadius: "var(--r-sm)", cursor: "pointer", transition: "all .18s var(--ease)",
        background: active ? "var(--accent)" : "transparent",
        borderWidth: 1, borderStyle: "solid",
        borderColor: active ? "var(--accent)" : (hover ? "var(--fg)" : (dim ? "var(--border)" : "var(--border-strong)")),
        color: active ? "var(--spring-wood)" : (dim ? "var(--fg-faint)" : "var(--fg)"),
      }}>{children}</button>
  );
}

export function ImgSlot({ label, ratio = "2/3", radius = "var(--r-md)", children, style }: { label?: string; ratio?: string; radius?: string; children?: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      aspectRatio: ratio, borderRadius: radius, overflow: "hidden", position: "relative",
      background: "repeating-linear-gradient(45deg,#201f1d,#201f1d 10px,#191917 10px,#191917 20px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", ...style,
    }}>
      {children}
      {label && <span style={{ position: "absolute", bottom: 10, fontFamily: "ui-monospace,monospace", fontSize: 11, color: "var(--fg-faint)", letterSpacing: "0.04em" }}>{label}</span>}
    </div>
  );
}

export function LensRings({ size = 520, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div style={{ width: size, height: size, position: "relative", ...style }}>
      {[0, 0.16, 0.32, 0.46, 0.58].map((inset, i) => (
        <span key={i} style={{ position: "absolute", inset: `${inset * size}px`, border: "1px solid", borderColor: i > 2 ? "var(--border-strong)" : "var(--border)", borderRadius: "50%" }} />
      ))}
    </div>
  );
}

export function Beam({ width = 90, skew = -18, style }: { width?: number; skew?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", width, transform: `skewX(${skew}deg)`, ...style }}>
      <i style={{ flex: 1, background: "var(--red-orange)" }} />
      <i style={{ flex: 1, background: "var(--selective-yellow)" }} />
      <i style={{ flex: 1, background: "var(--lochmara)" }} />
    </div>
  );
}

export function SectionHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 36, flexWrap: "wrap" }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>{eyebrow}</div>
        <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(2rem,4vw,3.25rem)", lineHeight: 0.95 }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}
