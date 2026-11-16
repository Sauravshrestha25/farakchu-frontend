"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Nav } from "../nav";
import { LogoMark } from "../logo-mark";
import { instagramIcon, phoneIcon, locationIcon } from "../ui/footer-icons";
import { site, visit } from "@/content/site";

const linkCls = "inline-flex w-fit items-center gap-2 transition-colors hover:text-lime";
const field =
  "border-b border-bone/30 bg-transparent py-2 text-lg text-bone outline-none transition-colors focus:border-lime";

// One screen, no scrolling: heading + form on the left, the house on the right.
export function ContactPage() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(q(".c-line"), { yPercent: 105, stagger: 0.08, duration: 1.1 })
        .from(q(".c-in"), { y: 24, opacity: 0, stagger: 0.07, duration: 0.8 }, 0.3)
        .from(q(".c-photo"), { clipPath: "inset(0 0 100% 0)", duration: 1.2 }, 0.2);
    },
    { scope: root },
  );

  // ponytail: no form backend yet. Copies the message and opens Instagram DM, same as the footer form.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    await navigator.clipboard?.writeText(`${d.get("message")}\n\n${d.get("email")}`).catch(() => {});
    setSent(true);
    window.open(site.contactHref, "_blank", "noopener");
  };

  return (
    <>
      <Nav page="sub" />
      <main
        ref={root}
        className="relative h-svh overflow-hidden bg-teal-deep text-bone"
      >
        <LogoMark
          className="pointer-events-none absolute -right-[8vw] -bottom-[12vw] size-[52vw] text-bone/[0.03]"
          title=""
        />
        <div className="relative grid h-full grid-cols-1 items-center gap-8 px-4 pb-8 pt-28 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-32">
          <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-10">
            <h1 className="font-wide text-[clamp(2.4rem,min(6vw,11vh),6.5rem)] leading-[0.92]">
              <span className="block overflow-hidden">
                <span className="c-line block">Say hi to</span>
              </span>
              <span className="block overflow-hidden pt-[0.08em]">
                <span className="c-line block">
                  the <span className="hl">house.</span>
                </span>
              </span>
            </h1>

            <form onSubmit={submit} className="flex max-w-xl flex-col gap-6">
              <p className="c-in text-[0.8125rem] uppercase leading-[1.25] text-bone/95">
                Book an event, ask about a drop, or just say hi.
              </p>
              <div className="c-in grid gap-6 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-bone/95">
                  Email*
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-bone/95">
                  Message
                  <input name="message" className={field} />
                </label>
              </div>
              <div className="c-in flex items-center gap-5">
                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="rounded-[50%] bg-lime px-8 py-3 font-wide text-[0.625rem] text-ink transition-[background-color,opacity] hover:bg-bone disabled:opacity-40"
                >
                  Send
                </button>
                <p aria-live="polite" className="text-xs text-bone/85">
                  {sent && "Copied. Paste it into the DM that just opened."}
                </p>
              </div>
            </form>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <div className="c-photo relative hidden aspect-[16/10] max-h-[38vh] w-full overflow-hidden lg:block">
              <Image
                src={visit.image.src}
                alt={visit.image.alt}
                fill
                sizes="40vw"
                priority
                className="object-cover"
              />
            </div>
            <div className="c-in flex flex-col gap-2 text-sm text-bone/95">
              <h2 className="mb-2 font-wide text-lg text-bone">Visit</h2>
              {visit.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
              <a className={`${linkCls} mt-2 text-bone`} href={site.phoneHref}>
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
          </aside>
        </div>
      </main>
    </>
  );
}
