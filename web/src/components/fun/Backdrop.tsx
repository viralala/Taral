// Simple dark painted backdrop for standalone pages (practice levels, leaderboard, 404).
type Tint = "forest" | "bridge" | "tower" | "dusk";

const TINTS: Record<Tint, [string, string, string]> = {
  forest: ["#1d4a3a", "#2a1a6e", "#7cc35a"],
  bridge: ["#2a1a6e", "#9b5bd4", "#bfe6d9"],
  tower: ["#2a1a6e", "#f2795a", "#ffb98a"],
  dusk: ["#2a1a6e", "#9b5bd4", "#ffb98a"],
};

export default function Backdrop({ tint = "dusk" }: { tint?: Tint }) {
  const [a, b, c] = TINTS[tint];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-night" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 15% 110%, ${a} 0%, transparent 60%), radial-gradient(90% 70% at 90% -10%, ${b}cc 0%, transparent 55%), linear-gradient(180deg, #0b1240 0%, #1a1550 55%, #0b1240 100%)`,
        }}
      />
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-70">
        <defs>
          <filter id="bd-paint">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="60" />
          </filter>
          <filter id="bd-blur"><feGaussianBlur stdDeviation="30" /></filter>
        </defs>
        <g filter="url(#bd-paint)">
          <ellipse cx="820" cy="180" rx="260" ry="120" fill={b} opacity=".35" filter="url(#bd-blur)" />
          <ellipse cx="150" cy="880" rx="380" ry="160" fill={a} opacity=".6" />
          <ellipse cx="880" cy="930" rx="300" ry="120" fill={a} opacity=".5" />
          <path d="M-20 760 C 200 700, 380 800, 560 740 S 900 690, 1020 750" fill="none" stroke={c} strokeOpacity=".22" strokeWidth="26" strokeLinecap="round" />
          <path d="M-20 820 C 240 780, 420 860, 640 800 S 920 780, 1020 820" fill="none" stroke={b} strokeOpacity=".25" strokeWidth="18" strokeLinecap="round" />
        </g>
        {[[120, 140], [300, 90], [540, 60], [700, 140], [880, 80], [420, 200], [60, 300], [940, 320]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.6 : 1.6} fill="#efead7" style={{ animation: `twinkle ${2.4 + (i % 4) * 0.7}s ease-in-out ${i * 0.3}s infinite` }} />
        ))}
      </svg>
    </div>
  );
}
