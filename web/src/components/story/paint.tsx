// Painterly SVG toolkit shared by every scene.
// All scene art is drawn in a 1600 x 1000 viewBox with preserveAspectRatio "xMidYMid slice":
// on a 375px phone only x ≈ 520–1080 is visible, so subjects live in that centre band.
import type { CSSProperties, ReactNode } from "react";

export const W = 1600;
export const H = 1000;

export const C = {
  paper: "#efead7", paper2: "#e4dcc0", navy: "#003c74", ink: "#0b1a33", night: "#0b1240", dusk: "#2a1a6e",
  violet: "#9b5bd4", peach: "#ffb98a", coral: "#f2795a", rose: "#ef3f7a", blossom: "#f6b5c8", lime: "#e8f20a",
  leaf: "#7cc35a", mint: "#bfe6d9",
};

/** Deterministic PRNG so server and client paint identical scenes. */
export function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const F = { paint: "url(#tp-paint)", brush: "url(#tp-brush)", soft: "url(#tp-soft)", glow: "url(#tp-glow)", haze: "url(#tp-haze)" };

/** Filters live once in the document; every scene svg references them by id. */
export function PaintDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        {/* wobbly edges: everything looks hand-cut with a wet brush */}
        <filter id="tp-paint" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* bristle strokes: wobble + streaky alpha so strokes show their hairs */}
        <filter id="tp-brush" x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.32" numOctaves="1" seed="11" result="streak" />
          <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.55" result="mask" />
          <feComposite in="d" in2="mask" operator="in" />
        </filter>
        <filter id="tp-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="tp-haze" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="tp-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** Keyframes private to the story shell. */
export const STORY_CSS = `
@keyframes tp-float { 0% { transform: translate3d(0,0,0); opacity: 0; } 12% { opacity: 1; } 100% { transform: translate3d(30px,-260px,0); opacity: 0; } }
@keyframes tp-bob { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-10px,0); } }
@keyframes tp-flicker { 0%,100% { transform: scale(1,1); opacity: .95; } 25% { transform: scale(.94,1.08); opacity: .8; } 50% { transform: scale(1.05,.95); opacity: 1; } 75% { transform: scale(.97,1.05); opacity: .85; } }
@keyframes tp-blink { 0%,44%,52%,100% { transform: scaleY(1); } 48% { transform: scaleY(.08); } }
@keyframes tp-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes tp-drift-x { 0%,100% { transform: translate3d(-3%,0,0); } 50% { transform: translate3d(3%,0,0); } }
@keyframes tp-beam { 0%,100% { opacity: .55; } 50% { opacity: .9; } }
@keyframes tp-firefly { 0%,100% { transform: translate3d(0,0,0); opacity: .2; } 30% { opacity: 1; } 50% { transform: translate3d(24px,-30px,0); } 70% { opacity: .7; } }
@keyframes tp-dot { 0%,100% { transform: scale(.7); opacity: .5; } 50% { transform: scale(1); opacity: 1; } }
@keyframes tp-bars { 0%,100% { transform: scaleY(.3); } 50% { transform: scaleY(1); } }
@keyframes tp-sweat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
.tp-kb { animation: kenburns 26s ease-in-out infinite alternate; transform-origin: 50% 60%; }
.tp-layer { transition: transform 1.1s cubic-bezier(.2,.7,.2,1); will-change: transform; }
.tp-fill { transform-box: fill-box; }
`;

/** Style helper for an SVG element that animates around its own box. */
export function anim(animation: string, origin = "center", delay = 0): CSSProperties {
  return { animation, animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: origin };
}

export function Stars({ n = 60, seed = 1, yMax = 520, color = C.paper }: { n?: number; seed?: number; yMax?: number; color?: string }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const big = r() > 0.88;
        return (
          <circle key={i} cx={r() * W} cy={r() * yMax} r={big ? 2.6 : 1.2 + r()} fill={color}
            style={{ animation: `twinkle ${2.5 + r() * 4}s ease-in-out infinite`, animationDelay: `${-r() * 6}s` }} />
        );
      })}
    </g>
  );
}

/** A loose horizontal brush stroke, the signature Kaizen texture. */
export function Stroke({ d, color, w = 60, o = 0.6, drift = 0 }: { d: string; color: string; w?: number; o?: number; drift?: number }) {
  return (
    <g style={drift ? { animation: `drift ${drift}s ease-in-out infinite` } : undefined}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} filter={F.brush} />
    </g>
  );
}

/** Cluster of painted dabs inside an ellipse — tree canopies, bushes, clouds. */
export function Dabs({ cx, cy, rx, ry, n, seed, colors, rMin = 18, rMax = 46, o = 1 }: {
  cx: number; cy: number; rx: number; ry: number; n: number; seed: number; colors: string[]; rMin?: number; rMax?: number; o?: number;
}) {
  const r = rng(seed);
  return (
    <g filter={F.paint} opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r());
        return <circle key={i} cx={cx + Math.cos(a) * rx * d} cy={cy + Math.sin(a) * ry * d} r={rMin + r() * (rMax - rMin)} fill={colors[(r() * colors.length) | 0]} />;
      })}
    </g>
  );
}

/** Cherry tree: brushy trunk + layered blossom canopy. x,y = base of trunk. */
export function CherryTree({ x, y, s = 1, seed = 4, colors = [C.blossom, C.rose, "#f9cfdc", C.peach], trunk = C.ink, glow = false }: {
  x: number; y: number; s?: number; seed?: number; colors?: string[]; trunk?: string; glow?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g filter={F.paint}>
        <path d="M-34 0 C-22 -90 -30 -170 -8 -250 C4 -300 -10 -330 -60 -380 L-48 -392 C0 -350 20 -320 26 -280 C40 -330 90 -360 150 -380 L156 -366 C100 -340 60 -310 44 -250 C36 -170 40 -90 40 0 Z" fill={trunk} />
        <path d="M-20 -230 C-70 -250 -130 -260 -190 -300" stroke={trunk} strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M30 -300 C60 -400 40 -440 10 -470" stroke={trunk} strokeWidth="13" strokeLinecap="round" fill="none" />
      </g>
      {glow && <ellipse cx={0} cy={-370} rx={330} ry={190} fill={C.blossom} opacity={0.35} filter={F.soft} />}
      <Dabs cx={0} cy={-390} rx={300} ry={150} n={70} seed={seed} colors={colors} rMin={22} rMax={58} />
      <Dabs cx={-170} cy={-310} rx={120} ry={70} n={24} seed={seed + 1} colors={colors} rMin={16} rMax={40} />
      <Dabs cx={170} cy={-360} rx={120} ry={70} n={24} seed={seed + 2} colors={colors} rMin={16} rMax={40} />
      <Dabs cx={20} cy={-470} rx={150} ry={60} n={22} seed={seed + 3} colors={[C.paper, "#fde3ea", C.blossom]} rMin={10} rMax={28} o={0.85} />
    </g>
  );
}

export type FigureKind = "gown" | "prince" | "hood" | "king" | "child";

/**
 * Elegant faceless silhouette, 100 units tall at scale 1, standing on (x, y).
 * `lean` tilts toward the partner, `flip` mirrors.
 */
export function Figure({ x, y, s = 1, kind, fill = C.ink, flip = false, lean = 0, rim }: {
  x: number; y: number; s?: number; kind: FigureKind; fill?: string; flip?: boolean; lean?: number; rim?: string;
}) {
  const body: Record<FigureKind, ReactNode> = {
    gown: (
      <>
        <circle cx="0" cy="-89" r="8.5" />
        <path d="M-3 -82 L3 -82 L5 -76 C9 -74 10 -66 8 -56 L7 -50 C14 -36 22 -16 28 0 L-28 0 C-22 -16 -14 -36 -7 -50 L-8 -56 C-10 -66 -9 -74 -5 -76 Z" />
        <path d="M6 -74 C14 -66 16 -56 14 -46" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M-6 -95 C-14 -96 -16 -80 -12 -66 C-10 -76 -8 -86 -4 -90 Z" />
      </>
    ),
    prince: (
      <>
        <circle cx="0" cy="-89" r="8.5" />
        <path d="M-4 -81 L4 -81 L9 -76 L11 -48 L8 -44 L8 0 L2 0 L0 -36 L-2 0 L-8 0 L-8 -44 L-11 -48 L-9 -76 Z" />
        <path d="M-9 -78 C-16 -60 -22 -30 -26 -6 L-6 -10 Z" opacity=".85" />
        <path d="M9 -74 C14 -64 15 -56 13 -48" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
    hood: (
      <path d="M0 -104 C-10 -104 -16 -96 -17 -84 C-18 -76 -15 -72 -13 -70 C-19 -50 -26 -22 -30 0 L30 0 C26 -22 19 -50 13 -70 C15 -72 18 -78 17 -86 C15 -98 8 -104 0 -104 Z M-2 -96 C5 -96 9 -90 9 -82 C9 -78 6 -76 0 -76 C-5 -76 -8 -79 -8 -84 C-8 -91 -6 -96 -2 -96 Z" fillRule="evenodd" />
    ),
    king: (
      <>
        <path d="M-10 -104 L-10 -94 L10 -94 L10 -104 L6 -99 L3 -106 L0 -99 L-3 -106 L-6 -99 Z" fill={C.lime} />
        <circle cx="0" cy="-86" r="9" />
        <path d="M-6 -78 L6 -78 C16 -74 20 -60 22 -44 C26 -26 32 -10 36 0 L-36 0 C-32 -10 -26 -26 -22 -44 C-20 -60 -16 -74 -6 -78 Z" />
        <path d="M-6 -78 C-3 -66 3 -66 6 -78" stroke={C.paper} strokeWidth="2" fill="none" opacity=".5" />
      </>
    ),
    child: (
      <>
        <circle cx="0" cy="-60" r="7" />
        <path d="M-4 -54 L4 -54 L10 -26 L6 0 L-6 0 L-10 -26 Z" />
      </>
    ),
  };
  const t = `translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s}) rotate(${lean})`;
  return (
    <g transform={t} fill={fill} style={{ color: fill }}>
      {rim && <g transform="translate(-2 -1)" fill={rim} style={{ color: rim }} opacity=".7">{body[kind]}</g>}
      {body[kind]}
    </g>
  );
}

/** Field of painterly five-petal flowers (Kaizen meadow). */
export function Flowers({ y0, y1, n, seed, colors, x0 = 0, x1 = W, sMin = 6, sMax = 14 }: {
  y0: number; y1: number; n: number; seed: number; colors: string[]; x0?: number; x1?: number; sMin?: number; sMax?: number;
}) {
  const r = rng(seed);
  const items = Array.from({ length: n }, () => {
    const y = y0 + r() * (y1 - y0);
    const k = (y - y0) / Math.max(1, y1 - y0);
    return { x: x0 + r() * (x1 - x0), y, s: (sMin + r() * (sMax - sMin)) * (0.6 + k * 0.9), c: colors[(r() * colors.length) | 0], rot: r() * 72 };
  }).sort((a, b) => a.y - b.y);
  return (
    <g filter={F.paint}>
      {items.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy={-f.s * 0.9} rx={f.s * 0.62} ry={f.s * 0.95} fill={f.c} transform={`rotate(${a})`} />
          ))}
          <circle r={f.s * 0.42} fill={C.lime} opacity=".9" />
        </g>
      ))}
    </g>
  );
}

/** Glowing paper lantern that floats upward on a loop. */
export function Lantern({ x, y, s = 1, delay = 0, dur = 14 }: { x: number; y: number; s?: number; delay?: number; dur?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g style={{ animation: `tp-float ${dur}s linear infinite`, animationDelay: `${delay}s` }}>
        <ellipse cx="0" cy="0" rx="34" ry="40" fill={C.peach} opacity=".35" filter={F.soft} />
        <path d="M-12 -16 C-14 -4 -13 8 -9 16 L9 16 C13 8 14 -4 12 -16 Z" fill={C.peach} filter={F.glow} />
        <path d="M-12 -16 L12 -16" stroke={C.coral} strokeWidth="3" />
        <rect x="-5" y="16" width="10" height="3" fill={C.coral} />
      </g>
    </g>
  );
}

/** Soft drifting mist band. */
export function Mist({ y, color, o = 0.4, h = 70, dur = 30, x = W / 2, w = W }: { y: number; color: string; o?: number; h?: number; dur?: number; x?: number; w?: number }) {
  return (
    <g style={{ animation: `tp-drift-x ${dur}s ease-in-out infinite` }}>
      <ellipse cx={x} cy={y} rx={w * 0.62} ry={h} fill={color} opacity={o} filter={F.soft} />
    </g>
  );
}

/** Generic svg layer wrapper used by Scene. */
export function Svg({ children, mode = "slice" }: { children: ReactNode; mode?: "slice" | "meet" }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio={`xMidYMid ${mode}`} className="absolute inset-0 h-full w-full" aria-hidden>
      {children}
    </svg>
  );
}
