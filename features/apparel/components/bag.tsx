"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getSmoother } from "@/components/smooth-scroll";
import { apparelDrop } from "@/content/site";
import type { Piece } from "@/features/apparel/data";

type Line = { key: string; piece: Piece; size: string; qty: number };
type BagCtx = { count: number; add: (p: Piece, size: string) => void; open: () => void };

const Ctx = createContext<BagCtx>({ count: 0, add: () => {}, open: () => {} });
export const useBag = () => useContext(Ctx);

// Orders go by Instagram DM. The bag writes the message; one tap copies it and opens the chat.
export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [note, setNote] = useState("");

  const count = lines.reduce((n, l) => n + l.qty, 0);

  const add = (piece: Piece, size: string) => {
    const key = `${piece.id}-${size}`;
    setLines((ls) => (ls.some((l) => l.key === key) ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { key, piece, size, qty: 1 }]));
    setBump((b) => b + 1);
  };
  const step = (key: string, d: number) => setLines((ls) => ls.flatMap((l) => (l.key !== key ? [l] : l.qty + d > 0 ? [{ ...l, qty: l.qty + d }] : [])));

  const message = useMemo(
    () =>
      [
        "Hi Farakchu Apparel! I'd like to order:",
        ...lines.map((l) => `• ${l.qty}× ${l.piece.name} (${l.piece.colourway}), size ${l.size}`),
        "",
        "Name:",
        "Pickup or delivery:",
      ].join("\n"),
    [lines],
  );

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    const s = getSmoother();
    s?.paused(isOpen);
    if (!isOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [isOpen]);

  const send = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setNote("Copied. Paste it into the DM.");
    } catch {
      setNote("Couldn't copy. Select the text and copy it by hand.");
    }
    window.open(apparelDrop.dm, "_blank", "noreferrer");
  };

  return (
    <Ctx.Provider value={{ count, add, open: () => setOpen(true) }}>
      {children}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open bag, ${count} items`}
        className="fixed bottom-4 right-4 z-[60] flex min-h-12 items-center gap-3 rounded-[50%] bg-lime px-7 py-3 font-wide text-[0.625rem] leading-none text-ink shadow-[0_12px_40px_-8px_rgb(0_0_0/0.5)] transition-colors hover:bg-bone lg:bottom-6 lg:right-6"
      >
        Bag
        <span key={bump} className={`grid size-6 place-items-center rounded-full bg-teal text-[0.625rem] text-lime ${bump ? "ap-pop" : ""}`}>{count}</span>
      </button>

      <div className={`fixed inset-0 z-[80] transition-opacity duration-500 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!isOpen}>
        <button type="button" aria-label="Close bag" tabIndex={isOpen ? 0 : -1} onClick={() => setOpen(false)} className="absolute inset-0 bg-teal-deep/70 backdrop-blur-sm" />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Your order"
          inert={!isOpen}
          className={`ap-receipt absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-bone pt-6 text-ink transition-transform duration-700 ease-out-expo ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between px-6 pt-8">
            <div>
              <h2 className="font-wide text-3xl leading-none text-teal">Your bag</h2>
              <p className="mt-2 font-mono text-[0.65rem] uppercase text-ink/60">{count ? `${count} ${count === 1 ? "piece" : "pieces"}` : "Empty"} · order by DM</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-[50%] bg-teal px-6 py-2.5 font-wide text-[0.625rem] leading-none text-lime transition-colors hover:bg-lime hover:text-ink">Close</button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto px-6">
            {lines.length === 0 ? (
              <p className="border-t border-dashed border-ink/30 pt-6 text-sm text-ink/70">Nothing here yet. Pick a piece and a size, and add it.</p>
            ) : (
              <ul className="border-t border-dashed border-ink/30">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-center gap-4 border-b border-dashed border-ink/30 py-4">
                    <div className="relative size-20 shrink-0 overflow-hidden bg-teal/10">
                      <Image src={l.piece.views[0].src} alt={l.piece.views[0].alt} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-wide text-sm leading-tight text-teal">{l.piece.name}</p>
                      <p className="mt-1 font-mono text-[0.65rem] uppercase text-ink/70">{l.piece.colourway} · size {l.size}</p>
                      <p className="mt-1 font-mono text-[0.65rem] uppercase text-ink/50">DM for price</p>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <button type="button" aria-label="Fewer" onClick={() => step(l.key, -1)} className="grid size-7 place-items-center rounded-full border border-ink/30 hover:bg-ink hover:text-bone">−</button>
                      <span className="w-4 text-center">{l.qty}</span>
                      <button type="button" aria-label="More" onClick={() => step(l.key, 1)} className="grid size-7 place-items-center rounded-full border border-ink/30 hover:bg-ink hover:text-bone">+</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {lines.length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[0.65rem] uppercase text-ink/60">The message we&rsquo;ll send</p>
                <textarea readOnly value={message} rows={Math.min(10, message.split("\n").length)} className="mt-2 w-full resize-none border border-dashed border-ink/30 bg-transparent p-3 font-mono text-xs leading-relaxed text-ink outline-none" />
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-ink/30 px-6 pb-6 pt-5">
            <button
              type="button"
              disabled={!lines.length}
              onClick={send}
              className="w-full rounded-[50%] bg-teal px-8 py-4 font-wide text-[0.7rem] leading-none text-lime transition-colors hover:bg-lime hover:text-ink disabled:opacity-40 disabled:hover:bg-teal disabled:hover:text-lime"
            >
              Copy order + open DM
            </button>
            <p className="mt-3 min-h-4 text-center font-mono text-[0.65rem] uppercase text-ink/60">{note || "Prices, sizes and pickup are confirmed in the DM."}</p>
          </div>
        </aside>
      </div>
    </Ctx.Provider>
  );
}
