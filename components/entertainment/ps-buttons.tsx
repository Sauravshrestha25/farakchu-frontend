// PlayStation face buttons redrawn in the Farakchu palette: lime, bone, ink green and teal discs, chunky symbols.
// Markup is kept as strings so React and the click-burst (plain DOM) draw the exact same buttons.
export type PSKind = "triangle" | "circle" | "cross" | "square";
export const PS_KINDS: PSKind[] = ["triangle", "circle", "cross", "square"];

const tone: Record<PSKind, { bg: string; fg: string; ring: string }> = {
  triangle: { bg: "#d6ff50", fg: "#1d4d4a", ring: "#003638" },
  circle: { bg: "#f1ece1", fg: "#1d4d4a", ring: "#003638" },
  cross: { bg: "#1d4d4a", fg: "#d6ff50", ring: "#d6ff50" },
  square: { bg: "#003638", fg: "#f1ece1", ring: "#d6ff50" },
};
const symbol: Record<PSKind, string> = {
  triangle: `<path d="M12 5.8 18 16.2H6Z" />`,
  circle: `<circle cx="12" cy="12" r="5" />`,
  cross: `<path d="M7.6 7.6 16.4 16.4M16.4 7.6 7.6 16.4" />`,
  square: `<rect x="7.4" y="7.4" width="9.2" height="9.2" rx="0.8" />`,
};

export const psSvg = (k: PSKind) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">` +
  `<circle cx="12" cy="12" r="11" fill="${tone[k].bg}" stroke="${tone[k].ring}" stroke-width="1.4"/>` +
  `<g fill="none" stroke="${tone[k].fg}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${symbol[k]}</g></svg>`;

export function PSButton({ kind, className }: { kind: PSKind; className?: string }) {
  return <span aria-hidden className={`inline-block ${className ?? "size-10"}`} dangerouslySetInnerHTML={{ __html: psSvg(kind) }} />;
}

// The four buttons laid out like a controller's right-hand cluster.
export function PSCluster({ className }: { className?: string }) {
  const at = { triangle: "left-1/3 top-0", circle: "right-0 top-1/3", cross: "left-1/3 bottom-0", square: "left-0 top-1/3" } as const;
  return (
    <span aria-hidden className={`relative inline-block ${className ?? "size-24"}`}>
      {PS_KINDS.map((k) => (
        <PSButton key={k} kind={k} className={`absolute size-1/3 ${at[k]}`} />
      ))}
    </span>
  );
}
