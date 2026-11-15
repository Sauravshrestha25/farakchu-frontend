"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { CornerArrow } from "./icons";

type Item = { title: string; image: { src: string; alt: string } };
const pad = (n: number) => String(n).padStart(2, "0");

// "case": poster cases, 5 visible, centre biggest. "video": framed 16:9 with red brackets, 3 visible.
export function Carousel({ items, variant }: { items: Item[]; variant: "case" | "video" }) {
  const box = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);
  const down = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const n = items.length;
  const isCase = variant === "case";
  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  const layout = useCallback(
    (animate: boolean) => {
      const vw = innerWidth;
      const mobile = vw < 768;
      const base = isCase ? (mobile ? vw * 0.58 : Math.min(vw * 0.25, 430)) : mobile ? vw * 0.78 : Math.min(vw * 0.455, 760);
      const mediaH = isCase ? base * 1.25 : base * 0.5625;
      box.current?.style.setProperty("--w", `${base}px`);
      box.current?.style.setProperty("--h", `${isCase ? mediaH : mediaH + 63}px`);
      const cfg = isCase
        ? [{ x: 0, s: 1, o: 1 }, { x: mobile ? 0.72 : 0.2527, s: 0.7, o: 1 }, { x: mobile ? 1.2 : 0.4339, s: 0.45, o: 0.75 }]
        : [{ x: 0, s: 1, o: 1 }, { x: mobile ? 0.9 : 0.468, s: 0.753, o: 1 }];
      els.current.forEach((el, i) => {
        if (!el) return;
        const off = ((((i - active + n / 2) % n) + n) % n) - n / 2;
        const a = Math.round(Math.abs(off));
        const c = cfg[a];
        gsap.to(el, {
          x: c ? Math.sign(off) * c.x * vw : Math.sign(off || 1) * vw,
          scale: c ? c.s : 0.3,
          autoAlpha: c ? c.o : 0,
          zIndex: 10 - a,
          duration: animate ? 0.9 : 0,
          ease: "power3.inOut",
          overwrite: true,
        });
      });
    },
    [active, n, isCase],
  );

  useEffect(() => {
    layout(!first.current);
    first.current = false;
    gsap.fromTo(box.current!.querySelectorAll("[data-cap]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", delay: 0.25 });
    const on = () => layout(false);
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, [layout]);

  const onUp = (x: number) => {
    if (down.current === null) return;
    const dx = x - down.current;
    down.current = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };
  const arrow = "ev-sq absolute z-20 -translate-x-1/2 -translate-y-1/2";
  const arrowTop = isCase ? "50%" : "calc(var(--h) / 2 - 31px)";

  return (
    <div ref={box} className="relative select-none" onPointerDown={(e) => (down.current = e.clientX)} onPointerUp={(e) => onUp(e.clientX)} onPointerLeave={(e) => onUp(e.clientX)}>
      <div ref={wrap} className="relative h-[var(--h)] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        {items.map((it, i) => (
          <div
            key={it.title}
            ref={(el) => {
              els.current[i] = el;
              if (el && first.current) gsap.set(el, { xPercent: -50, yPercent: isCase ? -50 : 0 });
            }}
            data-cursor
            onClick={() => i !== active && go(i)}
            className="absolute left-1/2 w-[var(--w)]"
            style={{ top: isCase ? "50%" : 32, cursor: i === active ? "default" : "pointer" }}
          >
            {isCase ? (
              <div className="ev-case relative aspect-[4/5] w-full">
                <div className="relative h-full w-full overflow-hidden bg-[#00292b]">
                  <Image src={it.image.src} alt={it.image.alt} fill sizes="30vw" className="object-cover" />
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden bg-[#00292b]">
                <Image src={it.image.src} alt={it.image.alt} fill sizes="50vw" className="ev-bw object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" aria-label="Previous" onClick={() => go(active - 1)} className={arrow} style={{ left: "calc(50% - 42.9vw)", top: arrowTop }}>
        <CornerArrow dir="l" />
      </button>
      <button type="button" aria-label="Next" onClick={() => go(active + 1)} className={arrow} style={{ left: "calc(50% + 42.9vw)", top: arrowTop }}>
        <CornerArrow dir="r" />
      </button>

      {isCase ? (
        <h3 data-cap className="ev-display ev-h3 mt-3 text-center text-[#d6ff50]">{items[active].title}</h3>
      ) : (
        <>
          <div className="pointer-events-none absolute left-1/2 top-0 w-[calc(var(--w)+64px)] -translate-x-1/2" style={{ height: "var(--h)" }}>
            <div className="ev-brackets"><i /><i /><i /><i /></div>
          </div>
          <p data-cap className="absolute left-1/2 top-[calc(var(--h)-19px)] -translate-x-1/2 whitespace-nowrap text-[#d6ff50]">{items[active].title}</p>
          <div className="relative mx-auto mt-10 h-20 w-[min(46rem,92vw)] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_30%,#000_70%,transparent)]" aria-hidden>
            <div className="flex justify-center">
              {[-2, -1, 0, 1, 2].map((o) => (
                <div key={o} className="flex w-[8.66vw] min-w-[5.5rem] max-w-[8.2rem] flex-col items-center">
                  <span className={`text-[0.95rem] ${o === 0 ? "text-bone" : Math.abs(o) === 1 ? "text-bone/35" : "text-bone/15"}`}>{pad(((((active + o) % n) + n) % n) + 1)}</span>
                  <span className="mt-2 h-4 w-px bg-bone/50" />
                </div>
              ))}
            </div>
            <div className="ev-ruler absolute inset-x-0 top-[2.9rem] h-2 opacity-60" />
          </div>
        </>
      )}
    </div>
  );
}
