import { NEON_D, NEON_VIEWBOX as V } from "./neon-path";

// The फरक छु neon sign from the shop wall, drawn as SVG: a wide orange halo,
// a tighter red-orange glow, then a hot yellow-white tube core on top.
export function NeonSign({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${V.w} ${V.h}`} role="img" aria-label="Farakchu neon sign reading फरक छु" className="ab-neon relative block h-auto w-full overflow-visible">
        <defs>
          <path id="neon-d" d={NEON_D} transform={`translate(0 ${V.h}) scale(1 -1)`} />
          <filter id="neon-halo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <use href="#neon-d" fill="#ff3d1f" stroke="#ff3d1f" strokeWidth="40" filter="url(#neon-halo)" className="neon-hum" />
        <use href="#neon-d" fill="#ff6a12" stroke="#ff6a12" strokeWidth="14" filter="url(#neon-glow)" />
        <use href="#neon-d" fill="#ffe066" stroke="#ff7a1a" strokeWidth="6" />
      </svg>
    </div>
  );
}
