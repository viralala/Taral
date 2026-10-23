"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LEVELS } from "@/lib/story";
import { sfx } from "@/lib/audio";
import { saveRun } from "@/lib/supabase";
import { TitleCard } from "./Caption";

export type Lvl = 1 | 2 | 3;
const ORD = { 1: "First Trial", 2: "Second Trial", 3: "Final Trial" } as const;
const ROMAN = { 1: "I", 2: "II", 3: "III" } as const;

/** "FIRST TRIAL" card; auto-continues, or tap to continue. */
export function ChapterCard({ level, onDone }: { level: Lvl; onDone: () => void }) {
  const done = useRef(onDone);
  useEffect(() => { done.current = onDone; });
  useEffect(() => {
    const t = setTimeout(() => done.current(), 3600);
    return () => clearTimeout(t);
  }, [level]);
  return (
    <div onClick={onDone} data-cursor="enter"
      className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center pb-[6vh]">
      <TitleCard title={ORD[level]} kicker={`Act ${ROMAN[level]}`} className="relative" />
      <motion.span className="hand pointer-events-none mt-3 block px-6 text-center text-lg text-paper md:text-2xl"
        style={{ textShadow: "0 2px 18px rgba(5,8,32,.85)" }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }}>
        {LEVELS[level].name}
      </motion.span>
      <button type="button" autoFocus onClick={(e) => { e.stopPropagation(); onDone(); }}
        className="hand fixed bottom-4 right-4 z-50 min-h-11 px-3 text-sm text-paper/85 hover:text-lime md:bottom-6 md:right-6">
        Continue <span aria-hidden>»</span>
      </button>
    </div>
  );
}

/** Three petals = three trials. Filled when cleared, pulsing for the current one. */
export function TrialPetals({ current, cleared }: { current: Lvl; cleared: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Trial ${current} of 3, ${cleared} cleared`} role="img">
      {[1, 2, 3].map((n) => {
        const done = n <= cleared;
        const now = n === current && !done;
        return (
          <svg key={n} viewBox="0 0 20 20" className="h-5 w-5" aria-hidden style={now ? { animation: "tp-pulse 1.6s ease-in-out infinite" } : undefined}>
            <path d="M10 2 C16 5 17 12 10 18 C3 12 4 5 10 2 Z" fill={done ? "var(--blossom)" : "none"} stroke={done || now ? "var(--blossom)" : "rgba(239,234,215,.45)"} strokeWidth="1.6" />
          </svg>
        );
      })}
    </div>
  );
}

export function LevelHud({ level, cleared }: { level: Lvl; cleared: number }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start gap-3 bg-gradient-to-b from-night/85 to-transparent px-4 pb-6 pt-4 pr-16 md:px-6 md:pr-20 md:pt-6">
      <p className="marker min-w-0 text-lg text-paper sm:text-xl md:text-2xl">
        <span className="text-lime">{ROMAN[level]}.</span> {LEVELS[level].name}
      </p>
      <div className="ml-auto pt-1"><TrialPetals current={level} cleared={cleared} /></div>
    </div>
  );
}

/** Between trials: the clue the heroes found. */
export function ClueCard({ level, humanity, onNext }: { level: Lvl; humanity: number; onNext: () => void }) {
  useEffect(() => { sfx("chime"); }, []);
  return (
    <div className="absolute inset-0 z-30 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: -1 }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="paper-card relative w-full max-w-md px-6 py-8 text-center md:px-9">
          <span className="hand absolute -top-4 left-1/2 -translate-x-1/2 -rotate-3 bg-lime px-4 py-1 text-sm text-navy"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>Clue found</span>
          <p className="marker mt-5 text-2xl text-navy md:text-3xl">&ldquo;{LEVELS[level].clue}&rdquo;</p>
          <p className="hand mt-5 text-base text-navy/80">Humanity <strong className="text-navy">{humanity}%</strong></p>
          <button type="button" autoFocus onClick={onNext} data-cursor="onward" className="btn-paint mt-7 text-lg">
            {level < 3 ? "Onward" : "Open the door"} <span aria-hidden>→</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/** After the intro cinematic. */
export function BeginPanel({ onBegin, onReplay }: { onBegin: () => void; onReplay: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-end px-6 pb-[13vh] text-center">
      <motion.p className="hand mb-6 max-w-xl text-lg text-paper md:text-2xl" style={{ textShadow: "0 2px 18px rgba(5,8,32,.85)" }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Three trials. Two hearts. One very suspicious CAPTCHA.
      </motion.p>
      <motion.button type="button" autoFocus onClick={onBegin} data-cursor="go" className="btn-paint px-9 py-4 text-xl md:text-2xl"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 14 }}>
        Begin your quest <span aria-hidden>→</span>
      </motion.button>
      <button type="button" onClick={onReplay} className="hand mt-5 min-h-11 px-3 text-sm text-paper/75 underline-offset-4 hover:underline">Replay the tale</button>
    </div>
  );
}

function verdictFor(h: number) {
  if (h >= 90) return { label: "Royal Heart", line: "Certified human. Hopelessly, royally in love." };
  if (h >= 75) return { label: "True Human", line: "Human enough for a happily ever after." };
  if (h >= 60) return { label: "Probably Human", line: "Probably human. CAPT. CHA is still squinting." };
  return { label: "Suspiciously Robotic", line: "Suspiciously robotic… but love wins anyway." };
}

export function fmtTime(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Completion({ hero, love, heroName, humanity, timeMs, onAgain, onRename }: {
  hero: string; love: string; heroName: string; humanity: number; timeMs: number; onAgain: () => void; onRename: () => void;
}) {
  const v = verdictFor(humanity);
  const [save, setSave] = useState<"idle" | "saving" | "saved" | "offline">("idle");
  const doSave = async () => {
    setSave("saving");
    let ok = false;
    try {
      const r = await saveRun({ name: heroName.slice(0, 24), level: 3, humanity, time_ms: Math.round(timeMs), verdict: v.label });
      ok = !r.error;
    } catch {}
    setSave(ok ? "saved" : "offline");
    sfx(ok ? "pass" : "fail");
  };
  return (
    <div className="absolute inset-0 z-30 overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center px-5 py-24 text-center">
        <motion.h1 className="marker max-w-full text-[clamp(2.2rem,8vw,5.5rem)] text-paper [overflow-wrap:anywhere] md:max-w-4xl" style={{ textShadow: "0 6px 30px rgba(5,8,32,.6)", rotate: "-1.5deg" }}
          initial={{ clipPath: "inset(-20% 100% -20% 0)" }} animate={{ clipPath: "inset(-20% 0% -20% 0)" }} transition={{ duration: 1.2, ease: [0.6, 0, 0.2, 1] }}>
          {hero} &amp; {love}
        </motion.h1>
        <motion.p className="hand mt-3 text-lg text-paper md:text-2xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          lived puzzlingly ever after.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
          className="paper-card mt-9 w-full max-w-md px-6 py-7">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="hand text-xs text-navy/60">Humanity</p>
              <p className="marker text-4xl text-navy sm:text-5xl">{humanity}%</p>
            </div>
            <div>
              <p className="hand text-xs text-navy/60">Time</p>
              <p className="marker text-4xl text-navy tabular-nums sm:text-5xl">{fmtTime(timeMs)}</p>
            </div>
          </div>
          <p className="hand mt-4 text-sm text-navy">{v.label}</p>
          <p className="mt-1 text-base text-navy/75">{v.line}</p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <button type="button" onClick={doSave} disabled={save === "saving" || save === "saved"} data-cursor="carve" className="btn-paint w-full">
              {save === "saved" ? "Carved into legend ✓" : save === "saving" ? "Carving…" : "Carve our names on the leaderboard"}
            </button>
            <p className="hand min-h-5 text-xs text-navy/60" role="status" aria-live="polite">
              {save === "offline" ? "The royal scribe is offline. Your legend lives on here." : save === "saved" ? `Saved as ${heroName}.` : ""}
            </p>
            <Link href="/leaderboard" data-cursor="legends" className="btn-ghost text-sm text-navy">See the leaderboard</Link>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={onAgain} data-cursor="again" className="btn-ghost text-paper">Play again</button>
          <button type="button" onClick={onRename} className="hand min-h-11 px-3 text-sm text-paper/75 underline-offset-4 hover:underline">Change names</button>
        </div>
      </div>
    </div>
  );
}
