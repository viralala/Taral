"use client";
import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SceneArt } from "@/lib/story";
import { sfx } from "@/lib/audio";
import Scene from "./Scene";

/**
 * Persistent painted backdrop. Crossfades between arts, sweeps a brush-stroke wipe across on every change,
 * and feeds pointer position into --px / --py so every plane parallaxes at its own depth.
 */
export default memo(function Stage({ art, dim = 0 }: { art: SceneArt; dim?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [wipe, setWipe] = useState(0);
  const prev = useRef(art);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", ((e.clientX / innerWidth) - 0.5).toFixed(3));
        el.style.setProperty("--py", ((e.clientY / innerHeight) - 0.5).toFixed(3));
      });
    };
    addEventListener("pointermove", move);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); };
  }, [reduce]);

  useEffect(() => {
    if (prev.current === art) return;
    prev.current = art;
    sfx("whoosh");
    setWipe((w) => w + 1);
  }, [art]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div key={art} className="absolute inset-0"
          initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 1.1, ease: [0.4, 0, 0.2, 1] }}>
          <Scene art={art} dim={dim} />
        </motion.div>
      </AnimatePresence>
      {!reduce && wipe > 0 && <BrushWipe key={wipe} />}
    </div>
  );
});

const WIPE = [
  { d: "M-20 18 C20 8 60 26 120 12", c: "#2a1a6e", w: 34, delay: 0 },
  { d: "M-20 48 C30 60 70 38 120 52", c: "#0b1240", w: 40, delay: 0.06 },
  { d: "M-20 82 C40 72 80 94 120 80", c: "#9b5bd4", w: 34, delay: 0.12 },
];

/** Three fat painted strokes sweep across, then the whole sheet melts away to reveal the next scene. */
function BrushWipe() {
  return (
    <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: 1.25, times: [0, 0.45, 1], ease: "easeInOut" }}>
      {WIPE.map((s, i) => (
        <motion.path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} strokeLinecap="round" fill="none" opacity={0.92}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: s.delay, ease: [0.7, 0, 0.3, 1] }} />
      ))}
      {WIPE.map((s, i) => (
        <motion.path key={`h${i}`} d={s.d} stroke="#efead7" strokeWidth={0.6} strokeDasharray="6 3 14 4" strokeLinecap="round" fill="none" opacity={0.35}
          transform={`translate(0 ${s.w / 2 - 2})`}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: s.delay + 0.04 }} />
      ))}
    </motion.svg>
  );
}
