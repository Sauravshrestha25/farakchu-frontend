"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { home } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// Wall layout (the reference, flipped so the statement sits on top): outer columns carry two tiles beside the statement,
// the four middle columns carry one tile beneath it. Even columns sit lower by a third of a tile.
const COLS = 8;
const TWO = new Set([0, 1, 6, 7]);
const START = [
  "md:col-start-1",
  "md:col-start-2",
  "md:col-start-3",
  "md:col-start-4",
  "md:col-start-5",
  "md:col-start-6",
  "md:col-start-7",
  "md:col-start-8",
];
// Where the face sits in photos that are mostly body (object-position y). Everything else uses FACE_DEFAULT.
const FACE_DEFAULT = "50% 30%";
const FACE: Record<string, string> = { "11": "50% 45%", "123123": "50% 42%", "111": "50% 32%", "22": "50% 28%" };
const focusOf = (src: string) => FACE[src.split("/").pop()!.replace(/\.\w+$/, "")] ?? FACE_DEFAULT;
const SLOTS = TWO.size * 2 + (COLS - TWO.size);

/**
 * "What we believe": the title and its little body texts, then (same light background) the statement framed by a staggered wall of photos. Tiles crossfade to other photos one at a time.
 */
export function Believe({ featured = [] }: { featured?: string[] }) {
  const root = useRef<HTMLElement>(null);
  const { believe } = home;

  // The wall uses the people2 photos only. If there are too few to fill it, top up with the older portraits and venue shots.
  const older = Array.from(
    { length: Math.max(believe.people.length, believe.places.length) },
    (_, i) => [believe.people[i], believe.places[i]],
  )
    .flat()
    .filter(Boolean);
  const pool = featured.length >= SLOTS ? featured : [...featured, ...older];
  const initial = pool.slice(0, SLOTS);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tiles = q(".bl-tile") as HTMLElement[];
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      pool.forEach((src) => (new Image().src = src)); // warm the cache so swaps never pop in

      // The closing text is sized so its first line is exactly as wide as the sign-off.
      const fit = () => {
        const small = q(".bl-small")[0] as HTMLElement;
        const line = small.querySelector<HTMLElement>(".bl-line")!;
        const sign = q(".bl-sign .hl")[0] as HTMLElement;
        small.style.fontSize = "100px";
        small.style.fontSize = `${(100 * sign.offsetWidth) / line.offsetWidth}px`;
      };
      fit();
      ScrollTrigger.addEventListener("refreshInit", fit);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      // Closing text: at first, scrolls away, and the sign-off takes its place.
      gsap.set(q(".bl-sign"), { autoAlpha: 0, y: 50 });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q(".bl-end")[0],
            start: "center center",
            end: "+=120%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to(q(".bl-small"), { autoAlpha: 0, y: -50, duration: 1 })
        .to(q(".bl-sign"), { autoAlpha: 1, y: 0, duration: 1 }, 0.7);

      // Dark nav ink while this light section is under the bar.
      const ink = ScrollTrigger.create({
        trigger: root.current,
        start: "top 50px",
        end: "bottom 50px",
        onToggle: (s) =>
          document
            .querySelector("[data-nav]")
            ?.classList.toggle("nav-ink", s.isActive),
      });

      if (reduce)
        return () => (
          ink.kill(),
          ScrollTrigger.removeEventListener("refreshInit", fit)
        );

      // Swap: crossfade one random visible tile to a photo that isn't on screen.
      const used = new Set(initial);
      let active = false;
      const view = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => (active = s.isActive),
      });
      const swap = () => {
        const visible = tiles.filter(
          (t) => t.offsetParent && t.dataset.busy !== "1",
        );
        // Prefer featured (people2) photos whenever one is off screen, so they keep coming back around.
        const unused = pool.filter((s) => !used.has(s));
        const free = unused.filter((s) => featured.includes(s)).length
          ? unused.filter((s) => featured.includes(s))
          : unused;
        if (active && visible.length && free.length) {
          const tile = visible[Math.floor(Math.random() * visible.length)];
          const [a, b] = Array.from(tile.querySelectorAll("img"));
          const [front, back] = tile.dataset.front === "b" ? [b, a] : [a, b];
          const next = free[Math.floor(Math.random() * free.length)];
          tile.dataset.busy = "1";
          used.delete(front.getAttribute("src")!);
          used.add(next);
          back.src = next;
          back.style.objectPosition = focusOf(next);
          back
            .decode()
            .catch(() => {})
            .then(() => {
              gsap.fromTo(
                back,
                { opacity: 0, scale: 1.12 },
                { opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" },
              );
              gsap.to(front, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
                onComplete: () => (tile.dataset.busy = "0"),
              });
              tile.dataset.front = back === b ? "b" : "a";
            });
        }
        call = gsap.delayedCall(0.8 + Math.random() * 0.8, swap);
      };
      let call = gsap.delayedCall(1, swap);
      return () => {
        call.kill();
        view.kill();
        ink.kill();
        ScrollTrigger.removeEventListener("refreshInit", fit);
        document.querySelector("[data-nav]")?.classList.remove("nav-ink");
      };
    },
    { scope: root },
  );

  let slot = 0;
  return (
    <section
      ref={root}
      id="believe"
      aria-label={believe.title}
      className="relative overflow-hidden bg-bone pb-16 text-ink lg:pb-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 px-5 py-28 text-center lg:gap-20 lg:py-40">
        <h2 className="font-wide whitespace-nowrap text-[clamp(1.75rem,6vw,6rem)] leading-none">
          {believe.title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="hl">{believe.title.split(" ").at(-1)}</span>
        </h2>
        <div className="grid w-full gap-4 text-left md:grid-cols-3 md:gap-6">
          {believe.stages.map((t, i) => (
            <div
              key={t}
              className="group flex min-h-[16rem] flex-col  gap-16 border border-ink/15 bg-bone-dim/40 p-6 transition-colors duration-500 ease-out-expo hover:bg-teal hover:text-bone lg:min-h-[22rem] lg:p-8"
            >
              <span className="font-wide text-[clamp(2.5rem,4vw,4.5rem)] leading-none text-ink/25 transition-colors duration-500 ease-out-expo group-hover:text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-serif text-[clamp(1.25rem,1.7vw,1.625rem)] leading-[1.3]">
                {t}
              </p>
            </div>
          ))}
        </div>

        {/* Pinned: the small closing text scrolls away and reveals the sign-off. */}
        <div className="w-full">
          <div className="bl-end relative h-[50svh] w-full">
            <p className="bl-small absolute inset-0 flex flex-col items-center justify-center font-serif leading-[1.25]">
              {believe.closing.map((l) => (
                <span key={l} className="bl-line block w-max">
                  {l}
                </span>
              ))}
            </p>
            <p className="bl-sign absolute inset-0 flex items-center justify-center font-wide whitespace-nowrap text-[clamp(0.65rem,3.2vw,4.5rem)] leading-none">
              <span className="hl">{believe.sign}</span>
            </p>
          </div>
        </div>
      </div>

      <div
        className="bl-wall grid grid-cols-4 gap-x-3 px-3 md:grid-cols-8 md:px-4"
        style={
          {
            "--tw": "calc((100vw - 2rem - 7 * 0.75rem) / 8)",
          } as React.CSSProperties
        }
      >
        <h2 className="col-span-4 row-start-1 px-2 pb-12 text-center font-serif text-[clamp(2rem,3.2vw,4rem)] leading-[1.1] md:whitespace-nowrap md:col-start-3 md:pb-6 md:pt-[calc(var(--tw)*0.33)]">
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="block">{believe.statement[0]}</span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="block">
              And that&apos;s <span className="hl">the beauty of it.</span>
            </span>
          </span>
        </h2>

        {Array.from({ length: COLS }, (_, c) => {
          const two = TWO.has(c);
          return (
            <div
              key={c}
              aria-hidden
              className={`flex flex-col gap-3 ${START[c]} ${two ? "row-start-2 md:row-span-2 md:row-start-1" : "max-md:hidden md:row-start-2"}`}
              style={{ marginTop: c % 2 ? "calc(var(--tw) * 0.33)" : 0 }}
            >
              {(two ? [0, 1] : [0]).map((r) => (
                <div
                  key={r}
                  className="bl-tile relative aspect-[7/9] overflow-hidden bg-bone-dim"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={initial[slot]}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    style={{ objectPosition: focusOf(initial[slot++]) }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-0"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
