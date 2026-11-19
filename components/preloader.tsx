"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { lockScroll, getLenis } from "./smooth-scroll";
import { sound } from "./sound-engine";
import { LogoMark } from "./logo-mark";

gsap.registerPlugin(ScrollTrigger, Observer);

// The idea behind the brand, rolled up like film credits: the name, what it stands for, and why the place exists.
// Paragraphs drawn from the home hero, the about page and "What we believe".
type Credit = { k: "title" } | { k: "p"; t: string };
const credits: Credit[] = [
  { k: "title" },
  {
    k: "p",
    t: "Farak means different. Chu means I am. Say the two words together and they stop being a name. They become a statement, and we mean it every time we open the door.",
  },
  {
    k: "p",
    t: "We think different is not a problem to fix. It is the whole point. You are not a copy of anyone, and you are not a version of the person sitting next to you.",
  },
  {
    k: "p",
    t: "So we built a place around that idea. A cafe for the quiet ones, a stage for the loud ones, a gaming zone for the competitive ones and a label for anyone who wants to wear it. Come for one, stay for another. Nobody here has to fit in.",
  },
  {
    k: "p",
    t: "Different tastes, different stories, different people, all through the same door in Samakhusi. Because different isn't a distance between us. It's what brings us together.",
  },
];

const SEEN = "fc-story-seen";

/**
 * Opens on the logo and two buttons: "Enter site" (sound on) or "Enter without sound".
 * Pressing either: logo and buttons fade, the tilted bar appears, and scrolling (wheel, touch or keys) rolls the story up the
 * screen like film credits while the bar fills 000 -> 100. At 100 the bar becomes a window that grows to full screen with the hero inside it.
 * Plays once per browser session; "Skip" jumps straight to the hero.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const enterRef = useRef<(withSound: boolean) => void>(() => {});
  const skipRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const counter = q(".pl-count")[0] as HTMLElement;
      const primary = q(".pl-enter")[0] as HTMLElement;
      const reveal = ["[data-nav]", "[data-hero]"];
      const html = document.documentElement;

      // Already seen this session: get out of the way before anything is hidden.
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN) === "1";
      } catch {}
      if (seen) {
        gsap.set(root.current, { display: "none" });
        return;
      }

      let entered = false;
      // Read from the preloader itself, so a page theme (e.g. .theme-mono) re-pointing the tokens is respected.
      const css = getComputedStyle(root.current!);
      const cover = css.getPropertyValue("--color-teal").trim(); // track starts as the cover colour, so the bar window is closed until it appears
      const trackColor = css.getPropertyValue("--color-ink").trim();

      // Transforms set via GSAP (Tailwind's rotate/translate props would stack with GSAP's transform).
      gsap.set(q(".pl-bar"), {
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        top: "81%",
      });
      gsap.set(q(".pl-fill"), { opacity: 0 }); // hidden until the bar appears
      gsap.set(q(".pl-intro"), { autoAlpha: 0, y: 20 });
      gsap.set([q(".pl-roll"), q(".pl-skip")], { autoAlpha: 0 });
      html.style.overflow = "hidden"; // no scrolling behind the loader (Lenis is also stopped below)

      let obs: Observer | undefined;
      let onKey: ((e: KeyboardEvent) => void) | undefined;
      const stopInput = () => {
        obs?.kill();
        if (onKey) removeEventListener("keydown", onKey);
      };

      lockScroll(true);
      {
        const release = () => {
          html.style.overflow = "";
          getLenis()?.scrollTo(0, { immediate: true, force: true });
          scrollTo(0, 0);
          lockScroll(false);
          gsap.set(root.current, { display: "none" });
          ScrollTrigger.refresh();
          try {
            sessionStorage.setItem(SEEN, "1");
          } catch {}
        };
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) gsap.set(reveal, { autoAlpha: 0 });

        // The bar becomes a window: its huge box-shadow covers the page, so growing it reveals the hero inside it.
        let opened = false;
        const open = () => {
          if (opened) return;
          opened = true;
          stopInput();
          gsap
            .timeline({
              defaults: { ease: "power4.inOut" },
              onComplete: release,
            })
            .to(
              [
                q(".pl-roll"),
                q(".pl-skip"),
                q(".pl-text"),
                q(".pl-track"),
                q(".pl-fill"),
              ],
              { autoAlpha: 0, duration: 0.4 },
            )
            .to(
              q(".pl-bar"),
              {
                top: "50%",
                width: "100vw",
                height: () => innerHeight,
                rotation: 0,
                duration: 1,
              },
              "<",
            )
            .fromTo(
              reveal,
              { autoAlpha: 0, y: 40 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.05,
                ease: "power3.out",
                clearProps: "transform",
              },
              "<0.2",
            );
        };

        // Story: the credit roll moves up by exactly the scrolled amount, until the closing line sits mid-frame. The bar fills alongside.
        const roll = q(".pl-roll")[0] as HTMLElement;
        const frame = roll.parentElement!;
        const n = { v: 0 };
        let dist = 1;
        const story = gsap
          .timeline({ paused: true, defaults: { ease: "none", duration: 1 } })
          .to(roll, { y: () => -dist })
          .to(q(".pl-fill"), { width: "100%" }, 0)
          .to(
            n,
            {
              v: 100,
              onUpdate: () =>
                (counter.textContent = String(Math.round(n.v)).padStart(
                  3,
                  "0",
                )),
            },
            0,
          );

        // Scroll position -> story progress, eased so wheel ticks feel smooth. One pixel scrolled is one pixel of roll.
        let target = 0;
        const advance = (by: number) => {
          target = gsap.utils.clamp(0, 1, target + by);
          // At the end, open straight away: waiting for the easing tween to complete never happens while a trackpad
          // keeps sending momentum events (each one restarts it).
          if (target >= 1) {
            gsap.to(story, {
              progress: 1,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            });
            open();
            return;
          }
          gsap.to(story, {
            progress: target,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        };

        skipRef.current = () => {
          gsap.killTweensOf(story);
          story.progress(1);
          open();
        };

        enterRef.current = (withSound) => {
          if (entered) return;
          entered = true;
          if (withSound) sound.start(); // inside the click, so the browser allows audio
          if (reduce) {
            gsap.to(root.current, {
              opacity: 0,
              duration: 0.5,
              ease: "power4.inOut",
              onComplete: release,
            });
            return;
          }
          gsap
            .timeline({ defaults: { ease: "power4.inOut" } })
            .to(
              q(".pl-logo"),
              {
                autoAlpha: 0,
                y: -24,
                scale: 0.8,
                duration: 0.55,
                ease: "power2.in",
              },
              0,
            )
            .to(
              [q(".pl-tag"), q(".pl-buttons")],
              {
                autoAlpha: 0,
                y: 16,
                duration: 0.45,
                ease: "power2.in",
                stagger: 0.05,
              },
              0,
            )
            .set(q(".pl-intro"), { display: "none" })
            // The bar appears out of nothing, ready to be filled by scrolling.
            .fromTo(
              q(".pl-track"),
              { backgroundColor: cover },
              {
                backgroundColor: trackColor,
                duration: 0.5,
                ease: "power2.out",
              },
              0.35,
            )
            .set(q(".pl-fill"), { opacity: 1 }, 0.35)
            .to(
              [q(".pl-text"), q(".pl-skip"), q(".pl-roll")],
              { autoAlpha: 1, duration: 0.5 },
              0.5,
            )
            .add(() => {
              const last = roll.lastElementChild as HTMLElement;
              dist =
                last.offsetTop + last.offsetHeight - frame.clientHeight * 0.5; // stop with the closing line mid-frame
              story.invalidate();
              const per = 1 / dist;
              advance(60 * per); // a nudge on its own so it's clear the roll moves
              obs = Observer.create({
                target: window,
                type: "wheel,touch",
                preventDefault: true,
                onChangeY: (self) => {
                  const dy =
                    self.event.type === "wheel" ? self.deltaY : -self.deltaY;
                  advance(dy * per);
                },
              });
              onKey = (e) => {
                if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key))
                  advance((innerHeight * 0.4) / dist);
                else if (["ArrowUp", "PageUp"].includes(e.key))
                  advance((-innerHeight * 0.4) / dist);
                else if (e.key === "Escape") skipRef.current();
                else return;
                e.preventDefault();
              };
              addEventListener("keydown", onKey);
            }, 0.6);
        };

        // Logo and buttons arrive once the page is ready to be entered.
        gsap.to(q(".pl-intro"), {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          onComplete: () => primary.focus({ preventScroll: true }),
        });
      }

      return () => {
        stopInput();
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  const pill =
    "min-h-11 w-64 rounded-[50%] px-9 py-3.5 font-azonix text-[0.625rem] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime";

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Enter Farakchu"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pl-bar absolute left-1/2 top-1/2 z-[1] h-4 w-[212px] shadow-[0_0_0_200vmax_var(--color-teal)] max-md:h-3 max-md:w-40"
      >
        <div className="pl-track absolute inset-0 bg-teal" />
        <div className="pl-fill absolute inset-y-0 left-0 w-0 bg-lime" />
      </div>

      {/* Credit roll: starts with the title mid-frame, fades out at the top and bottom edges. */}
      <div className="absolute inset-x-0 top-0 bottom-[24%] z-[3] overflow-hidden px-5 [mask-image:linear-gradient(transparent,#000_18%,#000_78%,transparent)]">
        <div className="pl-roll invisible mx-auto flex max-w-3xl flex-col gap-[16vh] pt-[28vh] text-bone">
          {credits.map((c, i) =>
            c.k === "title" ? (
              <div
                key={i}
                className="flex flex-col items-center gap-4 text-center"
              >
                <p className="font-azonix text-[clamp(2.8rem,9vw,7rem)] leading-[1]">
                  Farak Chu
                </p>
                <p className="font-wide tracking-wide font-azonix text-[clamp(1rem,1.8vw,1.4rem)] text-bone/80">
                  Come as you are
                </p>
              </div>
            ) : (
              <p
                key={i}
                className="mx-auto max-w-2xl text-pretty text-center text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.55] text-bone/85"
              >
                {c.t}
              </p>
            ),
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="pl-skip invisible absolute bottom-8 right-6 z-[3] min-h-11 rounded-[50%] border border-bone/40 px-6 py-3 font-azonix text-[0.625rem] leading-none text-bone transition-colors hover:bg-bone/15 md:bottom-14 md:right-10"
      >
        Skip
      </button>

      <div
        aria-hidden
        className="pl-text absolute inset-x-0 bottom-0 z-[3] flex flex-col items-center gap-3 pb-8 opacity-0 md:pb-16"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 animate-bounce text-lime motion-reduce:animate-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16M5 13l7 7 7-7" />
        </svg>
        <div className="flex w-[9.5rem] justify-between font-azonix text-[0.625rem] text-bone">
          <span>Scroll</span>
          <span className="pl-count tabular-nums">000</span>
        </div>
      </div>
      <div className="pl-intro invisible relative z-[3] flex flex-col items-center gap-8 px-5 text-center">
        <LogoMark
          className="pl-logo size-28 text-bone md:size-32"
          title="Farakchu"
        />
        <p className="pl-tag font-azonix text-[2rem] tracking-[0.2em] text-bone/85">
          Farak Chu
        </p>
        <div className="pl-buttons flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => enterRef.current(true)}
            className={`pl-enter ${pill} bg-lime text-ink hover:bg-bone`}
          >
            Enter site
          </button>
          <button
            type="button"
            onClick={() => enterRef.current(false)}
            className={`${pill} border border-bone/50 text-bone hover:bg-bone/15`}
          >
            Enter without sound
          </button>
        </div>
      </div>
    </div>
  );
}
