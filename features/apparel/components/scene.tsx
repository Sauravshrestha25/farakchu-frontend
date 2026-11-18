"use client";

import { useState } from "react";
import Image from "next/image";
import { price, type Piece } from "@/features/apparel/data";
import { AddControls } from "./add-controls";

// One full-screen photo per piece, details over a soft fade at the bottom, a Front/Back switch.
export function Scene({ piece, index, total }: { piece: Piece; index: number; total: number }) {
  const [view, setView] = useState(0);

  return (
    <section id={`piece-${piece.id}`} className="ap-scene relative h-svh overflow-hidden bg-[#0d0e11]">
      <div className="ap-scene-in absolute inset-0">
        {piece.views.map((v, i) => (
          <Image
            key={v.src}
            src={v.src}
            alt={v.alt}
            fill
            priority={index === 0 && i === 0}
            sizes="100vw"
            className={`object-cover object-[center_12%] transition-opacity duration-700 ${view === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col justify-end px-4 pb-8 lg:px-6 lg:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-[30rem]">
            <p className="font-mono text-xs uppercase text-bone/70">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · Chapter {String(piece.chapter).padStart(2, "0")}
              {piece.tag && <> · {piece.tag}</>}
            </p>
            <h2 className="mt-3 font-sans font-semibold tracking-[-0.02em] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.05]">{piece.name}</h2>
            <p className="mt-2 font-mono text-xs uppercase text-bone/80">{piece.colourway} · {price(piece)}</p>
            <p className="mt-4 hidden text-base leading-snug text-bone/85 lg:block">{piece.desc}</p>
          </div>

          <div className="flex flex-col items-start gap-5 lg:items-end">
            <div className="flex rounded-full border border-bone/40 p-1" role="tablist" aria-label="View">
              {piece.views.map((v, i) => (
                <button
                  key={v.src}
                  type="button"
                  role="tab"
                  aria-selected={view === i}
                  onClick={() => setView(i)}
                  className={`rounded-full px-4 py-2 font-mono text-[0.65rem] uppercase leading-none transition-colors ${view === i ? "bg-bone text-[#16181d]" : "text-bone/80 hover:text-bone"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <AddControls piece={piece} />
          </div>
        </div>
      </div>
    </section>
  );
}
