"use client";

import { useState } from "react";
import Image from "next/image";
import { price, type Piece } from "@/features/apparel/data";
import { AddControls } from "./add-controls";

// One full-screen scene per piece. The colour of the garment becomes the colour of the room.
export function Scene({ piece, index, total }: { piece: Piece; index: number; total: number }) {
  const [view, setView] = useState(0);
  const no = String(piece.chapter).padStart(2, "0");

  return (
    <section id={`piece-${piece.id}`} className="ap-scene relative min-h-svh overflow-hidden" style={{ background: piece.hex }}>
      <div className="ap-scene-in relative flex min-h-svh flex-col justify-end px-4 pb-8 pt-24 lg:px-6 lg:pb-8">

        <span className="ap-outline pointer-events-none absolute -right-[2vw] bottom-[2%] select-none font-wide text-[34vw] leading-[0.8]" aria-hidden>{no}</span>
        <span className="ap-outline ap-drift pointer-events-none absolute inset-x-0 top-[14%] select-none whitespace-nowrap font-wide text-[clamp(5rem,15vw,17rem)] leading-[0.85]" aria-hidden>{piece.name}</span>

        <div className="relative grid items-end gap-8 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="font-mono text-xs">({String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")})</p>
            <h2 className="mt-4 font-wide text-[clamp(2rem,3.8vw,4rem)] leading-[0.92]">{piece.name}</h2>
            <p className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase">
              <span className="inline-block size-3 rounded-full border border-bone/60" style={{ background: piece.hex, boxShadow: "0 0 0 3px rgb(241 236 225 / 0.25)" }} />
              Chapter {no} · {piece.colourway}
              {piece.tag && <span className="rounded-full bg-lime px-2.5 py-1 font-wide text-[0.55rem] leading-none text-ink">{piece.tag}</span>}
            </p>
            <p className="mt-4 max-w-[26rem] text-base leading-snug text-bone/90">{piece.desc}</p>
            <p className="mt-3 font-mono text-xs uppercase text-bone/70">{price(piece)}</p>
            <div className="mt-5"><AddControls piece={piece} /></div>
          </div>

          <div className="order-1 flex items-end gap-3 lg:order-2 lg:col-span-7 lg:justify-end">
            <div className="flex flex-col gap-2">
              {piece.views.map((v, i) => (
                <button key={v.src} type="button" onClick={() => setView(i)} aria-label={`Show ${v.label}`} className={`relative size-16 overflow-hidden border-2 transition-colors lg:size-20 ${view === i ? "border-lime" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <Image src={v.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
            <div data-cursor="Flip" onClick={() => setView((v) => (v + 1) % piece.views.length)} className="ap-photo relative aspect-[4/5] w-full max-w-[34rem] cursor-pointer overflow-hidden bg-black/20 max-lg:max-w-none lg:h-[72svh] lg:w-auto">
              {piece.views.map((v, i) => (
                <Image key={v.src} src={v.src} alt={v.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className={`object-cover transition-[opacity,transform] duration-700 ease-out-expo ${view === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`} />
              ))}
              <span className="absolute bottom-3 left-3 rounded-full bg-teal/80 px-3 py-1.5 font-mono text-[0.6rem] uppercase backdrop-blur">{piece.views[view].label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
