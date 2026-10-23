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

const SKIN = "#f0b88f";
const GOLD = "#f2c94c";
const EYE = "#2b1a1f";

/** A friendly little face: dot eyes, blush, smile (or a stern frown with angled brows for the king). */
function Face({ y, r = 8.5, stern = false }: { y: number; r?: number; stern?: boolean }) {
  const ex = r * 0.38;
  return (
    <g stroke="none">
      <circle cx={-ex} cy={y} r="1.25" fill={EYE} />
      <circle cx={ex} cy={y} r="1.25" fill={EYE} />
      <circle cx={-r * 0.62} cy={y + 3.4} r="1.9" fill="#f28b8b" opacity=".55" />
      <circle cx={r * 0.62} cy={y + 3.4} r="1.9" fill="#f28b8b" opacity=".55" />
      {stern ? (
        <>
          <path d={`M${-ex - 2.4} ${y - 3.4} L${-ex + 1.6} ${y - 2}`} stroke={EYE} strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${ex + 2.4} ${y - 3.4} L${ex - 1.6} ${y - 2}`} stroke={EYE} strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M-2.4 ${y + 5.2} Q0 ${y + 3.6} 2.4 ${y + 5.2}`} stroke="#7a3030" strokeWidth="1" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d={`M-2.6 ${y + 3.6} Q0 ${y + 6.4} 2.6 ${y + 3.6}`} stroke="#8a3b3b" strokeWidth="1" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

/**
 * Storybook character, 100 units tall at scale 1, standing on (x, y).
 * Coloured clothes, faces and hair. `tone` dims them for night scenes (1 = full colour),
 * `rim` adds a soft coloured edge light, `lean` tilts toward the partner, `flip` mirrors.
 */
export function Figure({ x, y, s = 1, kind, tone = 1, flip = false, lean = 0, rim }: {
  x: number; y: number; s?: number; kind: FigureKind; tone?: number; flip?: boolean; lean?: number; rim?: string;
}) {
  const body: Record<FigureKind, ReactNode> = {
    prince: (
      <>
        {/* red cape */}
        <path d="M-9 -78 C-19 -60 -25 -28 -29 -2 L-5 -8 L5 -8 L29 -2 C25 -28 19 -60 9 -78 Z" fill="#c63a4a" />
        {/* legs + boots */}
        <path d="M-8 -46 L-1 -46 L-1 -6 L-8 -6 Z M1 -46 L8 -46 L8 -6 L1 -6 Z" fill="#2c2f66" />
        <path d="M-9 -7 L0 -7 L0 0 L-10 0 Z M0 -7 L9 -7 L10 0 L0 0 Z" fill="#3b2418" />
        {/* tunic */}
        <path d="M-9 -80 L9 -80 L13 -44 L-13 -44 Z" fill="#2f5fd0" />
        <path d="M-13 -52 H13 V-48.5 H-13 Z" fill={GOLD} />
        <path d="M-4 -80 L0 -72 L4 -80" stroke={GOLD} strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="0" cy="-66" r="1.4" fill={GOLD} />
        <circle cx="0" cy="-59" r="1.4" fill={GOLD} />
        {/* sleeves + hands */}
        <path d="M-9 -78 L-16 -50 L-11 -48 L-6 -70 Z M9 -78 L16 -50 L11 -48 L6 -70 Z" fill="#2a54bd" />
        <circle cx="-13.5" cy="-46.5" r="3" fill={SKIN} stroke="none" />
        <circle cx="13.5" cy="-46.5" r="3" fill={SKIN} stroke="none" />
        {/* neck, head, hair, circlet */}
        <rect x="-3" y="-83" width="6" height="5" fill="#e2a27a" stroke="none" />
        <circle cx="0" cy="-89" r="8.5" fill={SKIN} />
        <path d="M-9.2 -88 C-11.5 -101 11.5 -101 9.2 -88 C6 -94 -2 -95 -9.2 -88 Z" fill="#3a2418" />
        <path d="M-8 -93.5 Q0 -97 8 -93.5" stroke={GOLD} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Face y={-88.5} />
      </>
    ),
    gown: (
      <>
        {/* long hair behind */}
        <path d="M-10 -90 C-17 -101 17 -101 10 -90 C15 -76 15 -62 11 -52 L-11 -52 C-15 -62 -15 -76 -10 -90 Z" fill="#4a2230" />
        {/* skirt */}
        <path d="M-6 -64 L6 -64 L8 -52 C16 -36 24 -16 31 0 L-31 0 C-24 -16 -16 -36 -8 -52 Z" fill="#f07aa8" />
        <path d="M-2 -52 C4 -36 10 -16 14 0 L24 0 C18 -16 10 -36 6 -52 Z" fill="#f9a8c6" opacity=".6" stroke="none" />
        <path d="M-31 -1.5 Q0 5 31 -1.5" stroke="#ffe3ef" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* bodice + sash */}
        <path d="M-6.5 -80 L6.5 -80 L8 -60 L-8 -60 Z" fill="#fbd0e0" />
        <path d="M-8 -61 H8 V-57 H-8 Z" fill="#9b5bd4" />
        {/* arms */}
        <path d="M-6 -78 L-13 -56 L-9.5 -55 L-4 -70 Z M6 -78 L13 -56 L9.5 -55 L4 -70 Z" fill={SKIN} />
        {/* neck, head, bangs, tiara */}
        <rect x="-2.8" y="-83" width="5.6" height="5" fill="#e2a27a" stroke="none" />
        <circle cx="0" cy="-89" r="8.5" fill={SKIN} />
        <path d="M-9.2 -88 C-11 -101 11 -101 9.2 -88 C4 -92 -3 -93 -9.2 -88 Z" fill="#4a2230" />
        <path d="M-4.5 -96.5 L0 -103 L4.5 -96.5 Z" fill={GOLD} />
        <Face y={-88} />
      </>
    ),
    king: (
      <>
        {/* crimson robe with ermine collar */}
        <path d="M-6 -78 L6 -78 C16 -74 20 -60 22 -44 C26 -26 32 -10 36 0 L-36 0 C-32 -10 -26 -26 -22 -44 C-20 -60 -16 -74 -6 -78 Z" fill="#b3262f" />
        <path d="M-3 -76 L-4.5 0 M3 -76 L4.5 0" stroke={GOLD} strokeWidth="2.2" fill="none" />
        <path d="M-22 -50 H22 V-45.5 H-22 Z" fill={GOLD} />
        <path d="M-18 -75 C-8 -66 8 -66 18 -75 L21 -66 C9 -55 -9 -55 -21 -66 Z" fill="#f6f1e6" />
        {[[-12, -66], [-5, -62], [4, -62], [12, -66]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="1.1" fill="#1d1030" stroke="none" />)}
        {/* hands */}
        <circle cx="-21" cy="-44" r="3.4" fill={SKIN} stroke="none" />
        <circle cx="21" cy="-44" r="3.4" fill={SKIN} stroke="none" />
        {/* head, hair, beard, crown */}
        <path d="M-10 -88 C-12 -78 -8 -72 0 -72 C8 -72 12 -78 10 -88 C6 -80 -6 -80 -10 -88 Z" fill="#d9d9de" />
        <circle cx="0" cy="-86" r="9" fill={SKIN} />
        <path d="M-9.5 -85 C-11 -70 11 -70 9.5 -85 C6 -76 -6 -76 -9.5 -85 Z" fill="#e6e6ec" />
        <path d="M-9.4 -90 C-11 -94 -9 -96 -7 -95 M9.4 -90 C11 -94 9 -96 7 -95" stroke="#d9d9de" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M-10.5 -93 L-10.5 -105 L-5.2 -99.5 L0 -107 L5.2 -99.5 L10.5 -105 L10.5 -93 Z" fill={GOLD} />
        <circle cx="0" cy="-97" r="1.5" fill="#ef3f7a" stroke="none" />
        <Face y={-86.5} r={9} stern />
      </>
    ),
    hood: (
      <>
        <path d="M0 -104 C-10 -104 -16 -96 -17 -84 C-18 -76 -15 -72 -13 -70 C-19 -50 -26 -22 -30 0 L30 0 C26 -22 19 -50 13 -70 C15 -72 18 -78 17 -86 C15 -98 8 -104 0 -104 Z" fill="#1b1448" />
        <path d="M-2 -96 C5 -96 9 -90 9 -82 C9 -78 6 -76 0 -76 C-5 -76 -8 -79 -8 -84 C-8 -91 -6 -96 -2 -96 Z" fill="#05061a" stroke="none" />
        {/* glowing eyes */}
        <ellipse cx="-3" cy="-86" rx="1.9" ry="2.6" fill={C.lime} stroke="none" filter={F.glow} />
        <ellipse cx="3.5" cy="-86" rx="1.9" ry="2.6" fill={C.lime} stroke="none" filter={F.glow} />
        {/* tiny traffic lights stitched on the hem: the clue from the bridge */}
        <rect x="-5" y="-22" width="10" height="24" rx="3" fill="#0f0b2e" stroke="none" />
        <circle cx="0" cy="-16" r="2.3" fill="#ef3f3f" stroke="none" />
        <circle cx="0" cy="-9" r="2.3" fill="#f2c94c" stroke="none" />
        <circle cx="0" cy="-2.6" r="2.3" fill="#4cd37b" stroke="none" />
        <path d="M-8 -70 C-4 -64 4 -64 8 -70" stroke="#3a2f8a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
    child: (
      <>
        <path d="M-4 -54 L4 -54 L10 -26 L6 0 L-6 0 L-10 -26 Z" fill="#f2795a" />
        <circle cx="0" cy="-60" r="7" fill={SKIN} />
        <Face y={-59.5} r={7} />
      </>
    ),
  };
  const t = `translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s}) rotate(${lean})`;
  const filter = [tone < 1 ? `brightness(${tone})` : "", rim ? `drop-shadow(0 0 2.5px ${rim})` : ""].filter(Boolean).join(" ");
  return (
    <g transform={t} stroke="#1d1030" strokeOpacity=".55" strokeWidth=".8" strokeLinejoin="round" style={filter ? { filter } : undefined}>
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
