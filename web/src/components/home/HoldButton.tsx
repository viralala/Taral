"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const HOLD_MS = 1200;
const R = 62;
const C = 2 * Math.PI * R;

export default function HoldButton() {
  const router = useRouter();
  const [p, setP] = useState(0);
  const raf = useRef(0);
  const start = useRef(0);
  const done = useRef(false);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (!done.current) setP(0);
  }, []);
  const go = useCallback(() => {
    if (done.current) return;
    start.current = performance.now();
    const tick = () => {
      const v = Math.min(1, (performance.now() - start.current) / HOLD_MS);
      setP(v);
      if (v >= 1) {
        done.current = true;
        router.push("/level/1");
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [router]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <button
      data-cursor="hold"
      aria-label="Hold to enter"
      onPointerDown={go}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) go();
      }}
      onKeyUp={stop}
      className="relative grid place-items-center w-36 h-36 sm:w-40 sm:h-40 select-none touch-none outline-none focus-visible:ring-4 ring-cocoa rounded-full"
    >
      <svg viewBox="-70 -70 140 140" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle r={R} fill="var(--butter)" stroke="var(--cocoa)" strokeWidth="3" style={{ transform: `scale(${1 - p * 0.06})` }} />
        <circle r={R} fill="none" stroke="var(--blush-deep)" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
      </svg>
      <span className="relative font-bold uppercase tracking-widest text-cocoa text-xs leading-tight text-center">
        Hold
        <br />
        to enter
      </span>
    </button>
  );
}
