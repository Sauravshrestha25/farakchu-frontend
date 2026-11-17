"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { scrollToAnchor } from "@/components/nav";
import { cafePage as d } from "@/features/cafe/data";

gsap.registerPlugin(ScrollTrigger, SplitText);

const MID = Math.floor(d.heroCards.length / 2);

// Drink cards dealt from a stack into a fan that sinks into a full-bleed wordmark.
// Cards weave in front of / behind the letters, follow the cursor, and straighten on hover.
export function CafeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q(".cf-card"); // scroll layer
      const faces = q(".cf-face"); // entrance layer
      const mm = gsap.matchMedia();
      let resetTilt: (() => void) | undefined; // set by the cursor layer; scroll calls it so the centre card is back in its slot before it opens

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(q(".cf-word"), { type: "chars,lines", mask: "lines" });
        const sec = root.current!.getBoundingClientRect();
        // Every card starts stacked at the centre, then deals out to its slot.
        const toCentre = faces.map((el) => {
          const r = el.getBoundingClientRect();
          return sec.left + sec.width / 2 - (r.left + r.width / 2);
        });

        gsap
          .timeline({ delay: 0.15, defaults: { ease: "power4.out" } })
          .from(faces, { x: (i) => toCentre[i], yPercent: 70, rotate: (i) => (i - MID) * -4, autoAlpha: 0, duration: 1.6, stagger: { each: 0.08, from: "center" } })
          .from(split.chars, { yPercent: 105, duration: 1.3, stagger: 0.06 }, 0.35)
          .from(q(".cf-badge"), { scale: 0, rotate: -120, duration: 1.2, ease: "back.out(1.6)" }, 1)
          .from(q(".cf-hero-meta > *"), { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 1.1);

        gsap.to(q(".cf-badge-ring"), { rotate: 360, duration: 14, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

        // Handoff (pinned): side cards scatter, letters drop, and the centre card's photo opens full-bleed.
        const centre = cards[MID];
        const stage = q(".cf-stage")[0];
        const cardInset = () => {
          const s = root.current!.getBoundingClientRect();
          const r = centre.getBoundingClientRect(); // layout box: no transforms on this layer for the centre card
          return `inset(${r.top - s.top}px ${s.right - r.right}px ${s.bottom - r.bottom}px ${r.left - s.left}px)`;
        };
        // Start the full-bleed image at the exact scale/offset of the card's object-cover crop, so the open is one continuous photo.
        const [fw, fh] = d.heroCards[MID].px!;
        const FRAME = { w: fw, h: fh };
        const cardFit = () => {
          const s = root.current!.getBoundingClientRect();
          const r = centre.getBoundingClientRect();
          const cover = (w: number, h: number) => Math.max(w / FRAME.w, h / FRAME.h);
          // Cover the screen, but never so tight that the wine glass / pint at the edges get cropped (portrait screens letterbox on teal).
          const full = Math.min(cover(s.width, s.height), s.width / (d.heroCards[MID].keep ?? FRAME.w));
          return { scale: cover(r.width, r.height) / full, x: r.left + r.width / 2 - (s.left + s.width / 2), y: r.top + r.height / 2 - (s.top + s.height / 2), width: FRAME.w * full, height: FRAME.h * full };
        };
        const handoff = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => self.progress > 0.01 && resetTilt?.(),
          },
        });
        cards.forEach((el, i) => {
          if (i === MID) return;
          handoff.to(el, { x: `${(i - MID) * 45}vw`, yPercent: -40 - Math.abs(i - MID) * 25, rotate: (i - MID) * 14, ease: "power2.in", duration: 0.45 }, 0);
        });
        handoff
          .to(split.chars, { yPercent: 110, ease: "power2.in", duration: 0.35, stagger: 0.03 }, 0)
          .to(q(".cf-badge, .cf-hero-meta"), { autoAlpha: 0, duration: 0.12 }, 0)
          .fromTo(stage, { clipPath: cardInset, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0)
          // Explicit from-value: browsers serialize equal left/right insets as 3 values, which GSAP would read as left = 0.
          .fromTo(stage, { clipPath: cardInset }, { clipPath: "inset(0px 0px 0px 0px)", ease: "power2.inOut", duration: 0.8, immediateRender: false }, 0.2)
          .fromTo(q(".cf-stage-img"), { scale: () => cardFit().scale, x: () => cardFit().x, y: () => cardFit().y, width: () => cardFit().width, height: () => cardFit().height, xPercent: -50, yPercent: -50 }, { scale: 1, x: 0, y: 0, ease: "power2.inOut", duration: 0.8 }, 0.2)
          .fromTo(q(".cf-stage-shade"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.6); // eases into the teal of the next section

        return () => split.revert();
      });

      // Cursor parallax on a separate layer so it never fights the scroll tweens. Bigger cards = closer = move more.
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const movers = q(".cf-tilt").map((el, i) => {
          const depth = d.heroCards[i].w / 24;
          return { x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }), depth };
        });
        resetTilt = () => movers.forEach((m) => (m.x(0), m.y(0)));
        const onMove = (e: PointerEvent) => {
          if (window.scrollY > 4) return;
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 40 * m.depth);
            m.y(ny * 24 * m.depth);
          });
        };
        root.current!.addEventListener("pointermove", onMove);
        return () => root.current?.removeEventListener("pointermove", onMove);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-hero className="relative flex h-svh min-h-[40rem] flex-col justify-end overflow-hidden px-4 pb-6 pt-28 lg:min-h-[44rem] lg:px-6">
      {/* Fan: bottoms sink into the wordmark. Mobile keeps the middle three, larger and overlapping. */}
      <div className="relative -mb-[30vw] flex md:-mb-[12vw] items-end justify-center gap-[1.4vw] max-md:gap-0">
        {d.heroCards.map((c, i) => (
          <div
            key={c.src}
            className={`cf-card shrink-0 will-change-transform [&:has(:hover,:focus-visible)]:z-40 ${c.front ? "z-20" : "z-0"} ${i === 0 || i === d.heroCards.length - 1 ? "max-md:hidden" : ""} ${i === MID ? "max-md:z-10" : "max-md:-mx-[4vw]"}`}
            style={{ "--w": c.w, "--lift": c.lift, "--r": `${c.rot}deg` } as React.CSSProperties}
          >
            <div className="cf-tilt w-[calc(var(--w)*1vw)] mb-[calc(var(--lift)*1vh)] max-md:mb-[calc(var(--lift)*0.6vh)] max-md:w-[calc(var(--w)*2.5vw)]">
              <button
                type="button"
                onClick={() => scrollToAnchor("#menu")}
                aria-label={`${c.name}${c.price ? `, Rs ${c.price}` : ""}. See the menu`}
                className="cf-face group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-teal-soft shadow-[0_40px_70px_-25px_rgb(0_15_15/0.8)] outline-offset-4 transition-[rotate,scale] duration-700 ease-out-expo rotate-(--r) hover:rotate-0 hover:scale-[1.04] focus-visible:rotate-0"
              >
                <Image src={c.src} alt={c.alt} fill priority sizes="(min-width:768px) 22vw, 56vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110" />
                <span className="absolute inset-x-2 bottom-2 flex translate-y-[calc(100%+0.75rem)] items-baseline justify-between gap-2 rounded-full bg-lime px-3 py-2 text-[0.625rem] uppercase leading-none text-ink transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  <span className="truncate font-semibold">{c.name}</span>
                  {c.price && <span className="font-mono tabular-nums">Rs {c.price}</span>}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* ponytail: width ratios fit "Cafe" (one line) / "Ca|fe" (mobile, two lines) in font-wide edge to edge; retune if the word or font changes. */}
        <h1 className="cf-word pointer-events-none font-wide text-[calc((100vw-2rem)*0.62)] leading-[0.8] tracking-[-0.05em] [margin-left:-0.04em] md:text-[calc((100vw-2rem)*0.343)] lg:text-[calc((100vw-3rem)*0.343)]">
          <span className="max-md:block">Ca</span>fe
        </h1>

        <button
          type="button"
          onClick={() => scrollToAnchor("#menu")}
          aria-label="See the menu"
          className="cf-badge group absolute right-[2%] top-0 z-30 grid size-24 max-md:bottom-[16%] max-md:right-[4%] max-md:top-auto md:-translate-y-[55%] cursor-pointer place-items-center rounded-full bg-lime text-ink shadow-[0_20px_40px_-15px_rgb(0_15_15/0.7)] lg:size-36"
        >
          <svg viewBox="0 0 100 100" className="cf-badge-ring absolute inset-0 size-full" aria-hidden>
            <defs>
              <path id="cf-ring" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
            </defs>
            <text className="fill-current font-wide text-[9.4px] uppercase">
              <textPath href="#cf-ring">See the menu · See the menu ·</textPath>
            </text>
          </svg>
          <span aria-hidden className="text-2xl transition-transform duration-500 ease-out-expo group-hover:translate-y-1 lg:text-4xl">↓</span>
        </button>

        <div className="cf-hero-meta relative z-30 mt-4 flex items-end justify-between gap-6 text-sm">
          <p className="max-w-[16rem] leading-tight">
            Coffee. Culture.
            <br />
            <span className="hl">Conversation.</span>
          </p>
          <p className="text-right leading-tight text-bone/80">
            Samakhusi,
            <br />
            Kathmandu
          </p>
        </div>
      </div>

      {/* Handoff stage: the centre card's photo, full-bleed. */}
      <div aria-hidden className="cf-stage pointer-events-none invisible absolute inset-0 z-50 overflow-hidden bg-teal-deep">
        {/* Box is the whole photo at cover size (set in JS), so scaling it never crops it. */}
        <div className="cf-stage-img absolute left-1/2 top-1/2">
          <Image src={d.heroCards[MID].src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="cf-stage-shade absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-teal via-transparent to-teal/30" />
        </div>
      </div>
    </section>
  );
}
