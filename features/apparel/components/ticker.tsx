"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const words = ["Limited chapters", "Made in Kathmandu", "Small runs", "Order by DM", "Wear the difference"];

// Lime tape, tilted across the page. Speeds up and reverses with scroll.
export function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const run = gsap.to(".ap-tape", { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
        const st = ScrollTrigger.create({ onUpdate: (s) => gsap.to(run, { timeScale: gsap.utils.clamp(-6, 6, 1 + s.getVelocity() / 300), duration: 0.25, overwrite: true }) });
        const settle = () => gsap.to(run, { timeScale: 1, duration: 1, overwrite: true });
        ScrollTrigger.addEventListener("scrollEnd", settle);
        return () => {
          st.kill();
          ScrollTrigger.removeEventListener("scrollEnd", settle);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative z-10 -my-4 overflow-hidden" aria-hidden>
      <div className="-rotate-[1.6deg] bg-lime py-3 text-ink">
        <div className="ap-tape flex w-max whitespace-nowrap font-wide text-[clamp(1.4rem,3vw,2.6rem)] leading-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {words.map((w) => (
                <span key={w} className="flex items-center">
                  <span className="px-6">{w}</span>
                  <span className="text-[0.6em]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
