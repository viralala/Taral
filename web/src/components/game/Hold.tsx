"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/audio";
import type { CProps } from "./types";

type Cfg = {
  idle: string;      // label on the button
  busy: string;      // label while held
  start: string;     // heckle when the hold starts
  hint?: string;     // optional small note under the button
  perfect: string;   // robot-precise quip
  good: string;      // pass quip
  short: string;     // let go too early
  long: string;      // held too long
  glyph: string;
};

/** Press and hold for exactly 3 s with no visible clock. ±0.4 s passes; ±0.02 s is "too perfect". */
export function makeHold(c: Cfg) {
  return function Hold({ finish, say }: CProps) {
    const t0 = useRef(0);
    const [down, setDown] = useState(false);
    const start = (e: React.PointerEvent) => {
      if (down) return; // a second finger must not restart the count mid-hold
      e.currentTarget.setPointerCapture(e.pointerId);
      t0.current = performance.now();
      setDown(true);
      sfx("click");
      say(c.start, "smug");
    };
    const end = () => {
      if (!down) return;
      setDown(false);
      const dt = (performance.now() - t0.current) / 1000;
      const off = Math.abs(dt - 3);
      const note = `You held ${dt.toFixed(2)} s`;
      if (off <= 0.02) finish({ pass: false, score: 0.2, mood: "shocked", note, quip: c.perfect.replace("{t}", dt.toFixed(3)) });
      else if (off <= 0.4) finish({ pass: true, score: 1 - off / 0.8, mood: "proud", note, quip: c.good });
      else finish({ pass: false, score: Math.max(0.1, 0.4 - off / 10), mood: dt < 3 ? "smug" : "crying", note, quip: dt < 3 ? c.short : c.long });
    };
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <motion.button
          type="button"
          data-cursor="hold"
          onPointerDown={start}
          onPointerUp={end}
          onPointerCancel={end}
          onContextMenu={(e) => e.preventDefault()}
          animate={down ? { scale: [1, 1.07, 1] } : { scale: 1 }}
          transition={down ? { duration: 1, repeat: Infinity } : {}}
          className="relative grid h-48 w-48 touch-none select-none place-items-center border-[3px] border-navy text-center sm:h-52 sm:w-52"
          style={{
            background: down ? "var(--blossom)" : "var(--lime)",
            borderRadius: "58% 42% 55% 45% / 45% 55% 45% 55%",
            WebkitTouchCallout: "none",
          }}
        >
          <span className="flex flex-col items-center gap-1 px-5">
            <span className="text-4xl" aria-hidden>{c.glyph}</span>
            <span className="marker text-2xl text-navy">{down ? c.busy : c.idle}</span>
          </span>
        </motion.button>
        {c.hint && <p className="hand text-center text-base text-navy/70">{c.hint}</p>}
      </div>
    );
  };
}
