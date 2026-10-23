"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ENDING, INTRO, LEVEL_INTRO } from "@/lib/story";

const AUDIO_IDS = [...INTRO, LEVEL_INTRO[1], LEVEL_INTRO[2], LEVEL_INTRO[3], ...ENDING].map((l) => l.id);
const CAP_MS = 4000;
const MIN_MS = 1400;

/** Kaizen loader: three painted dots, a production credit, a counting %, then CLICK TO START. */
export default function Loader({ onStart }: { onStart: () => void }) {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    let loaded = 0;
    const t0 = performance.now();
    const ctrl = new AbortController();
    AUDIO_IDS.forEach((id) => {
      fetch(`/audio/${id}.mp3`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.blob() : null))
        .catch(() => null)
        .finally(() => { loaded++; });
    });
    let shown = 0;
    let raf: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      if (!alive) return;
      const el = performance.now() - t0;
      const finished = (loaded >= AUDIO_IDS.length && el > MIN_MS) || el > CAP_MS;
      const target = finished ? 1 : Math.min(0.96, 0.55 * (loaded / AUDIO_IDS.length) + 0.45 * Math.min(1, el / CAP_MS));
      shown += (target - shown) * (finished ? 0.14 : 0.06);
      setPct(Math.round(shown * 100));
      if (finished && shown > 0.995) { setPct(100); setReady(true); return; }
      raf = setTimeout(tick, 16);
    };
    raf = setTimeout(tick, 16);
    return () => { alive = false; clearTimeout(raf); ctrl.abort(); };
  }, []);

  return (
    <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#071030] px-6 text-center text-paper"
      exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <svg viewBox="0 0 140 40" className="mb-8 h-10 w-36" aria-hidden>
        <defs>
          <filter id="tp-dotpaint"><feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="6" /></filter>
        </defs>
        {[24, 70, 116].map((cx, i) => (
          <circle key={cx} cx={cx} cy="20" r="11" fill="var(--paper)" filter="url(#tp-dotpaint)"
            style={{ animation: "tp-dot 1.4s ease-in-out infinite", animationDelay: `${i * 0.18}s`, transformBox: "fill-box", transformOrigin: "center" }} />
        ))}
      </svg>
      <p className="hand text-xs text-paper/70 md:text-sm">A Taral production</p>
      <h1 className="marker mt-3 text-[clamp(3rem,13vw,7.5rem)] text-paper">Taral</h1>
      <p className="hand mt-1 text-sm text-blossom md:text-base">The Three Trials</p>
      <p className="hand mt-6 text-xs text-paper/60 md:text-sm">Pixathon by Insight AI · Kingdom of MIT-WPU</p>

      <div className="mt-12 flex h-16 items-center justify-center">
        {ready ? (
          <motion.button type="button" autoFocus onClick={onStart} data-cursor="start"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="hand group relative px-6 py-3 text-lg tracking-[0.25em] text-paper md:text-xl">
            Click to start
            <span className="absolute inset-x-6 bottom-1 h-[2px] origin-left scale-x-50 bg-lime transition-transform duration-500 group-hover:scale-x-100" />
          </motion.button>
        ) : (
          <p className="hand text-lg tabular-nums text-paper/80" role="status" aria-live="polite">{pct}%</p>
        )}
      </div>
      <p className="hand absolute bottom-6 px-6 text-xs text-paper/55">Best with sound · headphones on</p>
    </motion.div>
  );
}
