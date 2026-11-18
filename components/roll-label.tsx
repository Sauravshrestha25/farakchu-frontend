"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const chars = (s: string) => Array.from(s).map((c) => (c === " " ? " " : c));

/**
 * Character-roll swap (RotatingText-style, GSAP instead of motion):
 * `text` rolls up and out letter by letter, `alt` rolls in from below, and the
 * lime highlight springs to the new width. `on` drives it (hover/focus).
 * `still`: apply changes instantly, no roll (e.g. while the menu sheet is closing).
 */
export function RollLabel({
  text,
  alt,
  on,
  still = false,
  className = "",
}: {
  text: string;
  alt: string;
  on: boolean;
  still?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const clip = useRef<HTMLSpanElement>(null);
  const rowA = useRef<HTMLSpanElement>(null);
  const rowB = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      // Start in whichever state `on` says (a label can mount already rolled, e.g. after a page switch).
      gsap.set((on ? rowA : rowB).current!.children, { yPercent: on ? -110 : 110, rotateX: on ? 0 : -80, opacity: 0 });
      const fit = () => gsap.set(clip.current, { width: (on ? rowB : rowA).current!.offsetWidth });
      fit();
      document.fonts?.ready.then(fit); // widths change once Mona Sans loads
    },
    { scope: root },
  );

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const out = (on ? rowA : rowB).current!.children;
    const inn = (on ? rowB : rowA).current!.children;
    const target = (on ? rowB : rowA).current!.offsetWidth;
    if (reduce || still) {
      gsap.killTweensOf([out, inn, clip.current]);
      gsap.set(out, { yPercent: -110, opacity: 0 });
      gsap.set(inn, { yPercent: 0, rotateX: 0, opacity: 1 });
      gsap.set(clip.current, { width: target });
      return;
    }
    gsap.to(out, { yPercent: -110, rotateX: 80, opacity: 0, duration: 0.32, stagger: 0.018, ease: "power2.in", overwrite: true });
    gsap.fromTo(
      inn,
      { yPercent: 110, rotateX: -80, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.6, stagger: 0.022, delay: 0.08, ease: "back.out(1.8)", overwrite: true },
    );
    gsap.to(clip.current, { width: target, duration: 0.75, ease: "elastic.out(1, 0.75)", overwrite: true });
  }, [on]);

  return (
    <span ref={root} className={`inline-block px-[0.08em] transition-colors duration-200 ${on ? "rounded-[0.16em] bg-lime text-ink" : ""} ${className}`}>
      <span className="sr-only">{text}</span>
      <span ref={clip} aria-hidden className="relative inline-grid overflow-hidden align-bottom [perspective:480px]">
        <span ref={rowA} className="inline-flex w-max whitespace-pre [grid-area:1/1]">
          {chars(text).map((c, i) => (
            <span key={i} className="inline-block [backface-visibility:hidden] [transform-origin:50%_50%_-0.45em]">
              {c}
            </span>
          ))}
        </span>
        <span ref={rowB} className="inline-flex w-max whitespace-pre [grid-area:1/1]">
          {chars(alt).map((c, i) => (
            <span key={i} className="inline-block [backface-visibility:hidden] [transform-origin:50%_50%_-0.45em]">
              {c}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
