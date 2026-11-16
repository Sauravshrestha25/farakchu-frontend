"use client";

import "../events.css";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { eventsPage as d } from "@/features/events/data";
import { Carousel } from "./carousel";
import { CircledMark, Crosshair, CornerArrow, Scribble } from "./icons";
import { Nav } from "@/components/nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LogoMark } from "@/components/logo-mark";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Fit a nowrap line of text to its parent's width.
function fit(el: HTMLElement) {
  el.style.fontSize = "100px";
  el.style.fontSize = `${(100 * (el.parentElement as HTMLElement).clientWidth) / el.offsetWidth}px`;
}

export function EventsPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      const fitAll = () => q(".ev-fit").forEach((el) => fit(el as HTMLElement));
      document.fonts.ready.then(() => {
        fitAll();
        ScrollTrigger.refresh();
      });
      addEventListener("resize", fitAll);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero title chars + chrome start hidden, then animate in.
        fitAll();
        const heroSplit = SplitText.create(q(".ev-hero-title"), { type: "chars", mask: "chars", charsClass: "ev-red-grad" });
        gsap.set(heroSplit.chars, { yPercent: 110 });
        gsap.set(q(".ev-cross"), { autoAlpha: 0, y: 14 });
        gsap
          .timeline({ delay: 0.3, defaults: { ease: "power4.out" } })
          .to(heroSplit.chars, { yPercent: 0, duration: 1.4, stagger: 0.05 })
          .to(q(".ev-cross"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.5);

        // Hero: photo drifts back as you leave.
        const hero = q(".ev-hero")[0];
        gsap.to(q(".ev-hero-photo-in"), { yPercent: 16, scale: 1.12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q(".ev-hero-title-wrap"), { yPercent: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

        // Section headings.
        q(".ev-rise").forEach((el) =>
          gsap.from(el, { y: 60, autoAlpha: 0, clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
        );
        gsap.from(q(".ev-carousel"), { y: 80, autoAlpha: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: q(".ev-carousel")[0], start: "top 85%", once: true } });

        // Statement: scribbles draw themselves.
        gsap.from(q(".ev-scribble path, .ev-circle path"), { strokeDashoffset: 1, duration: 1.6, stagger: 0.4, ease: "power2.inOut", scrollTrigger: { trigger: q(".ev-statement")[0], start: "top 55%", once: true } });

        // Tilted photos drift and straighten.
        const ph = q(".ev-photo");
        const ps = { trigger: q(".ev-photos")[0], start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(ph[0], { y: 120, rotate: -13 }, { y: -50, rotate: -6, ease: "none", scrollTrigger: ps });
        gsap.fromTo(ph[1], { y: 220, rotate: 12 }, { y: 20, rotate: 5, ease: "none", scrollTrigger: ps });

        // Paragraph fills white word by word with scroll.
        const words = SplitText.create(q(".ev-fill"), { type: "words" });
        gsap.fromTo(words.words, { opacity: 0.35 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: q(".ev-fill")[0], start: "top 80%", end: "bottom 45%", scrub: true } });

        // News rows.
        q(".ev-news").forEach((row) => {
          const r = gsap.utils.selector(row);
          gsap.from(r(".ev-line"), { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 90%", once: true } });
          gsap.from(r(".ev-news-img"), { clipPath: "inset(0 100% 0 0)", duration: 1.3, ease: "power3.inOut", scrollTrigger: { trigger: row, start: "top 85%", once: true } });
          gsap.from(r(".ev-news-copy > *"), { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 80%", once: true } });
        });

        // Footer wordmark.
        const fSplit = SplitText.create(q(".ev-foot-title"), { type: "chars", mask: "chars", charsClass: "ev-red-grad" });
        gsap.from(fSplit.chars, { yPercent: 110, duration: 1.3, stagger: 0.04, ease: "power4.out", scrollTrigger: { trigger: q(".ev-foot")[0], start: "top 55%", once: true } });
        gsap.fromTo(q(".ev-foot-bg"), { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: q(".ev-foot")[0], start: "top bottom", end: "bottom bottom", scrub: true } });

        // Cursor label over anything marked data-cursor.
        mm.add("(hover: hover) and (pointer: fine)", () => {
          const c = q(".ev-cursor")[0];
          const x = gsap.quickTo(c, "x", { duration: 0.4, ease: "power3" });
          const y = gsap.quickTo(c, "y", { duration: 0.4, ease: "power3" });
          const move = (e: MouseEvent) => {
            x(e.clientX + 14);
            y(e.clientY + 14);
            gsap.to(c, { opacity: (e.target as HTMLElement).closest("[data-cursor]") ? 1 : 0, duration: 0.2, overwrite: "auto" });
          };
          addEventListener("mousemove", move);
          return () => removeEventListener("mousemove", move);
        });

        return () => {
          heroSplit.revert();
          words.revert();
          fSplit.revert();
        };
      });

      return () => {
        removeEventListener("resize", fitAll);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <main ref={root} className="ev overflow-x-clip">
      <div className="ev-noise" aria-hidden />
      <div className="ev-cursor" aria-hidden>View</div>
      <Nav page="sub" />
      <SmoothScroll>

      {/* HERO */}
      <section data-hero className="ev-hero relative h-svh min-h-[34rem] overflow-hidden">
        <div className="ev-hero-photo absolute inset-0">
          <div className="ev-hero-photo-in absolute inset-0">
            <Image src={d.hero.src} alt={d.hero.alt} fill priority sizes="100vw" className="ev-bw object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#003638]" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent to-[#003638]" />
        </div>
        <div className="absolute left-[50px] top-[275px] flex gap-[9px] max-md:left-5 max-md:top-[22%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="ev-cross block"><Crosshair /></span>
          ))}
        </div>
        <div className="ev-hero-title-wrap absolute inset-x-[4.3vw] bottom-[2.2rem] max-md:inset-x-5">
          <h1 className="ev-hero-title ev-fit ev-display block w-max whitespace-nowrap leading-[0.92]">{d.title}</h1>
        </div>
      </section>

      {/* POSTERS */}
      <section id="posters" className="relative overflow-hidden py-[126px]">
        <h2 className="ev-rise ev-display ev-h2 ev-grad relative z-[2] text-center">Posters</h2>
        <div className="ev-carousel mt-[4.5rem]"><Carousel items={d.posters} variant="case" /></div>
      </section>

      {/* STATEMENT */}
      <section className="ev-statement relative px-5 pb-[126px] pt-10">
        <h2 className="ev-rise ev-display ev-h2 ev-grad mx-auto max-w-[72rem] text-center">
          <span className="relative inline-block">
            {d.statement.before.split(" ").slice(0, 2).join(" ")}
            <Scribble />
          </span>{" "}
          {d.statement.before.split(" ").slice(2).join(" ")} <CircledMark label="FC" /> {d.statement.after}
        </h2>
        <div className="ev-photos relative mx-auto mt-14 h-[34rem] w-full max-w-[46rem] max-md:h-[26rem]">
          {d.photos.map((p, i) => (
            <div key={p.src} className={`ev-photo ev-bw absolute aspect-[4/5] w-[44%] overflow-hidden bg-[#00292b] ${i === 0 ? "left-[2%] top-0" : "right-0 top-[12%]"}`}>
              <Image src={p.src} alt={p.alt} fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>
        <p className="ev-fill mx-auto mt-24 max-w-[34rem] text-center text-[1.3rem] leading-[1.35] max-md:text-base">{d.about}</p>
        <div className="mt-12 text-center">
          <a href={d.instagram} target="_blank" rel="noreferrer" className="ev-btn">
            About <span className="h-5 w-6"><LogoMark className="h-full w-full" /></span>
          </a>
        </div>
      </section>

      {/* GUESTS */}
      <section id="guests" className="relative overflow-hidden bg-gradient-to-b from-[#003638] to-[#00292b] py-[126px]">
        <h2 className="ev-rise ev-display ev-h2 ev-grad text-center">Guests</h2>
        <div className="ev-carousel mt-[3rem]"><Carousel items={d.guests} variant="video" /></div>
      </section>

      {/* NIGHTS */}
      <section id="nights" className="px-[42px] py-[126px] max-md:px-5">
        <h2 className="ev-rise ev-display ev-h2 ev-grad text-center">Recent nights</h2>
        <ul className="mt-[4.5rem]">
          {d.nights.map((n) => (
            <li key={n.title} className="ev-news relative">
              <span className="ev-line absolute inset-x-0 top-0 h-px bg-bone/20" aria-hidden />
              <a href={d.instagram} target="_blank" rel="noreferrer" data-cursor className="grid grid-cols-[26.6rem_1fr_auto] items-center gap-x-[2.3rem] px-[22px] py-[22px] max-lg:grid-cols-[12rem_1fr_auto] max-md:grid-cols-1 max-md:gap-y-4">
                <div className="ev-news-img relative aspect-[1.6] overflow-hidden bg-[#00292b]">
                  <Image src={n.image.src} alt={n.image.alt} fill sizes="430px" className="ev-bw object-cover object-top" />
                </div>
                <div className="ev-news-copy max-w-[46rem]">
                  <p className="text-[1.05rem] text-bone/80">{n.date}</p>
                  <h3 className="ev-display mt-4 text-[clamp(2.6rem,3.9vw,3.6rem)] leading-[1.05]">{n.title}</h3>
                  <p className="mt-6 max-w-[44rem] normal-case text-bone/80">{n.desc}</p>
                </div>
                <span className="ev-sq mr-[2.6rem] max-md:hidden"><CornerArrow dir="r" /></span>
              </a>
            </li>
          ))}
          <li className="ev-line h-px bg-bone/20" aria-hidden />
        </ul>
        <div className="mt-12 text-center">
          <a href={d.instagram} target="_blank" rel="noreferrer" className="ev-btn">
            All nights <CornerArrow dir="r" />
          </a>
        </div>
      </section>

      {/* BOOK */}
      <section className="px-5 pb-[126px] pt-10 text-center">
        <h2 className="ev-rise ev-display ev-h2 ev-grad mx-auto max-w-[56rem]">{d.book.title}</h2>
        <p className="mx-auto mt-8 max-w-[34rem] text-[1.2rem] leading-[1.4]">{d.book.body}</p>
        <a href={d.dm} target="_blank" rel="noreferrer" className="ev-btn mt-10">
          Book a night
        </a>
      </section>

      {/* FOOTER */}
      <footer className="ev-foot relative overflow-hidden pb-14 pt-[9.5rem]">
        <div className="ev-foot-bg absolute inset-x-0 -top-[10%] h-[60%] opacity-40">
          <Image src={d.footerImage.src} alt={d.footerImage.alt} fill sizes="100vw" className="ev-bw object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#003638] via-transparent to-[#003638]" />
        </div>
        <div className="relative mx-[4.3vw]">
          <h2 className="ev-foot-title ev-fit ev-display block w-max whitespace-nowrap leading-[0.92]">{d.title.split(" ")[0]}</h2>
        </div>
        <ul className="relative mt-24 flex flex-wrap justify-center gap-x-[2.6rem] gap-y-3 px-5">
          {d.links.map((l) => (
            <li key={l.label}>
              {l.href.startsWith("/") ? (
                <Link href={l.href} className="transition-colors hover:text-[#d6ff50]">{l.label}</Link>
              ) : (
                <a href={l.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#d6ff50]">{l.label}</a>
              )}
            </li>
          ))}
        </ul>
        <p className="relative mt-10 text-center text-[0.95rem] text-bone/60">© 2026 Farakchu all rights reserved</p>
      </footer>
      </SmoothScroll>
    </main>
  );
}
