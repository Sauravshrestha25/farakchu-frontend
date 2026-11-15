"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { apparelDrop } from "@/content/site";
import { Footer } from "@/components/home/footer";
import { Nav } from "@/components/nav";
import { apparelPage } from "@/features/apparel/data";
import { scramble } from "@/components/scramble";

gsap.registerPlugin(ScrollTrigger);

const CREAM = "bg-[#f6f6eb] text-[#333]";
const Arrow = () => <span aria-hidden>↗</span>;

export function ApparelPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Lenis smooth scroll, same as the reference site.
        const lenis = new Lenis({ lerp: 0.1 });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Hero load: letters + centre stack fade up in sequence (a,b,c,d,e), nav follows (f,g,h).
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(q(".ap-hero-photo"), { autoAlpha: 0, duration: 1.4, ease: "power1.out" })
          .from(q(".ap-in"), { y: 60, autoAlpha: 0, duration: 1.2, stagger: 0.12 }, 0.3);

        // Headings: each word rises out of a mask when it enters the viewport.
        q(".ap-words").forEach((el) => {
          const words = gsap.utils.selector(el)(".ap-w");
          gsap.from(words, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Body copy and small items fade up.
        q(".ap-reveal").forEach((el) => {
          gsap.from(el, {
            y: 24,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Mono lines decode from random characters.
        q(".ap-scramble-solo").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () => scramble(el as HTMLElement, 1.1),
          });
        });

        // Panel photos: linear parallax, -14% -> +6% of the (110% tall) image across the panel's pass.
        q(".ap-panel").forEach((panel) => {
          gsap.fromTo(
            gsap.utils.selector(panel)(".ap-panel-img"),
            { yPercent: -14 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Piece cards fade up in a row.
        gsap.from(q(".ap-piece"), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: q(".ap-pieces")[0], start: "top 85%", once: true },
        });

        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );


  return (
    <main ref={root} id="top" className={`${CREAM} overflow-x-clip font-medium`}>
      <Nav page="sub" />

      {/* HERO: photo + static staircase of letters, scrolls 1:1 with the page */}
      <section className="relative h-[165svh] overflow-hidden bg-[#0d0d0b] text-[#f6f6eb]">
        <div className="ap-hero-photo absolute inset-0">
          <Image src="/images/home/domain-apparel.jpg" alt="Two friends wearing Farakchu apparel" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.1),rgb(0_0_0/0.75))]" />
        </div>

        <div className="ap-in absolute left-1/2 top-[34%] z-10 w-[min(90vw,28rem)] -translate-x-1/2 text-center">
          <h1 className="text-[clamp(1.5rem,3vw,2.4rem)] uppercase leading-[0.92] tracking-tight">
            Limited clothing<br />made in Kathmandu<br />(Chapter 03)
          </h1>
          <p className="mt-6 font-mono text-[0.6rem] uppercase leading-tight">Worn different<br />Farakchu</p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[35svh] text-[13vw] font-medium uppercase leading-[0.76] tracking-[-0.04em]" aria-hidden>
          <div className="ap-in -ml-[1vw] h-[9.9vw]">FA</div>
          <div className="ap-in flex h-[9.9vw] justify-end">RA</div>
          <div className="ap-in ml-[33%] h-[9.9vw]">KC</div>
          <div className="ap-in ml-[64%] h-[9.9vw]">HU</div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="flex flex-wrap items-end justify-between gap-x-6 px-5 pt-5 text-[clamp(2.6rem,6vw,5.2rem)] uppercase leading-none tracking-[-0.05em]">
        <h2 className="ap-words"><Words text="Small runs" /></h2>
        <h2 className="ap-words"><Words text="Big feeling" /></h2>
      </section>

      <section className="px-5 pb-28 pt-24 lg:pt-40">
        <p className="ap-words font-serif text-[clamp(2rem,3.5vw,3rem)] italic leading-none tracking-tight md:ml-[25.7%]">
          <Words text="Worn different." />
        </p>
      </section>

      {/* STORY */}
      <section className="px-5 pb-32 pt-24 text-center">
        <h2 className="ap-words text-[clamp(4rem,17.5vw,19rem)] uppercase leading-[0.85] tracking-[-0.06em]"><Words text="The Drop" /></h2>
        <p className="ap-reveal mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)] uppercase tracking-tight">04 things to know</p>
        <p className="mx-auto mt-10 font-mono text-[0.6rem] uppercase leading-tight text-[#333]/60">
          <span className="ap-scramble-solo block">Small runs, made in Kathmandu</span>
          <span className="ap-scramble-solo block">Order by DM</span>
        </p>
      </section>

      {apparelPage.manifesto.map((c, i) => (
        <article key={c.kicker} className="ap-panel relative h-[130svh] bg-[#646464] text-[#f6f6eb]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="ap-panel-img absolute left-0 top-0 h-[110%] w-full will-change-transform">
              <Image src={c.image} alt={c.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: c.pos }} />
            </div>
            <div className="absolute inset-0 bg-black/35" />
          </div>
          <div className="sticky top-10 z-10 grid grid-cols-1 gap-8 px-5 md:grid-cols-[calc(58%-1.25rem)_1fr]">
            <h3 className="text-[clamp(2.2rem,3.7vw,5rem)] uppercase leading-[0.9] tracking-[-0.04em]">
              {c.title.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h3>
            <div className="max-w-[30rem] space-y-14 text-[0.95rem] leading-[1.2]">
              <p className="font-semibold">{c.kicker}.{i === 0 && <> <a href={apparelDrop.dm} target="_blank" rel="noreferrer" className="underline underline-offset-2">Ask about the drop <Arrow /></a></>}</p>
              <p>{c.body}</p>
              <p className="font-mono text-[0.65rem] uppercase">Farakchu / Chapter 03</p>
            </div>
          </div>
        </article>
      ))}

      {/* ABOUT / BIG NUMBER */}
      <section className="grid gap-12 px-5 py-4 md:grid-cols-[40%_1fr] md:gap-20">
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#222]">
            <Image src={apparelPage.story.image} alt={apparelPage.story.alt} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="mt-16 pb-20">
            {apparelPage.principles.map((p) => (
              <div key={p.title} className="ap-reveal border-t border-[#333]/25 py-5 text-sm leading-[1.25]">
                <p className="font-semibold uppercase">{p.title}</p>
                <p className="mt-2 max-w-[24rem]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center pt-6 text-center">
          <p className="ap-words text-[clamp(10rem,32vw,34rem)] leading-[0.85] tracking-[-0.06em]"><Words text="03" /></p>
          <p className="ap-reveal font-mono text-[0.65rem] uppercase leading-tight">Hoodies for the room<br />Made in Kathmandu,<br />Nepal</p>
        </div>
      </section>

      {/* PIECES */}
      <section className="border-t border-[#333]/15 px-5 pb-32 pt-24">
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 className="ap-words text-[clamp(2.4rem,6vw,5.2rem)] uppercase leading-[0.9] tracking-[-0.05em]"><Words text="The pieces" /></h2>
          <a href={apparelDrop.dm} target="_blank" rel="noreferrer" className="ap-reveal text-sm uppercase">+ DM to order <Arrow /></a>
        </div>
        <ul className="ap-pieces grid gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {apparelDrop.items.map((item, i) => (
            <li key={item.name} className="ap-piece">
              <a href={apparelDrop.dm} target="_blank" rel="noreferrer" className="group block" aria-label={`${item.name}, message to order`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e4e4d4]">
                  <Image src={item.image} alt={item.desc} fill sizes="(min-width:1024px) 24vw, 92vw" className="object-cover transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none" />
                  <Image src={item.alt} alt="" fill sizes="(min-width:1024px) 24vw, 92vw" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
                </div>
                <div className="mt-3 flex items-baseline justify-between text-sm uppercase">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-mono text-[0.65rem]">({String(i + 1).padStart(2, "0")})</span>
                </div>
                <p className="mt-1 text-xs uppercase text-[#333]/60">{item.chapter}</p>
                <p className="mt-3 text-xs normal-case leading-[1.25] text-[#333]/80">{item.desc}. Hover for the back.</p>
                <p className="mt-3 text-xs uppercase underline underline-offset-2">DM to order <Arrow /></p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW TO ORDER */}
      <section className="border-t border-[#333]/15 px-5 pb-32 pt-24">
        <h2 className="ap-words text-[clamp(2.4rem,6vw,5.2rem)] uppercase leading-[0.9] tracking-[-0.05em]"><Words text="How to order" /></h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            ["01", "Pick a piece", "Browse the chapters above and find the one that feels like you."],
            ["02", "Send a DM", "Message @farakchu.apparel on Instagram with the piece you want."],
            ["03", "Sort the details", "We’ll confirm size, colour and pickup with you in the chat."],
          ].map(([n, t, b]) => (
            <li key={n} className="ap-reveal border-t border-[#333]/25 pt-4">
              <span className="font-mono text-xs">({n})</span>
              <h3 className="mt-6 text-2xl uppercase leading-none tracking-[-0.03em]">{t}</h3>
              <p className="mt-3 max-w-[20rem] text-sm leading-[1.25]">{b}</p>
            </li>
          ))}
        </ol>
        <a href={apparelDrop.dm} target="_blank" rel="noreferrer" className="ap-reveal mt-16 inline-block bg-[#333] px-8 py-4 text-sm uppercase text-[#f6f6eb] transition-colors hover:bg-black">DM to order <Arrow /></a>
      </section>

      <Footer />
    </main>
  );
}

// Splits text into masked words (overflow hidden) so .ap-w can rise out of the mask.
function Words({ text, breakAfter }: { text: string; breakAfter?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
            <span className="ap-w inline-block">{w}</span>
          </span>
          {breakAfter === i + 1 ? <br /> : " "}
        </span>
      ))}
    </>
  );
}
