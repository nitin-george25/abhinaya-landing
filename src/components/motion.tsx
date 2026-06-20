"use client";

/* Motion primitives — a thin, reusable layer over Motion for React so the rest
   of the site can opt into scroll reveals and staggered entrances without each
   component re-deriving easing, viewport thresholds, or reduced-motion handling.

   Everything here honours prefers-reduced-motion: when the user asks for less
   motion we render the final state immediately (no transform, no fade) so the
   content is never hidden behind an animation that won't play. */

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { CSSProperties, ElementType, ReactNode } from "react";

// Matches --ease in globals.css so JS-driven motion feels of a piece with the
// CSS transitions already used for hovers.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Shared "fade up into place" used by both Reveal and staggered children.
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type RevealProps = {
  children: ReactNode;
  /** Render as a different element (e.g. "section", "li"). Default "div". */
  as?: ElementType;
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Distance in px the element travels up into place. */
  y?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** Fades + lifts its children into view the first time they scroll on-screen. */
export function Reveal({ children, as = "div", delay = 0, y = 22, className, style, id }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerGroupProps = {
  children: ReactNode;
  as?: ElementType;
  /** Gap in seconds between each child's entrance. */
  stagger?: number;
  /** Initial delay before the first child animates. */
  delayChildren?: number;
  /** When true, animate on mount instead of on scroll-into-view (above-the-fold). */
  immediate?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** Coordinates a sequence: children using `revealItem` (or `StaggerItem`)
    animate in one after another. */
export function StaggerGroup({
  children, as = "div", stagger = 0.08, delayChildren = 0, immediate = false, className, style, id,
}: StaggerGroupProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : delayChildren } },
  };
  const viewProps = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <MotionTag id={id} className={className} style={style} initial="hidden" variants={container} {...viewProps}>
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/** A single child of StaggerGroup. Carries the shared fade-up variant. */
export function StaggerItem({ children, as = "div", className, style }: StaggerItemProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag data-reveal="" className={className} style={style} variants={revealItem}>
      {children}
    </MotionTag>
  );
}

// Re-export the raw motion driver for one-off effects (rotation, pulse, etc.).
export { motion, useReducedMotion };
