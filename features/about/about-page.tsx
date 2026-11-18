"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/home/footer";
import { NeonSign } from "./neon-sign";
import { divisions, gallery, guests, site, visit } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const G = "bg-gradient-to-br from-lime to-bone bg-clip-text text-transparent";
const BLUR = "blur(14px)";
const statement =
  "There is no one way to be you. So we made a cafe for the quiet ones, a stage for the loud ones, a gaming zone for the competitive ones and a label for anyone who wants to wear it. [[Nobody here has to fit in.]]";

const steps = [
  { t: "Come as you are", b: "No dress code, no type. Walk in the way you walked in yesterday." },
  { t: "Find your room", b: "Coffee, a match, a live set or a controller. Pick the one that feels like you." },
  { t: "Wear it out", b: "Limited apparel in small runs, so what you wear is as different as you are." },
];

// Every word is its own span so it can animate. [[phrase]] gets the home-page lime highlight.
const Words = ({ text, cls = "", wc = "ab-w" }: { text: string; cls?: string; wc?: string }) => (
  <>
    {text.split(/(\[\[.*?\]\])/).map((part, k) => {
      const hl = part.startsWith("[[");
      const words = (hl ? part.slice(2, -2) : part).split(" ").filter(Boolean);
      const spans = words.map((w, i) => (
        <span key={i} className={`${wc} inline-block ${hl ? "" : cls}`}>
          {w}
          {!hl || i < words.length - 1 ? "\u00a0" : ""}
        </span>
      ));
      return hl ? (
        <span key={k} className="hl">{spans}</span>
      ) : (
        <span key={k}>{spans}</span>
      );
    })}
    {" "}
  </>
);

export function AboutPage() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lenis = new Lenis({ lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Hero: the portrait pulls into focus, the headline rises out of blur.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q(".ab-fig"), { autoAlpha: 0, scale: 1.12, filter: "blur(28px)", duration: 2.2, ease: "power2.out" }, 0)
          .from(q(".ab-h1 .ab-w"), { y: 50, autoAlpha: 0, filter: BLUR, duration: 1.3, stagger: 0.1 }, 0.2)
          .from(q(".ab-hero-in"), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.9);

        // Section headings: blur to sharp, word by word.
        q(".ab-head").forEach((el) => {
          gsap.from(gsap.utils.selector(el)(".ab-w"), {
            y: 30, autoAlpha: 0, filter: BLUR, duration: 1.1, stagger: 0.07, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        q(".ab-fade, .ab-card").forEach((el) => {
          gsap.from(el, {
            y: 28, autoAlpha: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Rule lines draw across before their column text lands.
        q(".ab-rule").forEach((el) => {
          gsap.from(el, {
            scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        // Statement: words light up with the scroll.
        gsap.fromTo(
          q(".ab-sw"),
          { opacity: 0.15, filter: "blur(6px)" },
          {
            opacity: 1, filter: "blur(0px)", ease: "none", stagger: 0.12,
            scrollTrigger: { trigger: q(".ab-statement")[0], start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );

        q(".ab-par").forEach((el) => {
          gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // Photo strip drifts sideways against the scroll.
        gsap.fromTo(
          q(".ab-strip"),
          { xPercent: 4 },
          { xPercent: -14, ease: "none", scrollTrigger: { trigger: q(".ab-gallery")[0], start: "top bottom", end: "bottom top", scrub: true } },
        );

        // Neon sign stutters on like a real tube warming up.
        gsap.fromTo(q(".ab-neon"), { opacity: 0 }, {
          keyframes: { opacity: [0, 0.9, 0.1, 0, 1, 0.3, 1, 0.75, 1] }, duration: 1.6, ease: "none",
          scrollTrigger: { trigger: q(".ab-neon")[0], start: "top 75%", once: true },
        });

        // Steps: the progress line fills as the section passes.
        gsap.fromTo(
          q(".ab-line"),
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left", ease: "none", scrollTrigger: { trigger: q(".ab-steps")[0], start: "top 75%", end: "bottom 60%", scrub: true } },
        );

        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="bg-teal text-bone">
      <Nav page="sub" />

      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-14 pt-40 md:px-[6.5vw]">
        <div
          className="ab-fig pointer-events-none absolute inset-y-0 right-0 w-full md:w-[42%]"
          style={{ maskImage: "linear-gradient(to right, transparent, #000 30%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 30%)" }}
        >
          <Image src="/images/home/domain-entertainment.jpg" alt="Guitarist playing a double-neck guitar under red stage light at Farakchu" fill priority sizes="42vw" className="object-cover object-[50%_28%] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal via-transparent to-teal/60" />
        </div>

        <h1 className="ab-h1 relative z-10 font-sans text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          <span className="block"><Words text="Farak Chu." cls={G} /></span>
          <span className="block"><Words text="I am [[different.]]" cls={G} /></span>
        </h1>

        <p className="ab-hero-in relative z-10 mt-8 max-w-md text-base leading-relaxed text-bone/70 md:text-lg">
          Farakchu is a concept before it is a place. You do not have to be like everyone. You are you because you are different. Ma farak chu: I am different.
        </p>
        <ul className="ab-hero-in relative z-10 mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-bone/60">
          {["Ma farak chu", "Be yourself", "Samakhusi", "Kathmandu"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-lime" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Meaning */}
      <section className="px-5 py-24 text-center md:px-[6.5vw] md:py-32">
        <NeonSign className="mx-auto w-[min(72vw,22rem)]" />
        <p className="ab-fade mt-6 font-mono text-sm text-bone/60">ma farak chu</p>
        <div className="mx-auto mt-16 grid max-w-4xl gap-14 text-left md:grid-cols-2 md:gap-20">
          <div className="ab-fade border-t border-bone/25 pt-6">
            <h2 className="font-sans text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Ma</h2>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-bone/75">Me. Not a copy of anyone, not a version of the person next to you.</p>
          </div>
          <div className="ab-fade border-t border-bone/25 pt-6">
            <h2 className="font-sans text-2xl font-semibold tracking-[-0.02em] md:text-3xl"><span className="hl">Farak chu</span></h2>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-bone/75">Am different. Said with your chest, and meant as a compliment.</p>
          </div>
        </div>
      </section>

      {/* The window */}
      <section className="px-5 pb-28 md:px-[6.5vw] md:pb-32">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="ab-fade relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] md:sticky md:top-28">
              <Image src="/images/home/storefront-day.jpg" alt="Farakchu storefront in daylight, window lettering visible" fill sizes="40vw" className="object-cover" />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="ab-head font-sans text-[clamp(1.75rem,2.8vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
              <Words text="Different is not a problem to fix. It is [[the whole point.]]" />
            </h2>
            <p className="ab-fade mt-10 font-sans text-xl font-medium leading-snug md:text-2xl text-bone">
              “There is no one way to be you.”
            </p>
            <p className="ab-fade mt-4 font-sans text-xl font-medium leading-snug md:text-2xl text-bone/60">
              “Please come in.” It is written on our window.
            </p>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-bone/70 md:text-lg">
              <p className="ab-fade">Farakchu is for the person who never quite fit the mould, and stopped trying a while ago. It is a feeling first. The cafe, the screens, the stage and the hoodies are just where that feeling lives in Samakhusi.</p>
              <p className="ab-fade">The singer, the gamer, the one in the hoodie nobody else owns, the one who only came for a quiet matcha. Same door, and nobody is asked to be the same.</p>
              <p className="ab-fade">So we built four rooms, because one way of being you was never going to be enough.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Four divisions */}
      <section className="px-5 pb-28 md:px-[6.5vw] md:pb-32">
        <h2 className="ab-head font-sans text-[clamp(1.75rem,2.8vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-center md:mx-auto md:max-w-[52rem]">
          <Words text="One place, [[four ways to be different.]]" />
        </h2>
        <div className="ab-cards mt-16 grid gap-x-6 gap-y-14 md:grid-cols-4 md:gap-x-8">
          {divisions.map((d, i) => (
            <a
              key={d.id}
              href={d.href}
              target="_blank"
              rel="noreferrer"
              style={{ perspective: "1200px" }}
              className={`ab-card group block ${["md:mt-0", "md:mt-16", "md:mt-6", "md:mt-24"][i]}`}
            >
              <div className="relative">
                {/* back plate gives the card a second layer */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-sm border border-bone/20 transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5" />
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1">
                  <div className="ab-par absolute -inset-y-[10%] inset-x-0">
                    <Image src={d.image.src} alt={d.image.alt} fill sizes="(min-width:768px) 22vw, 90vw" className="object-cover saturate-[0.85] transition duration-700 group-hover:scale-105 group-hover:saturate-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-teal/90 via-transparent to-transparent" />
                  <h3 className="absolute inset-x-0 bottom-0 p-5 font-sans text-xl font-semibold tracking-tight">{d.name}</h3>
                </div>
              </div>
              <p className="mt-8 max-w-[18rem] text-base leading-snug text-bone/80">{d.line}</p>
              <p className="mt-3 flex flex-wrap gap-x-3 font-mono text-xs text-bone/45">{d.tags.map((t) => <span key={t}>{t}</span>)}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-5 py-28 md:px-[6.5vw] md:py-32">
        <p className="ab-statement max-w-5xl font-sans text-[clamp(1.4rem,2.4vw,2.25rem)] leading-[1.35] tracking-[-0.015em]">
          <Words text={statement} wc="ab-sw" />
        </p>
      </section>

      {/* Gallery strip */}
      <section className="ab-gallery overflow-hidden pb-24 md:pb-40">
        <div className="ab-strip flex w-[130%] gap-4 md:gap-6">
          {gallery.map((g, i) => (
            <div key={i} className={`relative shrink-0 overflow-hidden rounded-sm shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] ${i % 2 ? "mt-14 aspect-[3/4] w-[22vw]" : "aspect-[4/5] w-[26vw]"}`}>
              <Image src={g.src} alt={g.alt} fill sizes="26vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Who's been through */}
      <section className="px-5 pb-28 md:px-[6.5vw] md:pb-32">
        <h2 className="ab-head font-sans text-[clamp(1.75rem,2.8vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]">
          <Words text="[[Different people,]] one room." />
        </h2>
        <div className="ab-fade mt-12 flex justify-end gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Previous" : "Next"}
              onClick={() => track.current?.scrollBy({ left: d * (track.current.firstElementChild as HTMLElement).offsetWidth * 1.05, behavior: "smooth" })}
              className="grid size-12 place-items-center rounded-full border border-bone/30 text-lg transition-colors hover:border-lime hover:bg-lime hover:text-ink"
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
        {/* ponytail: native scroll-snap carousel, no library. Add autoplay/dots only if asked. */}
        <ul ref={track} className="ab-fade -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] md:-mx-[6.5vw] md:gap-6 md:px-[6.5vw] [&::-webkit-scrollbar]:hidden">
          {guests.map((g) => (
            <li key={g.name} className="group w-[72vw] shrink-0 snap-start md:w-[22vw]">
              <a href={g.href} target="_blank" rel="noreferrer" className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <Image src={g.image.src} alt={g.image.alt} fill sizes="(min-width:768px) 22vw, 72vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <h3 className="mt-5 font-sans text-xl font-semibold leading-tight tracking-[-0.01em] transition-colors group-hover:text-lime">{g.name}</h3>
                <p className="mt-2 text-sm leading-snug text-bone/60">{g.note}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="ab-steps px-5 pb-32 pt-10 md:px-[6.5vw] md:pb-48">
        <div className="relative h-px bg-bone/20">
          <div className="ab-line absolute inset-0 bg-bone" />
        </div>
        <div className="grid gap-12 pt-6 md:grid-cols-3 md:gap-10">
          {steps.map((s, i) => (
            <div key={s.t} className="ab-fade">
              <h3 className="font-mono text-sm">
                <span className="mr-3 text-lime">0{i + 1}</span>
                {s.t}
              </h3>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone/65">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-32 text-center md:px-[6.5vw] md:pb-48">
        <h2 className="ab-head mx-auto max-w-3xl font-sans text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
          <Words text="Come as [[you are.]]" />
        </h2>
        <p className="ab-fade mt-6 text-base text-bone/70">{visit.lines.join(" · ")}</p>
        <div className="ab-fade mt-10 flex flex-wrap justify-center gap-3">
          <a href={visit.directions} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-lime px-8 py-4 font-mono text-sm text-ink transition-transform hover:-translate-y-0.5">
            Get directions <span aria-hidden>↗</span>
          </a>
          <a href={site.contactHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-bone/40 px-8 py-4 font-mono text-sm transition-colors hover:border-lime hover:text-lime">
            Say hi on Instagram <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
