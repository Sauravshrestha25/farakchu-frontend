"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cafePage as d } from "@/features/cafe/data";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Five sharp drink portraits fanned over a giant wordmark; they rise in, then drift at different speeds.
export function CafeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(q(".cf-word"), { type: "chars", mask: "chars" });
        gsap.set(split.chars, { yPercent: 105 });
        gsap.set(q(".cf-card"), { yPercent: 40, autoAlpha: 0 });
        gsap
          .timeline({ delay: 0.2, defaults: { ease: "power4.out" } })
          .to(q(".cf-card"), { yPercent: 0, autoAlpha: 1, duration: 1.5, stagger: { each: 0.1, from: "center" } })
          .to(split.chars, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0.3)
          .from(q(".cf-hero-meta > *"), { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 1);

        q(".cf-card").forEach((el, i) =>
          gsap.to(el, { yPercent: (i % 2 ? -1 : 1) * (6 + (i % 3) * 5), ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } }),
        );
        gsap.to(q(".cf-word"), { yPercent: -14, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero className="relative flex min-h-[44rem] h-svh flex-col justify-end overflow-hidden px-4 pb-6 pt-28 lg:px-6">
      {/* Cards: bottoms overlap the wordmark */}
      <div className="absolute inset-x-0 top-[12%] z-20 flex items-start justify-center gap-[1.4vw] px-4 max-md:[&>*:nth-child(1)]:hidden max-md:[&>*:nth-child(5)]:hidden">
        {d.heroCards.map((c) => (
          <div key={c.src} className="cf-card shrink-0 will-change-transform" style={{ width: `${c.w}vw`, marginTop: `${c.lift}vh`, rotate: `${c.rot}deg` }}>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-teal-soft shadow-[0_30px_60px_-20px_rgb(0_20_20/0.7)] max-md:aspect-[3/4]">
              <Image src={c.src} alt={c.alt} fill priority sizes="25vw" className="object-cover" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-auto">
        <h1 className="cf-word font-wide text-[clamp(5rem,27vw,28rem)] leading-[0.8] tracking-[-0.05em] [margin-left:-0.04em]">Cafe</h1>
        <div className="cf-hero-meta relative z-30 mt-4 flex items-end justify-between gap-6 text-sm">
          <p className="max-w-[16rem] leading-tight">Coffee. Culture.<br />Conversation.</p>
          <p className="text-right leading-tight text-bone/80">Samakhusi,<br />Kathmandu</p>
        </div>
      </div>
    </section>
  );
}
