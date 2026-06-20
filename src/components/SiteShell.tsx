"use client";

import { useState, useEffect } from "react";
import { MotionConfig } from "motion/react";
import Header from "./Header";
import Hero from "./Hero";
import NowShowing from "./NowShowing";
import Legacy from "./Legacy";
import Gallery from "./Gallery";
import Careers from "./Careers";
import Contact from "./Contact";
import Footer from "./Footer";
import TrailerModal from "./TrailerModal";
import { openBms } from "@/lib/site";
import type { MovieCardData, Programme, Opening } from "@/lib/movies";

type Tab = "Now Showing" | "Coming Soon";

const SECTION_TO_NAV: Record<string, string> = {
  legacy: "Legacy",
  gallery: "Gallery",
  careers: "Careers",
  contact: "Contact",
};

export default function SiteShell({
  movies, openings, heroMovie,
}: {
  movies: Programme; openings: Opening[]; heroMovie: MovieCardData | null;
}) {
  const [active, setActive] = useState("Now Showing");
  const [tab, setTab] = useState<Tab>("Now Showing");
  const [trailer, setTrailer] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  };

  // Scroll-spy — the active nav label follows whichever section is most in view.
  useEffect(() => {
    const ids = ["programme", ...Object.keys(SECTION_TO_NAV)];
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visibility = new Map<string, number>(elements.map((el) => [el.id, 0]));
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) visibility.set(e.target.id, e.intersectionRatio);
      let bestId: string | null = null, bestRatio = 0;
      for (const [id, ratio] of visibility) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      }
      if (!bestId) return;
      if (bestId === "programme") setActive(tab);
      else if (SECTION_TO_NAV[bestId]) setActive(SECTION_TO_NAV[bestId]);
    }, { rootMargin: "-80px 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => { if (window.scrollY < 100) setActive(tab); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [tab]);

  const onNav = (item: string) => {
    setActive(item);
    if (item === "Now Showing") { setTab("Now Showing"); scrollTo("programme"); }
    else if (item === "Coming Soon") { setTab("Coming Soon"); scrollTo("programme"); }
    else if (item === "Legacy" || item === "About Us") scrollTo("legacy");
    else if (item === "Gallery") scrollTo("gallery");
    else if (item === "Careers") scrollTo("careers");
    else if (item === "Contact") scrollTo("contact");
  };

  return (
    // reducedMotion="user" makes every motion component below honour the OS
    // "reduce motion" setting — transforms/scale/rotate are dropped, leaving
    // only gentle opacity fades.
    <MotionConfig reducedMotion="user">
      <div>
        <Header active={active} onNav={onNav} />
        <Hero onPlay={() => setTrailer(true)} heroMovie={heroMovie} />
        <NowShowing movies={movies} tab={tab} setTab={(t) => { setTab(t); setActive(t); }} />
        <Legacy />
        <Gallery />
        <Careers openings={openings} />
        <Contact />
        <Footer onNav={onNav} />
        {trailer && <TrailerModal trailerUrl={heroMovie?.trailerUrl} onClose={() => setTrailer(false)} />}
      </div>
    </MotionConfig>
  );
}
