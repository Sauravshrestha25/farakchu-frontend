"use client";

import "../apparel.css";
import { PageTheme } from "@/components/page-theme";
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
import { BagButton, BagProvider } from "./bag";
import { Catalogue } from "./catalogue";
import { RailHero } from "./rail-hero";
import { Scene } from "./scene";

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
        onToggle: (s) =>
          document
            .querySelector("[data-nav]")
            ?.classList.toggle("nav-ink", s.isActive),
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Desktop: each scene pins and the next slides over it; the covered photo drifts up a touch.
        mm.add("(min-width: 1024px)", () => {
          const scenes = q(".ap-scene");
          scenes.forEach((scene, i) => {
            const next = scenes[i + 1];
            if (!next) return;
            ScrollTrigger.create({
              trigger: scene,
              start: "top top",
              endTrigger: next,
              end: "top top",
              pin: true,
              pinSpacing: false,
            });
            gsap.to(gsap.utils.selector(scene)(".ap-scene-in"), {
              yPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            });
          });
        });

        gsap.from(q(".ap-card"), {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: q(".ap-catalogue")[0],
            start: "top 55%",
            once: true,
          },
        });
        q(".ap-step").forEach((el) =>
          gsap.from(el, {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );

        // Cursor label over anything marked data-cursor.
        mm.add("(hover: hover) and (pointer: fine)", () => {
          const c = document.querySelector<HTMLElement>(".ap-cursor")!;
          const x = gsap.quickTo(c, "x", { duration: 0.4, ease: "power3" });
          const y = gsap.quickTo(c, "y", { duration: 0.4, ease: "power3" });
          const move = (e: MouseEvent) => {
            x(e.clientX + 14);
            y(e.clientY + 14);
            const t = (e.target as HTMLElement).closest<HTMLElement>(
              "[data-cursor]",
            );
            if (t) c.textContent = t.dataset.cursor ?? "";
            gsap.to(c, {
              opacity: t ? 1 : 0,
              duration: 0.2,
              overwrite: "auto",
            });
          };
          const hide = () =>
            gsap.to(c, { opacity: 0, duration: 0.2, overwrite: "auto" });
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
        document
          .querySelector("[data-nav]")
          ?.classList.remove("nav-ink", "nav-light");
      };
    },
    { scope: root },
  );

  return (
    <div className="theme-studio">
      <PageTheme name="studio" />
      <BagProvider>
        <div className="ap-cursor" aria-hidden />
        <Nav page="sub" action={<BagButton />} />
        <SmoothScroll>
          <main ref={root}>
            <RailHero />

            {/* The pieces, one room each */}
            <div className="ap-scenes">
              {pieces.map((p, i) => (
                <Scene key={p.id} piece={p} index={i} total={pieces.length} />
              ))}
            </div>

            <Catalogue />

            {/* How ordering works */}
            <section className="flex flex-col justify-center px-4 py-20 lg:min-h-svh lg:px-6 lg:py-28">
              <h2
                data-heading
                className="max-w-[48rem] font-sans text-center font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.15]"
              >
                Ordering is <span className="hl">three steps.</span>
              </h2>
              <ol className="mt-14 grid gap-px bg-bone/20 lg:grid-cols-3">
                {steps.map((s) => (
                  <li
                    key={s.n}
                    className="ap-step bg-teal p-6 pb-10 lg:p-8 lg:pb-14"
                  >
                    <span className="font-mono text-sm text-lime">{s.n}</span>
                    <h3 className="mt-4 font-sans font-semibold tracking-[-0.02em] text-lg leading-tight">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[22rem] text-base leading-snug text-bone/85">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* The point */}
            <section className="relative grid items-center gap-12 overflow-hidden px-4 py-20 lg:min-h-svh lg:grid-cols-12 lg:gap-8 lg:px-6 lg:py-28">
              <div className="relative lg:col-span-6">
                <div className="relative aspect-[4/5] w-[82%] overflow-hidden bg-teal-soft lg:max-h-[78svh] lg:w-[78%]">
                  <Image
                    src={apparelPage.story.image}
                    alt={apparelPage.story.alt}
                    fill
                    sizes="(min-width:1024px) 36vw, 80vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 right-0 aspect-square w-[44%] overflow-hidden border-[6px] border-teal bg-teal-soft lg:-bottom-10 lg:w-[38%]">
                  <Image
                    src={apparelPage.manifesto[1].image}
                    alt={apparelPage.manifesto[1].alt}
                    fill
                    sizes="(min-width:1024px) 16vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 lg:pl-8">
                <h2
                  data-heading
                  className="font-sans font-semibold tracking-[-0.02em] text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.15]"
                >
                  {apparelPage.story.heading.split(", ")[0]},{" "}
                  <span className="hl">
                    {apparelPage.story.heading.split(", ")[1]}
                  </span>
                </h2>
                <p
                  data-body
                  className="mt-6 max-w-[34rem] text-lg leading-snug text-bone/90"
                >
                  {apparelPage.story.body}
                </p>
                <ol className="mt-10 border-t border-bone/25">
                  {apparelPage.principles.map((p, i) => (
                    <li
                      key={p.title}
                      className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-bone/25 py-5 sm:grid-cols-[4.5rem_14rem_1fr]"
                    >
                      <span className="font-mono text-sm leading-none text-lime">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-wide text-sm leading-tight">
                        {p.title}
                      </h3>
                      <p className="col-start-2 text-sm leading-snug text-bone/75 sm:col-start-auto">
                        {p.body}
                      </p>
                    </li>
                  ))}
                </ol>
                <a
                  href="#catalogue"
                  className="mt-10 inline-flex min-h-12 items-center rounded-[50%] bg-lime px-9 py-3 font-wide text-[0.625rem] leading-none text-ink transition-colors hover:bg-bone"
                >
                  Shop the pieces
                </a>
              </div>
            </section>
          </main>
          <Footer light />
          <Reveals />
        </SmoothScroll>
      </BagProvider>
    </div>
  );
}
