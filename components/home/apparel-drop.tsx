"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { apparelDrop } from "@/content/site";
import { pieces } from "@/features/apparel/data";
import { PieceCard } from "@/features/apparel/components/piece-card";

gsap.registerPlugin(ScrollTrigger);

// Lookbook, one screen. Hover a card to swap to the second shot; cards rise in staggered.
export function ApparelDrop() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.from(q(".ad-card"), {
        y: 80,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.from(q(".ad-head-line"), {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      // Big marquee word drifts with scroll.
      gsap.fromTo(
        q(".ad-marquee"),
        { xPercent: 0 },
        {
          xPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Re-measure once fonts and images have settled, so the reveal can't be left waiting on a stale scroll position.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      addEventListener("load", refresh);
      return () => removeEventListener("load", refresh);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="apparel"
      className="relative overflow-hidden bg-bone px-4 py-24 text-ink lg:px-8 lg:py-32"
    >
      <p
        aria-hidden
        className="ad-marquee pointer-events-none absolute left-0 top-10 whitespace-nowrap font-wide text-[18vw] leading-none text-ink/[0.06]"
      >
        FARAKCHU APPAREL FARAKCHU APPAREL
      </p>

      <div className="relative mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
        <h2 className="font-wide text-[clamp(2.6rem,6vw,6rem)] leading-[0.92]">
          <span className="block overflow-hidden">
            <span className="ad-head-line block">Wear the</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="ad-head-line block">
              <span className="inline-block rounded-[0.16em] bg-teal px-[0.08em] leading-[0.9] text-lime">
                difference.
              </span>
            </span>
          </span>
        </h2>
        <div className="flex max-w-[24rem] flex-col gap-5">
          <p className="text-justify text-[0.8125rem] uppercase leading-[1.25] [0.025rem] text-ink/95">
            Unisex hoodies in premium anti-peel brushed fleece. Small runs,
            numbered chapters, gone when they&apos;re gone.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/apparel"
              className="rounded-[50%] bg-teal px-7 py-3 font-wide text-[0.625rem] text-lime transition-colors hover:bg-lime hover:text-ink"
            >
              Shop apparel
            </Link>
            <a
              href={apparelDrop.merch}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline-offset-4 hover:underline"
            >
              Official Nepal merch →
            </a>
          </div>
        </div>
      </div>

      <ul className="relative grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-4">
        {pieces.map((p) => (
          <li key={p.id} data-hc className="ad-card group">
            <PieceCard piece={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
