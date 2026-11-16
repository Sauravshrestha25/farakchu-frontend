"use client";

import "../apparel.css";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Nav } from "@/components/nav";
import { Reveals } from "@/components/reveals";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Footer } from "@/components/home/footer";
import { apparelPage, pieces, steps } from "@/features/apparel/data";
import { BagProvider } from "./bag";
import { Catalogue } from "./catalogue";
import { RailHero } from "./rail-hero";
import { Scene } from "./scene";
import { Ticker } from "./ticker";

gsap.registerPlugin(ScrollTrigger);

export function ApparelPage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Bone catalogue under the nav: flip the nav to ink.
      ScrollTrigger.create({
        trigger: q(".ap-catalogue")[0],
        start: "top 50px",
        end: "bottom 50px",
        onToggle: (s) => document.querySelector("[data-nav]")?.classList.toggle("nav-ink", s.isActive),
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scenes: giant outline names drift, photos wipe in.
        q(".ap-scene").forEach((scene) => {
          const s = gsap.utils.selector(scene);
          gsap.fromTo(s(".ap-drift"), { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.from(s(".ap-photo"), { clipPath: "inset(0 0 100% 0)", duration: 1.3, ease: "power3.inOut", scrollTrigger: { trigger: scene, start: "top 60%", once: true } });
        });

        // Desktop: scenes stack like cards, each one covering the last.
        mm.add("(min-width: 1024px)", () => {
          const scenes = q(".ap-scene");
          scenes.forEach((scene, i) => {
            const next = scenes[i + 1];
            if (!next) return;
            ScrollTrigger.create({ trigger: scene, start: "top top", endTrigger: next, end: "top top", pin: true, pinSpacing: false });
            gsap.to(gsap.utils.selector(scene)(".ap-scene-in"), { scale: 0.92, opacity: 0.35, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
          });
        });

        gsap.from(q(".ap-card"), { y: 60, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: q(".ap-catalogue")[0], start: "top 55%", once: true } });
        q(".ap-step").forEach((el) => gsap.from(el, { y: 50, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));

        // Cursor label over anything marked data-cursor.
        mm.add("(hover: hover) and (pointer: fine)", () => {
          const c = document.querySelector<HTMLElement>(".ap-cursor")!;
          const x = gsap.quickTo(c, "x", { duration: 0.4, ease: "power3" });
          const y = gsap.quickTo(c, "y", { duration: 0.4, ease: "power3" });
          const move = (e: MouseEvent) => {
            x(e.clientX + 14);
            y(e.clientY + 14);
            const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
            if (t) c.textContent = t.dataset.cursor ?? "";
            gsap.to(c, { opacity: t ? 1 : 0, duration: 0.2, overwrite: "auto" });
          };
          const hide = () => gsap.to(c, { opacity: 0, duration: 0.2, overwrite: "auto" });
          addEventListener("mousemove", move);
          addEventListener("scroll", hide, { passive: true });
          return () => {
            removeEventListener("mousemove", move);
            removeEventListener("scroll", hide);
          };
        });
      });

      return () => {
        mm.revert();
        document.querySelector("[data-nav]")?.classList.remove("nav-ink");
      };
    },
    { scope: root },
  );

  return (
    <BagProvider>
      <div className="ap-cursor" aria-hidden />
      <Nav page="sub" />
      <SmoothScroll>
        <main ref={root}>
          <RailHero />
          <Ticker />

          {/* The pieces, one room each */}
          <div>
            {pieces.map((p, i) => (
              <Scene key={p.id} piece={p} index={i} total={pieces.length} />
            ))}
          </div>

          <Catalogue />

          {/* How ordering works */}
          <section className="px-4 py-20 lg:px-6 lg:py-28">
            <h2 data-heading className="max-w-[48rem] font-wide text-[clamp(2rem,4.6vw,4.6rem)] leading-[0.95]">
              Ordering is <span className="hl">one DM.</span>
            </h2>
            <ol className="mt-14 grid gap-px bg-bone/20 lg:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="ap-step bg-teal p-6 pb-10 lg:p-8 lg:pb-14">
                  <span className="font-wide text-[clamp(4rem,9vw,9rem)] leading-[0.85] text-lime">{s.n}</span>
                  <h3 className="mt-6 font-wide text-xl leading-tight">{s.title}</h3>
                  <p className="mt-3 max-w-[22rem] text-base leading-snug text-bone/85">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* The point */}
          <section className="relative grid gap-10 overflow-hidden px-4 pb-24 lg:grid-cols-12 lg:px-6 lg:pb-32">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-teal-soft lg:col-span-5">
              <Image src={apparelPage.story.image} alt={apparelPage.story.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
              <h2 data-heading className="font-wide text-[clamp(1.8rem,3.6vw,3.6rem)] leading-[0.98]">{apparelPage.story.heading}</h2>
              <p data-body className="mt-6 max-w-[34rem] text-lg leading-snug text-bone/90">{apparelPage.story.body}</p>
              <ul className="mt-10 grid gap-6 sm:grid-cols-3">
                {apparelPage.principles.map((p) => (
                  <li key={p.title} className="border-t border-bone/25 pt-4">
                    <h3 className="font-wide text-sm leading-tight">{p.title}</h3>
                    <p className="mt-2 text-sm leading-snug text-bone/75">{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
        <Footer />
        <Reveals />
      </SmoothScroll>
    </BagProvider>
  );
}
