"use client";

import "../apparel.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Reveals } from "@/components/reveals";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/home/footer";
import { price, pieces, type Piece } from "@/features/apparel/data";
import { AddControls } from "./add-controls";
import { PieceCard } from "./piece-card";
import { BagProvider } from "./bag";

// Product detail: gallery on the left, buy box on the right. Orders go through the bag.
export function ProductPage({ piece }: { piece: Piece }) {
  const [view, setView] = useState(0);
  const no = String(piece.chapter).padStart(2, "0");
  const more = pieces.filter((p) => p.id !== piece.id);

  return (
    <BagProvider>
      <Nav page="sub" />
      <SmoothScroll>
        <main>
          <section className="grid gap-10 px-4 pb-20 pt-28 lg:grid-cols-12 lg:px-6 lg:gap-y-6 lg:pb-28 lg:pt-32">
            <Link href="/apparel#catalogue" className="justify-self-start font-mono text-xs uppercase text-bone/70 hover:text-lime lg:col-span-12">← All pieces</Link>
            <div className="flex flex-col-reverse gap-3 lg:col-span-7 lg:flex-row">
              <div className="flex gap-2 lg:flex-col">
                {piece.views.map((v, i) => (
                  <button key={v.src} type="button" onClick={() => setView(i)} aria-label={`Show ${v.label}`} aria-pressed={view === i} className={`relative size-16 overflow-hidden border-2 transition-colors lg:size-20 ${view === i ? "border-lime" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <Image src={v.src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden lg:max-w-[40rem]" style={{ background: piece.hex }}>
                {piece.views.map((v, i) => (
                  <Image key={v.src} src={v.src} alt={v.alt} fill priority={i === 0} sizes="(min-width:1024px) 40vw, 100vw" className={`object-cover transition-opacity duration-700 ${view === i ? "opacity-100" : "opacity-0"}`} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 lg:self-center">
              <h1 className="font-wide text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[0.92]">{piece.name}</h1>
              <p className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase">
                <span className="inline-block size-3 rounded-full" style={{ background: piece.hex, boxShadow: "0 0 0 3px rgb(241 236 225 / 0.25)" }} />
                Chapter {no} · {piece.colourway}
                {piece.tag && <span className="rounded-full bg-lime px-2.5 py-1 font-wide text-[0.55rem] leading-none text-ink">{piece.tag}</span>}
              </p>
              <p className="mt-6 max-w-[28rem] text-lg leading-snug text-bone/90">{piece.desc}</p>
              <p className="mt-4 font-mono text-xs uppercase text-bone/70">{price(piece)} · unisex · brushed fleece</p>
              <div className="mt-8"><AddControls piece={piece} /></div>
            </div>
          </section>

          <section className="bg-bone px-4 py-16 text-ink lg:px-6 lg:py-24">
            <h2 className="font-wide text-[clamp(1.6rem,3vw,3rem)] leading-[0.95] text-teal">More pieces</h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-3">
              {more.map((p) => (
                <li key={p.id}><PieceCard piece={p} sizes="(min-width:1024px) 30vw, 46vw" /></li>
              ))}
            </ul>
          </section>
        </main>
        <Footer />
        <Reveals />
      </SmoothScroll>
    </BagProvider>
  );
}
