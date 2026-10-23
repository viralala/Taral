"use client";
import { useEffect, useState } from "react";
import { isMuted, onMuted, setMuted, sfx } from "@/lib/audio";

/** Kaizen-style animated sound bars, top-right. */
export function SoundToggle() {
  const [muted, setM] = useState(false);
  useEffect(() => {
    setM(isMuted());
    return onMuted(setM);
  }, []);
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); setMuted(!muted); if (muted) sfx("click"); }}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      aria-pressed={!muted}
      data-cursor={muted ? "sound" : "mute"}
      className="fixed right-4 top-4 z-50 flex h-11 w-11 items-end justify-center gap-[3px] rounded-full pb-3 text-paper md:right-6 md:top-6"
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="block h-4 w-[3px] origin-bottom rounded-full bg-current"
          style={muted ? { transform: "scaleY(.22)" } : { animation: `tp-bars ${0.7 + i * 0.17}s ease-in-out infinite`, animationDelay: `${-i * 0.23}s` }} />
      ))}
    </button>
  );
}

export function SkipButton({ onSkip, label = "Skip" }: { onSkip: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onSkip(); }}
      data-cursor="skip"
      className="hand fixed bottom-4 right-4 z-50 min-h-11 px-3 text-sm text-paper/85 transition hover:text-lime md:bottom-6 md:right-6"
    >
      {label} <span aria-hidden>»</span>
    </button>
  );
}

export function Logo() {
  return (
    <p className="marker pointer-events-none fixed left-4 top-4 z-50 text-2xl text-paper md:left-6 md:top-6 md:text-3xl">Taral</p>
  );
}
