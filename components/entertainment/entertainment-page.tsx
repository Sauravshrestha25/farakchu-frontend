"use client";

import { useRef, useState } from "react";
import { PageTheme } from "@/components/page-theme";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Nav } from "../nav";
import { instagramIcon, phoneIcon, locationIcon } from "../ui/footer-icons";
import { site, visit } from "@/content/site";
import { pages } from "./pages";
import { PSButton, PS_KINDS } from "./ps-buttons";

gsap.registerPlugin(ScrollTrigger);

const pill =
  "inline-flex min-h-11 items-center justify-center rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] leading-none text-ink transition-colors hover:bg-bone";
const ghost =
  "inline-flex min-h-11 items-center justify-center rounded-[50%] border border-bone/50 px-8 py-3 font-wide text-[0.625rem] leading-none text-bone transition-colors hover:bg-bone/15";
const h2 = "font-wide text-[clamp(2rem,4vw,3.5rem)] leading-[1]";
const outline = "text-transparent [-webkit-text-stroke:2px_var(--color-bone)]";

export function EntertainmentPage({ page }: { page: keyof typeof pages }) {
  const d = pages[page];
  const root = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero title: letters get mashed in from above like button presses.
        gsap.from(".h-ch", {
          y: () => -gsap.utils.random(260, 520),
          rotate: () => gsap.utils.random(-50, 50),
          opacity: 0,
          scale: 1.6,
          duration: 1,
          ease: "bounce.out",
          stagger: { each: 0.07, from: "random" },
        });
        gsap.from(".h-in", {
          y: 24,
          opacity: 0,
          duration: 1,
          delay: 1.1,
          stagger: 0.1,
          ease: "power3.out",
        });
        gsap.to(".h-bg", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.utils
          .toArray<HTMLElement>(".rv")
          .forEach((el) =>
            gsap.from(el, {
              y: 60,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            }),
          );

        // Statement fills word by word while you scroll.
        gsap.fromTo(
          ".sw",
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: {
              trigger: ".stmt",
              start: "top 75%",
              end: "bottom 55%",
              scrub: true,
            },
          },
        );

        // Word rows race sideways in opposite directions.
        gsap.utils
          .toArray<HTMLElement>(".wd-row")
          .forEach((row, i) =>
            gsap.fromTo(
              row,
              { xPercent: i % 2 ? 28 : -28 },
              {
                xPercent: i % 2 ? -28 : 28,
                ease: "none",
                scrollTrigger: {
                  trigger: ".wd",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            ),
          );

        // Photo wall: every polaroid drifts at its own speed.
        gsap.utils
          .toArray<HTMLElement>(".pol")
          .forEach((el, i) =>
            gsap.fromTo(
              el,
              { y: 50 + (i % 3) * 30 },
              {
                y: -50 - (i % 3) * 30,
                ease: "none",
                scrollTrigger: {
                  trigger: ".wall",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );
      });
    },
    { scope: root },
  );

  // ponytail: no form backend yet. Copies the message and opens the Instagram DM, same as the other forms.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await navigator.clipboard
      ?.writeText(`${f.get("message")}\n\n${f.get("email")}`)
      .catch(() => {});
    setSent(true);
    window.open(site.contactHref, "_blank", "noopener");
  };

  const to = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const words = [d.statement[0], d.statement[1], d.statement[2]].map(
    (t, part) =>
      t
        .trim()
        .split(/\s+/)
        .map((w, i) => (
          <span
            key={`${part}-${i}`}
            className={`sw inline-block ${part === 1 ? "hl mx-[0.12em]" : "mr-[0.28em]"}`}
          >
            {w}
          </span>
        )),
  );

  return (
    <div ref={root} className="theme-gaming min-h-svh bg-teal-deep text-bone">
      <PageTheme name="gaming" />
      <Nav page="sub" />

      {/* Hero */}
      <section className="hero relative flex min-h-svh items-center justify-center overflow-hidden px-4 text-center">
        <div className="h-bg absolute -inset-y-[10%] inset-x-0">
          <Image
            src={d.hero.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-teal-deep)_82%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.22)_0_1px,transparent_1px_3px)]" />
        <div className="relative">
          <h1
            aria-label="Farak Chu"
            className="font-azonix text-[clamp(2.5rem,7vw,6rem)] leading-[1]"
          >
            {"FARAK CHU".split("").map((c, i) => (
              <span key={i} aria-hidden className="h-ch inline-block text-bone">
                {c === " " ? " " : c}
              </span>
            ))}
          </h1>
          <p className="h-in mt-4 font-wide text-[clamp(1.1rem,2vw,1.6rem)] leading-none">
            {d.sub[0]} <span className="hl">{d.sub[1]}</span>
          </p>
          <p className="h-in mx-auto mt-8 max-w-sm text-sm text-bone/95">
            {d.blurb}
          </p>
          <div className="h-in mt-8 flex flex-wrap justify-center gap-3">
            <a href="#games" onClick={to("games")} className={pill}>
              Enter the game
            </a>
            <a
              href={site.contactHref}
              target="_blank"
              rel="noreferrer"
              className={ghost}
            >
              Book a night
            </a>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="stmt relative overflow-hidden px-4 py-32 lg:px-8 lg:py-48">
        <Image
          src={d.hero.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-deep via-teal-deep/50 to-teal-deep" />
        <p className="relative mx-auto max-w-5xl font-wide text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.2]">
          {words}
        </p>
      </section>

      {/* Words */}
      <section
        className="wd overflow-hidden py-16 lg:py-28"
        aria-label="What happens here"
      >
        <div className="flex flex-col gap-3 lg:gap-6">
          {d.words.map((row, i) => (
            <div
              key={i}
              className="wd-row flex w-max items-center gap-[3vw] whitespace-nowrap font-wide text-[clamp(2rem,5vw,4.5rem)] leading-[1]"
            >
              {row.map((w, j) => (
                <span key={w.t} className="flex items-center gap-[3vw]">
                  <span className={w.hl ? "hl" : outline}>{w.t}</span>
                  <PSButton
                    kind={PS_KINDS[(i + j) % 4]}
                    className="size-[0.7em]"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Nights: cards stack as you scroll */}
      <section id="games" className="px-2 pb-10">
        <h2 className={`rv px-2 py-20 text-center lg:py-32 ${h2}`}>
          {d.nights[0]}
          <span className="hl">{d.nights[1]}</span>
        </h2>
        <div className="flex flex-col gap-4">
          {d.cards.map((c, i) => (
            <article
              key={c.name}
              className="grid gap-2 rounded-[2rem]  lg:sticky lg:grid-cols-[1fr_2fr]"
              style={{ top: `${5 + i * 1.1}rem` }}
            >
              <div
                className={`relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl p-8 text-center lg:min-h-[34rem] ${c.panel}`}
              >
                <PSButton
                  kind={PS_KINDS[i % 4]}
                  className="absolute left-5 top-5 size-12"
                />
                <p className="font-wide text-[0.625rem]">{c.kind}</p>
                <h3 className="font-wide text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[0.95]">
                  {c.name}
                </h3>
                <p className="max-w-[28ch]">{c.body}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex min-h-11 items-center rounded-[50%] px-8 py-3 font-wide text-[0.625rem] leading-none transition-colors ${c.panel.includes("lime") ? "bg-ink text-bone hover:bg-teal-deep" : "bg-lime text-ink hover:bg-bone"}`}
                >
                  {c.cta}
                </a>
                <ul className="flex max-w-xs flex-wrap justify-center gap-2">
                  {c.tags.map((t) => (
                    <li
                      key={t}
                      className={`rounded-full px-4 py-1.5 text-sm ${c.chip}`}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative grid min-h-[26rem] place-items-center overflow-hidden rounded-3xl bg-teal lg:min-h-[34rem]">
                {c.poster ? (
                  <>
                    <Image
                      src={c.img.src}
                      alt=""
                      fill
                      sizes="50vw"
                      className="scale-125 object-cover opacity-30 blur-2xl"
                    />
                    <div className="relative aspect-[4/5] h-[88%] max-h-[30rem] overflow-hidden rounded-2xl ring-1 ring-bone/20">
                      <Image
                        src={c.img.src}
                        alt={c.img.alt}
                        fill
                        sizes="(min-width:1024px) 30vw, 80vw"
                        className="object-cover"
                      />
                    </div>
                  </>
                ) : (
                  <Image
                    src={c.img.src}
                    alt={c.img.alt}
                    fill
                    sizes="(min-width:1024px) 66vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* What's on offer: a pinned-up photo wall */}
      <section
        id="services"
        className="wall relative overflow-hidden px-4 py-28 lg:px-8 lg:py-44"
      >
        <div className="relative mx-auto max-w-6xl">
          <h2 className={`rv pb-20 text-center ${h2}`}>
            What&apos;s <span className="hl">on offer.</span>
          </h2>
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {d.offers.map((o, i) => {
              const tilt = [-4, 3, -2, 4, -3.4, 2.4, -4.2, 3.2][i % 8];
              const ratio = [
                "aspect-[4/5]",
                "aspect-square",
                "aspect-[5/4]",
                "aspect-[3/4]",
              ][i % 4];
              return (
                <article
                  key={o.title}
                  className="pol group relative mb-14 break-inside-avoid transition-transform duration-500 hover:z-[1] hover:!rotate-0 hover:scale-[1.05]"
                  style={{ rotate: `${tilt}deg` }}
                >
                  <span
                    aria-hidden
                    className="absolute -top-3 left-1/2 z-[2] h-7 w-24 -translate-x-1/2 rotate-[-4deg] bg-lime/85 shadow-sm"
                  />
                  <div className="rounded-md bg-bone p-3 pb-5 text-ink shadow-[0_24px_40px_-12px_rgb(0_0_0/0.65)]">
                    <div
                      className={`relative overflow-hidden rounded-sm ${ratio}`}
                    >
                      <Image
                        src={o.img.src}
                        alt={o.img.alt}
                        fill
                        sizes="(min-width:1024px) 30vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="mt-4 font-wide text-[clamp(1.3rem,2vw,1.9rem)] leading-[0.95]">
                      {o.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink">{o.line}</p>
                  </div>
                  <PSButton
                    kind={PS_KINDS[i % 4]}
                    className="absolute -right-5 -top-6 z-[2] size-16 rotate-12 drop-shadow-xl transition-transform duration-500 group-hover:rotate-[-14deg] group-hover:scale-125"
                  />
                  <span className="absolute -bottom-3 left-4 z-[2] -rotate-3 rounded-full bg-lime px-3.5 py-1.5 font-wide text-[0.625rem] leading-none text-ink shadow-md">
                    {o.tag}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 py-24 lg:px-8 lg:py-36">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-2">
          <div className="rv">
            <h2 className={h2}>
              {d.cta[0]}
              <span className="hl">{d.cta[1]}</span>
            </h2>
            <p className="mt-6 max-w-sm text-bone/95">{d.ctaBody}</p>
            <div className="mt-8 flex flex-col gap-3 text-sm text-bone/95">
              {visit.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
              <a
                className="inline-flex w-fit items-center gap-2 hover:text-lime"
                href={site.phoneHref}
              >
                {phoneIcon}
                {site.phone}
              </a>
              <a
                className="inline-flex w-fit items-center gap-2 hover:text-lime"
                href={d.handle.href}
                target="_blank"
                rel="noreferrer"
              >
                {instagramIcon}
                {d.handle.label}
              </a>
              <a
                className="inline-flex w-fit items-center gap-2 hover:text-lime"
                href={visit.directions}
                target="_blank"
                rel="noreferrer"
              >
                {locationIcon}Get directions ↗
              </a>
            </div>
          </div>
          <form
            onSubmit={submit}
            className="rv flex flex-col gap-6 rounded-3xl border border-bone/20 bg-teal p-8"
          >
            <label className="flex flex-col gap-1 text-sm text-bone/95">
              Email*
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-bone/95">
              What&apos;s the plan?
              <textarea
                name="message"
                rows={3}
                className="resize-none border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime"
              />
            </label>
            <div className="flex items-center gap-5">
              <button
                type="submit"
                disabled={!email.trim()}
                className={`${pill} disabled:opacity-40`}
              >
                Send
              </button>
              <p aria-live="polite" className="text-xs text-bone/85">
                {sent && "Copied. Paste it into the DM that just opened."}
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
