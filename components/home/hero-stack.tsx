"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "../logo-mark";

gsap.registerPlugin(ScrollTrigger);

const img = (name: string) => `/images/home/${name}.jpg`;

// Hero poster + copy for this scene lives here (not in content/site.ts).
const heroPoster = img("storefront-day");

// The four domains, shown as the card wipe at the end of the scene.
const films = [
  {
    id: "entertainment",
    title: ["The rhythm of", "Music"],
    name: "Entertainment",
    blurb:
      "Live sessions, watch parties and nights people talk about the morning after.",
    no: "01",
    href: "/entertainment",
    logo: "/images/logo/logo-entertainment.jpg",
    focus: "50% 30%",
    image: {
      src: img("domain-entertainment"),
      alt: "Guitarist on a double-neck guitar under red stage lights",
    },
  },
  {
    id: "gamingzone",
    title: ["One more", "Game"],
    name: "Gaming Zone",
    blurb:
      "PS5s, big screens and brackets that get loud. One more game, always.",
    no: "02",
    href: "/gaming",
    logo: "/images/logo/logo-gamezone.jpg",
    focus: "50% 50%",
    image: {
      src: img("domain-gaming"),
      alt: "Players on the sofa in the neon-lit Farakchu gaming room",
    },
  },
  {
    id: "apparel",
    title: ["Wear the", "Difference"],
    name: "Apparel",
    blurb:
      "Limited drops in small runs, gone when they're gone. Including the official Nepal merch.",
    no: "03",
    href: "/apparel",
    logo: "/images/logo/logo-apparel.jpg",
    focus: "50% 8%",
    image: {
      src: img("domain-apparel"),
      alt: "Two models in Farakchu hoodies and caps",
    },
  },
  {
    id: "cafe",
    title: ["Pour, sit,", "Stay"],
    name: "Cafe",
    blurb:
      "Espresso, strawberry matcha, cold beer and long tables. A cafe, and a bar too.",
    no: "04",
    href: "/cafe",
    logo: "/images/logo/logo-cafe.jpg",
    focus: "50% 35%",
    image: {
      src: img("domain-cafe"),
      alt: "Guest with a drink inside the Farakchu cafe, brick wall and sign behind",
    },
  },
];

// About: rolls up like end credits.
const about = {
  heading:
    "We believe there's no single way to live, express, create or connect.",
  body: "Your interests make you unique. Your experiences shape your story. Your individuality is what makes you, you.\n\nAt Farakchu, we celebrate all of it. Because the world becomes a more interesting place when everyone brings something different.",
  image: {
    src: img("cafe-crowd"),
    alt: "Friends crowded together at a Farakchu night, cheering",
  },
};

// Simple stacked version: plain scroll, no pin or timeline.
// The pinned diamond/credits/panel-wipe scene is kept in hero-stack.pinned.tsx.
export function HeroStack() {
  const slot = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);

  // Logo scrolls up from below inside About; once its centre reaches the navbar logo it hands off to it and stays there.
  useGSAP(() => {
    const nav = document.querySelector<HTMLElement>("[data-nav-logo]");
    if (!nav || !slot.current) return;
    const navY = () => {
      const r = nav.getBoundingClientRect();
      return r.top + r.height / 2;
    };
    nav.style.visibility = "hidden";
    // Hero stays put while About slides over it (no pin spacing = no extra scroll).
    const pin = ScrollTrigger.create({
      trigger: hero.current,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });
    const st = ScrollTrigger.create({
      trigger: slot.current,
      start: () => `center ${navY()}px`,
      invalidateOnRefresh: true,
      onEnter: () => {
        nav.style.visibility = "visible";
        slot.current!.style.visibility = "hidden";
      },
      onLeaveBack: () => {
        nav.style.visibility = "hidden";
        slot.current!.style.visibility = "visible";
      },
    });
    return () => {
      pin.kill();
      st.kill();
      nav.style.visibility = "";
    };
  });
  const aboutType =
    "font-wide max-w-[30ch] text-center text-[1.3rem] leading-[1.05] md:text-[2.275rem] lg:text-[2.925rem]";

  return (
    <div id="top">
      {/* Hero */}
      <section ref={hero} className="relative z-0 h-svh overflow-hidden bg-teal">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
        </video>
        {/* data-hero wrapper: the preloader reveals it. */}
        <div
          data-hero
          className="relative z-[2] flex h-full flex-col items-center justify-center px-4 py-4 text-bone lg:px-8 lg:py-8"
        >
          <h1 className="flex flex-col items-center gap-[0.06em] text-center font-wide text-[8vw] leading-[0.95] lg:text-[4.5rem]">
            <span>The</span>
            <span>Art Of</span>
            <span className="block whitespace-nowrap text-center">
              <span className="hl">Difference</span>
            </span>
          </h1>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative z-10 flex min-h-svh items-center justify-center overflow-hidden bg-teal-deep px-4 py-32 text-bone lg:px-8"
      >
        <Image
          src={about.image.src}
          alt={about.image.alt}
          fill
          sizes="100vw"
          className="object-cover object-[50%_72%]"
        />
        <div className="absolute inset-0 bg-teal-deep/70" />
        <div className="relative flex flex-col items-center gap-8">
          <div ref={slot} className="size-16 lg:size-20" aria-hidden>
            <LogoMark solid="#161616" className="size-full text-bone" />
          </div>
          <h2 className={aboutType}>
            {about.heading.split(" ").map((w, i) => (
              <span key={i}>{w} </span>
            ))}
          </h2>
          {about.body.split("\n\n").map((paragraph) => (
            <p key={paragraph} className={aboutType}>
              {paragraph.split(" ").map((w, i) => {
                const m = w.match(/^(.*?)([.,;:!?]*)$/)!;
                return (
                  <span key={i}>
                    {/^(unique|individuality|different)$/i.test(m[1]) ? (
                      <>
                        <span className="hl">{m[1]}</span>
                        {m[2]}
                      </>
                    ) : (
                      w
                    )}{" "}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </section>

      {/* Domain cards */}
      <section
        id="films"
        className="bg-teal-deep px-4 py-24 text-bone md:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-wide text-[clamp(2.4rem,6vw,6rem)] leading-[0.95]">
              One house,
              <br />
              four <span className="hl">worlds</span>
            </h2>
            <p className="max-w-[28rem] text-sm uppercase leading-[1.3] text-bone/80">
              Music, games, clothes and coffee. Pick a door and walk in.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5">
            {films.map((f) => (
              <a
                key={f.id}
                href={f.href}
                aria-label={`${f.name}: ${f.blurb}`}
                className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[2rem] p-4 ring-1 ring-bone/15 transition-transform duration-500 ease-out-expo hover:-translate-y-2"
              >
                <Image
                  src={f.image.src}
                  alt={f.image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  style={{ objectPosition: f.focus }}
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-teal-deep/50 via-transparent via-40% to-teal-deep/40" />

                <div className="relative flex items-start justify-between">
                  <span className="font-wide text-5xl leading-none text-bone drop-shadow-[0_2px_12px_rgb(0_0_0/0.5)]">
                    {f.no}
                  </span>
                  <Image
                    src={f.logo}
                    alt=""
                    width={56}
                    height={56}
                    className="size-11 rounded-full object-cover ring-1 ring-bone/40"
                  />
                </div>

                <div className="relative rounded-3xl border border-bone/20 bg-teal-deep/55 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-wide text-[1.4rem] leading-none">
                      {f.name}
                    </h3>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bone text-ink transition-transform duration-300 group-hover:rotate-45">
                      ↗
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-[1.4] text-bone/85">
                    {f.blurb}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
