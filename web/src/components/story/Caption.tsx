"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { narrate } from "@/lib/audio";

/**
 * Plays one narrated line and reports 0..1 progress. Calls onEnd (once) a beat after the voice finishes.
 * Narration is always cancelled when the line changes or the component unmounts.
 */
export function useNarration(id: string | null, text: string, onEnd: () => void) {
  const [state, setState] = useState({ id, p: 0 });
  const endRef = useRef(onEnd);
  useEffect(() => { endRef.current = onEnd; });

  useEffect(() => {
    if (!id) return;
    let alive = true;
    let to: ReturnType<typeof setTimeout> | undefined;
    const n = narrate(id, text, (p) => { if (alive) setState({ id, p }); });
    n.done.then(() => {
      if (alive) to = setTimeout(() => { if (alive) endRef.current(); }, 900);
    });
    return () => {
      alive = false;
      if (to) clearTimeout(to);
      n.cancel();
    };
  }, [id, text]);

  // progress belongs to the current line only (no flash of the previous line's 100%)
  return state.id === id ? state.p : 0;
}

/** Kaizen caption: words appear one by one, the spoken word underlined, the rest faint. */
export function Caption({ text, progress }: { text: string; progress: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  const done = progress >= 0.999;
  const cur = done ? words.length : Math.min(words.length - 1, Math.floor(progress * words.length));
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[11vh] z-20 flex justify-center px-5 md:bottom-[9vh]">
      <p className="sr-only" aria-live="polite">{text}</p>
      <p aria-hidden className="hand max-w-[min(92vw,58rem)] text-center text-[17px] leading-[1.5] text-paper sm:text-xl md:text-[26px] lg:text-[29px]"
        style={{ textShadow: "0 2px 18px rgba(5,8,32,.85), 0 0 2px rgba(5,8,32,.6)" }}>
        {words.map((w, i) => (
          <span key={i}>
            <span className={i === cur ? "scribble" : undefined}
              style={{ opacity: i <= cur ? 1 : 0.26, transition: "opacity .35s ease" }}>
              {w}
            </span>{" "}
          </span>
        ))}
      </p>
    </div>
  );
}

/** Big brushy chapter/title lettering that paints itself in from the left. */
export function TitleCard({ title, kicker, className = "absolute inset-x-0 top-[9vh]" }: { title: string; kicker?: string; className?: string }) {
  return (
    <div className={`pointer-events-none z-20 flex flex-col items-center px-5 text-center ${className}`}>
      {kicker && (
        <motion.p className="hand mb-2 text-sm text-lime md:text-base" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
          {kicker}
        </motion.p>
      )}
      <motion.h2
        className="marker max-w-[94vw] text-[clamp(2.2rem,8vw,5.5rem)] text-paper [overflow-wrap:anywhere]"
        style={{ textShadow: "0 6px 30px rgba(5,8,32,.6)", rotate: "-2deg" }}
        initial={{ clipPath: "inset(-20% 100% -20% 0)", opacity: 0.4 }}
        animate={{ clipPath: "inset(-20% 0% -20% 0)", opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.6, 0, 0.2, 1] }}
      >
        {title}
      </motion.h2>
      <svg viewBox="0 0 300 20" className="mt-1 h-4 w-[min(60vw,360px)]" aria-hidden>
        <motion.path d="M6 12 C70 4 150 18 294 8" stroke="var(--lime)" strokeWidth="5" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }} />
      </svg>
    </div>
  );
}
