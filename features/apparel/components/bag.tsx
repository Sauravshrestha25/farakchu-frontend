"use client";

import { createContext, useContext, useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { getSmoother } from "@/components/smooth-scroll";
import { price, type Piece } from "@/features/apparel/data";
import { placeOrder, toItems } from "@/features/apparel/api";

type Line = { key: string; piece: Piece; size: string; qty: number };
type BagCtx = { count: number; bump: number; dot: RefObject<HTMLSpanElement | null> | null; add: (p: Piece, size: string, from?: Element | null) => void; open: () => void };

const Ctx = createContext<BagCtx>({ count: 0, bump: 0, dot: null, add: () => {}, open: () => {} });
export const useBag = () => useContext(Ctx);

// Bag drawer: bag -> your details -> done. Orders are posted to the backend (see api.ts).
export function BagProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [stage, setStage] = useState<"bag" | "details" | "done">("bag");
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const count = lines.reduce((n, l) => n + l.qty, 0);

  const dot = useRef<HTMLSpanElement>(null);

  // `from` given: a thumbnail of the piece flies from there up to the Bag count, and the line lands when it does.
  const add = (piece: Piece, size: string, from?: Element | null) => {
    const to = dot.current;
    if (!from || !to || !to.offsetParent || matchMedia("(prefers-reduced-motion: reduce)").matches) return commit(piece, size);
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const s = 56;
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `position:fixed;left:0;top:0;width:${s}px;height:${s}px;border-radius:999px;z-index:70;pointer-events:none;background:${piece.hex} center/cover url("${piece.views[0].src}");box-shadow:0 10px 30px -6px rgb(0 0 0/.45)`;
    document.body.appendChild(el);
    const x0 = a.left + a.width / 2 - s / 2, y0 = a.top + a.height / 2 - s / 2;
    const x1 = b.left + b.width / 2 - s / 2, y1 = b.top + b.height / 2 - s / 2;
    // Separate x and y eases bend the path into an arc: it lifts off first, then swings across.
    gsap.timeline({ onComplete: () => { el.remove(); commit(piece, size); } })
      .fromTo(el, { x: x0, y: y0, scale: 0.4 }, { scale: 1, duration: 0.18, ease: "back.out(2)" })
      .to(el, { x: x1, duration: 0.75, ease: "power1.in" }, ">")
      .to(el, { y: y1, duration: 0.75, ease: "power3.out" }, "<")
      .to(el, { scale: 0.3, duration: 0.75, ease: "power2.in" }, "<");
  };

  const commit = (piece: Piece, size: string) => {
    const key = `${piece.id}-${size}`;
    setLines((ls) => (ls.some((l) => l.key === key) ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { key, piece, size, qty: 1 }]));
    setBump((b) => b + 1);
  };
  const step = (key: string, d: number) => setLines((ls) => ls.flatMap((l) => (l.key !== key ? [l] : l.qty + d > 0 ? [{ ...l, qty: l.qty + d }] : [])));

  const priced = lines.every((l) => l.piece.price != null);
  const subtotal = lines.reduce((n, l) => n + (l.piece.price ?? 0) * l.qty, 0);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    const s = getSmoother();
    s?.paused(isOpen);
    if (!isOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [isOpen]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    setSending(true);
    setError("");
    try {
      await placeOrder({
        customer: { name: v("name"), phone: v("phone"), email: v("email"), address: v("address"), note: v("note") },
        method,
        items: toItems(lines),
      });
      setLines([]);
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  const close = () => {
    setOpen(false);
    if (stage === "done") setStage("bag");
  };

  const field = "mt-1.5 w-full border border-ink/30 bg-transparent px-3 py-3 text-sm text-ink outline-none transition-colors focus:border-teal";
  const label = "block font-mono text-[0.65rem] uppercase text-ink/70";

  return (
    <Ctx.Provider value={{ count, bump, dot, add, open: () => setOpen(true) }}>
      {children}

      <div className={`fixed inset-0 z-[80] transition-opacity duration-500 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!isOpen}>
        <button type="button" aria-label="Close bag" tabIndex={isOpen ? 0 : -1} onClick={close} className="absolute inset-0 bg-teal-deep/70 backdrop-blur-sm" />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Your order"
          inert={!isOpen}
          className={`ap-receipt absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-bone pt-6 text-ink transition-transform duration-700 ease-out-expo ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-start justify-between px-6 pt-8">
            <div>
              <h2 className="font-sans font-semibold tracking-[-0.02em] text-2xl leading-none text-teal">{stage === "bag" ? "Your bag" : stage === "details" ? "Your details" : "Order sent"}</h2>
              <p className="mt-2 font-mono text-[0.65rem] uppercase text-ink/60">{count ? `${count} ${count === 1 ? "piece" : "pieces"}` : "Empty"} · order online</p>
            </div>
            <button type="button" onClick={close} className="rounded-[50%] bg-lime px-6 py-2.5 font-wide text-[0.625rem] leading-none text-bone transition-colors hover:bg-teal hover:text-bone">Close</button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto px-6">
            {stage === "done" ? (
              <p className="border-t border-dashed border-ink/30 pt-6 text-sm leading-snug text-ink/80">Thanks. We have your order and will get in touch to confirm {method === "pickup" ? "pickup" : "delivery"}.</p>
            ) : stage === "details" ? (
              <form id="order-form" onSubmit={submit} className="space-y-4 border-t border-dashed border-ink/30 pt-6">
                <label className={label}>Full name<input name="name" required autoComplete="name" className={field} /></label>
                <label className={label}>Phone<input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} /></label>
                <label className={label}>Email (optional)<input name="email" type="email" autoComplete="email" className={field} /></label>
                <div role="radiogroup" aria-label="Delivery or pickup" className="flex gap-2">
                  {(["delivery", "pickup"] as const).map((m) => (
                    <button key={m} type="button" role="radio" aria-checked={method === m} onClick={() => setMethod(m)} className={`flex-1 rounded-[50%] px-4 py-3 font-wide text-[0.625rem] leading-none transition-colors ${method === m ? "bg-teal text-bone" : "border border-ink/30 hover:border-lime hover:text-lime"}`}>
                      {m === "delivery" ? "Delivery" : "Pickup"}
                    </button>
                  ))}
                </div>
                {method === "delivery" ? (
                  <label className={label}>Delivery address<textarea name="address" required rows={3} autoComplete="street-address" className={field} /></label>
                ) : (
                  <p className="font-mono text-[0.65rem] uppercase text-ink/70">Pick up at Farakchu, Samakhusi. We&rsquo;ll confirm a time.</p>
                )}
                <label className={label}>Note (optional)<textarea name="note" rows={2} className={field} /></label>
              </form>
            ) : lines.length === 0 ? (
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
                      <p className="mt-1 font-mono text-[0.65rem] uppercase text-ink/50">{price(l.piece)}</p>
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
          </div>

          {stage !== "done" && (
            <div className="border-t border-dashed border-ink/30 px-6 pb-6 pt-5">
              <div className="mb-4 flex items-baseline justify-between font-mono text-xs uppercase">
                <span>Subtotal</span>
                <span>{lines.length === 0 ? "—" : priced ? `NPR ${subtotal.toLocaleString("en-US")}` : "Price soon"}</span>
              </div>
              {stage === "bag" ? (
                <button type="button" disabled={!lines.length} onClick={() => setStage("details")} className="w-full rounded-[50%] bg-lime px-8 py-4 font-wide text-[0.7rem] leading-none text-bone transition-colors hover:bg-teal hover:text-bone disabled:bg-ink/15 disabled:text-ink/45 disabled:hover:bg-ink/15 disabled:hover:text-ink/45">
                  Checkout
                </button>
              ) : (
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setStage("bag"); setError(""); }} className="rounded-[50%] border border-ink/30 px-6 py-4 font-wide text-[0.7rem] leading-none transition-colors hover:border-teal hover:text-teal">Back</button>
                  <button type="submit" form="order-form" disabled={sending} className="flex-1 rounded-[50%] bg-lime px-8 py-4 font-wide text-[0.7rem] leading-none text-bone transition-colors hover:bg-teal hover:text-bone disabled:opacity-60">
                    {sending ? "Sending…" : "Place order"}
                  </button>
                </div>
              )}
              <p role="status" className="mt-3 min-h-4 text-center font-mono text-[0.65rem] uppercase text-ink/60">{error || "Pay on delivery or pickup. We confirm by phone."}</p>
            </div>
          )}
        </aside>
      </div>
    </Ctx.Provider>
  );
}

// Bag pill for the nav bar, next to Menu. Outlined so it doesn't compete with the Menu pill.
export function BagButton() {
  const { count, bump, dot, open } = useBag();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open bag, ${count} items`}
      className="flex min-h-11 items-center gap-2.5 rounded-[50%] border border-current px-3 py-2 font-wide text-[0.625rem] leading-none transition-opacity hover:opacity-70 sm:px-6"
    >
      <span className="max-sm:sr-only">Bag</span>
      <span ref={dot} key={bump} className={`grid size-5 place-items-center rounded-full bg-lime text-[0.6rem] text-ink ${bump ? "ap-pop" : ""}`}>{count}</span>
    </button>
  );
}
