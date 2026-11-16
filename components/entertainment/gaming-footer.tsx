"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LogoMark } from "../logo-mark";
import { instagramIcon, phoneIcon, locationIcon } from "../ui/footer-icons";
import { PSCluster } from "./ps-buttons";
import { Controller, DPad, Headset, Joystick, Screen, Trophy } from "./console-icons";
import { site, visit } from "@/content/site";

type Photo = { src: string; alt: string };

// Console icons float around the big logo. pos = absolute placement, d = float delay.
const icons = [
  { I: Controller, pos: "left-[6%] top-[14%] size-16 md:size-28 -rotate-12", d: "0s", c: "text-lime" },
  { I: Joystick, pos: "right-[8%] top-[8%] size-14 md:size-24 rotate-12", d: "-1.2s", c: "text-bone" },
  { I: Headset, pos: "left-[34%] bottom-[22%] size-12 md:size-20 rotate-6", d: "-2.1s", c: "text-bone" },
  { I: Trophy, pos: "right-[22%] bottom-[12%] size-14 md:size-24 -rotate-6", d: "-0.6s", c: "text-lime" },
  { I: DPad, pos: "left-[40%] top-[4%] size-10 md:size-16 rotate-12", d: "-1.7s", c: "text-lime" },
  { I: Screen, pos: "right-[36%] bottom-[5%] size-12 md:size-20 -rotate-3", d: "-2.6s", c: "text-bone" },
];

// Diamond-cut photos (same shape as the logo) with a lime diamond behind each one for an outline.
const spots = [
  "left-[1%] top-[30%] w-[26vw] md:w-[17vw]",
  "right-[1%] top-[36%] w-[24vw] md:w-[15vw]",
  "left-[14%] bottom-[2%] hidden w-[16vw] md:block",
  "right-[16%] top-[2%] hidden w-[13vw] md:block",
];

export function GamingFooter({ photos }: { photos: Photo[] }) {
  // Arcade "continue?" countdown: 9 down to 0, then around again.
  const [n, setN] = useState(9);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((v) => (v === 0 ? 9 : v - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-bone/15 bg-teal-deep">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.18)_0_1px,transparent_1px_3px)]" />
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 py-24 text-center">
        {photos.slice(0, 4).map((ph, i) => (
          <div key={i} aria-hidden className={`fc-float absolute aspect-square ${spots[i]}`} style={{ "--d": `${-i * 1.3}s` } as React.CSSProperties}>
            <div className="diamond absolute inset-0 bg-lime" />
            <div className="diamond absolute inset-[2.5%] overflow-hidden">
              <Image src={ph.src} alt="" fill sizes="20vw" className="object-cover" />
            </div>
          </div>
        ))}

        <span aria-hidden className="fc-float absolute bottom-[28%] right-[3%] size-20 rotate-12 md:size-32" style={{ "--d": "-0.9s" } as React.CSSProperties}>
          <PSCluster className="size-full" />
        </span>

        {icons.map(({ I, pos, d, c }, i) => (
          <span key={i} aria-hidden className={`fc-float absolute ${pos} ${c}`} style={{ "--d": d } as React.CSSProperties}>
            <I className="size-full" />
          </span>
        ))}

        <div className="relative z-[1] flex flex-col items-center">
          <LogoMark className="size-[min(50vw,19rem)] text-bone drop-shadow-[0_0_50px_rgb(214_255_80/0.3)]" title="Farakchu" />
          <p className="mt-6 font-azonix text-[clamp(2.4rem,9vw,8rem)] leading-none text-lime [text-shadow:0_0_40px_rgb(214_255_80/0.35)]">
            Continue?
          </p>
          <p aria-hidden className="mt-1 font-azonix text-[clamp(4rem,16vw,13rem)] leading-none text-bone [-webkit-text-stroke:2px_var(--color-lime)] [text-shadow:none]">
            <span className="text-transparent">{n}</span>
          </p>
          <p className="mt-4 max-w-xs text-sm text-bone/95">Controllers are charged. Your squad is waiting.</p>
          <a
            href={site.contactHref}
            target="_blank"
            rel="noreferrer"
            className="fc-blink mt-8 inline-flex min-h-12 items-center justify-center rounded-[50%] bg-lime px-12 py-4 font-wide text-[0.7rem] leading-none text-ink transition-colors hover:bg-bone"
          >
            Insert coin
          </a>
        </div>
      </div>

      <div className="relative z-[3] flex flex-col items-center justify-between gap-5 border-t border-bone/15 px-4 py-6 text-xs text-bone/85 lg:flex-row lg:px-8">
        <span>© 2026 Farakchu · All Rights Reserved.</span>
        <span className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-bone">
          <a className="inline-flex items-center gap-2 hover:text-lime" href={site.phoneHref}>{phoneIcon}{site.phone}</a>
          <a className="inline-flex items-center gap-2 hover:text-lime" href="https://www.instagram.com/farakchu.gamezone/" target="_blank" rel="noreferrer">{instagramIcon}farakchu.gamezone</a>
          <a className="inline-flex items-center gap-2 hover:text-lime" href={visit.directions} target="_blank" rel="noreferrer">{locationIcon}Directions ↗</a>
        </span>
        <a href="/" className="font-wide text-[0.625rem] text-bone transition-colors hover:text-lime">← Back to Farakchu</a>
      </div>
    </footer>
  );
}
