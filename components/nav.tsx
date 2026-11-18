"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "./logo-mark";
import { RollLabel } from "./roll-label";
import { SoundToggle } from "./sound-toggle";
import { getSmoother } from "./smooth-scroll";
import { divisions, site } from "@/content/site";

// Anchor -> scroll position. Pinned scenes need an offset into the pin.
const targets: Record<
  string,
  { el: string; vh: { desktop: number; mobile: number } }
> = {
  "#top": { el: "body", vh: { desktop: 0, mobile: 0 } },
  // Inside the HeroStack pin: 1 timeline unit = 1vh of scroll (see hero-stack.tsx).
  "#about": { el: "#top", vh: { desktop: 4.5, mobile: 4.5 } },
  "#films": { el: "#top", vh: { desktop: 8.6, mobile: 8.6 } },
  "#entertainment": { el: "#top", vh: { desktop: 8.6, mobile: 8.6 } },
  "#cafe": { el: "#cafe", vh: { desktop: 0, mobile: 0 } },
  "#contact": { el: "#contact", vh: { desktop: 0, mobile: 0 } },
};

export function scrollToAnchor(hash: string) {
  const t = targets[hash];
  const el = document.querySelector(t?.el ?? hash) as HTMLElement | null;
  if (!el) return;
  const extra =
    innerHeight * (t ? (innerWidth >= 992 ? t.vh.desktop : t.vh.mobile) : 0);
  const s = getSmoother();
  if (s)
    gsap.to(s, {
      scrollTop: s.offset(el, "top top") + extra,
      duration: 2,
      ease: "expo.inOut",
      overwrite: true,
    });
  else
    gsap.to(window, {
      scrollTo: el.getBoundingClientRect().top + scrollY + extra,
      duration: 2,
      ease: "expo.inOut",
      overwrite: true,
    });
}

const links = [
  {
    label: "Home",
    alt: "Back to top",
    href: "#top",
    image: "/images/home/storefront-day.jpg",
  },
  {
    label: "About",
    alt: "Who we are",
    href: "/about",
    image: "/images/home/apparel-kid.jpg",
  },
  {
    label: "Entertainment",
    alt: "Big nights",
    href: "/entertainment",
    image: divisions[0].image.src,
  },
  {
    label: "Gaming Zone",
    alt: "Play + compete",
    href: "/gaming",
    image: divisions[1].image.src,
  },
  {
    label: "Apparel",
    alt: "Wear it",
    href: "/apparel",
    image: "/images/apparel/ch01-navy.jpg",
  },
  {
    label: "Cafe",
    alt: "Pull up a seat",
    href: "/cafe",
    image: "/images/cafe/matcha-latte.jpg",
  },
  {
    label: "Contact",
    alt: "Say hi",
    href: "/contact",
    image: "/images/home/storefront-day.jpg",
  },
];

// Set when a menu link leaves for another page: the next page's Nav mounts with the sheet
// already down and rolls it up, so the old page is never revealed. Module scope survives
// client-side navigation.
let handoff = false;
// The leaving page's colours, so the sheet keeps them while it rolls up over the new page.
// The new page's colours apply from the next time the menu is opened.
let handoffTheme: Record<string, string> | null = null;
let handoffHover = 0; // keep the same preview photo on the sheet across the switch
let handoffRoll: number | null = null; // and the same rolled label
const THEME_VARS = [
  "--color-teal",
  "--color-teal-deep",
  "--color-teal-soft",
  "--color-ink",
  "--color-bone",
  "--color-bone-dim",
  "--color-lime",
];

// page="sub": not the home page, so "#section" links route to "/#section" and the logo goes home.
export function Nav({ page = "home", action }: { page?: "home" | "sub"; action?: React.ReactNode }) {
  const sub = page === "sub";
  const to = (h: string) => (sub && h.startsWith("#") ? `/${h === "#top" ? "" : h}` : h);
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  // Read at first render, not in the effect: StrictMode runs effects twice and would lose it.
  const carried = useRef(handoff);
  const head = useRef<HTMLElement>(null);
  const rollUp = useRef<gsap.core.Tween>(null); // sheet sliding up after a link click
  const [theme, setTheme] = useState(() => (handoff ? handoffTheme : null));
  const tl = useRef<gsap.core.Timeline>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(() => (handoff ? handoffHover : 0)); // photo preview (sticky)
  const [roll, setRoll] = useState<number | null>(() => (handoff ? handoffRoll : null)); // label currently rolled

  // Every close: the sheet slides straight up in one motion while its contents hold still
  // (no reverse, no text animation), then everything resets to the normal closed state.
  const slideUp = () => {
    tl.current?.pause(); // freeze the links/photo wherever they are
    rollUp.current = gsap.to(panel.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.8,
      ease: "expo.inOut",
      onComplete: () => {
        carried.current = false;
        tl.current?.pause(0);
        gsap.set(panel.current, { visibility: "hidden" });
        setRoll(null);
        handoffTheme = null;
        setTheme(null);
      },
    });
  };

  // cacheComponents keeps left pages mounted but hidden (React <Activity>). This cleanup runs when
  // the page is hidden, so coming back to it never finds the menu still open.
  // See node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md
  useLayoutEffect(
    () => () => {
      // Only transient state: dev StrictMode also runs this right after mount, so it must not
      // touch the incoming handoff (carried / theme).
      setOpen(false);
      if (!carried.current) setRoll(null);
    },
    [],
  );

  useGSAP(
    () => {
      // Clip the whole panel (bg + content) so nothing shows outside the dropping sheet.
      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "expo.inOut", duration: 1.5 },
        })
        .set(panel.current, { visibility: "visible" })
        .fromTo(
          panel.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)" },
          0,
        )
        // Links rise out of their masks as the sheet settles, the photo unveils easing out of a
        // slight zoom, the footer arrives last.
        .fromTo(
          ".o-link",
          { yPercent: 115, rotate: 3 },
          { yPercent: 0, rotate: 0, stagger: 0.08, duration: 1.3, ease: "expo.out", transformOrigin: "0% 100%" },
          0.7,
        )
        .fromTo(
          ".o-photo",
          { clipPath: "inset(0 0 100% 0)", scale: 1.12 },
          { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.8 },
          0.55,
        )
        .fromTo(
          ".o-foot",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "expo.out" },
          1.15,
        );

      // Arrived from a menu link: start with the sheet down, then roll it back up over this page.
      // Checked here too (not only at first render) because a kept-alive page is revealed, not remounted.
      if (handoff) {
        handoff = false;
        carried.current = true;
        setTheme(handoffTheme);
        setHover(handoffHover);
        setRoll(handoffRoll);
      }
      if (carried.current) {
        tl.current.progress(1);
        slideUp();
      }
    },
    { scope: panel },
  );

  useEffect(() => {
    const s = getSmoother();
    if (open) {
      // Menu tapped while the sheet is still sliding up: stop it and keep the sheet down.
      if (rollUp.current?.isActive()) {
        rollUp.current.kill();
        carried.current = false;
        handoffTheme = null;
        setTheme(null);
        gsap.set(panel.current, { clipPath: "inset(0% 0% 0% 0%)" });
        tl.current?.progress(1);
      }
      tl.current?.timeScale(1).play();
      s?.paused(true);
      // Warm every page the menu links to, so a click switches with no wait.
      for (const h of [...links.map((l) => to(l.href)), "/contact", "/apparel"]) {
        if (!h.startsWith("#") && h.split("#")[0] !== pathname) router.prefetch(h);
      }
      panel.current?.querySelector<HTMLElement>(".o-link")?.focus();
    } else {
      // Skip while a handoff sheet is rolling up on its own (see useGSAP above).
      if (!carried.current && tl.current && tl.current.progress() > 0) slideUp();
      s?.paused(false);
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = e.currentTarget.getAttribute("href")!;
    const page = href.split("#")[0] || "/";
    // Another page: keep the sheet down and let the next page roll it up.
    if (!href.startsWith("#") && page !== pathname) {
      e.preventDefault();
      handoff = true;
      handoffHover = hover;
      handoffRoll = roll;
      const cs = getComputedStyle(head.current!);
      handoffTheme = Object.fromEntries(THEME_VARS.map((v) => [v, cs.getPropertyValue(v)]));
      router.push(href);
      return;
    }
    if (!href.startsWith("#")) {
      // Same page: just slide the sheet away.
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (sub) return;
    e.preventDefault();
    setOpen(false);
    // Wait for the panel to lift before gliding.
    setTimeout(() => scrollToAnchor(href), 450);
  };

  return (
    <header
      ref={head}
      style={theme ?? undefined}
      className="fixed inset-x-0 top-0 z-50 text-bone"
    >
      {/* Bar sits above the overlay so the logo never moves. data-nav lives here, not on <header>:
          a transform on header would trap the fixed overlay inside the bar's box. */}
      <div
        data-nav
        className="nav-bar relative z-[2] grid grid-cols-[1fr_auto_1fr] items-center py-3"
      >
        <SoundToggle />
        <a
          href={to("#top")}
          onClick={go}
          aria-label="Farakchu home"
          data-nav-logo
          className="[filter:drop-shadow(0_0_1px_var(--color-teal-deep))_drop-shadow(0_0_1px_var(--color-teal-deep))_drop-shadow(0_0_6px_rgb(0_0_0/0.5))]"
        >
          <LogoMark className="size-16 lg:size-20" />
        </a>
        <div className="flex items-center gap-2 justify-self-end">
        {action}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="fc-menu"
          className="group flex min-h-11 items-center justify-center gap-3 rounded-[50%] bg-lime px-5 py-3 sm:px-8 font-wide text-[0.625rem] leading-none text-ink transition-colors hover:bg-bone focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span aria-hidden="true" className="relative block size-3 shrink-0">
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-teal transition-transform duration-700 ease-out-expo ${open ? "rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-teal transition-transform duration-700 ease-out-expo ${open ? "-rotate-45" : "rotate-90"}`}
            />
          </span>
        </button>
        </div>
      </div>

      <div
        ref={panel}
        id="fc-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className="invisible fixed inset-0 z-[1]"
      >
        <div className="absolute inset-0 bg-teal-deep" />
        <div className="nav-inset relative flex h-full flex-col pb-6 pt-28 lg:pb-8 lg:pt-32">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-12">
            <nav aria-label="Main" className="lg:col-span-7">
              <ul>
                {links.map((l, i) => (
                  <li key={l.href} className="overflow-hidden">
                    <a
                      href={to(l.href)}
                      onClick={go}
                      onMouseEnter={() => (setHover(i), setRoll(i))}
                      // Closing makes the sheet inert, which fires leave/blur: ignore them so the
                      // label doesn't flip back while the sheet slides away.
                      onMouseLeave={() => open && setRoll(null)}
                      onFocus={(e) => (
                        setHover(i),
                        e.currentTarget.matches(":focus-visible") && setRoll(i)
                      )}
                      onBlur={() => open && setRoll(null)}
                      className="o-link group flex items-baseline gap-4 py-1 outline-none"
                    >
                      <span className="w-8 font-wide text-[0.625rem] text-bone/85">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <RollLabel
                        text={l.label}
                        alt={l.alt}
                        on={roll === i}
                        still={!open}
                        className="whitespace-nowrap font-wide text-[clamp(2rem,min(4.6vw,7.2vh),4.75rem)] leading-[0.95]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="o-photo relative hidden aspect-[4/5] max-h-[62vh] w-full justify-self-end overflow-hidden lg:col-span-4 lg:col-start-9 lg:block">
              {links.map((l, i) => (
                <Image
                  key={l.href}
                  src={l.image}
                  alt=""
                  fill
                  sizes="30vw"
                  className={`object-cover transition-[opacity,transform] duration-700 ease-out-expo ${hover === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-bone/15 pt-6 text-sm">
            <a href={site.phoneHref} className="o-foot group flex items-center gap-3 transition-colors hover:text-lime">
              <span aria-hidden className="grid size-9 place-items-center rounded-full border border-bone/25 transition-colors group-hover:border-lime">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
              </span>
              +977 {site.phone}
            </a>
            <a href={site.emailHref} className="o-foot group flex items-center gap-3 transition-colors hover:text-lime">
              <span aria-hidden className="grid size-9 place-items-center rounded-full border border-bone/25 transition-colors group-hover:border-lime">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              {site.email}
            </a>
            <div className="o-foot ml-auto flex items-center gap-3">
              <a
                href="/contact"
                onClick={go}
                className="rounded-[50%] border border-bone/40 px-7 py-3 font-wide text-[0.625rem] transition-colors hover:border-lime hover:text-lime"
              >
                Contact
              </a>
              <Link
                href="/apparel"
                onClick={go}
                className="rounded-[50%] bg-lime px-7 py-3 font-wide text-[0.625rem] text-ink transition-colors hover:bg-bone"
              >
                Shop apparel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
