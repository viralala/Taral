// Painted scenes for the ending: rescue, reveal, blessing, reunion.
import { C, CherryTree, Dabs, F, Figure, Flowers, Mist, Stroke, anim, rng } from "./paint";
import { ARCH, Motes, Torch, TowerWall } from "./artsTrials";
import type { ArtDef } from "./types";

export function rescue(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#120a2e 0%,#2a1a6e 50%,#160c34 100%)",
    layers: [
      { depth: 0.1, node: <TowerWall seed={111} /> },
      {
        depth: 0.4, node: (
          <>
            <Torch x={500} y={480} />
            <Torch x={1100} y={480} delay={-0.5} />
            <g filter={F.paint}>
              <path d="M600 880 L600 460 C600 270 1000 270 1000 460 L1000 880 Z" fill="#4a3a7a" />
              <rect x="560" y="860" width="480" height="34" fill="#3a2a6a" />
              <rect x="520" y="892" width="560" height="34" fill="#2f2160" />
            </g>
            {/* the light inside */}
            <path d={ARCH} fill="#fff4dc" />
            <path d={ARCH} fill={C.peach} opacity=".35" filter={F.soft} />
            {/* light spilling across the floor */}
            <path d="M630 860 L970 860 L1400 1010 L200 1010 Z" fill="#fff1c9" opacity=".55" filter={F.soft} style={anim("tp-beam 5s ease-in-out infinite")} />
            <g opacity=".5" style={anim("tp-beam 7s ease-in-out infinite")}>
              {[-1, 1].map((s) => (
                <path key={s} d={`M800 380 L${800 + s * 900} ${200 + 140} L${800 + s * 900} ${520}`} fill="#fff1c9" opacity=".25" filter={F.soft} />
              ))}
            </g>
            {/* door leaf swung open */}
            <g filter={F.paint}>
              <path d="M630 470 L540 430 L540 900 L630 860 Z" fill="#5a2e2a" />
              <path d="M560 440 L560 890" stroke="#3a1a18" strokeWidth="10" />
            </g>
            {/* silhouettes reunited in the doorway */}
            <Figure x={772} y={858} s={2.5} kind="prince" fill="#2a1a3a" lean={6} rim={C.peach} />
            <Figure x={834} y={858} s={2.4} kind="gown" fill="#2a1a3a" flip lean={-6} rim={C.peach} />
            <Motes n={30} seed={112} />
          </>
        ),
      },
      {
        depth: 1.0, node: (
          <g>
            {/* three broken locks on the floor */}
            {[[640, 950, -30, C.lime], [930, 960, 40, C.peach], [1040, 935, 75, C.rose]].map(([x, y, a, c], i) => (
              <g key={i} transform={`translate(${x} ${y}) rotate(${a})`} filter={F.paint}>
                <path d="M-12 -8 L-12 -22 C-12 -36 6 -40 12 -30" stroke="#1a1030" strokeWidth="6" fill="none" />
                <rect x="-20" y="-8" width="40" height="30" rx="8" fill={String(c)} />
              </g>
            ))}
          </g>
        ),
      },
    ],
    petals: 10,
  };
}

/** CAPT. CHA, the royal CAPTCHA: a flower-faced bot, hood fallen, very sheepish. */
function CaptCha() {
  return (
    <g transform="translate(800 0)">
      {/* fallen hood pooled at his feet */}
      <path d="M-200 860 C-170 790 -90 770 0 776 C90 770 170 790 200 860 Z" fill={C.ink} filter={F.paint} />
      <path d="M-120 800 C-60 780 60 780 120 800" stroke="#2a3070" strokeWidth="8" fill="none" opacity=".7" />
      {/* body */}
      <g filter={F.paint}>
        <rect x="-110" y="500" width="220" height="290" rx="70" fill={C.navy} />
        <rect x="-70" y="560" width="140" height="120" rx="22" fill={C.paper} />
        <rect x="-40" y="772" width="30" height="40" rx="10" fill={C.navy} />
        <rect x="10" y="772" width="30" height="40" rx="10" fill={C.navy} />
      </g>
      {/* checkbox on his chest, ticked */}
      <rect x="-30" y="592" width="60" height="56" rx="8" fill="none" stroke={C.navy} strokeWidth="6" />
      <path d="M-18 620 L-4 636 L24 598" stroke={C.leaf} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* sash */}
      <path d="M-104 540 L104 700 L94 726 L-110 568 Z" fill={C.rose} filter={F.paint} opacity=".92" />
      <text x="0" y="640" textAnchor="middle" fontSize="26" fill={C.paper} className="hand" transform="rotate(37 0 632) translate(0 -2)">CAPT. CHA</text>
      {/* arm scratching head */}
      <path d="M100 540 C160 520 170 440 120 380" stroke={C.navy} strokeWidth="34" fill="none" strokeLinecap="round" filter={F.paint} />
      <path d="M-100 560 C-150 620 -150 680 -120 720" stroke={C.navy} strokeWidth="34" fill="none" strokeLinecap="round" filter={F.paint} />
      {/* antenna */}
      <path d="M0 270 C10 230 -10 210 0 180" stroke={C.navy} strokeWidth="6" fill="none" />
      <circle cx="0" cy="176" r="12" fill={C.lime} filter={F.glow} style={anim("tp-pulse 1.6s ease-in-out infinite")} />
      {/* flower head */}
      <g style={anim("sway 4s ease-in-out infinite", "center bottom")}>
        <g filter={F.paint}>
          {Array.from({ length: 10 }, (_, i) => (
            <ellipse key={i} cx="0" cy="-118" rx="46" ry="70" fill={i % 2 ? C.rose : C.blossom} transform={`translate(0 380) rotate(${i * 36})`} />
          ))}
          <circle cx="0" cy="380" r="92" fill={C.paper} />
        </g>
        {/* sheepish closed eyes, blush, tiny wobbly smile */}
        <path d="M-50 372 Q-34 356 -18 372" stroke={C.navy} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M18 372 Q34 356 50 372" stroke={C.navy} strokeWidth="7" fill="none" strokeLinecap="round" />
        <ellipse cx="-56" cy="404" rx="18" ry="10" fill={C.coral} opacity=".7" />
        <ellipse cx="56" cy="404" rx="18" ry="10" fill={C.coral} opacity=".7" />
        <path d="M-16 418 Q-8 426 0 418 Q8 426 16 418" stroke={C.navy} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M96 300 C104 316 108 326 100 334 C92 340 84 330 90 318 Z" fill={C.mint} style={anim("tp-sweat 1.4s ease-in-out infinite")} />
      </g>
    </g>
  );
}

export function reveal(): ArtDef {
  const r = rng(121);
  return {
    sky: "radial-gradient(ellipse at 50% 38%,#ffd2a8 0%,#ffb98a 18%,#f2795a 40%,#9b5bd4 68%,#2a1a6e 100%)",
    layers: [
      {
        depth: 0.08, node: (
          <>
            <path d="M720 -20 L880 -20 L1180 1000 L420 1000 Z" fill={C.paper} opacity=".16" filter={F.soft} style={anim("tp-beam 6s ease-in-out infinite")} />
            <Stroke d="M60 200 C360 160 640 240 960 190 S1400 170 1560 220" color={C.violet} w={60} o={0.35} drift={24} />
            <Stroke d="M120 760 C420 730 760 790 1080 740 S1440 720 1580 760" color={C.rose} w={50} o={0.3} drift={30} />
          </>
        ),
      },
      {
        depth: 0.25, node: (
          <g>
            {Array.from({ length: 40 }, (_, i) => (
              <rect key={i} x={r() * 1600} y={r() * 900} width={10 + r() * 10} height={6 + r() * 6} rx={3}
                fill={[C.lime, C.blossom, C.mint, C.peach, C.paper][i % 5]} transform={`rotate(${r() * 180} 800 500)`}
                style={{ animation: `twinkle ${2 + r() * 3}s ease-in-out infinite`, animationDelay: `${-r() * 4}s` }} />
            ))}
          </g>
        ),
      },
      {
        depth: 0.6, node: (
          <>
            <ellipse cx="800" cy="860" rx="300" ry="30" fill="#000" opacity=".25" filter={F.haze} />
            <CaptCha />
          </>
        ),
      },
      {
        depth: 1.1, node: <Flowers y0={900} y1={1010} n={60} seed={122} colors={[C.rose, C.blossom, C.coral]} />,
      },
    ],
    petals: 14,
  };
}

export function blessing(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#ffb98a 0%,#ffd2a8 34%,#fbc3c4 64%,#f2795a 100%)",
    layers: [
      {
        depth: 0.06, node: (
          <>
            <circle cx="720" cy="330" r="300" fill="#fff4dc" opacity=".6" filter={F.soft} />
            <circle cx="720" cy="330" r="120" fill="#fff4dc" filter={F.paint} />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <path key={i} d={`M${720 + Math.cos(a) * 160} ${330 + Math.sin(a) * 160} L${720 + Math.cos(a) * 900} ${330 + Math.sin(a) * 900}`}
                stroke="#fff4dc" strokeWidth="40" opacity=".22" filter={F.brush} />;
            })}
            <Stroke d="M40 180 C340 150 600 210 900 170" color={C.paper} w={40} o={0.4} drift={26} />
          </>
        ),
      },
      {
        depth: 0.3, node: (
          <g filter={F.paint} fill="#e48c8c" opacity=".75">
            <rect x="180" y="380" width="70" height="480" />
            <rect x="1350" y="380" width="70" height="480" />
            <path d="M150 380 L280 380 L260 350 L170 350 Z" />
            <path d="M1320 380 L1450 380 L1430 350 L1340 350 Z" />
          </g>
        ),
      },
      {
        depth: 0.6, node: (
          <>
            <path d="M0 840 C400 820 1200 820 1600 840 L1600 1000 L0 1000 Z" fill="#c4566a" filter={F.paint} />
            <ellipse cx="800" cy="842" rx="320" ry="16" fill="#5a1a3a" opacity=".3" filter={F.haze} />
            {/* the king bows, offering his crown */}
            <g>
              <Figure x={620} y={842} s={2.7} kind="king" fill="#3a1238" lean={16} rim={C.paper} />
              <path d="M650 640 C690 640 720 650 742 668" stroke="#3a1238" strokeWidth="20" fill="none" strokeLinecap="round" filter={F.paint} />
              <g transform="translate(758 650)" style={anim("tp-bob 3s ease-in-out infinite")}>
                <circle r="44" fill={C.lime} opacity=".35" filter={F.soft} />
                <path d="M-24 10 L-28 -14 L-14 -4 L-7 -22 L0 -6 L7 -22 L14 -4 L28 -14 L24 10 Z" fill={C.lime} filter={F.glow} />
              </g>
            </g>
            <Figure x={920} y={842} s={2.3} kind="prince" fill="#3a1238" flip lean={-4} rim={C.paper} />
            <Figure x={985} y={842} s={2.2} kind="gown" fill="#3a1238" flip lean={-6} rim={C.paper} />
          </>
        ),
      },
      {
        depth: 1.15, node: (
          <>
            <Dabs cx={200} cy={20} rx={360} ry={90} n={40} seed={131} colors={[C.blossom, C.rose, C.paper]} rMin={18} rMax={40} />
            <Dabs cx={1400} cy={20} rx={360} ry={90} n={40} seed={132} colors={[C.blossom, C.rose, C.paper]} rMin={18} rMax={40} />
            <Flowers y0={920} y1={1010} n={50} seed={133} colors={[C.paper, C.blossom, C.lime]} />
          </>
        ),
      },
    ],
    petals: 16,
  };
}

export function reunion(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#2a1a6e 0%,#7d47c4 22%,#e59ac4 46%,#ffb98a 68%,#fff1c9 100%)",
    layers: [
      {
        depth: 0.06, node: (
          <>
            <circle cx="900" cy="760" r="380" fill="#fff4dc" opacity=".55" filter={F.soft} />
            <circle cx="900" cy="760" r="170" fill="#fff1c9" filter={F.paint} />
            <Stroke d="M40 300 C340 260 640 330 960 290 S1420 270 1580 310" color={C.peach} w={56} o={0.5} drift={26} />
            <Stroke d="M200 430 C520 400 840 460 1200 420" color={C.rose} w={36} o={0.35} drift={32} />
            <Stroke d="M700 160 C1000 140 1300 170 1580 140" color={C.paper} w={40} o={0.35} drift={22} />
            {[[620, 220], [660, 250], [1180, 200], [1220, 230], [1260, 210]].map(([x, y], i) => (
              <path key={i} d={`M${x - 12} ${y} q6 -7 12 0 q6 -7 12 0`} stroke={C.dusk} strokeWidth="3" fill="none" style={anim(`tp-bob ${3 + i * 0.5}s ease-in-out infinite`)} />
            ))}
          </>
        ),
      },
      {
        depth: 0.3, node: (
          <path d="M0 780 C300 740 600 760 900 760 C1200 760 1400 740 1600 760 L1600 1000 L0 1000 Z" fill="#d98cc0" opacity=".8" filter={F.paint} />
        ),
      },
      {
        depth: 0.55, node: (
          <>
            <path d="M0 860 C300 820 560 790 820 790 C1100 790 1340 830 1600 850 L1600 1000 L0 1000 Z" fill="#a14d8a" filter={F.paint} />
            <CherryTree x={600} y={830} s={1.1} seed={141} glow />
            <ellipse cx="868" cy="796" rx="110" ry="12" fill="#5a1a4a" opacity=".3" filter={F.haze} />
            <Figure x={842} y={796} s={2.4} kind="prince" fill="#3a1238" lean={8} rim={C.peach} />
            <Figure x={898} y={796} s={2.3} kind="gown" fill="#3a1238" flip lean={-8} rim={C.peach} />
            <Mist y={860} color={C.paper} o={0.25} h={40} />
          </>
        ),
      },
      {
        depth: 1.15, node: <Flowers y0={870} y1={1015} n={150} seed={142} colors={[C.coral, C.rose, C.blossom, C.peach, C.paper]} sMin={7} sMax={17} />,
      },
    ],
    petals: 34,
  };
}
