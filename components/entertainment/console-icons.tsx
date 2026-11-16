// Outline gaming icons (24x24 grid) for the Gaming Zone footer. Stroke follows currentColor.
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Controller = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z" />
    <path d="M6 11h4M8 9v4" />
    <circle cx="15" cy="12" r=".6" />
    <circle cx="18" cy="10" r=".6" />
  </svg>
);
export const Joystick = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v6M5 14h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" />
    <circle cx="7.5" cy="17.5" r=".7" />
    <circle cx="16.5" cy="17.5" r=".7" />
  </svg>
);
export const Headset = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
    <path d="M3 14h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2zM21 14h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2z" />
  </svg>
);
export const Trophy = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
  </svg>
);
export const DPad = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
  </svg>
);
export const Screen = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);
