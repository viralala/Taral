"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Mood } from "./types";

/**
 * CAPT. CHA, the flower-faced royal CAPTCHA. In the trials he wears a hood and calls
 * himself THE HOODED VOICE (the ending reveals who he is). Eyes follow the cursor.
 */
export default function CaptchaBot({ mood, size = 150, hooded = true }: { mood: Mood; size?: number; hooded?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 160);
      setP({ x: (dx / d) * k * 4.5, y: (dy / d) * k * 4.5 });
    };
    window.addEventListener("pointermove", h);
    return () => window.removeEventListener("pointermove", h);
  }, []);
  const petals = Array.from({ length: 5 }, (_, i) => i * 72);
  const big = mood === "shocked";
  const eyeR = big ? 12 : 10;
  const pr = big ? 3.5 : 5.5;
  const eyes = [-17, 17];
  const face = "#fbd9c4";
  return (
    <motion.div
      key={mood}
      style={{ width: size, height: size }}
      initial={{ scale: 0.85, rotate: mood === "shocked" ? -8 : 0 }}
      animate={mood === "shocked" ? { scale: 1, rotate: [0, -5, 5, -5, 0] } : { scale: 1, y: [0, -5, 0] }}
      transition={mood === "shocked" ? { duration: 0.5 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="shrink-0"
    >
      <svg ref={ref} viewBox="-100 -100 200 200" className="h-full w-full overflow-visible" aria-label={hooded ? `The Hooded Voice, looking ${mood}` : `CAPT. CHA looking ${mood}`}>
        {hooded && (
          <>
            {/* cloak + hood */}
            <path d="M-92 100 Q-86 20 -64 -38 Q-42 -98 0 -104 Q42 -98 64 -38 Q86 20 92 100 Z" fill="var(--dusk)" stroke="var(--navy)" strokeWidth="4" strokeLinejoin="round" />
            <path d="M-40 100 Q-30 70 0 62 Q30 70 40 100" fill="none" stroke="var(--violet)" strokeWidth="3" opacity=".7" />
            <ellipse cx="0" cy="-2" rx="64" ry="68" fill="var(--night)" />
          </>
        )}
        <g transform={hooded ? "scale(.78) translate(0 4)" : undefined}>
          {petals.map((r) => (
            <ellipse key={r} cx="0" cy="-52" rx="34" ry="46" fill="var(--blossom)" stroke="var(--navy)" strokeWidth="3" transform={`rotate(${r})`} />
          ))}
          <circle r="50" fill={face} stroke="var(--navy)" strokeWidth="3" />
          <circle cx="-34" cy="10" r="7" fill="var(--rose)" opacity=".3" />
          <circle cx="34" cy="10" r="7" fill="var(--rose)" opacity=".3" />
          {eyes.map((ex, i) =>
            mood === "proud" ? (
              <path key={i} d={`M${ex - 9} -2 Q${ex} -16 ${ex + 9} -2`} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
            ) : (
              <g key={i}>
                <circle cx={ex} cy={-6} r={eyeR} fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
                <circle cx={ex + p.x} cy={-6 + p.y - (mood === "crying" ? 2 : 0)} r={pr} fill="var(--ink)" />
                {mood === "smug" && (
                  <path d={`M${ex - eyeR - 1} -6 L${ex + eyeR + 1} -6 L${ex + eyeR + 1} -19 L${ex - eyeR - 1} -19Z`} fill={face} stroke="var(--ink)" strokeWidth="2.5" />
                )}
                {mood === "crying" && (
                  <motion.ellipse cx={ex} cy={6} rx="3" ry="5" fill="var(--mint)" stroke="var(--navy)" strokeWidth="1.5"
                    animate={{ cy: [6, 30], opacity: [1, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.4 }} />
                )}
              </g>
            )
          )}
          {mood === "smug" && <path d="M-28 -24 L-8 -28" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />}
          {mood === "smug" && <path d="M8 -30 L28 -22" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />}
          {mood === "smug" && <path d="M-16 24 Q4 34 20 16" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />}
          {mood === "shocked" && <ellipse cx="0" cy="26" rx="7" ry="10" fill="var(--ink)" />}
          {mood === "crying" && <path d="M-14 32 Q0 18 14 32" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />}
          {mood === "proud" && <path d="M-18 18 Q0 40 18 18 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />}
        </g>
        {hooded && (
          /* hood rim drawn over the petals so the face peeks out of the shadow */
          <path d="M-66 30 Q-74 -60 0 -72 Q74 -60 66 30" fill="none" stroke="var(--dusk)" strokeWidth="16" strokeLinecap="round" />
        )}
        {mood === "proud" && (
          <motion.text x="50" y="-50" fontSize="26" animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>✨</motion.text>
        )}
      </svg>
    </motion.div>
  );
}
