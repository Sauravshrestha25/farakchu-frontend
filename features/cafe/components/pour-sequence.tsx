"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cafePage as d } from "@/features/cafe/data";

gsap.registerPlugin(ScrollTrigger);

const src = (i: number) => `/images/cafe/pour/f${String(i + 1).padStart(3, "0")}.jpg`;

// Pinned section: scrolling plays a milk pour frame by frame on a canvas, with three lines fading through.
export function PourSequence() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const cv = canvas.current!;
      const ctx = cv.getContext("2d")!;
      const n = d.pour.frames;
      const imgs: HTMLImageElement[] = [];
      const state = { f: 0 };

      // Cover-fit draw; falls back to the nearest loaded frame while images stream in.
      const draw = (want: number) => {
        let i = want;
        while (i >= 0 && !(imgs[i]?.complete && imgs[i].naturalWidth)) i--;
        const im = imgs[Math.max(i, 0)];
        if (!im?.naturalWidth) return;
        const r = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight);
        const w = im.naturalWidth * r;
        const h = im.naturalHeight * r;
        ctx.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      };
      const size = () => {
        const dpr = Math.min(devicePixelRatio, 2);
        cv.width = cv.clientWidth * dpr;
        cv.height = cv.clientHeight * dpr;
        draw(Math.round(state.f));
      };
      for (let i = 0; i < n; i++) {
        const im = new Image();
        im.onload = () => Math.round(state.f) >= i - 1 && draw(Math.round(state.f));
        im.src = src(i);
        imgs.push(im);
      }
      size();
      addEventListener("resize", size);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>(".cf-pour-line", root.current);
        // Line i owns the i-th slice of the scroll: fades/rises in over its first quarter, out over its last (the final line stays).
        const showLines = (p: number) =>
          lines.forEach((el, i) => {
            const t = p * lines.length - i;
            const fin = gsap.utils.clamp(0, 1, t / 0.25);
            const fout = i === lines.length - 1 ? 1 : gsap.utils.clamp(0, 1, (1 - t) / 0.25);
            const a = t < 0 || t > 1 ? (i === lines.length - 1 && t > 1 ? 1 : 0) : Math.min(fin, fout);
            gsap.set(el, { autoAlpha: a, y: (1 - fin) * 50 - (1 - fout) * 50 });
          });
        showLines(0);
        gsap.to(state, {
          f: n - 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", scrub: 0.6, pin: true, anticipatePin: 1, onUpdate: (self) => showLines(self.progress) },
          onUpdate: () => draw(Math.round(state.f)),
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.f = Math.round(n * 0.6);
        gsap.set(".cf-pour-line", { autoAlpha: 1 });
        draw(state.f);
      });

      return () => {
        removeEventListener("resize", size);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-svh overflow-hidden bg-teal-deep" aria-label="Milk being poured into iced coffee">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-teal/85 via-teal/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-teal/70 via-transparent to-teal/30" />
      <div className="absolute inset-x-4 bottom-[12%] lg:inset-x-6">
        <div className="relative h-[clamp(2.5rem,5.5vw,5rem)]">
          {d.pour.lines.map((l, i) => (
            <p key={l} className={`cf-pour-line absolute inset-x-0 bottom-0 font-sans font-semibold tracking-[-0.02em] text-[clamp(2rem,4.6vw,4.25rem)] leading-[1] ${i === 0 ? "text-lime" : "text-bone"}`}>
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
