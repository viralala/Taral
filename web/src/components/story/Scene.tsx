"use client";
import { memo, useMemo, type CSSProperties } from "react";
import type { SceneArt } from "@/lib/story";
import { C, Stroke, Svg, rng } from "./paint";
import type { ArtDef } from "./types";
import { glimpse, kingdom, king, meet, note, taken } from "./artsIntro";
import { bridge, door, forest } from "./artsTrials";
import { blessing, rescue, reunion, reveal } from "./artsEnding";

function montage(): ArtDef {
  const panels: { art: "forest" | "bridge" | "door"; label: string; rot: number }[] = [
    { art: "forest", label: "I · The Forest of Clues", rot: -2.5 },
    { art: "bridge", label: "II · The Bridge of Insight", rot: 1.5 },
    { art: "door", label: "III · The Final Challenge", rot: -1 },
  ];
  return {
    sky: "radial-gradient(ellipse at 50% 40%,#2a1a6e 0%,#140c3e 60%,#070a24 100%)",
    layers: [
      {
        depth: 0.1, node: (
          <Svg>
            <Stroke d="M-40 200 C400 160 900 260 1640 180" color={C.violet} w={120} o={0.35} drift={30} />
            <Stroke d="M-40 820 C500 780 1000 860 1640 800" color={C.rose} w={90} o={0.25} drift={26} />
          </Svg>
        ),
      },
    ],
    overlay: (
      <div className="absolute inset-x-0 top-[7vh] bottom-[30vh] flex flex-col items-center justify-center gap-3 px-6 md:top-[10vh] md:bottom-[28vh] md:flex-row md:gap-6 md:px-10">
        {panels.map((p, i) => (
          <figure key={p.art} className="relative w-[min(86vw,420px)] flex-1 md:h-full md:w-auto md:max-w-[30vw]"
            style={{ transform: `rotate(${p.rot}deg)`, animation: `rise .9s cubic-bezier(.2,.7,.2,1) both`, animationDelay: `${0.25 + i * 0.35}s` }}>
            <div className="absolute inset-0 overflow-hidden border-[3px] border-paper/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,.8)]"
              style={{ borderRadius: "18px 26px 14px 22px / 22px 14px 26px 18px" }}>
              <SceneBody art={p.art} still />
            </div>
            <figcaption className="hand absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-0.5 text-[13px] text-navy md:text-sm">
              {p.label}
            </figcaption>
          </figure>
        ))}
      </div>
    ),
  };
}

const ARTS: Record<SceneArt, () => ArtDef> = {
  kingdom, meet, king, taken, note, montage, glimpse, forest, bridge, door, rescue, reveal, blessing, reunion,
};

/** Falling cherry petals (HTML so they cover the whole viewport at any aspect). */
const Petals = memo(function Petals({ n, seed }: { n: number; seed: number }) {
  const r = rng(seed);
  const items = Array.from({ length: n }, () => ({
    left: r() * 120, size: 8 + r() * 10, dur: 9 + r() * 9, delay: -r() * 18, c: [C.blossom, "#f9cfdc", C.rose, C.paper][(r() * 4) | 0], rot: r() * 360,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p, i) => (
        <span key={i} className="absolute top-0" style={{
          left: `${p.left}%`, width: p.size, height: p.size * 0.7, background: p.c, borderRadius: "100% 0 100% 0", opacity: 0.85,
          animation: `petal-fall ${p.dur}s linear infinite`, animationDelay: `${p.delay}s`, rotate: `${p.rot}deg`,
        }} />
      ))}
    </div>
  );
});

const Fireflies = memo(function Fireflies({ n, seed, color }: { n: number; seed: number; color: string }) {
  const r = rng(seed);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="absolute rounded-full" style={{
          left: `${8 + r() * 84}%`, top: `${25 + r() * 60}%`, width: 6, height: 6, background: color,
          boxShadow: `0 0 12px 4px ${color}`, animation: `tp-firefly ${5 + r() * 5}s ease-in-out infinite`, animationDelay: `${-r() * 8}s`,
        }} />
      ))}
    </div>
  );
});

/** The art itself: sky, parallax planes, petals. `still` disables parallax/kenburns (montage thumbnails). */
export const SceneBody = memo(function SceneBody({ art, still = false }: { art: SceneArt; still?: boolean }) {
  const def = useMemo(() => ARTS[art](), [art]);
  const seed = art.length * 13 + art.charCodeAt(0);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: def.sky }}>
      <div className={still ? "absolute inset-0" : "tp-kb absolute inset-0"}>
        {def.layers.map((l, i) => {
          const style: CSSProperties | undefined = still ? undefined : {
            transform: `translate3d(calc(var(--px, 0) * ${-l.depth * 46}px), calc(var(--py, 0) * ${-l.depth * 26}px), 0) scale(${1.04 + l.depth * 0.03})`,
          };
          const isSvg = art !== "montage";
          return (
            <div key={i} className={still ? "absolute inset-0" : "tp-layer absolute inset-0"} style={style}>
              {isSvg ? <Svg>{l.node}</Svg> : l.node}
            </div>
          );
        })}
      </div>
      {!still && def.petals ? <Petals n={def.petals} seed={seed} /> : null}
      {!still && def.fireflies ? <Fireflies n={def.fireflies} seed={seed + 1} color={def.fireflyColor ?? C.lime} /> : null}
      {def.overlay}
    </div>
  );
});

/** Full-bleed painted scene with vignette and optional dimming for gameplay. */
export default function Scene({ art, dim = 0 }: { art: SceneArt; dim?: number }) {
  return (
    <div className="absolute inset-0">
      <SceneBody art={art} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(5,8,32,.6) 100%)" }} />
      <div className="pointer-events-none absolute inset-0 bg-night transition-opacity duration-700" style={{ opacity: dim }} />
    </div>
  );
}
