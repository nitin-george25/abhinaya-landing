"use client";

import { LensRings, Button } from "./primitives";
import Icon from "./Icon";
import { motion, useReducedMotion, EASE } from "./motion";
import { openBms } from "@/lib/site";
import type { MovieCardData } from "@/lib/movies";

// Children fade up one after another the moment the hero mounts (it's above the
// fold, so we animate immediately rather than on scroll).
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero({ onPlay, heroMovie }: { onPlay: () => void; heroMovie: MovieCardData | null }) {
  const hasTrailer = !!(heroMovie && heroMovie.trailerUrl);
  const reduce = useReducedMotion();
  return (
    <section style={{ position: "relative", minHeight: "min(92vh, 760px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", textAlign: "center", padding: "120px 24px 80px" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Slow, almost-imperceptible push-in on the backdrop gives the still a
            sense of depth without distracting from the copy. */}
        <motion.img src="/site/assets/photos/big-screen.jpg?v=2" alt="" aria-hidden="true"
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 30%, rgba(21,21,21,0.42), rgba(21,21,21,0.94) 78%)" }} />
      </div>

      {/* Lens rings drift in and rotate forever — a quiet nod to a turning reel. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.82 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ position: "absolute", top: "46%", left: "50%", translateX: "-50%", translateY: "-50%", pointerEvents: "none" }}>
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}>
          <LensRings size={620} />
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" style={{ position: "relative", maxWidth: 1000 }}>
        <motion.h1 data-reveal="" variants={item} className="display" style={{ fontSize: "clamp(2rem, 9vw, 7rem)", margin: 0 }}>
          <span style={{ display: "block", fontSize: "clamp(1.1rem, 4vw, 2.6rem)", whiteSpace: "nowrap", marginBottom: "0.35em" }}>History of Storytelling,</span>
          <span className="screen-text">Reimagined.</span>
        </motion.h1>
        <motion.p data-reveal="" variants={item} className="lead" style={{ maxWidth: 680, margin: "26px auto 0" }}>
          For over 50 years, more than just a theatre - a cultural landmark where stories
          come alive, memories are made, and communities gather.
        </motion.p>
        <motion.div data-reveal="" variants={item} style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 38, flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" icon="ticket" onClick={openBms}>Book Tickets</Button>
          {hasTrailer && <Button variant="ghost" size="lg" icon="play" onClick={onPlay}>Watch Trailer</Button>}
        </motion.div>
        {hasTrailer && (
          <motion.div data-reveal="" variants={item} className="eyebrow" style={{ marginTop: 22, color: "var(--fg-muted)" }}>
            Now in cinemas &middot; {heroMovie!.title}
          </motion.div>
        )}
      </motion.div>

      {hasTrailer && (
        <motion.button onClick={onPlay} aria-label="Play trailer" data-reveal=""
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "relative", marginTop: 40, width: 74, height: 74, borderRadius: "50%",
            border: "1.5px solid var(--border-strong)", background: "rgba(246,245,236,0.06)", color: "var(--fg)",
            cursor: "pointer", display: "grid", placeItems: "center", backdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--screen-gradient)"; e.currentTarget.style.borderColor = "transparent"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(246,245,236,0.06)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}>
          {/* Expanding ring pulse, like sonar — draws the eye to the play CTA. */}
          {!reduce && (
            <motion.span aria-hidden="true"
              animate={{ scale: [1, 1.25, 1.9], opacity: [0, 0.55, 0] }}
              transition={{ duration: 2.4, ease: "easeOut", times: [0, 0.18, 1], repeat: Infinity }}
              style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid var(--accent)" }} />
          )}
          <Icon name="play" size={26} />
        </motion.button>
      )}
    </section>
  );
}
