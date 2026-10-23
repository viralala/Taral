// Painted scenes for the three trials: forest, bridge, door (+ the shared tower wall used by rescue).
import { C, Dabs, F, Mist, Stars, Stroke, anim, rng } from "./paint";
import type { ArtDef } from "./types";

export function forest(): ArtDef {
  const r = rng(81);
  const farTrunks = Array.from({ length: 16 }, (_, i) => ({ x: i * 105 + r() * 50, w: 26 + r() * 30 }));
  const nearTrunks = [
    { x: 120, w: 120 }, { x: 380, w: 80 }, { x: 560, w: 70 }, { x: 1040, w: 76 }, { x: 1230, w: 96 }, { x: 1480, w: 130 },
  ];
  const eyes = [
    [620, 560, C.lime], [960, 520, C.peach], [760, 430, C.lime], [300, 600, C.peach], [1340, 560, C.lime], [870, 640, C.mint], [470, 380, C.lime], [1130, 400, C.peach],
  ] as const;
  return {
    sky: "linear-gradient(180deg,#04121a 0%,#0b2f35 38%,#145246 66%,#0d3a33 85%,#06171a 100%)",
    layers: [
      {
        depth: 0.06, node: (
          <>
            <ellipse cx="800" cy="420" rx="260" ry="320" fill={C.mint} opacity=".18" filter={F.soft} />
            {[[700, 0, 560, 1000], [860, 0, 980, 1000], [780, 0, 760, 1000]].map(([x1, y1, x2, y2], i) => (
              <path key={i} d={`M${x1 - 40} ${y1} L${x1 + 40} ${y1} L${x2 + 90} ${y2} L${x2 - 90} ${y2} Z`} fill={C.mint} opacity=".08"
                style={{ animation: `tp-beam ${6 + i * 2}s ease-in-out infinite`, animationDelay: `${-i * 2}s` }} />
            ))}
          </>
        ),
      },
      {
        depth: 0.2, node: (
          <g filter={F.paint}>
            {farTrunks.map((t, i) => (
              <rect key={i} x={t.x} y={-20} width={t.w} height={900} fill={i % 2 ? "#1d5a55" : "#174a48"} opacity=".7" />
            ))}
            <Mist y={760} color={C.mint} o={0.18} h={80} />
          </g>
        ),
      },
      {
        depth: 0.45, node: (
          <>
            {/* the lit path into the woods */}
            <path d="M640 1000 C700 880 760 780 790 700 L810 700 C840 780 900 880 960 1000 Z" fill={C.mint} opacity=".28" filter={F.paint} />
            <g filter={F.paint}>
              {nearTrunks.map((t, i) => (
                <path key={i} d={`M${t.x - t.w / 2} 1000 C${t.x - t.w / 2 + 10} 700 ${t.x - t.w / 3} 300 ${t.x - t.w / 3} -20 L${t.x + t.w / 3} -20 C${t.x + t.w / 3} 300 ${t.x + t.w / 2 - 10} 700 ${t.x + t.w / 2} 1000 Z`}
                  fill={i % 2 ? "#082224" : "#0a2a2b"} />
              ))}
            </g>
            <Dabs cx={800} cy={40} rx={900} ry={140} n={80} seed={82} colors={["#0b3b33", "#0f4a3c", "#14614a", "#082a26"]} rMin={40} rMax={90} />
            {/* eyes watching back */}
            {eyes.map(([x, y, c], i) => (
              <g key={i} filter={F.glow}>
                <g style={anim(`tp-blink ${4 + (i % 3)}s ease-in-out infinite`, "center", -i * 0.9)}>
                  <ellipse cx={x - 13} cy={y} rx="7" ry="5" fill={c} />
                  <ellipse cx={x + 13} cy={y} rx="7" ry="5" fill={c} />
                </g>
              </g>
            ))}
          </>
        ),
      },
      {
        depth: 1.1, node: (
          <>
            <Mist y={930} color={C.mint} o={0.2} h={60} />
            {[[460, 930, C.rose], [520, 950, C.peach], [1110, 940, C.rose], [1160, 960, C.coral]].map(([x, y, c], i) => (
              <g key={i} filter={F.glow}>
                <path d={`M${Number(x) - 22} ${y} C${Number(x) - 20} ${Number(y) - 30} ${Number(x) + 20} ${Number(y) - 30} ${Number(x) + 22} ${y} Z`} fill={String(c)} />
                <rect x={Number(x) - 4} y={Number(y)} width="8" height="18" fill={C.paper} opacity=".8" />
              </g>
            ))}
            <g filter={F.brush}>
              {Array.from({ length: 14 }, (_, i) => {
                const left = i < 7;
                const bx = left ? 40 + i * 40 : 1300 + (i - 7) * 44;
                return <path key={i} d={`M${bx} 1010 C${bx + (left ? 40 : -40)} 900 ${bx + (left ? 100 : -100)} 860 ${bx + (left ? 160 : -160)} 840`}
                  stroke={i % 2 ? "#0f4a3c" : C.leaf} strokeWidth="18" fill="none" opacity={i % 2 ? 0.95 : 0.5} strokeLinecap="round" />;
              })}
            </g>
          </>
        ),
      },
    ],
    fireflies: 14,
    fireflyColor: C.lime,
  };
}

export function bridge(): ArtDef {
  const q = (t: number, a: number, b: number, c: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  const planks = Array.from({ length: 24 }, (_, i) => {
    const t = (i + 0.5) / 24;
    const x = q(t, 440, 800, 1160);
    const y = q(t, 640, 790, 640);
    const dy = 2 * (1 - t) * (790 - 640) + 2 * t * (640 - 790);
    const ang = (Math.atan2(dy, 720) * 180) / Math.PI;
    return { x, y, ang, i };
  });
  return {
    sky: "linear-gradient(180deg,#0b1240 0%,#2a1a6e 34%,#7d47c4 62%,#d98cc0 84%,#f6b5c8 100%)",
    layers: [
      {
        depth: 0.06, node: (
          <>
            <Stars n={60} seed={91} yMax={400} />
            <circle cx="1010" cy="250" r="200" fill={C.paper} opacity=".22" filter={F.soft} />
            <circle cx="1010" cy="250" r="90" fill={C.paper} filter={F.paint} />
            <circle cx="985" cy="232" r="22" fill={C.paper2} opacity=".7" />
            <Stroke d="M60 330 C380 300 700 360 1000 330 S1420 300 1560 340" color={C.blossom} w={40} o={0.35} drift={26} />
          </>
        ),
      },
      {
        depth: 0.2, node: (
          <g filter={F.paint} fill="#5a3299" opacity=".85">
            <path d="M120 520 C180 480 280 490 330 520 L290 600 L230 640 L170 590 Z" />
            <path d="M1300 470 C1360 440 1460 450 1500 480 L1470 560 L1400 590 L1340 540 Z" />
            <path d="M560 450 C600 430 650 436 680 452 L654 500 L610 516 L580 490 Z" />
          </g>
        ),
      },
      {
        depth: 0.4, node: (
          <>
            <Mist y={900} color={C.blossom} o={0.5} h={110} dur={26} />
            <Mist y={800} color={C.violet} o={0.45} h={80} dur={34} />
            {[[420, 380], [480, 360], [1120, 300], [1170, 320]].map(([x, y], i) => (
              <path key={i} d={`M${x - 14} ${y} q7 -8 14 0 q7 -8 14 0`} stroke={C.ink} strokeWidth="3" fill="none" style={anim(`tp-bob ${3 + i}s ease-in-out infinite`)} />
            ))}
          </>
        ),
      },
      {
        depth: 0.65, node: (
          <>
            <g filter={F.paint}>
              <path d="M-20 600 C140 590 300 610 470 630 C500 700 470 820 420 1020 L-20 1020 Z" fill="#1a0f45" />
              <path d="M1620 600 C1460 590 1300 610 1130 630 C1100 700 1130 820 1180 1020 L1620 1020 Z" fill="#1a0f45" />
              <path d="M-20 600 C140 590 300 610 470 630" stroke={C.violet} strokeWidth="10" fill="none" opacity=".6" />
              <path d="M1620 600 C1460 590 1300 610 1130 630" stroke={C.violet} strokeWidth="10" fill="none" opacity=".6" />
            </g>
            {/* rope bridge */}
            <g>
              <path d="M440 540 Q800 700 1160 540" stroke="#3a2010" strokeWidth="5" fill="none" />
              <path d="M440 640 Q800 790 1160 640" stroke="#3a2010" strokeWidth="5" fill="none" />
              {planks.filter((p) => p.i % 3 === 0).map((p) => (
                <line key={`v${p.i}`} x1={p.x} y1={p.y} x2={p.x} y2={q((p.i + 0.5) / 24, 540, 700, 540)} stroke="#3a2010" strokeWidth="3" />
              ))}
              {planks.map((p) => (
                <rect key={p.i} x={-13} y={-6} width={26} height={14} rx={3} fill={p.i % 2 ? "#a2643f" : "#8a5233"}
                  transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`} />
              ))}
              {[440, 1160].map((x) => (
                <g key={x} filter={F.paint}>
                  <rect x={x - 10} y={520} width={20} height={140} fill="#2a160c" />
                  <circle cx={x} cy={520} r={13} fill="#2a160c" />
                </g>
              ))}
              <circle cx="440" cy="500" r="18" fill={C.lime} opacity=".7" filter={F.glow} style={anim("tp-pulse 3s ease-in-out infinite")} />
              <circle cx="1160" cy="500" r="18" fill={C.lime} opacity=".7" filter={F.glow} style={anim("tp-pulse 3s ease-in-out infinite", "center", -1.5)} />
            </g>
          </>
        ),
      },
      {
        depth: 1.15, node: (
          <>
            <Mist y={990} color={C.paper} o={0.25} h={70} dur={22} />
            <g filter={F.brush}>
              {[60, 140, 1460, 1540].map((x, i) => (
                <path key={x} d={`M${x} -10 C${x + 20} 120 ${x - 20} 220 ${x + 10} ${300 + (i % 2) * 80}`} stroke={C.leaf} strokeWidth="14" fill="none" opacity=".7" strokeLinecap="round"
                  style={anim("sway 6s ease-in-out infinite", "top center", -i)} />
              ))}
            </g>
          </>
        ),
      },
    ],
    petals: 8,
  };
}

/** Stone tower wall with flickering torches; used by door and rescue. */
export function TowerWall({ seed = 101 }: { seed?: number }) {
  const r = rng(seed);
  const rows = Array.from({ length: 12 }, (_, row) => row);
  return (
    <g filter={F.paint}>
      {rows.map((row) =>
        Array.from({ length: 11 }, (_, col) => {
          const off = row % 2 ? 80 : 0;
          const shade = ["#241657", "#2b1b63", "#1f1350", "#2f2070"][(r() * 4) | 0];
          return <rect key={`${row}-${col}`} x={col * 160 - off - 10} y={row * 84 - 20} width={150} height={76} rx={14} fill={shade} />;
        }),
      )}
    </g>
  );
}

export function Torch({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 40} r="200" fill={C.peach} opacity=".28" filter={F.soft} style={anim("tp-pulse 2.6s ease-in-out infinite", "center", delay)} />
      <g filter={F.paint}>
        <path d={`M${x - 14} ${y} L${x + 14} ${y} L${x + 6} ${y + 70} L${x - 6} ${y + 70} Z`} fill="#2a160c" />
        <rect x={x - 24} y={y + 30} width="48" height="10" fill="#140a06" />
      </g>
      <g filter={F.glow} style={anim("tp-flicker .9s ease-in-out infinite", "bottom center", delay)}>
        <path d={`M${x} ${y - 70} C${x + 26} ${y - 30} ${x + 22} ${y} ${x} ${y + 2} C${x - 22} ${y} ${x - 26} ${y - 30} ${x} ${y - 70} Z`} fill={C.coral} />
        <path d={`M${x} ${y - 46} C${x + 14} ${y - 22} ${x + 12} ${y - 2} ${x} ${y} C${x - 12} ${y - 2} ${x - 14} ${y - 22} ${x} ${y - 46} Z`} fill={C.peach} />
        <path d={`M${x} ${y - 24} C${x + 6} ${y - 12} ${x + 6} ${y - 2} ${x} ${y} C${x - 6} ${y - 2} ${x - 6} ${y - 12} ${x} ${y - 24} Z`} fill={C.lime} />
      </g>
    </g>
  );
}

export const ARCH = "M630 860 L630 470 C630 300 970 300 970 470 L970 860 Z";

function Padlock({ x, y, c, delay }: { x: number; y: number; c: string; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="44" fill={c} opacity=".3" filter={F.soft} style={anim("tp-pulse 3s ease-in-out infinite", "center", delay)} />
      <path d="M-18 -8 L-18 -26 C-18 -48 18 -48 18 -26 L18 -8" stroke="#1a1030" strokeWidth="8" fill="none" />
      <rect x="-28" y="-10" width="56" height="44" rx="10" fill={c} filter={F.glow} />
      <circle cx="0" cy="8" r="6" fill="#1a1030" />
      <rect x="-3" y="10" width="6" height="14" fill="#1a1030" />
    </g>
  );
}

export function door(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#120a2e 0%,#2a1a6e 50%,#160c34 100%)",
    layers: [
      { depth: 0.1, node: <TowerWall /> },
      {
        depth: 0.4, node: (
          <>
            <Torch x={500} y={480} />
            <Torch x={1100} y={480} delay={-0.4} />
            <g filter={F.paint}>
              <path d="M600 880 L600 460 C600 270 1000 270 1000 460 L1000 880 Z" fill="#4a3a7a" />
              <path d={ARCH} fill="#4a2420" />
              {[680, 740, 800, 860, 920].map((x, i) => (
                <path key={x} d={`M${x} ${i === 0 || i === 4 ? 400 : 330} L${x} 860`} stroke={i % 2 ? "#6e3a30" : "#5a2e2a"} strokeWidth="56" opacity=".9" />
              ))}
              <path d={ARCH} fill="none" stroke="#2a1a3a" strokeWidth="18" />
              <rect x="630" y="560" width="340" height="14" fill="#1a1030" />
              <rect x="630" y="760" width="340" height="14" fill="#1a1030" />
              <rect x="560" y="860" width="480" height="34" fill="#3a2a6a" />
              <rect x="520" y="892" width="560" height="34" fill="#2f2160" />
            </g>
            <Padlock x={800} y={470} c={C.lime} delay={0} />
            <Padlock x={800} y={610} c={C.peach} delay={-1} />
            <Padlock x={800} y={750} c={C.rose} delay={-2} />
          </>
        ),
      },
      {
        depth: 1.0, node: (
          <>
            <g filter={F.brush}>
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i} d={`M${-20 + i * 30} -10 C${80 + i * 40} 100 ${40 + i * 50} 240 ${160 + i * 40} ${360 + i * 30}`} stroke={i % 2 ? C.leaf : "#2f6b3a"}
                  strokeWidth="16" fill="none" opacity=".8" strokeLinecap="round" />
              ))}
            </g>
            <Dabs cx={120} cy={120} rx={160} ry={100} n={30} seed={102} colors={[C.leaf, "#2f6b3a", "#1f4a2a"]} rMin={14} rMax={30} />
            <Mist y={980} color={C.violet} o={0.4} h={60} />
          </>
        ),
      },
    ],
    fireflies: 5,
    fireflyColor: C.peach,
  };
}

/** Small motes used by rescue. */
export function Motes({ n, seed, yMin = 300, yMax = 900 }: { n: number; seed: number; yMin?: number; yMax?: number }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={500 + r() * 600} cy={yMin + r() * (yMax - yMin)} r={1.5 + r() * 2.5} fill={C.paper}
          style={{ animation: `tp-float ${8 + r() * 6}s linear infinite`, animationDelay: `${-r() * 12}s` }} />
      ))}
    </g>
  );
}

