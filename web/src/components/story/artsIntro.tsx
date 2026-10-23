// Painted scenes for the opening cinematic: kingdom, meet, king, taken, note, glimpse.
import { C, CherryTree, Dabs, F, Figure, Flowers, Lantern, Mist, Stars, Stroke, W, anim, rng } from "./paint";
import type { ArtDef } from "./types";

const castle = "#170e4a";

function Castle() {
  const win = (x: number, y: number, w = 10, h = 18, d = 0, c: string = C.peach) => (
    <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={w / 2} fill={c}
      style={{ animation: `twinkle ${3 + d}s ease-in-out infinite`, animationDelay: `${-d * 1.7}s` }} />
  );
  return (
    <g>
      <g filter={F.paint} fill={castle}>
        {/* outer towers */}
        <rect x="528" y="560" width="40" height="150" />
        <path d="M520 562 L548 470 L576 562 Z" />
        <rect x="1032" y="560" width="40" height="150" />
        <path d="M1024 562 L1052 470 L1080 562 Z" />
        {/* inner towers */}
        <rect x="604" y="500" width="58" height="210" />
        <path d="M594 504 L633 398 L672 504 Z" />
        <rect x="938" y="500" width="58" height="210" />
        <path d="M928 504 L967 398 L1006 504 Z" />
        {/* walls with crenellations */}
        <path d="M560 610 h20 v-14 h16 v14 h16 v-14 h16 v14 h16 v-14 h16 v14 h420 v-14 h16 v14 h16 v-14 h16 v14 h16 v-14 h16 v14 h10 V720 H560 Z" />
        {/* the great dome (MIT-WPU's World Peace Dome) */}
        <rect x="690" y="560" width="220" height="150" />
        <path d="M680 566 C680 420 920 420 920 566 Z" />
        <rect x="796" y="400" width="8" height="70" />
        <circle cx="800" cy="398" r="9" />
      </g>
      {/* dome highlight brush */}
      <path d="M708 540 C716 470 760 446 800 440" stroke={C.violet} strokeWidth="10" fill="none" opacity=".55" strokeLinecap="round" filter={F.brush} />
      {/* windows */}
      {[...[700, 730, 760, 790, 820, 850, 880].map((x, i) => win(x + 4, 600, 10, 22, i * 0.7, i % 3 ? C.peach : C.lime)),
        win(626, 540, 12, 24, 1.2), win(960, 540, 12, 24, 2.1, C.lime), win(543, 600, 10, 18, 0.4), win(1047, 600, 10, 18, 1.6),
        win(626, 610, 12, 20, 2.6), win(960, 612, 12, 20, 0.8)]}
      {/* PIXATHON pennant flying from the dome */}
      <g style={anim("sway 5s ease-in-out infinite", "left center")}>
        <path d="M806 300 C860 288 920 318 1000 300 C1030 294 1050 300 1064 306 L1040 330 L1064 356 C1040 346 1020 344 1000 348 C920 366 860 336 806 350 Z"
          fill={C.lime} filter={F.paint} />
        <text x="925" y="337" textAnchor="middle" fontSize="30" fill={C.navy} className="marker" transform="rotate(-2 925 330)">PIXATHON</text>
      </g>
      <rect x="798" y="296" width="5" height="110" fill={castle} />
    </g>
  );
}

export function kingdom(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#0b1240 0%,#2a1a6e 34%,#7d47c4 58%,#ffb98a 84%,#f2795a 100%)",
    layers: [
      {
        depth: 0.08, node: (
          <>
            <Stars n={80} seed={11} yMax={420} />
            <circle cx="800" cy="720" r="260" fill={C.peach} opacity=".55" filter={F.soft} />
            <circle cx="800" cy="720" r="150" fill="#ffd9b3" filter={F.paint} />
            <Stroke d="M80 260 C360 220 640 300 980 250 S1420 230 1560 270" color={C.violet} w={70} o={0.45} drift={24} />
            <Stroke d="M200 400 C500 370 760 430 1100 390" color={C.blossom} w={40} o={0.35} drift={30} />
            <Stroke d="M900 160 C1100 140 1300 180 1500 150" color={C.paper} w={34} o={0.25} drift={20} />
          </>
        ),
      },
      {
        depth: 0.25, node: (
          <path d="M0 760 C200 690 420 730 600 700 C820 660 1040 710 1220 680 C1400 650 1500 690 1600 680 L1600 1000 L0 1000 Z" fill="#3a2380" filter={F.paint} />
        ),
      },
      {
        depth: 0.5, node: (
          <>
            <path d="M0 880 C260 820 500 720 800 704 C1100 720 1340 820 1600 880 L1600 1000 L0 1000 Z" fill="#1d1257" filter={F.paint} />
            <Castle />
            <Mist y={760} color={C.violet} o={0.35} h={50} />
          </>
        ),
      },
      {
        depth: 0.8, node: (
          <>
            {[[600, 820, 0], [720, 860, -4], [880, 840, -8], [1010, 860, -2], [520, 900, -10], [1100, 900, -6], [300, 860, -3], [1320, 840, -9], [800, 900, -12]].map(([x, y, d], i) => (
              <Lantern key={i} x={x} y={y} s={0.9 + (i % 3) * 0.2} delay={d} dur={13 + (i % 4) * 2} />
            ))}
          </>
        ),
      },
      {
        depth: 1.2, node: (
          <>
            <Dabs cx={120} cy={960} rx={260} ry={90} n={40} seed={21} colors={["#120a3a", "#1d1257", "#2a1a6e"]} rMin={30} rMax={70} />
            <Dabs cx={1480} cy={960} rx={260} ry={90} n={40} seed={22} colors={["#120a3a", "#1d1257", "#2a1a6e"]} rMin={30} rMax={70} />
            <Flowers y0={930} y1={1000} n={50} seed={5} colors={[C.coral, C.rose, C.blossom]} />
            <g filter={F.paint}><path d="M-20 60 C120 90 240 140 330 220" stroke={C.ink} strokeWidth="18" fill="none" strokeLinecap="round" /></g>
            <Dabs cx={200} cy={130} rx={170} ry={90} n={34} seed={23} colors={[C.blossom, C.rose, "#f9cfdc"]} rMin={14} rMax={34} />
          </>
        ),
      },
    ],
    petals: 10,
  };
}

export function meet(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#2a1a6e 0%,#7d47c4 30%,#d98cc0 58%,#f6b5c8 74%,#ffb98a 100%)",
    layers: [
      {
        depth: 0.08, node: (
          <>
            <circle cx="520" cy="560" r="180" fill="#ffe2c4" opacity=".5" filter={F.soft} />
            <Stroke d="M60 220 C320 180 560 260 860 210 S1300 180 1560 230" color={C.paper} w={56} o={0.35} drift={26} />
            <Stroke d="M300 340 C600 300 900 360 1300 320" color={C.peach} w={38} o={0.4} drift={32} />
            <Stroke d="M100 120 C400 100 700 140 900 110" color={C.violet} w={46} o={0.4} drift={22} />
          </>
        ),
      },
      {
        depth: 0.3, node: (
          <path d="M0 720 C240 670 480 700 720 680 C980 660 1240 700 1600 670 L1600 1000 L0 1000 Z" fill="#a663b8" opacity=".75" filter={F.paint} />
        ),
      },
      {
        depth: 0.55, node: (
          <>
            <path d="M0 830 C300 790 600 800 900 790 C1200 780 1400 800 1600 790 L1600 1000 L0 1000 Z" fill="#5b2f86" filter={F.paint} />
            <CherryTree x={980} y={812} s={1.05} seed={31} glow />
            <ellipse cx="745" cy="812" rx="140" ry="14" fill={C.ink} opacity=".35" filter={F.haze} />
            <Figure x={690} y={812} s={2.3} kind="prince" lean={3} rim={C.blossom} />
            <Figure x={805} y={812} s={2.2} kind="gown" flip lean={-3} rim={C.blossom} />
            <circle cx="748" cy="590" r="10" fill={C.lime} filter={F.glow} style={anim("tp-pulse 2.4s ease-in-out infinite")} />
          </>
        ),
      },
      {
        depth: 1.1, node: (
          <>
            <Flowers y0={850} y1={1010} n={110} seed={8} colors={[C.coral, C.rose, C.blossom, C.peach, "#f9cfdc"]} sMin={7} sMax={16} />
          </>
        ),
      },
    ],
    petals: 26,
  };
}

function Crown({ x, y, s, fill, o = 1 }: { x: number; y: number; s: number; fill: string; o?: number }) {
  return (
    <path transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill={fill} filter={F.paint}
      d="M-100 40 L-110 -40 L-60 0 L-30 -70 L0 -10 L30 -70 L60 0 L110 -40 L100 40 Z" />
  );
}

export function king(): ArtDef {
  const r = rng(51);
  return {
    sky: "radial-gradient(ellipse at 50% 42%,#ffb98a 0%,#f2795a 26%,#d93a63 52%,#5a1a5e 78%,#2a1a6e 100%)",
    layers: [
      {
        depth: 0.08, node: (
          <>
            {Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2;
              return <path key={i} d={`M800 420 L${800 + Math.cos(a) * 1100} ${420 + Math.sin(a) * 1100}`} stroke={C.peach} strokeWidth={70} opacity=".12" filter={F.brush} />;
            })}
            <Crown x={800} y={250} s={3.2} fill="#7a1840" o={0.45} />
          </>
        ),
      },
      {
        depth: 0.35, node: (
          <g filter={F.paint}>
            <rect x="330" y="80" width="90" height="760" fill="#3d0f3c" />
            <rect x="1180" y="80" width="90" height="760" fill="#3d0f3c" />
            {[540, 1060].map((x) => (
              <g key={x} style={anim("sway 7s ease-in-out infinite", "top center")}>
                <path d={`M${x - 46} 120 L${x + 46} 120 L${x + 46} 420 L${x} 380 L${x - 46} 420 Z`} fill={C.rose} />
                <path d={`M${x - 20} 230 L${x - 22} 200 L${x - 8} 214 L${x} 192 L${x + 8} 214 L${x + 22} 200 L${x + 20} 230 Z`} fill={C.lime} />
              </g>
            ))}
          </g>
        ),
      },
      {
        depth: 0.6, node: (
          <>
            <g filter={F.paint}>
              <rect x="520" y="790" width="560" height="60" fill="#3d0f3c" />
              <rect x="590" y="742" width="420" height="52" fill="#4e1446" />
              <path d="M690 744 L690 470 L722 420 L752 470 L800 360 L848 470 L878 420 L910 470 L910 744 Z" fill={C.ink} />
              <path d="M760 470 L800 400 L840 470 Z" fill={C.rose} opacity=".6" />
            </g>
            <ellipse cx="800" cy="744" rx="120" ry="12" fill="#000" opacity=".35" filter={F.haze} />
            <Figure x={800} y={744} s={2.5} kind="king" rim={C.peach} />
          </>
        ),
      },
      {
        depth: 1.0, node: (
          <>
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={i} cx={400 + r() * 800} cy={860 + r() * 120} r={2 + r() * 3} fill={i % 2 ? C.peach : C.lime}
                style={{ animation: `tp-float ${6 + r() * 6}s linear infinite`, animationDelay: `${-r() * 10}s` }} />
            ))}
            <path d="M0 900 C400 870 1200 870 1600 900 L1600 1000 L0 1000 Z" fill="#2a0a2a" filter={F.paint} />
          </>
        ),
      },
    ],
  };
}

export function taken(): ArtDef {
  return {
    sky: "linear-gradient(180deg,#02040f 0%,#070b2a 45%,#0b1240 75%,#15104a 100%)",
    layers: [
      {
        depth: 0.06, node: (
          <>
            <Stars n={120} seed={61} yMax={620} />
            <Stroke d="M100 200 C400 170 700 240 1000 200 S1400 180 1560 210" color="#1d2560" w={80} o={0.7} drift={28} />
            <Stroke d="M300 330 C600 300 900 360 1300 320" color="#18204f" w={50} o={0.6} drift={34} />
          </>
        ),
      },
      {
        depth: 0.3, node: (
          <g filter={F.paint} fill="#0e1238">
            <path d="M200 700 L200 520 L230 470 L260 520 L260 700 Z" />
            <path d="M1260 700 L1260 480 L1300 410 L1340 480 L1340 700 Z" />
            <rect x="180" y="640" width="1240" height="70" />
            <rect x="1290" y="520" width="16" height="22" rx="6" fill={C.peach} style={{ animation: "twinkle 4s ease-in-out infinite" }} />
          </g>
        ),
      },
      {
        depth: 0.55, node: (
          <>
            <g filter={F.paint}>
              <path d="M0 830 C300 800 700 810 1000 800 C1300 790 1450 810 1600 800 L1600 1000 L0 1000 Z" fill="#070a24" />
              {/* hedge archway */}
              <path d="M430 830 L430 520 C430 380 640 380 640 520 L640 830 L600 830 L600 530 C600 430 470 430 470 530 L470 830 Z" fill="#0c2a2b" />
              <path d="M1080 830 C1070 700 1120 640 1200 640 C1280 640 1330 700 1320 830 Z" fill="#0c2a2b" />
            </g>
            {/* motion streaks */}
            {[620, 660, 700].map((y, i) => (
              <path key={y} d={`M${520 - i * 30} ${y} L${760 - i * 20} ${y - 6}`} stroke={C.paper} strokeWidth="6" opacity=".15" strokeLinecap="round" filter={F.brush} />
            ))}
            {/* stolen-away ribbon */}
            <Stroke d="M820 600 C760 580 700 610 640 590 C600 578 560 590 520 600" color={C.rose} w={10} o={0.85} />
            <g transform="translate(862 840)">
              <Figure x={0} y={0} s={2.7} kind="hood" fill="#05061a" lean={10} rim="#2a3070" />
              {/* carried figure draped over the shoulder */}
              <g transform="translate(-6 -228) rotate(-78)">
                <Figure x={0} y={0} s={1.7} kind="gown" fill="#141a48" />
              </g>
            </g>
            {/* dropped blossom */}
            <g transform="translate(650 850)" filter={F.paint}>
              {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-10" rx="7" ry="11" fill={C.rose} transform={`rotate(${a})`} />)}
              <circle r="5" fill={C.lime} />
            </g>
          </>
        ),
      },
      {
        depth: 1.1, node: (
          <>
            <Dabs cx={150} cy={940} rx={300} ry={110} n={44} seed={62} colors={["#050820", "#0a1030", "#0c2a2b"]} rMin={30} rMax={70} />
            <Dabs cx={1450} cy={950} rx={300} ry={110} n={44} seed={63} colors={["#050820", "#0a1030", "#0c2a2b"]} rMin={30} rMax={70} />
            <Mist y={900} color="#2a3070" o={0.35} h={60} />
          </>
        ),
      },
    ],
    fireflies: 6,
    fireflyColor: C.mint,
  };
}

export function note(): ArtDef {
  return {
    sky: "radial-gradient(ellipse at 50% 50%,#2a1a6e 0%,#14103d 55%,#060820 100%)",
    layers: [
      {
        depth: 0.08, node: (
          <>
            {[150, 300, 450, 600, 750, 900].map((y, i) => (
              <Stroke key={y} d={`M-40 ${y} C400 ${y - 20} 1000 ${y + 20} 1640 ${y - 10}`} color={i % 2 ? "#1d1446" : "#241a55"} w={120} o={0.8} />
            ))}
            <circle cx="380" cy="230" r="220" fill={C.peach} opacity=".3" filter={F.soft} />
          </>
        ),
      },
      {
        depth: 0.4, node: (
          <g transform="rotate(-4 800 500)">
            <rect x="590" y="236" width="480" height="590" fill="#000" opacity=".45" filter={F.soft} />
            <path d="M560 210 L700 204 L760 214 L900 206 L1040 212 L1046 380 L1036 520 L1044 790 L900 796 L780 786 L640 794 L556 788 L566 600 L552 420 Z"
              fill={C.paper} filter={F.paint} />
            <path d="M560 500 L1040 504" stroke={C.paper2} strokeWidth="4" opacity=".8" />
            <circle cx="900" cy="340" r="46" fill={C.navy} opacity=".08" filter={F.haze} />
            <g fill={C.navy} style={{ fontFamily: "var(--font-body), cursive" }} fontSize="62" textAnchor="middle">
              <text x="800" y="370">Solve the</text>
              <text x="800" y="450">three trials</text>
              <text x="800" y="560">and find me.</text>
            </g>
            <path d="M650 590 C720 600 860 580 950 596" stroke={C.navy} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".7" />
            {/* wax seal with a blossom */}
            <g transform="translate(930 710)">
              <circle r="46" fill={C.rose} filter={F.paint} />
              {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-14" rx="8" ry="13" fill="#c42a5e" transform={`rotate(${a})`} />)}
            </g>
            {/* pressed blossom */}
            <g transform="translate(640 270) rotate(20)" filter={F.paint}>
              {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-14" rx="10" ry="15" fill={C.blossom} transform={`rotate(${a})`} />)}
              <circle r="6" fill={C.coral} />
            </g>
            <circle cx="700" cy="690" r="14" fill={C.navy} opacity=".55" filter={F.paint} />
          </g>
        ),
      },
      {
        depth: 0.9, node: (
          <>
            <g filter={F.paint}>
              <path d="M1150 900 C1250 700 1340 520 1460 360" stroke={C.paper} strokeWidth="14" strokeLinecap="round" fill="none" opacity=".85" />
              <path d="M1460 360 C1420 420 1360 470 1300 560 C1360 520 1440 470 1490 390 Z" fill={C.paper} opacity=".7" />
            </g>
            <g transform="translate(330 860) rotate(-30)" filter={F.paint}>
              <ellipse cx="0" cy="0" rx="14" ry="22" fill={C.blossom} />
            </g>
          </>
        ),
      },
    ],
  };
}

export function glimpse(): ArtDef {
  const r = rng(71);
  return {
    sky: "radial-gradient(ellipse at 50% 62%,#f6b5c8 0%,#c27fd6 30%,#6a3aa8 58%,#2a1a6e 82%,#0b1240 100%)",
    layers: [
      {
        depth: 0.06, node: (
          <g filter={F.soft}>
            {Array.from({ length: 22 }, (_, i) => (
              <circle key={i} cx={r() * W} cy={r() * 700} r={30 + r() * 70} fill={[C.blossom, C.peach, C.lime, C.paper][i % 4]} opacity={0.18 + r() * 0.25}
                style={{ animation: `tp-pulse ${4 + r() * 4}s ease-in-out infinite`, animationDelay: `${-r() * 6}s` }} />
            ))}
          </g>
        ),
      },
      {
        depth: 0.3, node: (
          <g filter={F.haze}>
            <Dabs cx={800} cy={60} rx={900} ry={170} n={90} seed={72} colors={[C.blossom, C.rose, "#f9cfdc", C.violet]} rMin={30} rMax={70} />
          </g>
        ),
      },
      {
        depth: 0.55, node: (
          <>
            <ellipse cx="800" cy="600" rx="260" ry="300" fill={C.blossom} opacity=".35" filter={F.soft} />
            <g filter={F.haze}>
              <path d="M0 860 C400 830 1200 830 1600 860 L1600 1000 L0 1000 Z" fill="#4a2380" />
              <Figure x={770} y={850} s={2.7} kind="prince" fill="#1a0f40" lean={7} rim={C.blossom} />
              <Figure x={838} y={850} s={2.6} kind="gown" fill="#1a0f40" flip lean={-7} rim={C.blossom} />
            </g>
          </>
        ),
      },
      {
        depth: 1.3, node: (
          <g filter={F.soft}>
            <Dabs cx={80} cy={900} rx={200} ry={140} n={20} seed={73} colors={[C.rose, C.blossom]} rMin={40} rMax={80} o={0.75} />
            <Dabs cx={1520} cy={120} rx={200} ry={140} n={20} seed={74} colors={[C.rose, C.blossom]} rMin={40} rMax={80} o={0.75} />
          </g>
        ),
      },
    ],
    petals: 22,
  };
}
