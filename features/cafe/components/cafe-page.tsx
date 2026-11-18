"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Nav, scrollToAnchor } from "@/components/nav";
import { Reveals } from "@/components/reveals";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/home/footer";
import { CafeHero } from "./cafe-hero";
import { PourSequence } from "./pour-sequence";
import { cafePage as d, menuColumns } from "@/features/cafe/data";

gsap.registerPlugin(ScrollTrigger);

// Pills match the rest of the site: lime on teal, teal on bone.
const pillLime = "inline-flex min-h-11 items-center justify-center rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] leading-none text-ink transition-colors hover:bg-bone";
const pillTeal = "inline-flex min-h-11 items-center justify-center rounded-[50%] bg-teal px-8 py-3 font-wide text-[0.625rem] leading-none text-lime transition-colors hover:bg-lime hover:text-ink";

// Hand-drawn divider, drawn on scroll.
const Wave = ({ className = "" }: { className?: string }) => (
  <svg className={`cf-wave block h-3 w-full ${className}`} viewBox="0 0 1400 12" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path pathLength={1} strokeDasharray={1} d="M0 7C80 3 150 10 260 6S420 2 560 7 760 10 900 5s240-3 330 2 130 1 170-1" />
  </svg>
);

const Cup = ({ className = "" }: { className?: string }) => (
  <svg className={`cf-doodle ${className}`} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path pathLength={1} strokeDasharray={1} d="M10 32h44v8a22 22 0 0 1-22 22 22 22 0 0 1-22-22zM54 36h5a8 8 0 0 1 0 16h-7M24 8c-4 6 4 8 0 14M37 8c-4 6 4 8 0 14" />
  </svg>
);

export function CafePage() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  // Arrows step the matcha carousel by one card.
  const step = (dir: number) => {
    const t = track.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (t && card) t.scrollBy({ left: dir * (card.offsetWidth + parseFloat(getComputedStyle(t).columnGap || "0")), behavior: "smooth" });
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // The menu sits on a bone band: flip the nav to ink while it is under the bar.
      ScrollTrigger.create({
        trigger: q(".cf-menu")[0],
        start: "top 50px",
        end: "bottom 50px",
        onToggle: (s) => document.querySelector("[data-nav]")?.classList.toggle("nav-ink", s.isActive),
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Dividers and doodles draw themselves.
        q(".cf-wave path, .cf-doodle path").forEach((p) =>
          gsap.from(p, { strokeDashoffset: 1, duration: 1.8, ease: "power2.inOut", scrollTrigger: { trigger: p, start: "top 90%", once: true } }),
        );

        // Menu: groups rise in column by column.
        q(".cf-col").forEach((col) =>
          gsap.from(gsap.utils.selector(col)(".cf-group"), { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: col, start: "top 82%", once: true } }),
        );
        gsap.from(q(".cf-menu-photo"), { clipPath: "inset(0 0 100% 0)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: q(".cf-menu-photo")[0], start: "top 85%", once: true } });

        // Banner + split images drift against the scroll.
        gsap.fromTo(q(".cf-banner-img"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: q(".cf-banner")[0], start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(q(".cf-mcard"), { y: 70, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: q(".cf-matcha")[0], start: "top 80%", once: true } });

        // Pour cards + feed posts.
        gsap.from(q(".cf-pour"), { y: 70, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: q(".cf-pours")[0], start: "top 80%", once: true } });
        gsap.from(q(".cf-post"), { y: 60, autoAlpha: 0, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: q(".cf-feed")[0], start: "top 75%", once: true } });
      });

      return () => {
        mm.revert();
        document.querySelector("[data-nav]")?.classList.remove("nav-ink");
      };
    },
    { scope: root },
  );

  return (
    <>
      <Nav page="sub" />
      <SmoothScroll>
        <main ref={root}>
          <CafeHero />

          {/* INTRO */}
          <section className="relative px-4 pb-16 pt-14 lg:px-6 lg:pb-24 lg:pt-20">
            <div className="grid gap-10 lg:grid-cols-2">
              <h1 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05]">
                A cafe. And a <span className="hl">bar, too.</span>
              </h1>
              <div className="max-w-[34rem] lg:pt-3">
                <p data-body className="text-base leading-relaxed text-bone/85 md:text-lg">{d.intro}</p>
                <div data-body className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={() => scrollToAnchor("#menu")} className={pillLime}>See the menu</button>
                  <a href={d.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-[50%] border border-bone/40 px-8 py-3 font-wide text-[0.625rem] leading-none text-bone transition-colors hover:border-lime hover:text-lime">
                    @farakchu.cafe
                  </a>
                </div>
              </div>
            </div>
            <Cup className="pointer-events-none absolute bottom-6 left-1/2 hidden size-24 -translate-x-1/2 text-lime lg:block" />
            <Wave className="mt-16 text-bone/35 lg:mt-24" />
          </section>

          <PourSequence />

          {/* MENU (bone band, like the printed menu) */}
          <section id="menu" className="cf-menu bg-bone px-4 py-20 text-ink lg:px-6 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[24%_1fr] lg:gap-10">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <h2 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.1] text-teal">Explore our menu</h2>
                <p data-body className="mt-5 max-w-[22rem] text-base leading-snug text-ink/80">{d.menuIntro}</p>
                <div className="cf-menu-photo relative mt-8 hidden aspect-[3/4] w-full overflow-hidden bg-teal lg:block">
                  <Image src={d.menuImage.src} alt={d.menuImage.alt} fill sizes="24vw" className="object-cover" />
                </div>
                <a data-body href={d.pdf} target="_blank" rel="noreferrer" className={`${pillTeal} mt-8`}>Menu PDF</a>
              </aside>

              <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                {menuColumns.map((col, i) => (
                  <div key={i} className="cf-col flex flex-col gap-12">
                    {col.map((group) => (
                      <div key={group.title} className="cf-group">
                        <h3 className="border-b-2 border-teal pb-2 font-sans font-semibold tracking-[-0.02em] text-base leading-none text-teal">{group.title}</h3>
                        <ul className="mt-4">
                          {group.items.map((it) => (
                            <li key={it.name} className="flex items-baseline gap-3 border-b border-dotted border-ink/25 py-2">
                              <span className="flex-1 text-[0.8125rem] font-semibold uppercase leading-tight tracking-[0.01em]">
                                {it.name}
                                {it.note && <span className="mt-0.5 block font-mono text-[0.65rem] font-normal normal-case text-ink/60">{it.note}</span>}
                              </span>
                              <span className="font-mono text-sm tabular-nums text-teal">{it.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-14 font-mono text-[0.65rem] uppercase text-ink/60">Prices in Rs. Menu may change.</p>
          </section>

          {/* BANNER */}
          <section className="cf-banner relative flex h-[85svh] min-h-[32rem] items-end overflow-hidden">
            <div className="cf-banner-img absolute inset-[-10%] will-change-transform">
              <Image src={d.banner.src} alt={d.banner.alt} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-teal via-teal/50 to-teal/10" />
            <div className="relative max-w-[44rem] px-4 pb-12 lg:px-6 lg:pb-16">
              <h2 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.1]">{d.banner.title}</h2>
              <p data-body className="mt-5 text-base leading-relaxed text-bone md:text-lg">{d.banner.kicker}</p>
              <p data-body className="mt-3 max-w-[34rem] text-sm leading-snug text-bone/80">{d.banner.body}</p>
            </div>
          </section>

          {/* MATCHA CAROUSEL: one card per flavour, swipe or use the arrows. */}
          <section className="cf-matcha relative overflow-hidden py-20 lg:py-28">
            <div className="px-4 lg:px-6">
              <Wave className="mb-16 text-bone/35 lg:mb-20" />
              <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-[34rem]">
                  <h2 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.1]">{d.matcha.title}</h2>
                  <p data-body className="mt-5 text-base leading-snug text-bone/85">{d.matcha.body}</p>
                </div>
                <div className="flex items-center gap-2">
                  {([-1, 1] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => step(dir)}
                      aria-label={dir < 0 ? "Previous matcha" : "Next matcha"}
                      className="grid size-12 cursor-pointer place-items-center rounded-full border border-bone/30 text-lg transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                    >
                      {dir < 0 ? "←" : "→"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* ponytail: native scroll-snap carousel, no library. */}
            <ul
              ref={track}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scroll-px-4 px-4 pb-4 [scrollbar-width:none] lg:scroll-px-6 lg:gap-5 lg:px-6 [&::-webkit-scrollbar]:hidden"
            >
              {d.matcha.list.map((m, i) => (
                <li key={m.name} className="cf-mcard w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-[27vw]">
                  <button type="button" onClick={() => scrollToAnchor("#menu")} aria-label={`${m.name}: see the menu`} className="group block w-full cursor-pointer text-left">
                    <div className="relative aspect-[4/5] overflow-hidden bg-teal-soft">
                      <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width:1024px) 27vw, (min-width:640px) 44vw, 72vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                      <span className="absolute left-3 top-3 rounded-full bg-teal/80 px-2.5 py-1 font-mono text-[0.625rem] text-bone backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="mt-3 flex items-baseline justify-between gap-3 text-sm uppercase">
                      <span className="font-semibold transition-colors group-hover:text-lime">{m.name}</span>
                      <span aria-hidden className="text-bone/60 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </p>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 lg:px-6">
              <a data-body href={d.instagram} target="_blank" rel="noreferrer" className={`${pillLime} mt-8`}>Ask for matcha</a>
            </div>
          </section>

          {/* SIGNATURE POURS */}
          <section className="px-4 pb-20 lg:px-6 lg:pb-28">
            <Wave className="mb-16 text-bone/35 lg:mb-20" />
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.1]">Signature pours</h2>
              <button type="button" onClick={() => scrollToAnchor("#menu")} className={pillLime}>Full menu</button>
            </div>
            <ul className="cf-pours grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5">
              {d.pours.map((p) => (
                <li key={p.name} className="cf-pour">
                  <button type="button" onClick={() => scrollToAnchor("#menu")} aria-label={`${p.name}, Rs ${p.price}: see the menu`} className="group block w-full cursor-pointer text-left">
                    <div className="relative aspect-[4/5] overflow-hidden bg-teal-soft">
                      <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width:1024px) 24vw, 46vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                    </div>
                    <p className="mt-3 flex items-baseline justify-between gap-3 text-sm uppercase">
                      <span className="font-semibold transition-colors group-hover:text-lime">{p.name}</span>
                      <span className="font-mono text-bone/70">{p.price}</span>
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* FEED */}
          <section className="cf-feed px-4 pb-24 lg:px-6 lg:pb-32">
            <Wave className="mb-16 text-bone/35 lg:mb-20" />
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr_1.2fr] lg:gap-6">
              <div className="max-w-[22rem]">
                <h2 data-heading className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.1]">{d.feed.title}</h2>
                <p data-body className="mt-5 text-base leading-snug text-bone/85">{d.feed.body}</p>
                <a data-body href={d.instagram} target="_blank" rel="noreferrer" className={`${pillLime} mt-8`}>Follow us</a>
              </div>
              {d.feed.posts.map((p) => (
                <a key={p.src} href={d.instagram} target="_blank" rel="noreferrer" className="cf-post group relative block aspect-[4/5] overflow-hidden bg-teal-soft">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                </a>
              ))}
            </div>
          </section>
        </main>
        <Footer />
        <Reveals />
      </SmoothScroll>
    </>
  );
}
