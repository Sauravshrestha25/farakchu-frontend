"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "../logo-mark";
import { phoneIcon, locationIcon } from "../ui/footer-icons";
import { scrollToAnchor } from "../nav";
import { WebxLogoSparkles } from "../ui/webx-logo-sparkles";
import { apparelDrop, divisions, site, visit } from "@/content/site";

const explore = [
  { label: "About", href: "/about" },
  { label: "What we do", href: "#films" },
  { label: "What's on", href: "#whats-on" },
  { label: "Who's been", href: "#guests" },
  { label: "Apparel", href: "#apparel" },
  { label: "Cafe", href: "/cafe" },
];

const Col = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="f-col">
    <h3 className="mb-4 font-serif text-2xl text-bone">{title}</h3>
    <div className="flex flex-col gap-2 text-sm text-bone/95">{children}</div>
  </div>
);

const linkCls = "w-fit transition-colors hover:text-lime";

// light: footer sits on a light page (cafe), so the WebX lockup switches to its dark version.
export function Footer({ light = false }: { light?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      // Nav slides away while the footer is on screen.
      gsap.to(document.querySelectorAll("[data-nav]"), {
        yPercent: -200,
        duration: 0.6,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: root.current,
          start: "top 20%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(q(".f-head-line"), {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(q(".f-col, .f-form"), {
        y: 30,
        opacity: 0,
        stagger: 0.07,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      // Wordmark melts on enter + with pointer speed.
      const disp = q("feDisplacementMap")[0];
      const text = q(".f-mark text")[0];
      const warp = { s: 0 };
      // Perf: the turbulence filter costs every paint, even at scale 0. Attach it only while warping.
      const apply = () => {
        disp.setAttribute("scale", warp.s.toFixed(2));
        if (warp.s < 0.2) text.removeAttribute("filter");
        else if (!text.hasAttribute("filter"))
          text.setAttribute("filter", "url(#f-warp)");
      };
      const pulse = (v: number) => {
        gsap.to(warp, {
          s: v,
          duration: 0.25,
          overwrite: true,
          onUpdate: apply,
        });
        gsap.to(warp, {
          s: 0,
          duration: 1.6,
          delay: 0.25,
          ease: "power2.out",
          onUpdate: apply,
        });
      };
      const mark = q(".f-mark")[0] as HTMLElement;
      gsap.from(mark, {
        yPercent: 40,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: {
          trigger: mark,
          start: "top 95%",
          onEnter: () => pulse(110),
        },
      });
      const onMove = (e: PointerEvent) =>
        pulse(Math.min(100, 15 + Math.hypot(e.movementX, e.movementY) * 4));
      mark.addEventListener("pointermove", onMove);
      return () => mark.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  // Posts to /api/contact (same endpoint as the contact page). It answers with an honest error until CONTACT_WEBHOOK_URL is set.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("Sending…");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Website footer",
        email,
        message: data.get("message") || "(no message)",
      }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setStatus(
      res?.ok
        ? "Sent. We'll get back to you."
        : (json?.error ?? "Could not send. Try the contact page."),
    );
  };

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href")!;
    if (!href.startsWith("#")) return;
    e.preventDefault();
    // Off the homepage (e.g. /apparel) the sections don't exist, so go home first.
    if (window.location.pathname !== "/" && href !== "#top")
      window.location.href = `/${href}`;
    else scrollToAnchor(href);
  };

  return (
    <footer
      ref={root}
      id="contact"
      className="relative z-10 overflow-hidden bg-teal-deep px-4 pt-24 text-bone lg:px-8 lg:pt-32"
    >
      {/* Giant faint diamond behind everything */}
      <LogoMark
        className="pointer-events-none absolute right-[2vw] top-[3vw] size-[52vw] text-bone/[0.03]"
        title=""
      />

      {/* CTA + form */}
      <div className="relative grid gap-12 border-b border-bone/15 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-20">
        <h2 className="font-wide text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.92] lg:col-span-7">
          <span className="block overflow-hidden">
            <span className="f-head-line block">See you at</span>
          </span>
          <span className="block overflow-hidden pt-[0.08em]">
            <span className="f-head-line block">
              the <span className="hl">house.</span>
            </span>
          </span>
        </h2>

        <form
          onSubmit={submit}
          className="f-form flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:self-end"
        >
          <p className="text-[0.8125rem] uppercase leading-[1.25] [0.025rem] text-bone/95">
            Book an event, ask about a drop, or just say hi.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
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
              Message
              <input
                name="message"
                className="border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime"
              />
            </label>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="submit"
              disabled={!email.trim()}
              className="rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] text-ink transition-[background-color,opacity] hover:bg-bone disabled:opacity-40"
            >
              Send
            </button>
            <p aria-live="polite" className="text-xs text-bone/85">
              {status}
            </p>
          </div>
        </form>
      </div>

      {/* Columns */}
      <div className="relative z-[1] grid grid-cols-2 gap-10 py-16 lg:grid-cols-4 lg:gap-8">
        <Col title="Visit">
          {visit.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
          <a
            className={`${linkCls} mt-2 inline-flex items-center gap-2 text-bone`}
            href={site.phoneHref}
          >
            {phoneIcon}
            {site.phone}
          </a>
          <a
            className={`${linkCls} inline-flex items-center gap-2 text-bone`}
            href={visit.directions}
            target="_blank"
            rel="noreferrer"
          >
            {locationIcon}
            Get directions ↗
          </a>
        </Col>
        <Col title="Divisions">
          {divisions.map((d) => (
            <a
              key={d.id}
              className={linkCls}
              href={`/${d.id === "gamingzone" ? "gaming" : d.id}`}
            >
              {d.name}
            </a>
          ))}
        </Col>
        <Col title="Explore">
          {explore.map((l) => (
            <a key={l.href} className={linkCls} href={l.href} onClick={go}>
              {l.label}
            </a>
          ))}
        </Col>
        <Col title="Shop">
          <Link className={linkCls} href="/apparel">
            Shop apparel
          </Link>
          <a
            className={linkCls}
            href={apparelDrop.merch}
            target="_blank"
            rel="noreferrer"
          >
            Official Nepal merch ↗
          </a>
          <Link
            className="mt-2 w-fit rounded-[50%] bg-lime px-6 py-2.5 font-wide text-[0.625rem] text-ink transition-colors hover:bg-bone hover:text-teal"
            href="/apparel"
          >
            Limited drop
          </Link>
        </Col>
      </div>

      {/* Warped wordmark */}
      <svg
        viewBox="0 0 1000 190"
        className="f-mark relative block w-full overflow-visible"
        role="img"
        aria-label="Farakchu"
      >
        <filter id="f-warp" x="-15%" y="-50%" width="130%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.03"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap
            in="SourceGraphic"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <text
          x="500"
          y="170"
          textAnchor="middle"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          className="fill-bone"
          style={{
            fontFamily: "var(--font-sans)",
            fontStretch: "125%",
            fontWeight: 900,
            fontSize: 210,
          }}
        >
          FARAKCHU
        </text>
      </svg>

      {/* Bottom bar */}
      <div className="relative mt-6 flex flex-col gap-6 border-t border-bone/15 py-6 text-xs text-bone/85 lg:flex-row lg:items-center lg:justify-between">
        <span>© 2026 Farakchu · All Rights Reserved.</span>
        <a
          href="#top"
          onClick={go}
          className="w-fit font-wide text-[0.625rem] text-bone transition-colors hover:text-lime"
        >
          Back to top ↑
        </a>
        <span className="flex items-center gap-4">
          <span className=" [0.025rem]">Designed &amp; Developed by</span>
          <a
            href="https://www.webxnepal.com"
            target="_blank"
            rel="noreferrer"
            aria-label="WebX Nepal"
            className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <WebxLogoSparkles
              className="mb-1"
              width={96}
              particleDensity={420}
              {...(light && {
                logoSrc: "/images/logo/webx-logo-black.svg",
                particleColor: "#f4f1ea",
              })}
            />
          </a>
        </span>
      </div>
    </footer>
  );
}
