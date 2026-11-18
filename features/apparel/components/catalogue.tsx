"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { price, pieces, sizes } from "@/features/apparel/data";
import { useBag } from "./bag";

gsap.registerPlugin(Flip);

const filters: { label: string; chapter: number | 0 }[] = [
  { label: "All", chapter: 0 },
  { label: "Chapter 01", chapter: 1 },
  { label: "Chapter 02", chapter: 2 },
  { label: "Chapter 03", chapter: 3 },
];

// Bone catalogue: filter by chapter, switch density; cards re-flow with Flip.
export function Catalogue() {
  const grid = useRef<HTMLUListElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);
  const { add } = useBag();
  const [chapter, setChapter] = useState(0);
  const [cols, setCols] = useState<2 | 4>(4);

  const change = (apply: () => void) => {
    const items = grid.current?.querySelectorAll("li");
    if (items) flip.current = Flip.getState(items);
    apply();
  };

  useEffect(() => {
    if (!flip.current) return;
    const state = flip.current;
    flip.current = null;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(state, {
      duration: 0.8,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.4, ease: "power2.in" }),
    });
  }, [chapter, cols]);

  const shown = pieces.filter((p) => !chapter || p.chapter === chapter);

  return (
    <section id="catalogue" className="ap-catalogue bg-bone px-4 py-20 text-ink lg:px-6 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.15] text-teal">All pieces</h2>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button key={f.label} type="button" onClick={() => change(() => setChapter(f.chapter))} aria-pressed={chapter === f.chapter} className={`rounded-[50%] px-6 py-3 font-wide text-[0.625rem] leading-none transition-colors ${chapter === f.chapter ? "bg-teal text-lime" : "border border-ink/30 text-ink hover:border-teal hover:text-teal"}`}>
              {f.label}
            </button>
          ))}
          <span className="mx-2 hidden h-6 w-px bg-ink/20 sm:block" />
          {([2, 4] as const).map((n) => (
            <button key={n} type="button" onClick={() => change(() => setCols(n))} aria-label={`${n} columns`} aria-pressed={cols === n} className={`grid size-11 place-items-center rounded-full font-mono text-xs transition-colors max-sm:hidden ${cols === n ? "bg-teal text-lime" : "border border-ink/30 hover:border-teal"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <ul ref={grid} className={`mt-12 grid gap-x-4 gap-y-14 grid-cols-2 ${cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}>
        {shown.map((p) => (
          <li key={p.id} className="ap-card group">
            <div className="relative aspect-[4/5] overflow-hidden" style={{ background: p.hex }} data-cursor="View">
              <Link href={`/apparel/${p.id}`} aria-label={`${p.name}, view product`} className="absolute inset-0 z-[1]" />
              <Image src={p.views[0].src} alt={p.views[0].alt} fill sizes="(min-width:1024px) 26vw, 46vw" className="object-cover transition-opacity duration-700 group-hover:opacity-0" />
              <Image src={p.views[1].src} alt={p.views[1].alt} fill sizes="(min-width:1024px) 26vw, 46vw" className="object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-100" />
              <span className="absolute right-3 top-3 font-mono text-xs leading-none text-ink mix-blend-difference">{String(p.chapter).padStart(2, "0")}</span>
              {p.tag && <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1.5 font-wide text-[0.55rem] leading-none text-ink">{p.tag}</span>}
              <div data-cursor="Quick add" className="absolute inset-x-3 bottom-3 z-[2] flex translate-y-3 items-center justify-between gap-2 rounded-full bg-bone p-1.5 opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                {sizes.map((s) => (
                  <button key={s} type="button" aria-label={`Add ${p.name}, size ${s}`} onClick={(e) => add(p, s, e.currentTarget)} className="grid size-9 place-items-center rounded-full font-wide text-[0.6rem] leading-none text-teal transition-colors hover:bg-teal hover:text-lime">
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="font-wide text-sm leading-tight text-teal"><Link href={`/apparel/${p.id}`} className="hover:underline">{p.name}</Link></h3>
              <span className="font-mono text-[0.65rem] uppercase text-ink/60">{price(p)}</span>
            </div>
            <p className="mt-1 flex items-center gap-2 font-mono text-[0.65rem] uppercase text-ink/70">
              <span className="inline-block size-2.5 rounded-full" style={{ background: p.hex }} />
              {p.colourway}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
