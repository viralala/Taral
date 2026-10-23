"use client";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "framer-motion";
import { sfx } from "@/lib/audio";
import { LEVELS } from "@/lib/story";
import CaptchaBot from "./CaptchaBot";
import Timer from "./Timer";
import Stamp from "./Stamp";
import ResultScreen from "./ResultScreen";
import { LEVEL1 } from "./level1";
import { LEVEL2 } from "./level2";
import { LEVEL3 } from "./level3";
import { pick, shuffle, type Def, type Level, type Mood, type Res } from "./types";

type LevelResult = { level: 1 | 2 | 3; passed: number; total: number; humanity: number; timeMs: number; cleared: boolean };
export type { LevelResult };

const POOLS: Record<Level, Def[]> = { 1: LEVEL1, 2: LEVEL2, 3: LEVEL3 };
const PER_LEVEL = 3;
const NEED = 2;

const OPENERS: Record<Level, string> = {
  1: "Halt! Three trials, pass two. Owl be watching.",
  2: "Every plank's a riddle. Wrong answers? Long way down.",
  3: "My tower. Last time asking: are you human?",
};
const RETRY = [
  "Denied. Don't worry, I failed my first CAPTCHA too.",
  "Two strikes. Humans are famous for second tries.",
  "Path closed. Luck is for random number generators.",
];
const TIMEOUT = [
  "Time's up. Even the loading spinner felt embarrassed.",
  "Overthinking: the most human bug. Still a fail.",
  "Tick-tock. The clock wins this round.",
];
const RETRY_TITLE = ["Not this thyme.", "Plot twist: again.", "So close. Again!"];
const COMBO: Record<number, string> = { 2: "2 in a row! Suspiciously competent.", 3: "3 for 3! Hat trick, human." };
const NEXT_LABEL: Record<Level, string> = { 1: "Leave the forest →", 2: "Cross to the tower →", 3: "Open the door →" };

type Phase = "intro" | "play" | "stamp" | "retry" | "result" | "done";

export default function LevelGame({
  level,
  onComplete,
  standalone = false,
}: {
  level: 1 | 2 | 3;
  onComplete?: (r: LevelResult) => void;
  standalone?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<Def[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Res[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [bubble, setBubble] = useState<{ t: string; m: Mood }>({ t: OPENERS[level], m: "smug" });
  const lock = useRef(false);
  const t0 = useRef(0);
  const total = useRef(0);
  const lastDraw = useRef<string>("");
  const [card, shake] = useAnimate();
  const still = useReducedMotion();

  const say = useCallback((t: string, m: Mood = "smug") => setBubble({ t, m }), []);

  const begin = (i: number, ord: Def[]) => {
    lock.current = false;
    t0.current = Date.now();
    setIdx(i);
    setPhase("play");
    say(ord[i].intro, "smug");
  };

  const start = () => {
    sfx("whoosh");
    const pool = POOLS[level];
    let ord = shuffle(pool).slice(0, PER_LEVEL);
    // fresh draw on retry: avoid repeating the exact same trio
    for (let k = 0; k < 4 && ord.map((d) => d.id).sort().join() === lastDraw.current; k++) ord = shuffle(pool).slice(0, PER_LEVEL);
    lastDraw.current = ord.map((d) => d.id).sort().join();
    total.current = 0; // time and humanity both describe this attempt only
    setOrder(ord);
    setResults([]);
    setAttempt((a) => a + 1);
    begin(0, ord);
  };

  const finish = useCallback((r: Res) => {
    if (lock.current) return;
    lock.current = true;
    total.current += Date.now() - t0.current;
    sfx(r.pass ? "pass" : "fail");
    setResults((rs) => [...rs, r]);
    setBubble({ t: r.quip, m: r.mood });
    setPhase("stamp");
    if (!r.pass && !still && card.current) shake(card.current, { x: [0, -9, 8, -5, 3, 0] }, { duration: 0.35, ease: "easeOut" });
  }, [card, shake, still]);

  const timeout = useCallback(() => {
    finish({ pass: false, score: 0.1, mood: "crying", quip: pick(TIMEOUT), note: "Out of time" });
  }, [finish]);

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;
  const humanity = Math.round((results.reduce((a, r) => a + r.score, 0) / Math.max(1, results.length)) * 100);
  const doomed = failed > PER_LEVEL - NEED; // can no longer clear this attempt
  const finished = results.length >= order.length && order.length > 0;

  const next = () => {
    sfx("click");
    if (doomed) {
      setPhase("retry");
      say(pick(RETRY), "crying");
      return;
    }
    if (!finished) return begin(idx + 1, order);
    const res: LevelResult = { level, passed, total: results.length, humanity, timeMs: total.current, cleared: true };
    if (standalone) {
      setPhase("result");
      say("Fine. You passed. I'm not crying, it's forest dew.", "proud");
    } else {
      setPhase("done");
      say("Go on. I'll be waiting further in. Always.", "proud");
      onComplete?.(res);
    }
  };

  const restart = () => {
    total.current = 0;
    setPhase("intro");
    setOrder([]);
    setResults([]);
    setIdx(0);
    say("Back again? Persistence: human trait or while-loop?", "smug");
  };

  const def = phase === "play" || phase === "stamp" ? order[idx] : null;
  const last = results[results.length - 1];
  const lvl = LEVELS[level];
  let streak = 0;
  for (let i = results.length - 1; i >= 0 && results[i].pass; i--) streak++;
  const combo = last?.pass ? COMBO[Math.min(streak, 3)] : undefined;
  const retryTitle = RETRY_TITLE[(attempt - 1 + RETRY_TITLE.length) % RETRY_TITLE.length];
  const stampLabel = doomed ? "See what happens" : !finished ? "Next trial →" : NEXT_LABEL[level];

  return (
    <div ref={card} className="mx-auto w-full max-w-[640px] bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: -0.3 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="paper-card relative px-4 pb-6 pt-4 sm:px-7 sm:pb-8 sm:pt-6"
      >
        {/* progress dots (the page HUD names the trial) */}
        <div className="flex items-center justify-end">
          <div className="flex shrink-0 items-center gap-2" aria-label={`progress: ${results.length} of ${PER_LEVEL}`}>
            {Array.from({ length: PER_LEVEL }, (_, i) => {
              const r = results[i];
              const bg = r ? (r.pass ? "var(--leaf)" : "var(--rose)") : phase === "play" && i === idx ? "var(--lime)" : "transparent";
              return (
                <span key={i} className="h-4 w-4 border-2 border-navy transition-colors" style={{ background: bg, borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%", rotate: `${(i - 1) * 8}deg` }} />
              );
            })}
          </div>
        </div>

        {/* THE HOODED VOICE */}
        <div className="mt-3 flex items-center gap-3">
          <CaptchaBot mood={bubble.m} size={78} hooded />
          <AnimatePresence mode="wait">
            <motion.div
              key={bubble.t}
              initial={{ opacity: 0, x: -8, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="relative min-w-0 flex-1 bg-paper-2 px-3 py-2 sm:px-4"
              style={{ borderRadius: "18px 26px 16px 22px / 22px 16px 26px 18px" }}
              aria-live="polite"
            >
              <p className="text-sm leading-snug text-ink sm:text-base">{bubble.t}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <svg viewBox="0 0 300 8" preserveAspectRatio="none" className="my-4 h-2 w-full" aria-hidden>
          <path d="M2 5 C 60 2, 120 7, 180 4 S 270 3, 298 5" fill="none" stroke="var(--navy)" strokeOpacity=".25" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key={`intro-${attempt}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col items-center gap-3 py-2 text-center">
              <h2 className="marker -rotate-1 text-4xl text-navy sm:text-5xl">{lvl.name}</h2>
              <p className="hand rounded-full bg-paper-2 px-4 py-1 text-base text-navy">
                {PER_LEVEL} trials · pass {NEED}
              </p>
              <button type="button" onClick={start} data-cursor="begin" className="btn-paint mt-2 text-lg">
                {attempt === 0 ? "Begin the trial" : "Try again"}
              </button>
            </motion.div>
          )}

          {phase === "play" && def && (
            <motion.div key={`play-${attempt}-${idx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-3">
              <h2 className="marker -rotate-1 text-3xl text-navy sm:text-4xl">{def.title}</h2>
              <p className="text-base leading-snug text-navy sm:text-lg">{def.prompt}</p>
              <Timer key={`${attempt}-${idx}`} limit={def.limit} onTimeout={timeout} active />
              <div className="mt-1">
                <def.Comp key={`${attempt}-${idx}`} finish={finish} say={say} />
              </div>
            </motion.div>
          )}

          {phase === "stamp" && last && (
            <motion.div key={`stamp-${attempt}-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col items-center gap-4 py-3 text-center">
              <Stamp pass={last.pass} />
              <div className="flex flex-wrap items-center justify-center gap-2">
                {combo && (
                  <motion.p initial={{ scale: 0.6, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: -2 }} transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 14 }}
                    className="hand rounded-full bg-lime px-3 py-1 text-sm text-navy">
                    {combo}
                  </motion.p>
                )}
                {last.note && <p className="hand rounded-full bg-paper-2 px-3 py-1 text-sm text-navy">{last.note}</p>}
              </div>
              <button type="button" onClick={next} data-cursor="next" className={doomed ? "btn-ghost text-navy" : "btn-paint"}>
                {stampLabel}
              </button>
            </motion.div>
          )}

          {phase === "retry" && (
            <motion.div key={`retry-${attempt}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-3 text-center">
              <h2 className="marker rotate-1 text-4xl text-rose sm:text-5xl">{retryTitle}</h2>
              <button type="button" onClick={start} data-cursor="retry" className="btn-paint mt-1">Try again</button>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <ResultScreen level={level} results={results} titles={order.map((d) => d.title)} timeMs={total.current} onRestart={restart} />
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 py-4 text-center">
              <h2 className="marker -rotate-1 text-4xl text-leaf sm:text-5xl">Trial cleared</h2>
              <p className="hand text-base text-navy/80">humanity {humanity}% · {(total.current / 1000).toFixed(1)} s</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
