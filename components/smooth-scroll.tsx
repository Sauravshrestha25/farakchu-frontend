"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let lenis: Lenis | null = null;
let resolveReady: (l: Lenis | null) => void;
export const lenisReady = new Promise<Lenis | null>((r) => (resolveReady = r));
export const getLenis = () => lenis;

// One Lenis for the whole site, mounted in app/layout.tsx. Fixed UI (nav, preloader) is unaffected: Lenis scrolls the real window.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = "manual";
    gsap.defaults({ ease: "none" });
    gsap.config({ force3D: true });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
    }
    const tick = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
    resolveReady(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
