"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COLORS = ["#e8f20a", "#f6b5c8", "#ffb98a", "#7cc35a"]; // lime, blossom, peach, leaf

/** Rubber stamp slammed onto the paper: lime/leaf PASS, coral/rose FAIL. A PASS pops a little confetti. */
export default function Stamp({ pass }: { pass: boolean }) {
  const c = pass ? "var(--leaf)" : "var(--rose)";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pass) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    // wait for the slam to land, then burst from the stamp itself
    const id = setTimeout(() => {
      import("canvas-confetti")
        .then((m) => {
          const r = ref.current?.getBoundingClientRect();
          if (!alive || !r) return;
          const origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
          m.default({ particleCount: 55, spread: 70, startVelocity: 32, scalar: 0.9, ticks: 140, origin, colors: COLORS, disableForReducedMotion: true });
        })
        .catch(() => {});
    }, 180);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [pass]);
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 3.2, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: pass ? -8 : 6, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 15, mass: 0.7 }}
      className="marker inline-block select-none px-7 py-2 text-6xl sm:text-8xl"
      style={{
        color: c,
        border: `7px double ${c}`,
        borderRadius: "18px 26px 14px 22px / 22px 14px 26px 18px",
        background: pass ? "color-mix(in srgb, var(--lime) 35%, transparent)" : "color-mix(in srgb, var(--coral) 18%, transparent)",
      }}
    >
      {pass ? "PASS" : "FAIL"}
    </motion.div>
  );
}
