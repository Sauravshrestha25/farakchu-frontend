"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { smootherReady } from "./smooth-scroll";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counter = q(".pl-count")[0] as HTMLElement;
      const reveal = ["[data-nav]", "[data-hero]"];
      const done = () => {
        gsap.set(root.current, { display: "none" });
        ScrollTrigger.refresh();
      };

      // Transforms set via GSAP (Tailwind's rotate/translate props would stack with GSAP's transform).
      gsap.set(q(".pl-bar"), { xPercent: -50, yPercent: -50, rotation: -10 });

      smootherReady.then((smoother) => {
        smoother?.paused(true);
        const release = () => (smoother?.paused(false), done());

        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.to(root.current, { opacity: 0, duration: 0.5, delay: 0.5, ease: "power4.inOut", onComplete: release });
          return;
        }

        gsap.set(reveal, { autoAlpha: 0 });
        const n = { v: 0 };
        gsap
          .timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: release,
          })
          .to(n, { v: 100, duration: 1.5, onUpdate: () => (counter.textContent = String(Math.round(n.v)).padStart(3, "0")) }, 0)
          .to(q(".pl-text"), { opacity: 1, duration: 1 }, 0)
          .to(q(".pl-fill"), { width: "100%", duration: 1.5 }, 0)
          .to([q(".pl-text"), q(".pl-track"), q(".pl-fill")], { autoAlpha: 0, duration: 0.4 })
          // The bar is a window: its huge teal box-shadow covers the page, so growing it reveals the hero inside it.
          .to(q(".pl-bar"), { width: "100vw", height: () => innerHeight, rotation: 0, duration: 1 }, "<")
          .fromTo(reveal, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: "power3.out", clearProps: "transform" }, "<0.2");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <div className="pl-bar absolute left-1/2 top-1/2 z-[1] h-4 w-[212px] shadow-[0_0_0_200vmax_var(--color-teal)] max-md:h-3 max-md:w-40">
        <div className="pl-track absolute inset-0 bg-teal-soft" />
        <div className="pl-fill absolute inset-y-0 left-0 w-0 bg-lime" />
      </div>
      <div className="pl-text absolute inset-x-0 bottom-0 z-[3] flex justify-center pb-8 opacity-0 md:pb-16">
        <div className="flex w-[8.5rem] justify-between text-[0.625rem] uppercase text-bone">
          <span>Loading…</span>
          <span className="pl-count tabular-nums">000</span>
        </div>
      </div>
    </div>
  );
}
