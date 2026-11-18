"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { guests } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// Frames cycle through these sizes (in units of --u). They all sit on one baseline, so the row reads as a skyline.
const SHAPES = [
  { w: 16, h: 21 },
  { w: 19, h: 14 },
  { w: 15, h: 19 },
  { w: 20, h: 15 },
  { w: 17, h: 22 },
];

// Dates on the calendar badges. PLACEHOLDERS: apart from Rabindra Dhant's (Road to UFC, Aug 28, from the events data),
// each date is made up from the guest's name so it stays stable between renders.
// TODO(client): replace with the real visit dates, as month (3 letters) + day, in DATES.
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const DATES: Record<string, { m: string; d: string }> = {
  "Rabindra Dhant": { m: "AUG", d: "28" },
};
const when = (name: string) => {
  if (DATES[name]) return DATES[name];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { m: MONTHS[h % 12], d: String(1 + ((h >>> 4) % 28)) };
};

// "Who's been through": the heading, then an endless right-to-left row of guest photos in dashed frames.
// The list is rendered twice and the track slides half its width, so the loop has no seam. It never pauses.
export function Guests() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(gsap.utils.selector(root)(".gw-head-line"), {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="guests"
      className="relative overflow-hidden bg-teal-deep py-24 text-bone lg:py-32"
    >
      <div className="px-4 text-center lg:px-8">
        <h2 className="font-wide text-[clamp(2.4rem,6vw,6.5rem)] leading-[0.92]">
          <span className="block overflow-hidden">
            <span className="gw-head-line block">Who&apos;s been</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="gw-head-line block">
              <span className="hl">through.</span>
            </span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-[24rem] text-center text-[0.8125rem] uppercase leading-[1.25] [0.025rem] text-bone/95">
          Bands, fighters, filmmakers and friends who pulled up, played,
          premiered or celebrated at the house.
        </p>
      </div>

      <div className="mt-16 overflow-hidden [--u:1rem] max-md:[--u:0.7rem] lg:mt-20">
        <div
          className="fc-marquee flex w-max"
          style={
            { "--marquee-dur": `${guests.length * 9}s` } as React.CSSProperties
          }
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-end gap-6 pr-6"
            >
              {guests.map((g, i) => {
                const s = SHAPES[i % SHAPES.length];
                return (
                  <li
                    key={g.name}
                    data-hc
                    className="shrink-0"
                    style={{ width: `calc(var(--u) * ${s.w} + 1.1rem)` }}
                  >
                    {/* Dashed frame with a mat, like a pinned-up print. */}
                    <div className="rounded-2xl border-[1.5px] border-dashed border-bone/60 p-2">
                      <div
                        className="relative overflow-hidden rounded-xl bg-teal"
                        style={{
                          width: `calc(var(--u) * ${s.w})`,
                          height: `calc(var(--u) * ${s.h})`,
                        }}
                      >
                        <Image
                          src={g.image.src}
                          alt={copy === 0 ? g.image.alt : ""}
                          fill
                          sizes="25vw"
                          draggable={false}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3 px-1">
                      <div className="min-w-0">
                        <h3 className="font-wide text-sm leading-none">
                          {g.name}
                        </h3>
                        <p className="mt-1.5 text-[0.6875rem] uppercase leading-[1.25] [0.025rem] text-bone/85">
                          {g.note}
                        </p>
                      </div>
                      {/* Calendar badge instead of a link. */}
                      <div
                        className="w-11 shrink-0 overflow-hidden rounded-md border border-white/50 bg-[#003638] text-center"
                        aria-label={`${when(g.name).m} ${when(g.name).d}`}
                      >
                        <span className="block bg-[#1d4d4a] py-0.5 font-wide text-[0.5rem] leading-none text-white">
                          {when(g.name).m}
                        </span>
                        <span className="block py-1.5 font-wide text-base leading-none text-white">
                          {when(g.name).d}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
