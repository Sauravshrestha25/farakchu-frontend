"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Nav } from "../nav";
import { LogoMark } from "../logo-mark";
import { instagramIcon, phoneIcon, locationIcon } from "../ui/footer-icons";
import { site, visit } from "@/content/site";

const linkCls = "inline-flex w-fit items-center gap-2 transition-colors hover:text-lime";
const field =
  "w-full border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors placeholder:text-bone/35 focus:border-lime [color-scheme:dark]";
const labelCls = "flex flex-col gap-1 text-sm text-bone/95";

// Contact: one centred column.
export function ContactPage() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(q(".c-line"), { yPercent: 105, stagger: 0.08, duration: 1.1 })
        .from(q(".c-in"), { y: 24, opacity: 0, stagger: 0.05, duration: 0.8 }, 0.3);
    },
    { scope: root },
  );

  // Posts to /api/contact, which forwards to the client's webhook. On failure, point people at the phone line.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const body = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    if (res?.ok) form.reset();
    setStatus(res?.ok ? "sent" : "error");
  };

  return (
    <>
      <Nav page="sub" />
      <main ref={root} className="relative min-h-svh overflow-hidden bg-teal-deep text-bone">
        <LogoMark className="pointer-events-none absolute -right-[10vw] top-[30vh] size-[46vw] text-bone/[0.03]" title="" />
        {/* One centred column: heading, form, visit. Scrolls when it needs to. */}
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-12 px-4 pb-20 pt-32 text-center lg:pt-40">
          <div className="flex flex-col items-center gap-5">
            <h1 className="font-wide text-[clamp(2.4rem,6vw,5.25rem)] leading-[0.92]">
              <span className="block overflow-hidden">
                <span className="c-line block">Say hi to</span>
              </span>
              <span className="block overflow-hidden pt-[0.08em]">
                <span className="c-line block">
                  the <span className="hl">house.</span>
                </span>
              </span>
            </h1>
            <p className="c-in max-w-sm text-[0.8125rem] uppercase leading-[1.25] text-bone/95">
              Book an event, reserve a table, ask about a drop, or just say hi.
            </p>
          </div>

          <form onSubmit={submit} className="flex w-full flex-col gap-7 text-left">
            <div className="c-in grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <label className={labelCls}>
                Name*
                <input required name="name" autoComplete="name" className={field} />
              </label>
              <label className={labelCls}>
                Email*
                <input required type="email" name="email" autoComplete="email" className={field} />
              </label>
              <label className={labelCls}>
                Phone
                <input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="98XXXXXXXX" className={field} />
              </label>
              <label className={labelCls}>
                Guests
                <input type="number" name="guests" min={1} max={500} inputMode="numeric" placeholder="How many?" className={field} />
              </label>
              <label className={labelCls}>
                Date
                {/* min set on focus: reading the clock during render breaks Next's prerender. */}
                <input type="date" name="date" onFocus={(e) => (e.currentTarget.min = new Date().toISOString().slice(0, 10))} className={field} />
              </label>
              <label className={labelCls}>
                Time
                <input type="time" name="time" className={field} />
              </label>
            </div>

            <label className={`c-in ${labelCls}`}>
              Message*
              <textarea required name="message" rows={3} placeholder="Booking, a gig, a drop, or just hi." className={`${field} resize-none`} />
            </label>

            <div className="c-in flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-[50%] bg-lime px-10 py-3.5 font-wide text-[0.625rem] text-ink transition-[background-color,opacity] hover:bg-bone disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send"}
              </button>
              <p aria-live="polite" className="min-h-4 text-center text-xs text-bone/85">
                {status === "sent" && "Got it. We'll get back to you soon."}
                {status === "error" && (
                  <>
                    Couldn&apos;t send that. Call us on{" "}
                    <a href={site.phoneHref} className="underline hover:text-lime">
                      {site.phone}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </form>

          <div className="c-in flex flex-col items-center gap-1.5 border-t border-bone/15 pt-10 text-sm text-bone/95">
            <h2 className="mb-1 font-wide text-lg text-bone">Visit</h2>
            {visit.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a className={`${linkCls} text-bone`} href={site.phoneHref}>
                {phoneIcon}
                {site.phone}
              </a>
              <a className={linkCls} href={site.instagram} target="_blank" rel="noreferrer">
                {instagramIcon}
                farakchu
              </a>
              <a className={`${linkCls} text-bone`} href={visit.directions} target="_blank" rel="noreferrer">
                {locationIcon}
                Get directions ↗
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
