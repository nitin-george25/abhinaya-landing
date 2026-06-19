"use client";

import { LogoLockup, Button, SocialLinks } from "./primitives";
import { NAV, CONTACT, DIRECTIONS_URL, MAP_EMBED_URL } from "@/lib/site";

export default function Footer({ onNav }: { onNav: (item: string) => void }) {
  return (
    <footer style={{ background: "var(--cod-gray)", paddingTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(220px,100%),1fr))", gap: 48, paddingBottom: 56, borderBottom: "1px solid var(--border)" }}>
          <div>
            <LogoLockup size={32} />
            <p style={{ fontFamily: "var(--font-text)", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 14, color: "var(--fg-muted)", marginTop: 20, lineHeight: 1.5, maxWidth: 260 }}>
              50 years of stories, now redefined.
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Explore</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {NAV.map((i) => <a key={i} onClick={() => onNav(i)} style={{ fontFamily: "var(--font-text)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 14, color: "var(--fg-muted)", cursor: "pointer" }}>{i}</a>)}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Visit</div>
            <div style={{ fontFamily: "var(--font-text)", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.8 }}>
              Abhinaya Cinemas, M C Road<br />Perunna, Changanacherry<br />Kottayam, Kerala — 686101<br />
              <a href={`tel:${CONTACT.phoneHref}`} style={{ color: "inherit", textDecoration: "none" }}>{CONTACT.phoneDisplay}</a>
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>The reel, in your inbox</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Email address" style={{ flex: 1, minWidth: 0, background: "var(--bg-surface)", border: "1px solid var(--border-strong)", borderRadius: "var(--r-sm)", color: "var(--fg)", fontFamily: "var(--font-text)", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 13, padding: "12px 14px", outline: "none" }} />
              <Button size="sm" variant="solid" icon="arrow-right" />
            </div>
            <div style={{ marginTop: 22 }}>
              <SocialLinks size={20} gap={16} />
            </div>
          </div>
        </div>

        {/* Directions map */}
        <div style={{ paddingTop: 48 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div className="eyebrow">Find us</div>
            <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-text)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
              Get directions →
            </a>
          </div>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 5", minHeight: 220, borderRadius: "var(--r-sm)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <iframe
              title="Abhinaya Cinemas location on Google Maps"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              style={{ border: 0, width: "100%", height: "100%", filter: "grayscale(0.3) contrast(1.05)" }}
            />
            <div style={{ position: "absolute", right: 16, bottom: 16 }}>
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <Button size="sm" variant="primary" icon="arrow-right">Get Directions</Button>
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 24, marginTop: 48, borderTop: "1px solid var(--border)" }}>
          <span className="meta">© 2026 Abhinaya Cinemas · abhinayacinemas.com</span>
          <span className="meta" style={{ display: "flex", gap: 14 }}>
            <a href="/privacy.html" style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>Privacy</a>
            <span>·</span>
            <a href="/terms.html" style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
