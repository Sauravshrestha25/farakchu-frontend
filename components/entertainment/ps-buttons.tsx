// PlayStation face buttons redrawn in the Farakchu palette: lime, bone, ink green and teal discs, chunky symbols.
// Markup is kept as strings so React and the click-burst (plain DOM) draw the exact same buttons.
export type PSKind = "triangle" | "circle" | "cross" | "square";
export const PS_KINDS: PSKind[] = ["triangle", "circle", "cross", "square"];

// Colours are the page's tokens, so the buttons follow whatever theme they sit in.
const tone: Record<PSKind, { bg: string; fg: string; ring: string }> = {
  triangle: { bg: "var(--color-lime)", fg: "var(--color-ink)", ring: "var(--color-teal)" },
  circle: { bg: "var(--color-bone)", fg: "var(--color-ink)", ring: "var(--color-teal)" },
  cross: { bg: "var(--color-ink)", fg: "var(--color-lime)", ring: "var(--color-lime)" },
  square: { bg: "var(--color-teal)", fg: "var(--color-bone)", ring: "var(--color-lime)" },
};
const symbol: Record<PSKind, string> = {
  triangle: `<path d="M12 5.8 18 16.2H6Z" />`,
  circle: `<circle cx="12" cy="12" r="5" />`,
  cross: `<path d="M7.6 7.6 16.4 16.4M16.4 7.6 7.6 16.4" />`,
  square: `<rect x="7.4" y="7.4" width="9.2" height="9.2" rx="0.8" />`,
};

export const psSvg = (k: PSKind) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">` +
  `<circle cx="12" cy="12" r="11" style="fill:${tone[k].bg};stroke:${tone[k].ring}" stroke-width="1.4"/>` +
  `<g fill="none" style="stroke:${tone[k].fg}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${symbol[k]}</g></svg>`;

export function PSButton({ kind, className }: { kind: PSKind; className?: string }) {
  return <span aria-hidden className={`inline-block ${className ?? "size-10"}`} dangerouslySetInnerHTML={{ __html: psSvg(kind) }} />;
}
