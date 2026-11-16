"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Nav } from "../nav";
import { instagramIcon, phoneIcon, locationIcon } from "../ui/footer-icons";
import { site, visit } from "@/content/site";
import { pages } from "./pages";
import { GamingFooter } from "./gaming-footer";
import { PSButton, PS_KINDS, psSvg } from "./ps-buttons";

gsap.registerPlugin(ScrollTrigger);

const pill =
  "inline-flex min-h-11 items-center justify-center rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] leading-none text-ink transition-colors hover:bg-bone";
const ghost =
  "inline-flex min-h-11 items-center justify-center rounded-[50%] border border-bone/50 px-8 py-3 font-wide text-[0.625rem] leading-none text-bone transition-colors hover:bg-bone/15";
const h2 = "font-wide text-[clamp(2.6rem,7vw,7.5rem)] leading-[0.9]";
const outline = "text-transparent [-webkit-text-stroke:2px_var(--color-bone)]";

// 16-point starburst for the "new high score" sticker.
const burst = Array.from({ length: 32 }, (_, i) => {
  const r = i % 2 ? 36 : 50;
  const a = (i / 32) * Math.PI * 2;
  return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(" ");

// Strip of buttons + words that scrolls forever.
function Strip({ cls, dur, reverse }: { cls: string; dur: string; reverse?: boolean }) {
  return (
    <div aria-hidden className={`absolute inset-x-[-4%] top-1/2 -translate-y-1/2 overflow-hidden py-3.5 text-ink ${cls}`}>
      <div className="fc-marquee flex w-max" style={{ "--marquee-dur": dur, animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}>
        {[0, 1].map((c) => (
          <span key={c} className="flex shrink-0 items-center gap-8 pr-8 font-wide text-[clamp(1.2rem,2.8vw,2.4rem)] leading-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                {PS_KINDS.map((k) => (
                  <PSButton key={k} kind={k} className="size-[clamp(2.2rem,3.8vw,3.4rem)]" />
                ))}
                <span>Press start</span>
                <span>Player one</span>
                <span>Ek game matrai</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function EntertainmentPage({ page }: { page: keyof typeof pages }) {
  const d = pages[page];
  const root = useRef<HTMLDivElement>(null);
  const score = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Score HUD runs on every motion setting: it is just a readout of scroll progress.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (score.current) score.current.textContent = String(Math.round(self.progress * 999999)).padStart(6, "0");
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          if (hud.current) hud.current.style.opacity = self.progress > 0.965 ? "0" : "1"; // clear of the footer links
        },
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero title: letters get mashed in from above like button presses.
        gsap.from(".h-ch", { y: () => -gsap.utils.random(260, 520), rotate: () => gsap.utils.random(-50, 50), opacity: 0, scale: 1.6, duration: 1, ease: "bounce.out", stagger: { each: 0.07, from: "random" } });
        gsap.from(".h-in", { y: 24, opacity: 0, duration: 1, delay: 1.1, stagger: 0.1, ease: "power3.out" });
        gsap.from(".h-btn", { scale: 0, rotate: -90, duration: 0.8, delay: 0.6, stagger: 0.12, ease: "back.out(2.4)" });
        gsap.to(".h-bg", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".h-ghost", { xPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

        gsap.utils.toArray<HTMLElement>(".rv").forEach((el) =>
          gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
        );

        // Statement fills word by word while you scroll.
        gsap.fromTo(".sw", { opacity: 0.18 }, { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: ".stmt", start: "top 75%", end: "bottom 55%", scrub: true } });

        // Word rows race sideways in opposite directions.
        gsap.utils.toArray<HTMLElement>(".wd-row").forEach((row, i) =>
          gsap.fromTo(row, { xPercent: i % 2 ? 28 : -28 }, { xPercent: i % 2 ? -28 : 28, ease: "none", scrollTrigger: { trigger: ".wd", start: "top bottom", end: "bottom top", scrub: 0.6 } }),
        );

        // Photo wall: every polaroid drifts at its own speed.
        gsap.utils.toArray<HTMLElement>(".pol").forEach((el, i) =>
          gsap.fromTo(el, { y: 50 + (i % 3) * 30 }, { y: -50 - (i % 3) * 30, ease: "none", scrollTrigger: { trigger: ".wall", start: "top bottom", end: "bottom top", scrub: true } }),
        );

        // High scores count up and their bars fill.
        gsap.utils.toArray<HTMLElement>(".stat").forEach((el) => {
          const o = { v: 0 };
          gsap.to(o, { v: Number(el.dataset.to), duration: 2, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".stat-bar").forEach((el) =>
          gsap.from(el, { scaleX: 0, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 95%", once: true } }),
        );
      });
    },
    { scope: root },
  );

  // Click anywhere: a burst of PS buttons flies out of the cursor.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pop = (e: PointerEvent) => {
      for (let i = 0; i < 5; i++) {
        const el = document.createElement("span");
        el.setAttribute("aria-hidden", "true");
        el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:40px;height:40px;margin:-20px 0 0 -20px;z-index:200;pointer-events:none`;
        el.innerHTML = psSvg(PS_KINDS[Math.floor(Math.random() * 4)]);
        document.body.appendChild(el);
        const ang = (-Math.PI / 2) + (i - 2) * 0.55 + gsap.utils.random(-0.15, 0.15);
        const dist = gsap.utils.random(90, 170);
        gsap.fromTo(el, { scale: 0.2, rotate: 0 }, { scale: 1.1, rotate: gsap.utils.random(-120, 120), x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, duration: 0.55, ease: "power3.out" });
        gsap.to(el, { y: `+=${120}`, opacity: 0, delay: 0.5, duration: 0.6, ease: "power2.in", onComplete: () => el.remove() });
      }
    };
    addEventListener("pointerdown", pop);
    return () => removeEventListener("pointerdown", pop);
  }, []);

  // ponytail: no form backend yet. Copies the message and opens the Instagram DM, same as the other forms.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await navigator.clipboard?.writeText(`${f.get("message")}\n\n${f.get("email")}`).catch(() => {});
    setSent(true);
    window.open(site.contactHref, "_blank", "noopener");
  };

  const to = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const words = [d.statement[0], d.statement[1], d.statement[2]].map((t, part) =>
    t.trim().split(/\s+/).map((w, i) => (
      <span key={`${part}-${i}`} className={`sw inline-block ${part === 1 ? "hl mx-[0.12em]" : "mr-[0.28em]"}`}>
        {w}
      </span>
    )),
  );

  return (
    <div ref={root} className="min-h-svh bg-teal-deep text-bone">
      <Nav page="sub" />

      {/* Score HUD */}
      <div ref={hud} className="pointer-events-none fixed bottom-4 left-1/2 z-40 transition-opacity duration-300 flex -translate-x-1/2 items-center gap-3 rounded-full border border-bone/25 bg-ink/90 px-5 py-2.5 backdrop-blur-md">
        <span className="font-azonix text-[0.6rem] text-lime">P1</span>
        <span className="font-azonix text-[0.6rem] tabular-nums text-bone">
          <span ref={score}>000000</span>
        </span>
        <span className="relative hidden h-1.5 w-24 overflow-hidden rounded-full bg-bone/20 sm:block">
          <span ref={bar} className="absolute inset-0 origin-left rounded-full bg-lime" style={{ transform: "scaleX(0)" }} />
        </span>
      </div>

      {/* Hero */}
      <section className="hero relative flex min-h-svh items-center justify-center overflow-hidden px-4 text-center">
        <div className="h-bg absolute -inset-y-[10%] inset-x-0">
          <Image src={d.hero.src} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-teal-deep)_82%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.22)_0_1px,transparent_1px_3px)]" />
        <p aria-hidden className={`h-ghost absolute left-[8%] top-1/2 -translate-y-1/2 whitespace-nowrap font-azonix text-[34vw] leading-none opacity-[0.12] ${outline}`}>
          P1
        </p>
        {PS_KINDS.map((k, i) => (
          <PSButton
            key={k}
            kind={k}
            className={`h-btn fc-float absolute size-16 drop-shadow-[0_0_30px_rgb(214_255_80/0.35)] md:size-32 ${["left-[5%] top-[20%] -rotate-12", "right-[6%] top-[18%] rotate-12", "left-[10%] bottom-[16%] rotate-6", "right-[9%] bottom-[18%] -rotate-6"][i]}`}
          />
        ))}
        <div className="relative">
          <h1 aria-label="Farak Chu" className="font-azonix text-[clamp(3rem,12vw,11rem)] leading-[0.95]">
            {"FARAK CHU".split("").map((c, i) => (
              <span key={i} aria-hidden className="h-ch inline-block text-bone">
                {c === " " ? " " : c}
              </span>
            ))}
          </h1>
          <p className="h-in mt-4 font-wide text-[clamp(1.3rem,3.4vw,2.8rem)] leading-none">
            {d.sub[0]} <span className="hl">{d.sub[1]}</span>
          </p>
          <p className="h-in mx-auto mt-8 max-w-sm text-sm text-bone/95">{d.blurb}</p>
          <div className="h-in mt-8 flex flex-wrap justify-center gap-3">
            <a href="#games" onClick={to("games")} className={`${pill} gap-3`}>
              <PSButton kind="cross" className="size-6" />
              Enter the game
            </a>
            <a href={site.contactHref} target="_blank" rel="noreferrer" className={ghost}>Book a night</a>
          </div>
          <p className="h-in fc-blink mt-8 font-azonix text-[0.7rem] text-lime">Press ✕ to start</p>
        </div>
      </section>

      {/* Statement */}
      <section className="stmt relative overflow-hidden px-4 py-32 lg:px-8 lg:py-48">
        <Image src={d.hero.src} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-deep via-teal-deep/50 to-teal-deep" />
        <p className="relative mx-auto max-w-5xl font-wide text-[clamp(2rem,5.4vw,5.4rem)] leading-[1.05]">{words}</p>
      </section>

      {/* Words */}
      <section className="wd overflow-hidden py-16 lg:py-28" aria-label="What happens here">
        <div className="flex flex-col gap-3 lg:gap-6">
          {d.words.map((row, i) => (
            <div key={i} className="wd-row flex w-max items-center gap-[3vw] whitespace-nowrap font-wide text-[clamp(3.4rem,11vw,11rem)] leading-[0.95]">
              {row.map((w, j) => (
                <span key={w.t} className="flex items-center gap-[3vw]">
                  <span className={w.hl ? "hl" : outline}>{w.t}</span>
                  <PSButton kind={PS_KINDS[(i + j) % 4]} className="size-[0.7em]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Crossing strips */}
      <div aria-hidden className="relative h-44 overflow-hidden md:h-56">
        <Strip cls="rotate-[4deg] bg-bone" dur="46s" reverse />
        <Strip cls="-rotate-[4deg] bg-lime" dur="38s" />
      </div>

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
              className="grid gap-2 rounded-[2rem] bg-teal-deep lg:sticky lg:grid-cols-[1fr_2fr]"
              style={{ top: `${5 + i * 1.1}rem` }}
            >
              <div className={`relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl p-8 text-center lg:min-h-[34rem] ${c.panel}`}>
                <PSButton kind={PS_KINDS[i % 4]} className="absolute left-5 top-5 size-12" />
                <p className="font-wide text-[0.625rem]">{c.kind}</p>
                <h3 className="font-wide text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[0.95]">{c.name}</h3>
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
                    <li key={t} className={`rounded-full px-4 py-1.5 text-sm ${c.chip}`}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="relative grid min-h-[26rem] place-items-center overflow-hidden rounded-3xl bg-teal lg:min-h-[34rem]">
                {c.poster ? (
                  <>
                    <Image src={c.img.src} alt="" fill sizes="50vw" className="scale-125 object-cover opacity-30 blur-2xl" />
                    <div className="relative aspect-[4/5] h-[88%] max-h-[30rem] overflow-hidden rounded-2xl ring-1 ring-bone/20">
                      <Image src={c.img.src} alt={c.img.alt} fill sizes="(min-width:1024px) 30vw, 80vw" className="object-cover" />
                    </div>
                  </>
                ) : (
                  <Image src={c.img.src} alt={c.img.alt} fill sizes="(min-width:1024px) 66vw, 100vw" className="object-cover" />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* High scores: the page flips to lime */}
      <section className="relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-lime px-4 py-24 text-ink lg:rounded-t-[5rem] lg:px-8 lg:py-36">
        <p aria-hidden className="absolute -right-[4vw] top-6 whitespace-nowrap font-azonix text-[22vw] leading-none text-ink/[0.07]">1UP</p>
        <h2 className={`rv relative text-center ${h2}`}>
          High <span className="rounded-[0.16em] bg-ink px-[0.08em] pb-[0.02em] pt-[0.04em] text-lime">scores.</span>
        </h2>
        <div className="relative mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.stats.map((st, i) => (
            <div key={st.label} className="rv relative flex flex-col overflow-hidden rounded-3xl bg-ink p-6 text-bone">
              <PSButton kind={PS_KINDS[i % 4]} className="absolute right-4 top-4 size-10" />
              <p className="whitespace-nowrap font-azonix text-[clamp(2.8rem,5.4vw,4.6rem)] leading-none text-lime">
                {st.pre && <span className="mr-1 text-[0.4em]">{st.pre}</span>}
                <span className="stat" data-to={st.to}>0</span>
                {st.post && <span className="ml-1 text-[0.4em]">{st.post}</span>}
              </p>
              <p className="mb-5 mt-3 font-wide text-sm leading-tight">{st.label}</p>
              <div className="mt-auto h-2 overflow-hidden rounded-full bg-bone/20">
                <div className="stat-bar h-full origin-left rounded-full bg-lime" style={{ width: `${st.bar}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's on offer: a pinned-up photo wall */}
      <section id="services" className="wall relative overflow-hidden px-4 py-28 lg:px-8 lg:py-44">
        <div className="relative mx-auto max-w-6xl">
          <h2 className={`rv pb-20 text-center ${h2}`}>
            What&apos;s <span className="hl">on offer.</span>
          </h2>
          <div aria-hidden className="fc-spin absolute -left-6 -top-10 hidden size-40 lg:block">
            <svg viewBox="0 0 100 100" className="size-full"><polygon points={burst} fill="#d6ff50" /></svg>
          </div>
          <p aria-hidden className="absolute -left-6 -top-10 hidden size-40 -rotate-12 place-items-center text-center font-wide text-[0.7rem] leading-[0.95] text-ink lg:grid">
            New<br />high<br />score!
          </p>
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {d.offers.map((o, i) => {
              const tilt = [-4, 3, -2, 4, -3.4, 2.4, -4.2, 3.2][i % 8];
              const ratio = ["aspect-[4/5]", "aspect-square", "aspect-[5/4]", "aspect-[3/4]"][i % 4];
              return (
                <article
                  key={o.title}
                  className="pol group relative mb-14 break-inside-avoid transition-transform duration-500 hover:z-[1] hover:!rotate-0 hover:scale-[1.05]"
                  style={{ rotate: `${tilt}deg` }}
                >
                  <span aria-hidden className="absolute -top-3 left-1/2 z-[2] h-7 w-24 -translate-x-1/2 rotate-[-4deg] bg-lime/85 shadow-sm" />
                  <div className="rounded-md bg-bone p-3 pb-5 text-ink shadow-[0_24px_40px_-12px_rgb(0_0_0/0.65)]">
                    <div className={`relative overflow-hidden rounded-sm ${ratio}`}>
                      <Image src={o.img.src} alt={o.img.alt} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <h3 className="mt-4 font-wide text-[clamp(1.3rem,2vw,1.9rem)] leading-[0.95]">{o.title}</h3>
                    <p className="mt-1.5 text-sm text-ink">{o.line}</p>
                  </div>
                  <PSButton kind={PS_KINDS[i % 4]} className="absolute -right-5 -top-6 z-[2] size-16 rotate-12 drop-shadow-xl transition-transform duration-500 group-hover:rotate-[-14deg] group-hover:scale-125" />
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
              <a className="inline-flex w-fit items-center gap-2 hover:text-lime" href={site.phoneHref}>{phoneIcon}{site.phone}</a>
              <a className="inline-flex w-fit items-center gap-2 hover:text-lime" href={d.handle.href} target="_blank" rel="noreferrer">{instagramIcon}{d.handle.label}</a>
              <a className="inline-flex w-fit items-center gap-2 hover:text-lime" href={visit.directions} target="_blank" rel="noreferrer">{locationIcon}Get directions ↗</a>
            </div>
          </div>
          <form onSubmit={submit} className="rv flex flex-col gap-6 rounded-3xl border border-bone/20 bg-teal p-8">
            <label className="flex flex-col gap-1 text-sm text-bone/95">
              Email*
              <input required type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-bone/95">
              What&apos;s the plan?
              <textarea name="message" rows={3} className="resize-none border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime" />
            </label>
            <div className="flex items-center gap-5">
              <button type="submit" disabled={!email.trim()} className={`${pill} disabled:opacity-40`}>Send</button>
              <p aria-live="polite" className="text-xs text-bone/85">
                {sent && "Copied. Paste it into the DM that just opened."}
              </p>
            </div>
          </form>
        </div>
      </section>

      <GamingFooter photos={d.footerPhotos} />
    </div>
  );
}
