"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { scrollToAnchor } from "@/components/nav";
import { pieces } from "@/features/apparel/data";

gsap.registerPlugin(SplitText);

const Hanger = () => (
  <svg viewBox="0 0 120 56" className="mx-auto -mb-3 block h-14 w-[45%] text-bone" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M60 2v10M60 12c-7 0-7 9 0 9s7-5 4-8M60 21 8 50h104z" />
  </svg>
);

// The whole shop on one rail: four pieces hanging, swaying, and pushed around by the cursor.
export function RailHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(q(".ap-hero-title"), { type: "lines", mask: "lines" });
        gsap.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.12, ease: "power4.out", delay: 0.2 });
        gsap.from(q(".ap-drop"), { yPercent: -120, autoAlpha: 0, duration: 1.8, stagger: 0.14, ease: "elastic.out(1, 0.5)", delay: 0.5 });
        gsap.from(q(".ap-hero-note"), { y: 20, autoAlpha: 0, duration: 0.9, ease: "power3.out", delay: 1 });

        mm.add("(hover: hover) and (pointer: fine)", () => {
          const rail = q(".ap-rail")[0];
          const sways = q(".ap-sway");
          const push = (e: PointerEvent) =>
            sways.forEach((el) => {
              const r = el.getBoundingClientRect();
              const d = (e.clientX - (r.left + r.width / 2)) / r.width;
              const inRange = Math.abs(d) < 1.7 && e.clientY > r.top - 60;
              gsap.to(el, { rotate: inRange ? gsap.utils.clamp(-9, 9, -d * 7) : 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
            });
          const rest = () => gsap.to(sways, { rotate: 0, duration: 1.6, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
          rail.addEventListener("pointermove", push as EventListener);
          rail.addEventListener("pointerleave", rest);
          return () => {
            rail.removeEventListener("pointermove", push as EventListener);
            rail.removeEventListener("pointerleave", rest);
          };
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero className="relative flex min-h-[max(44rem,100svh)] flex-col overflow-hidden px-4 pb-10 pt-28 lg:px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="ap-hero-title font-sans font-semibold tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05]">
          Wear the <br />
          <span className="hl">difference.</span>
        </h1>
        <p className="ap-hero-note max-w-[26rem] text-sm leading-snug text-bone/80">
          Four hoodies, small runs, made in Kathmandu. Pick yours off the rail, add it to the bag, and order online.
        </p>
      </div>

      <div className="ap-rail relative mt-10 flex-1 lg:mt-12">
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-bone" aria-hidden />
        <div className="absolute -left-1 top-[-5px] h-[13px] w-[3px] bg-bone" aria-hidden />
        <div className="absolute -right-1 top-[-5px] h-[13px] w-[3px] bg-bone" aria-hidden />
        <ul className="flex items-start justify-center gap-[2vw] pt-[2px] max-sm:gap-3">
          {pieces.map((p, i) => (
            <li key={p.id} className="ap-drop w-[min(14.5vw,15.5rem)] shrink-0 max-md:w-[22vw]">
              <div className="ap-hang" style={{ animationDelay: `${-i * 1.1}s`, animationDuration: `${4.2 + i * 0.5}s` }}>
                <div className="ap-sway" style={{ transformOrigin: "50% 0" }}>
                  <Hanger />
                  <button type="button" onClick={() => scrollToAnchor(`#piece-${p.id}`)} data-cursor="View" className="group relative block w-full text-left">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-teal-soft shadow-[0_24px_40px_-18px_rgb(0_20_20/0.8)]">
                      <Image src={p.views[0].src} alt={p.views[0].alt} fill priority sizes="16vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                      {p.tag && <span className="absolute left-2 top-2 rounded-full bg-lime px-2.5 py-1 font-wide text-[0.5rem] leading-none text-ink">{p.tag}</span>}
                    </div>
                    <p className="mt-3 font-wide text-[0.7rem] leading-tight">{p.name}</p>
                    <p className="mt-0.5 font-mono text-[0.6rem] uppercase text-bone/60">{p.colourway}</p>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
