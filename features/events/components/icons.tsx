export const CornerArrow = ({ dir }: { dir: "l" | "r" }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden style={dir === "l" ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M7 4v9h9M12 9l4 4-4 4" />
  </svg>
);

export const Crosshair = () => (
  <svg width="46" height="52" viewBox="0 0 46 52" fill="none" stroke="#f1ece1" strokeWidth="1" opacity="0.85" aria-hidden>
    <circle cx="23" cy="28" r="12" />
    <circle cx="23" cy="28" r="4" />
    <path d="M23 0v18M23 38v14M0 28h11M35 28h11" />
  </svg>
);

// Hand-drawn red scribbles, drawn on scroll via pathLength.
export const Scribble = () => (
  <svg className="ev-scribble pointer-events-none absolute -bottom-[0.12em] left-[-2%] w-[104%]" viewBox="0 0 500 18" fill="none" stroke="#d6ff50" strokeWidth="2" strokeLinecap="round" preserveAspectRatio="none" aria-hidden>
    <path pathLength={1} strokeDasharray={1} d="M4 11C90 6 190 5 300 7S440 10 496 4M12 14C120 9 260 10 380 8" />
  </svg>
);

export const CircledMark = ({ label }: { label: string }) => (
  <span className="relative mx-[0.12em] inline-block align-middle" aria-hidden>
    <svg className="ev-circle block h-[1.05em] w-[1.9em]" viewBox="0 0 150 90" fill="none" stroke="#d6ff50" strokeWidth="3" strokeLinecap="round">
      <path pathLength={1} strokeDasharray={1} d="M75 6C30 6 6 24 8 46c3 24 40 40 80 36 40-4 60-26 52-48C132 14 100 4 62 10" />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-[0.55em] tracking-widest text-[#d6ff50]">{label}</span>
  </span>
);
