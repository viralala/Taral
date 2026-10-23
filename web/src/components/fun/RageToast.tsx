"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HECKLES = [
  "Still there? Even CAPT. CHA has a faster reaction time and it runs on Internet Explorer.",
  "Take your time. The heat death of the universe isn't going anywhere either.",
  "Loading your motivation... 404. Motivation not found.",
  "Buffering like it's 2009. Are you okay?",
  "A robot would have clicked by now. Just saying.",
  "Thinking is great. Doing is the load-bearing part.",
  "Your cursor is doing the same thing as your career: hovering.",
];

export default function RageToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const arm = () => {
      if (timer.current) clearTimeout(timer.current);
      if (count.current >= 3) return;
      timer.current = setTimeout(() => {
        count.current += 1;
        setMsg(HECKLES[Math.floor(Math.random() * HECKLES.length)]);
      }, 12000);
    };
    const onAct = () => {
      setMsg(null);
      arm();
    };
    const evs = ["pointermove", "pointerdown", "scroll", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, onAct, { passive: true }));
    arm();
    return () => {
      evs.forEach((e) => window.removeEventListener(e, onAct));
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] max-w-[min(22rem,calc(100vw-2rem))]">
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, y: 24 }}
            className="pointer-events-auto rounded-3xl border-2 border-cocoa bg-paper p-4 pr-10 text-cocoa shadow-[4px_4px_0_var(--cocoa)]"
          >
            <p className="hand text-xl leading-tight">{msg}</p>
            <button
              data-cursor="dismiss"
              aria-label="Dismiss"
              onClick={() => setMsg(null)}
              className="absolute right-3 top-2 text-lg font-bold"
            >
              x
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
