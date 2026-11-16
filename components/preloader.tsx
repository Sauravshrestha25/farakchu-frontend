"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { smootherReady } from "./smooth-scroll";
import { sound } from "./sound-engine";
import { LogoMark } from "./logo-mark";

/**
 * Opens on the logo and two buttons: "Enter site" (sound on) or "Enter without sound".
 * Pressing either: logo and buttons fade away, the tilted bar appears at full length and fills left to right (000 -> 100),
 * then it becomes a window that grows to full screen with the hero inside it.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const enterRef = useRef<(withSound: boolean) => void>(() => {});

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counter = q(".pl-count")[0] as HTMLElement;
      const primary = q(".pl-enter")[0] as HTMLElement;
      const reveal = ["[data-nav]", "[data-hero]"];
      const html = document.documentElement;
      let entered = false;
      const css = getComputedStyle(html);
      const cover = css.getPropertyValue("--color-teal").trim(); // track starts as the cover colour, so the bar window is closed until it appears
      const trackColor = css.getPropertyValue("--color-ink").trim();

      // Transforms set via GSAP (Tailwind's rotate/translate props would stack with GSAP's transform).
      gsap.set(q(".pl-bar"), { xPercent: -50, yPercent: -50, rotation: -10 });
      gsap.set(q(".pl-fill"), { opacity: 0 }); // hidden until the bar appears
      gsap.set(q(".pl-intro"), { autoAlpha: 0, y: 20 });
      html.style.overflow = "hidden"; // no scrolling behind the loader (ScrollSmoother is also paused below)

      smootherReady.then((smoother) => {
        smoother?.paused(true);
        const release = () => {
          html.style.overflow = "";
          smoother?.paused(false);
          gsap.set(root.current, { display: "none" });
          ScrollTrigger.refresh();
        };
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) gsap.set(reveal, { autoAlpha: 0 });

        enterRef.current = (withSound) => {
          if (entered) return;
          entered = true;
          if (withSound) sound.start(); // inside the click, so the browser allows audio
          if (reduce) {
            gsap.to(root.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power4.inOut",
              onComplete: release,
            });
            return;
          }
          const n = { v: 0 };
          gsap
            .timeline({
              defaults: { ease: "power4.inOut" },
              onComplete: release,
            })
            .to(
              q(".pl-logo"),
              {
                autoAlpha: 0,
                y: -24,
                scale: 0.8,
                duration: 0.55,
                ease: "power2.in",
              },
              0,
            )
            .to(
              [q(".pl-tag"), q(".pl-buttons")],
              {
                autoAlpha: 0,
                y: 16,
                duration: 0.45,
                ease: "power2.in",
                stagger: 0.05,
              },
              0,
            )
            // The bar appears out of nothing, then fills.
            .fromTo(
              q(".pl-track"),
              { backgroundColor: cover },
              {
                backgroundColor: trackColor,
                duration: 0.5,
                ease: "power2.out",
              },
              0.35,
            )
            .set(q(".pl-fill"), { opacity: 1 }, 0.35)
            .to(q(".pl-text"), { opacity: 1, duration: 0.5 }, 0.5)
            .to(
              n,
              {
                v: 100,
                duration: 1.5,
                onUpdate: () =>
                  (counter.textContent = String(Math.round(n.v)).padStart(
                    3,
                    "0",
                  )),
              },
              0.9,
            )
            .to(q(".pl-fill"), { width: "100%", duration: 1.5 }, 0.9)
            .to([q(".pl-text"), q(".pl-track"), q(".pl-fill")], {
              autoAlpha: 0,
              duration: 0.4,
            })
            // The bar is a window: its huge teal box-shadow covers the page, so growing it reveals the hero inside it.
            .to(
              q(".pl-bar"),
              {
                width: "100vw",
                height: () => innerHeight,
                rotation: 0,
                duration: 1,
              },
              "<",
            )
            .fromTo(
              reveal,
              { autoAlpha: 0, y: 40 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.05,
                ease: "power3.out",
                clearProps: "transform",
              },
              "<0.2",
            );
        };

        // Logo and buttons arrive once the page is ready to be entered.
        gsap.to(q(".pl-intro"), {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          onComplete: () => primary.focus({ preventScroll: true }),
        });
      });

      return () => {
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  const pill =
    "min-h-11 w-64 rounded-[50%] px-9 py-3.5 font-azonix text-[0.625rem] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime";

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Enter Farakchu"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pl-bar absolute left-1/2 top-1/2 z-[1] h-4 w-[212px] shadow-[0_0_0_200vmax_var(--color-teal)] max-md:h-3 max-md:w-40"
      >
        <div className="pl-track absolute inset-0 bg-teal" />
        <div className="pl-fill absolute inset-y-0 left-0 w-0 bg-lime" />
      </div>
      <div
        aria-hidden
        className="pl-text absolute inset-x-0 bottom-0 z-[3] flex justify-center pb-8 opacity-0 md:pb-16"
      >
        <div className="flex w-[9.5rem] justify-between font-azonix text-[0.625rem] text-bone">
          <span>Loading…</span>
          <span className="pl-count tabular-nums">000</span>
        </div>
      </div>
      <div className="pl-intro invisible relative z-[3] flex flex-col items-center gap-8 px-5 text-center">
        <LogoMark
          className="pl-logo size-28 text-bone md:size-32"
          title="Farakchu"
        />
        <p className="pl-tag font-azonix text-[2rem] text-bone/85">Farak Chu</p>
        <div className="pl-buttons flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => enterRef.current(true)}
            className={`pl-enter ${pill} bg-lime text-ink hover:bg-bone`}
          >
            Enter site
          </button>
          <button
            type="button"
            onClick={() => enterRef.current(false)}
            className={`${pill} border border-bone/50 text-bone hover:bg-bone/15`}
          >
            Enter without sound
          </button>
        </div>
      </div>
    </div>
  );
}
