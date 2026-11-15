import { gsap } from "gsap";

const GLYPHS = "ABCDEFGHKLMNOPRSTUVXZ0123456789+?4";

// Decode-style text scramble, same feel as the somefolk awards list.
export function scramble(el: HTMLElement, duration = 0.9) {
  const final = el.dataset.final ?? el.textContent ?? "";
  el.dataset.final = final;
  const state = { p: 0 };
  gsap.fromTo(
    state,
    { p: 0 },
    {
      p: 1,
      duration,
      ease: "none",
      onUpdate: () => {
        const n = Math.floor(state.p * final.length);
        el.textContent =
          final.slice(0, n) +
          final
            .slice(n)
            .replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      },
      onComplete: () => {
        el.textContent = final;
      },
    },
  );
}
