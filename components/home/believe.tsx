"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

// All copy for this section lives here (not in content/site.ts).
const believe = {
  title: "A few things we believe in",
  statement: ["There's no one way to be you.", "And that's the beauty of it."],
  stages: [
    {
      title: "Be uniquely you.",
      body: "We believe you shouldn't have to fit into someone else's idea of who you should be. Your personality, passions and perspectives are what make you different. Own them.",
    },
    {
      title: "Celebrate every difference.",
      body: "Different tastes, different interests, different perspectives. We believe these differences make life more colourful, experiences more meaningful and the world more interesting.",
    },
    {
      title: "Connection makes us stronger.",
      body: "Being different doesn't mean being apart. We believe the best moments happen when different people, passions and stories come together.",
    },
    {
      title: "Make room for experiences.",
      body: "Life isn't meant to be experienced in just one way. Explore something new, follow your curiosity, create memories and make every moment your own.",
    },
  ],
  closing: [
    "Because different isn't a distance between us.",
    "It's what brings us together.",
  ],
  sign: "That's what Farakchu believes.",
};

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
const SLOTS = TWO.size * 2 + (COLS - TWO.size);
// Where the face sits in photos that are mostly body (object-position). Everything else uses FACE_DEFAULT.
const FACE_DEFAULT = "50% 30%";
const FACE: Record<string, string> = {
  "11": "50% 45%",
  "123123": "50% 42%",
  "111": "50% 32%",
  "22": "50% 28%",
};
const focusOf = (src: string) =>
  FACE[
    src
      .split("/")
      .pop()!
      .replace(/\.\w+$/, "")
  ] ?? FACE_DEFAULT;

/**
 * "A few things we believe in": the title, four beliefs hanging off a central line, a closing line that scrolls away to reveal
 * the sign-off, then (same light background) the statement framed by a staggered wall of photos from people2.
 * Tiles crossfade to other photos one at a time.
 */
export function Believe({ featured = [] }: { featured?: string[] }) {
  const root = useRef<HTMLElement>(null);

  // Every photo in people2. If there are fewer than the wall has tiles, the list repeats so no tile is empty.
  const pool = featured;
  const initial = Array.from(
    { length: SLOTS },
    (_, i) => pool[i % Math.max(pool.length, 1)],
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tiles = q(".bl-tile") as HTMLElement[];
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      pool.forEach((src) => (new Image().src = src)); // warm the cache so swaps never pop in

      // The closing text is sized so its first line is exactly as wide as the sign-off.
      const fit = () => {
        const small = q(".bl-small")[0] as HTMLElement | undefined;
        const line = small?.querySelector<HTMLElement>(".bl-line");
        const sign = q(".bl-sign > span")[0] as HTMLElement | undefined;
        if (!small || !line || !sign) return;
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

      // The beliefs. Spine draws down with scroll while the node spins along it; each belief's diamond spins in and pings.
      // Skipped with reduced motion.
      if (!reduce) {
        const list = q(".bl-beliefs")[0] as HTMLElement;
        const span = { trigger: list, start: "top 65%", end: "bottom 60%", scrub: 0.6 };
        gsap.fromTo(q(".bl-spine"), { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: span });
        gsap.fromTo(
          q(".bl-node"),
          { y: 0, rotation: 45 },
          { y: () => list.offsetHeight, rotation: 405, ease: "none", scrollTrigger: { ...span, invalidateOnRefresh: true } },
        );

        // Per belief: only the diamond animates (spins in and pings). Label, elbow and copy are static.
        (q(".bl-item") as HTMLElement[]).forEach((item) => {
          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: item, start: "top 78%", toggleActions: "play none none reverse" },
            })
            .fromTo(item.querySelector(".bl-dot"), { scale: 0, rotate: -135 }, { scale: 1, rotate: 45, duration: 0.7 }, 0)
            .fromTo(item.querySelector(".bl-ping"), { scale: 1, rotate: 45, autoAlpha: 0.7 }, { scale: 4, rotate: 45, autoAlpha: 0, duration: 1, ease: "power2.out" }, 0.15);
        });
      }

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

      // Every tile swaps on its own clock, every 2-3 seconds, to a random photo (never the one it already shows). Repeats across tiles are fine.
      // Plain timers on purpose: no scroll flags, observers or image-decode steps that could stall. With reduced motion the swap is instant, not faded.
      const timers = new Map<HTMLElement, number>();
      console.log("BLDBG effect", tiles.length, pool.length);
      const swapTile = (tile: HTMLElement) => {
        const r = tile.getBoundingClientRect();
        console.log(
          "BLDBG swap",
          pool.length,
          !!tile.offsetParent,
          Math.round(r.top),
          innerHeight,
        );
        // Only tiles near the screen do the work (offsetParent is null for the columns hidden on phones).
        if (
          pool.length > 1 &&
          tile.offsetParent &&
          r.bottom > -300 &&
          r.top < innerHeight + 300
        ) {
          const [a, b] = Array.from(tile.querySelectorAll("img"));
          const [front, back] = tile.dataset.front === "b" ? [b, a] : [a, b];
          const current = front.getAttribute("src");
          let next = current;
          while (next === current)
            next = pool[Math.floor(Math.random() * pool.length)];
          let shown = false;
          const show = () => {
            if (shown) return;
            shown = true;
            if (reduce) {
              gsap.set(back, { opacity: 1, scale: 1 });
              gsap.set(front, { opacity: 0 });
            } else {
              gsap.fromTo(
                back,
                { opacity: 0, scale: 1.12 },
                { opacity: 1, scale: 1, duration: 1.2, ease: "power2.inOut" },
              );
              gsap.to(front, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
              });
            }
            tile.dataset.front = back === b ? "b" : "a";
          };
          back.onload = show;
          back.style.objectPosition = focusOf(next!);
          back.src = next!;
          if (back.complete && back.naturalWidth) show();
          window.setTimeout(show, 1500); // fallback if the load event never fires
        }
        timers.set(
          tile,
          window.setTimeout(() => swapTile(tile), 2000 + Math.random() * 1000),
        );
      };
      // First swaps are spread out so the wall doesn't change all at once.
      tiles.forEach((t) =>
        timers.set(
          t,
          window.setTimeout(() => swapTile(t), 400 + Math.random() * 2600),
        ),
      );
      return () => {
        timers.forEach((id) => window.clearTimeout(id));
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
        {/* Two lines: "A few things" / "we believe in", with the lime block on "believe". */}
        <h2
          aria-label={believe.title}
          className="font-wide text-[clamp(2rem,6.4vw,6.75rem)] leading-[0.98]"
        >
          <span aria-hidden className="block">
            A few things
          </span>
          <span aria-hidden className="mt-[0.08em] block">
            we <span className="hl">believe</span> in
          </span>
        </h2>

        {/* The beliefs hang off one central line, alternating sides and staggered, each on a curved elbow connector. */}
        <div className="relative w-full text-left md:w-[min(94vw,1300px)]">
          <div
            aria-hidden
            className="bl-spine absolute bottom-0 left-3 top-0 w-px bg-ink/20 md:left-1/2"
          />
          <span
            aria-hidden
            className="bl-node absolute left-3 top-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-lime ring-1 ring-ink/40 md:left-1/2"
          />
          <ol className="bl-beliefs pt-14 md:grid md:grid-cols-2 md:gap-y-20 md:pt-20">
            {believe.stages.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={s.title}
                  data-side={right ? "r" : "l"}
                  className={`bl-item relative mb-14 pl-10 md:mb-0 md:pl-0 ${right ? "md:col-start-2 md:mt-32 md:pl-28" : "md:col-start-1 md:pr-28 md:text-right"}`}
                >
                  {/* Elbow: rises from the central line, curves, then runs out toward the text. */}
                  <span
                    aria-hidden
                    className={`bl-elbow absolute top-3 hidden h-16 w-24 border-ink/30 md:block ${right ? "left-0 rounded-tl-[3rem] border-l border-t" : "right-0 rounded-tr-[3rem] border-r border-t"}`}
                  />
                  <div
                    className={`flex items-center gap-3 ${right ? "" : "md:flex-row-reverse"}`}
                  >
                    <span aria-hidden className="relative grid shrink-0 place-items-center">
                      <span className="bl-ping absolute size-2.5 rotate-45 border border-ink opacity-0" />
                      <span className="bl-dot size-2.5 rotate-45 border border-ink bg-lime" />
                    </span>
                    <span
                      className="bl-label cursor-default bg-ink px-2.5 py-1.5 font-wide text-[clamp(0.75rem,1vw,1rem)] leading-tight text-bone"
                    >
                      {String(i + 1).padStart(2, "0")} &nbsp;&nbsp; · &nbsp;{" "}
                      {s.title}
                    </span>
                  </div>
                  <p
                    className={`bl-body mt-5 max-w-[34ch] font-serif text-[clamp(1.05rem,1.5vw,1.55rem)] leading-[1.35] ${right ? "" : "md:ml-auto"}`}
                  >
                    {s.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Pinned: the small closing text scrolls away and reveals the sign-off. */}
        <div className="w-full">
          <div className="bl-end relative h-[50svh] w-full">
            <p className="bl-small absolute inset-0 flex flex-col items-center justify-center font-wide leading-none">
              <span className="bl-line block w-max">{believe.closing[0]}</span>
              <span className="bl-line block w-max">
                <span className="hl">{believe.closing[1]}</span>
              </span>
            </p>
            <p className="bl-sign absolute inset-0 flex items-center justify-center font-wide whitespace-nowrap text-[clamp(0.65rem,3.2vw,4.5rem)] leading-none">
              <span className="bl-line block w-max">{believe.sign}</span>
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
        <h2 className="col-span-4 row-start-1 px-2 pb-12 text-center font-serif font-bold uppercase text-[clamp(1.75rem,2.7vw,3.5rem)] leading-[1.1] md:col-start-3 md:whitespace-nowrap md:pb-6 md:pt-[calc(var(--tw)*0.33)]">
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
                  data-hc
                  className="bl-tile relative aspect-[7/9] overflow-hidden rounded-2xl bg-bone-dim"
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
