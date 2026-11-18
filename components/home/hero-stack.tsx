"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "../logo-mark";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

const img = (name: string) => `/images/home/${name}.jpg`;

// Hero poster + copy for this scene lives here (not in content/site.ts).
const heroPoster = img("storefront-day");

// Layer 0: what the name means.
const meaning = [
  {
    word: "Farak",
    body: "Different. A name for our own way of living, creating and coming together.",
  },
  { word: "Chu", body: "I am. Together, Farak Chu means I am different." },
];

// The four domains, shown as the card wipe at the end of the scene.
const films = [
  {
    id: "entertainment",
    title: ["The rhythm of", "Music"],
    name: "Entertainment",
    blurb:
      "Live sessions, watch parties and nights people talk about the morning after.",
    no: "01",
    href: "/entertainment",
    logo: "/images/logo/logo-entertainment.jpg",
    focus: "50% 30%",
    image: {
      src: img("domain-entertainment"),
      alt: "Guitarist on a double-neck guitar under red stage lights",
    },
  },
  {
    id: "gamingzone",
    title: ["One more", "Game"],
    name: "Gaming Zone",
    blurb:
      "PS5s, big screens and brackets that get loud. One more game, always.",
    no: "02",
    href: "/gaming",
    logo: "/images/logo/logo-gamezone.jpg",
    focus: "50% 50%",
    image: {
      src: img("domain-gaming"),
      alt: "Players on the sofa in the neon-lit Farakchu gaming room",
    },
  },
  {
    id: "apparel",
    title: ["Wear the", "Difference"],
    name: "Apparel",
    blurb:
      "Limited drops in small runs, gone when they're gone. Including the official Nepal merch.",
    no: "03",
    href: "/apparel",
    logo: "/images/logo/logo-apparel.jpg",
    focus: "50% 8%",
    image: {
      src: img("domain-apparel"),
      alt: "Two models in Farakchu hoodies and caps",
    },
  },
  {
    id: "cafe",
    title: ["Pour, sit,", "Stay"],
    name: "Cafe",
    blurb:
      "Espresso, strawberry matcha, cold beer and long tables. A cafe, and a bar too.",
    no: "04",
    href: "/cafe",
    logo: "/images/logo/logo-cafe.jpg",
    focus: "50% 35%",
    image: {
      src: img("domain-cafe"),
      alt: "Guest with a drink inside the Farakchu cafe, brick wall and sign behind",
    },
  },
];

// About: rolls up like end credits.
const about = {
  heading:
    "We believe there's no single way to live, express, create or connect.",
  body: "Your interests make you unique. Your experiences shape your story. Your individuality is what makes you, you.\n\nAt Farakchu, we celebrate all of it. Because the world becomes a more interesting place when everyone brings something different.",
  image: {
    src: img("cafe-crowd"),
    alt: "Friends crowded together at a Farakchu night, cheering",
  },
};

// Rect clip anchored top/bottom. Width in % so panels can resize (hover split) after the reveal.
function rect(bh: number, h: number, anchor: "top" | "bottom") {
  const y = anchor === "top" ? -1 : bh - h + 1;
  return `polygon(-1px ${y - 1}px, calc(100% + 1px) ${y - 1}px, calc(100% + 1px) ${y + h + 1}px, -1px ${y + h + 1}px)`;
}

// Full rect (t=0) -> Farakchu diamond of radius r (t=1). Corners swing to the diamond points: TL->top, TR->right, BR->bottom, BL->left.
function diamond(bw: number, bh: number, t: number, r: number) {
  const cx = bw / 2;
  const cy = bh / 2;
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const pts = [
    [lerp(-1, cx), lerp(-1, cy - r)],
    [lerp(bw + 1, cx + r), lerp(-1, cy)],
    [lerp(bw + 1, cx), lerp(bh + 1, cy + r)],
    [lerp(-1, cx - r), lerp(bh + 1, cy)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
}

// Logo artboard: outer diamond points span ~96% of the 1080 box.
// Timeline layout of the tail of the scene (1 unit = 100vh).
// About copy rolls up like end credits from CREDITS_AT over CREDITS_LEN units (slow on purpose).
const CREDITS_AT = 3.3;
const CREDITS_LEN = 4.2;
// The film panels start wiping in the moment the last line of the credits leaves the frame.
const FILMS_AT = CREDITS_AT + CREDITS_LEN;
const FILMS_END = FILMS_AT + 3 * 0.08 + 0.8;

const markSize = (r: number) => (r * 2) / 0.963;

/**
 * One pinned scene (1 timeline unit = 100vh of scroll):
 * 0 hero folds into the Farakchu diamond (Farak/Chu spread out from centre) -> 1 shrinks to the logo, lettering lands, Farak/Chu close in beside it ->
 * 2 About photo fades in inside the diamond -> 2.5 diamond opens to full bleed, logo flies to the About heading ->
 * 3.3 About copy rolls up like end credits with the logo riding on top; the logo keeps climbing to the navbar and hands off to the fixed nav logo, the text rolls off the top -> 7.5 last line leaves the frame and the film panels wipe in straight away -> 8.54 pin releases (films then scroll away normally).
 * Nav offsets in components/nav.tsx depend on these positions.
 */
export function HeroStack() {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [hero] = q(".hs-hero") as HTMLElement[];
      const films = q(".hs-film") as HTMLElement[];
      const [mark] = q(".hs-mark") as HTMLElement[];
      const [slot] = q(".hs-slot") as HTMLElement[];
      const [credits] = q(".hs-credits") as HTMLElement[];
      const navLogo = document.querySelector<HTMLElement>("[data-nav-logo]");
      const [vv1, vv2] = q(".hs-vv") as HTMLElement[];

      // Toggle-played reveals, fired from timeline progress.
      const filmSplit = SplitText.create(q(".hs-film-heading"), {
        type: "lines",
        mask: "lines",
        linesClass: "line",
      });
      const filmHead = gsap.fromTo(
        filmSplit.lines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "power4.inOut",
          duration: 0.8,
          stagger: 0.05,
          paused: true,
        },
      );
      const filmBody = gsap.fromTo(
        q(".hs-film-body"),
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power4.inOut",
          duration: 1.5,
          delay: 0.5,
          paused: true,
        },
      );
      const toggle = (anim: gsap.core.Animation[], on: boolean) =>
        anim.forEach((a) => (on ? a.play() : a.reverse()));
      let filmsOn = false;

      gsap.set(q(".hs-bg"), { scale: 1.05 });
      // Centre via xPercent/yPercent (GSAP freezes CSS translate into px, which breaks once the mark resizes).
      gsap.set(mark, { xPercent: -50, yPercent: -50 });

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 992px)", mobile: "(max-width: 991px)" },
        (ctx) => {
          const desktop = ctx.conditions!.desktop;
          const box = {
            w: 0,
            h: 0,
            fh: [] as number[],
            cH: 0,
            slotC: 40,
            navY: 0,
            navS: 64,
          };
          const measure = () => {
            box.w = hero.offsetWidth;
            box.h = hero.offsetHeight;
            box.fh = films.map((f) => f.offsetHeight);
            // Credits block height, and where the logo's slot sits inside it (the logo rides on this slot).
            box.cH = credits.offsetHeight;
            box.slotC = slot.offsetTop + slot.offsetHeight / 2;
            // Navbar logo (fixed, viewport coords). The hero is pinned at the viewport top, so its centre sits at box.h / 2.
            if (navLogo) {
              const n = navLogo.getBoundingClientRect();
              box.navY = n.top + n.height / 2 - box.h / 2;
              box.navS = n.width;
            } else box.navY = 50 - box.h / 2;
          };
          measure();
          // Fixed nav logo stays hidden until the flying logo reaches it (visibility toggled in paint()).
          if (navLogo) navLogo.style.visibility = "hidden";

          const rFull = () => Math.min(box.h, box.w) * 0.5;
          const rLogo = () => Math.min(box.h * 0.34, box.w * 0.36);
          const m: Record<string, number> = {
            t: 0,
            r: rFull(),
            ms: markSize(rFull()),
            cy: box.h,
          };
          films.forEach((_, i) => (m[`f${i}`] = 0));
          // Perf: only touch the DOM when a value actually changed (each clip change repaints a full-screen layer).
          const last: Record<string, string | number> = {};
          const setIf = (
            key: string,
            v: string | number,
            apply: () => void,
          ) => {
            if (last[key] === v) return;
            last[key] = v;
            apply();
          };
          // Mark renders once at its largest size and is scaled on the GPU (resizing the traced SVG each frame was the main jank).
          const paint = () => {
            const base = Math.round(markSize(Math.max(box.h, box.w) * 0.5));
            setIf(
              "base",
              base,
              () => (mark.style.width = mark.style.height = `${base}px`),
            );
            const d = diamond(box.w, box.h, m.t, m.r);
            setIf("hero", d, () => (hero.style.clipPath = d));
            const sc = +(m.ms / base).toFixed(4);
            setIf("mark", sc, () => gsap.set(mark, { scale: sc }));
            // Credits roll; the logo sits at the screen centre until the slot reaches it, rides up with it, and stops at the navbar.
            setIf("cy", Math.round(m.cy), () =>
              gsap.set(credits, { y: Math.round(m.cy) }),
            );
            const rideY = m.cy + box.slotC - box.h / 2;
            const my = Math.round(Math.max(box.navY, Math.min(0, rideY)));
            setIf("my", my, () => gsap.set(mark, { y: my }));
            // Hand off to the fixed nav logo the moment the flying one reaches it.
            const docked = rideY <= box.navY ? 1 : 0;
            setIf("dock", docked, () => {
              mark.style.visibility = docked ? "hidden" : "visible";
              if (navLogo)
                navLogo.style.visibility = docked ? "visible" : "hidden";
            });
            // Panels wipe in alternately from the top and from the bottom.
            films.forEach((f, i) => {
              const c = rect(box.fh[i], m[`f${i}`], i % 2 ? "bottom" : "top");
              setIf(`f${i}`, c, () => (f.style.clipPath = c));
            });
          };
          ScrollTrigger.addEventListener("refreshInit", measure);
          paint();

          const rem = () =>
            parseFloat(getComputedStyle(document.documentElement).fontSize);
          // x offsets for a Farak/Chu column (layout position via offsetLeft, so current transforms don't skew it).
          const middle = (el: HTMLElement) =>
            box.w / 2 - el.offsetWidth / 2 - el.offsetLeft;
          const beside = (el: HTMLElement, side: 1 | -1) =>
            side === 1
              ? box.w / 2 -
                rLogo() -
                3 * rem() -
                (el.offsetLeft + el.offsetWidth)
              : box.w / 2 + rLogo() + 3 * rem() - el.offsetLeft;

          // Panel wipe (timeline FILMS_AT-FILMS_END): once scrolling goes idle mid-wipe, glide to its end (or back to its start when scrolling up).
          // Own idle detector instead of ScrollTrigger snap: snap fires too early under ScrollSmoother's wheel lag and never finishes.
          let idle = 0;
          let glide: gsap.core.Tween | undefined;
          const settle = (self: ScrollTrigger) => {
            if (glide?.isActive()) return;
            clearTimeout(idle);
            idle = window.setTimeout(() => {
              const d = tl.duration();
              const [a, b] = [FILMS_AT / d, FILMS_END / d];
              const p = self.progress;
              if (p <= a + 0.002 || p >= b - 0.002) return;
              const y =
                self.start +
                (self.direction === -1 ? a : b) * (self.end - self.start);
              glide = gsap.to(window, {
                scrollTo: { y },
                duration: 0.9 + (1.2 * Math.abs(y - scrollY)) / innerHeight,
                ease: "power2.inOut",
                overwrite: true,
              });
            }, 160);
          };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => {
              paint();
              const time = tl.time();
              if (time > FILMS_AT + 0.4 !== filmsOn)
                toggle([filmHead, filmBody], (filmsOn = time > FILMS_AT + 0.4));
            },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: `+=${FILMS_END * 100}%`,
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => settle(self),
              onRefresh: (self) => {
                self.animation?.progress(self.progress);
                paint();
              },
            },
          });

          // 0-1: fold into the diamond
          tl.fromTo(
            m,
            { t: 0, r: () => rFull() },
            { duration: 1, t: 1, ease: "power2.inOut" },
            0,
          )
            .to(q(".hs-bg"), { duration: 1, scale: 1 }, 0)
            // Heading holds until the logo arrives, then cross-fades with it (1.5-2).
            .to(q(".hs-heading"), { duration: 0.5, opacity: 0 }, 1.5)
            .to(q(".hs-first"), { duration: 0.98, x: desktop ? 100 : 10 }, 0.02)
            .to(
              q(".hs-third"),
              { duration: 0.98, x: desktop ? -100 : -10 },
              0.02,
            )
            // 1-2: shrink to the logo, lettering lands
            .fromTo(
              m,
              { r: () => rFull(), ms: () => markSize(rFull()) },
              {
                duration: 1,
                r: () => rLogo(),
                ms: () => markSize(rLogo()),
                ease: "power2.inOut",
              },
              1,
            )
            .fromTo(mark, { opacity: 0 }, { duration: 0.5, opacity: 1 }, 1.5);
          // Farak / Chu: start at the centre, spread out as the diamond forms (0-1),
          // then close in beside the logo (1-2): (Farak) (logo) (Chu).
          if (desktop)
            (
              [
                [vv1, 1],
                [vv2, -1],
              ] as [HTMLElement, 1 | -1][]
            ).forEach(([el, side]) =>
              tl
                .fromTo(
                  el,
                  { x: () => middle(el) },
                  { duration: 1, x: 0, ease: "power2.inOut" },
                  0,
                )
                .to(
                  el,
                  {
                    duration: 1,
                    x: () => beside(el, side),
                    ease: "power2.inOut",
                  },
                  1,
                ),
            );

          // 2-2.5: About photo inside the diamond
          tl.to(q(".hs-about-bg"), { duration: 0.5, opacity: 1 }, 2)
            // 2.5-3.5: open to full bleed, logo flies to the heading
            .to(
              m,
              { duration: 1, t: 0, ms: () => box.navS, ease: "power2.inOut" },
              2.5,
            )
            .to(q(".hs-about-tint"), { duration: 1, opacity: 0.68 }, 2.5)
            // Photo drifts up slowly with the credits (scale leaves margin so the bottom edge never shows).
            .fromTo(
              q(".hs-about-photo"),
              { scale: 1.25, yPercent: 0 },
              {
                duration: CREDITS_AT + CREDITS_LEN - 2.5,
                scale: 1.14,
                yPercent: -6,
              },
              2.5,
            )
            // Credits roll: from below the screen to off the top, linear so it reads as a slow crawl.
            .fromTo(
              m,
              { cy: () => box.h },
              { duration: CREDITS_LEN, cy: () => -box.cH, ease: "none" },
              CREDITS_AT,
            );
          // FILMS_AT: the four domain panels wipe in over About, staggered
          films.forEach((_, i) =>
            tl.fromTo(
              m,
              { [`f${i}`]: 0 },
              {
                duration: 0.8,
                [`f${i}`]: () => box.fh[i] + 1,
                immediateRender: false,
              },
              FILMS_AT + i * 0.08,
            ),
          );
          tl.fromTo(
            films,
            { pointerEvents: "none" },
            { pointerEvents: "auto", duration: 0 },
            FILMS_AT + 0.8,
          ).to({}, { duration: 0.2 }, FILMS_AT + 0.8);

          return () => {
            if (navLogo) navLogo.style.visibility = "";
            clearTimeout(idle);
            glide?.kill();
            ScrollTrigger.removeEventListener("refreshInit", measure);
            gsap.set([hero, ...films], { clearProps: "clipPath" });
          };
        },
      );

      // Lime "Explore" badge follows the pointer inside each panel (desktop).
      const offs: (() => void)[] = [];
      films.forEach((film) => {
        const badge = film.querySelector<HTMLElement>(".hs-cursor");
        if (!badge) return;
        gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0 });
        const x = gsap.quickTo(badge, "x", {
          duration: 0.3,
          ease: "power3.out",
        });
        const y = gsap.quickTo(badge, "y", {
          duration: 0.3,
          ease: "power3.out",
        });
        const move = (e: PointerEvent) => {
          const r = film.getBoundingClientRect();
          x(e.clientX - r.left);
          y(e.clientY - r.top);
        };
        const enter = (e: PointerEvent) => {
          const r = film.getBoundingClientRect();
          gsap.set(badge, { x: e.clientX - r.left, y: e.clientY - r.top });
          gsap.to(badge, { scale: 1, duration: 0.5, ease: "back.out(2)" });
        };
        const leave = () =>
          gsap.to(badge, { scale: 0, duration: 0.3, ease: "power2.in" });
        film.addEventListener("pointermove", move);
        film.addEventListener("pointerenter", enter);
        film.addEventListener("pointerleave", leave);
        offs.push(
          () => (
            film.removeEventListener("pointermove", move),
            film.removeEventListener("pointerenter", enter),
            film.removeEventListener("pointerleave", leave)
          ),
        );
      });
      gsap.set(films, { pointerEvents: "none" });

      // After the pin: films darken + drift as the next section scrolls in.
      // Trigger is whatever section follows (not a hard-coded id): a missing trigger makes the tween run at once and tints the whole hero.
      const next = root.current?.nextElementSibling;
      if (next) {
        const trigger = {
          trigger: next,
          start: "top bottom",
          end: "top top",
          scrub: true,
        };
        gsap.to(q(".hs-films-overlay"), {
          opacity: 0.85,
          ease: "none",
          scrollTrigger: trigger,
        });
        gsap.to(q(".hs-film-img"), {
          yPercent: 15,
          ease: "none",
          scrollTrigger: trigger,
        });
      }

      return () => {
        offs.forEach((off) => off());
        filmSplit.revert();
      };
    },
    { scope: root },
  );

  const [m1, m2] = meaning;
  const words = about.heading.split(" ");
  const aboutType =
    "font-wide max-w-[30ch] text-center text-[1.3rem] leading-[1.05] md:text-[2.275rem] lg:text-[2.925rem]";

  return (
    <div ref={root} id="top" className="relative grid h-svh overflow-hidden">
      {/* Layer 0: meaning */}
      <section
        id="vv"
        className="relative flex h-svh items-center justify-between bg-teal px-4 text-bone [grid-area:1/1] md:px-8 max-lg:flex-col max-lg:py-24"
      >
        {[m1, m2].map((m, i) => (
          <div
            key={m.word}
            className={`hs-vv flex w-[15rem] flex-col gap-4 lg:w-[20rem] ${i ? "max-lg:ml-auto" : "max-lg:mr-auto"}`}
          >
            <h2
              data-heading
              className="font-azonix text-[3rem] leading-none tracking-[0.2em] lg:text-[4.25rem]"
            >
              {m.word}
            </h2>
            <p
              data-body
              className="text-justify text-[0.8125rem] uppercase leading-[1.2] [0.025rem]"
            >
              {m.body}
            </p>
          </div>
        ))}
      </section>

      {/* Layer 1: hero -> diamond -> About */}
      <section className="hs-hero relative z-[1] h-svh overflow-hidden bg-teal [grid-area:1/1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
          aria-hidden="true"
          className="hs-bg absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
        </video>

        <div
          id="about"
          className="hs-about-bg absolute inset-0 z-[1] opacity-0"
        >
          <div className="hs-about-photo absolute inset-0">
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              sizes="100vw"
              className="object-cover object-[50%_72%]"
            />
          </div>
          <div className="hs-about-tint absolute inset-0 bg-teal-deep opacity-0" />
          <div className="hs-credits absolute inset-x-0 top-0 flex flex-col items-center gap-8 px-4 text-bone will-change-transform lg:px-8">
            {/* The flying logo rides on this slot. */}
            <div className="hs-slot size-16 lg:size-20" aria-hidden />
            <h2 className={aboutType}>
              {words.map((w, i) => {
                const hl = /^(lifestyle|hospitality)$/i.test(w);
                return (
                  <span key={i}>
                    {hl ? <span className="hl">{w}</span> : w}{" "}
                  </span>
                );
              })}
            </h2>
            {/* Body copy set at the same size as the heading, with its own highlighted words. */}
            <div className="flex flex-col gap-8">
              {about.body.split("\n\n").map((paragraph) => (
                <p key={paragraph} className={aboutType}>
                  {paragraph.split(" ").map((w, i) => {
                    const m = w.match(/^(.*?)([.,;:!?]*)$/)!;
                    return (
                      <span key={i}>
                        {/^(unique|individuality|different)$/i.test(m[1]) ? (
                          <>
                            <span className="hl">{m[1]}</span>
                            {m[2]}
                          </>
                        ) : (
                          w
                        )}{" "}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          </div>
        </div>

        <LogoMark solid="#000" className="hs-mark pointer-events-none absolute left-1/2 top-1/2 z-[3] text-bone opacity-0 will-change-transform" />

        {/* data-hero lives on this wrapper, not the h1: the scroll timeline owns the h1's opacity and would overwrite the preloader's reveal on refresh. */}
        <div
          data-hero
          className="relative z-[2] flex h-full flex-col items-center justify-center px-4 py-4 text-bone lg:px-8 lg:py-8"
        >
          <h1 className="hs-heading flex flex-col items-center gap-[0.06em] text-center font-wide text-[8vw] leading-[0.95] lg:text-[4.5rem]">
            <span>The</span>
            <span>Art Of</span>
            <span className="block whitespace-nowrap text-center">
              <span className="hl">Difference</span>
            </span>
          </h1>
        </div>
      </section>

      {/* Layer 2: film panels */}
      <section
        id="films"
        className="hs-films relative z-[2] flex h-svh [grid-area:1/1] max-lg:flex-col"
      >
        <div className="hs-films-overlay pointer-events-none absolute inset-0 z-[6] bg-teal-deep opacity-0" />
        {films.map((f, i) => {
          const on = hover === i;
          const off = hover !== null && !on;
          return (
            <a
              key={f.id}
              href={f.href}
              aria-label={`${f.name}: ${f.blurb}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`hs-film group relative block min-h-0 w-full flex-1 overflow-hidden px-4 py-4 text-bone [clip-path:polygon(0_0,0_0,0_0,0_0)] lg:w-auto lg:min-w-0 lg:flex-none lg:basis-0 lg:cursor-none lg:px-6 lg:pb-8 lg:pt-[5.25rem] lg:transition-[flex-grow] lg:duration-[900ms] lg:ease-out-expo ${
                on ? "lg:grow-[11]" : off ? "lg:grow-[3]" : "lg:grow-[5]"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={f.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 992px) 55vw, 100vw"
                  style={{ objectPosition: f.focus }}
                  className={`hs-film-img origin-top object-cover transition-[filter,scale] duration-[900ms] ease-out-expo ${on ? "scale-[1.04]" : ""} ${off ? "brightness-[0.45]" : ""}`}
                />
              </div>
              <div
                className={`absolute inset-0 z-[2] bg-teal/20 mix-blend-multiply transition-opacity duration-700 ${on ? "opacity-0" : ""}`}
              />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-teal-deep/95 via-teal-deep/40 via-35% to-transparent to-60%" />
              {i < films.length - 1 && (
                <span className="absolute inset-y-0 right-0 z-[5] hidden w-px bg-bone/20 lg:block" />
              )}

              {/* Collapsed state: name runs up the spine */}
              <span
                className={`pointer-events-none absolute bottom-8 left-1/2 z-[3] hidden origin-center -translate-x-1/2 whitespace-nowrap font-wide text-[clamp(1.5rem,2.4vw,2.5rem)] [writing-mode:vertical-rl] rotate-180 transition-opacity duration-500 lg:block ${
                  off ? "opacity-100 delay-200" : "opacity-0"
                }`}
              >
                {f.name}
              </span>

              <div
                className={`relative z-[3] flex h-full flex-col justify-end transition-opacity duration-300 ${off ? "lg:opacity-0" : ""}`}
              >
                {/* Division badge + number, kept clear of the fixed nav */}
                <div className="mb-4 flex items-center gap-3 lg:mb-6">
                  <Image
                    src={f.logo}
                    alt=""
                    width={56}
                    height={56}
                    className="size-9 rounded-full object-cover ring-1 ring-bone/30 lg:size-12"
                  />
                  <span className="font-wide text-[0.625rem] text-bone/95">
                    {f.no}
                  </span>
                </div>
                <h3 className="hs-film-heading whitespace-nowrap font-serif text-[2rem] leading-[1] lg:text-[clamp(2.4rem,3.4vw,4.5rem)]">
                  <span className="block">{f.title[0]}</span>
                  <span className="mt-1.5 block">
                    <span className="hl font-wide text-[0.82em]">
                      {f.title[1]}
                    </span>
                  </span>
                </h3>
                <div
                  className={`hs-film-body mt-4 flex items-end justify-between gap-4 border-t border-bone/20 pt-4 lg:mt-6 lg:pt-5`}
                >
                  <p
                    className={`max-w-[19rem] text-justify text-[0.8125rem] uppercase leading-[1.25] [0.025rem] text-bone/95 transition-[opacity,max-height] duration-500 max-lg:line-clamp-2 lg:text-xs ${hover === null || on ? "" : "lg:opacity-0"}`}
                  >
                    {f.blurb}
                  </p>
                  <span className="shrink-0 rounded-[50%] bg-lime px-5 py-2.5 font-wide text-[0.625rem] text-ink lg:hidden">
                    Explore
                  </span>
                </div>
              </div>

              <span className="hs-cursor pointer-events-none absolute left-0 top-0 z-[7] hidden size-28 place-items-center rounded-full bg-lime text-center font-wide text-[0.625rem] leading-tight text-ink lg:grid">
                {f.name}
                <br />↗
              </span>
            </a>
          );
        })}
      </section>
    </div>
  );
}
