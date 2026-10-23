"use client";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/audio";

const STROKE = "M6 13 C 50 7, 95 17, 150 11 S 250 8, 294 13";

/** Brush-stroke countdown. The paint dries up as time runs out. */
export default function Timer({ limit, onTimeout, active }: { limit: number; onTimeout: () => void; active: boolean }) {
  const [left, setLeft] = useState(limit);
  const cb = useRef(onTimeout);
  useEffect(() => {
    cb.current = onTimeout;
  }, [onTimeout]);
  useEffect(() => {
    if (!active) return;
    const t0 = Date.now();
    let lastTick = Math.ceil(limit);
    const id = setInterval(() => {
      const l = Math.max(0, limit - (Date.now() - t0) / 1000);
      setLeft(l);
      const s = Math.ceil(l);
      if (s < lastTick) {
        lastTick = s;
        if (s <= 5 && s > 0) sfx("tick");
      }
      if (l <= 0) {
        clearInterval(id);
        cb.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [limit, active]);
  const urgent = left <= 5;
  const frac = Math.max(0, left / limit);
  return (
    <div className="flex items-center gap-3" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
      <svg viewBox="0 0 300 26" className="h-6 flex-1 overflow-visible" preserveAspectRatio="none" aria-hidden>
        <path d={STROKE} fill="none" stroke="var(--navy)" strokeOpacity=".12" strokeWidth="14" strokeLinecap="round" />
        <path
          d={STROKE}
          fill="none"
          pathLength={1}
          strokeDasharray={`${frac} 1`}
          stroke={urgent ? "var(--coral)" : "var(--leaf)"}
          strokeWidth="11"
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 100ms linear, stroke 300ms" }}
        />
      </svg>
      <span className={`marker w-12 text-right text-2xl tabular-nums ${urgent ? "text-coral" : "text-navy"}`}>{Math.ceil(left)}s</span>
    </div>
  );
}
