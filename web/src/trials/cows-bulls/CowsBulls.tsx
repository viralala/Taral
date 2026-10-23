"use client";
/**
 * Cows & Bulls, Tana's "Wordle with no colours", dressed in the Taral paper theme.
 * Game rules live in ./logic.ts and the word lists in ./words.ts (both from Tana's puzzle).
 * Bull = right letter, right spot. Cow = right letter, wrong spot. A 0/0 guess turns red.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BTN, CARD, CaptchaBot, LABEL, Stamp, TITLE, sfx } from "../kit";
import ResultScreen from "@/components/game/ResultScreen";
import type { Mood } from "@/components/game/types";
import type { TrialProps } from "../types";
import { MAX_ATTEMPTS, WORD_LENGTH, eliminatedLetters, pickSecret, scoreGuess, validateGuess } from "./logic";

type Guess = { guess: string; bulls: number; cows: number; miss: boolean };
type Phase = "intro" | "play" | "won" | "lost" | "result";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const OPENER = "Four letters, no repeats. I count bulls and cows. I will not say which are which.";

/** The more tries it took, the more human you were. Never below 40. */
const humanityFor = (attempts: number) => Math.max(40, 100 - (attempts - 1) * 6);

function Dots({ n, kind }: { n: number; kind: "bull" | "cow" }) {
  const label = kind === "bull" ? (n === 1 ? "bull" : "bulls") : n === 1 ? "cow" : "cows";
  return (
    <span className={`hand inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-white ${kind === "bull" ? "bg-coral" : "bg-violet"}`}>
      <span className="inline-flex gap-[3px]" aria-hidden>
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className="h-[7px] w-[7px] rounded-full bg-current" />
        ))}
      </span>
      {n} {label}
    </span>
  );
}

function Tile({ c, filled, active, small, miss }: { c: string; filled?: boolean; active?: boolean; small?: boolean; miss?: boolean }) {
  const size = small ? "h-9 w-9 text-lg sm:h-10 sm:w-10" : "h-12 w-12 text-2xl sm:h-14 sm:w-14 sm:text-3xl";
  const tone = miss ? "border-rose bg-rose text-white" : filled || small ? "border-navy bg-white text-navy" : "border-navy/40 bg-paper-2 text-navy";
  return (
    <span
      className={`marker grid place-items-center rounded-[14px_18px_12px_16px/16px_12px_18px_14px] border-2 ${size} ${tone} ${active ? "outline-2 outline-dashed outline-navy/50 -outline-offset-4" : ""}`}
      style={{ lineHeight: 1 }}
    >
      {c}
    </span>
  );
}

export default function CowsBulls({ onComplete, standalone }: TrialProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [secret, setSecret] = useState("");
  const [history, setHistory] = useState<Guess[]>([]);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [crossed, setCrossed] = useState<Set<string>>(() => new Set());
  const [noteMode, setNoteMode] = useState(false);
  const [bubble, setBubble] = useState<{ t: string; m: Mood }>({ t: OPENER, m: "smug" });
  const [attempt, setAttempt] = useState(0);
  const t0 = useRef(0);
  const timeMs = useRef(0);
  const endRef = useRef<HTMLLIElement>(null);

  const eliminated = useMemo(() => eliminatedLetters(history), [history]);
  const playing = phase === "play";
  const humanity = humanityFor(history.length);

  const start = () => {
    sfx("whoosh");
    setSecret(pickSecret());
    setHistory([]);
    setCurrent("");
    setError("");
    setCrossed(new Set());
    setNoteMode(false);
    setBubble({ t: OPENER, m: "smug" });
    setAttempt((a) => a + 1);
    t0.current = Date.now();
    setPhase("play");
  };

  const type = useCallback(
    (ch: string) => {
      if (!playing) return;
      setError("");
      setCurrent((c) => (c.length < WORD_LENGTH ? c + ch.toUpperCase() : c));
    },
    [playing],
  );

  const back = useCallback(() => {
    if (!playing) return;
    setError("");
    setCurrent((c) => c.slice(0, -1));
  }, [playing]);

  const submit = useCallback(() => {
    if (!playing) return;
    const v = validateGuess(current);
    if (!v.ok) {
      sfx("fail");
      setError(v.message);
      setShake((n) => n + 1);
      return;
    }
    const guess = current.toUpperCase();
    const row: Guess = { guess, ...scoreGuess(secret, guess) };
    const next = [...history, row];
    setHistory(next);
    setCurrent("");
    setError("");
    if (guess === secret) {
      timeMs.current = Date.now() - t0.current;
      sfx("pass");
      setBubble({ t: next.length <= 3 ? "Suspiciously quick. Are you a robot?" : "Fine. You cracked it. Hmph.", m: next.length <= 3 ? "shocked" : "proud" });
      setPhase("won");
    } else if (next.length >= MAX_ATTEMPTS) {
      timeMs.current = Date.now() - t0.current;
      sfx("fail");
      setBubble({ t: "Out of tries. Even the cows are embarrassed.", m: "crying" });
      setPhase("lost");
    } else {
      sfx("click");
      setBubble(
        row.miss
          ? { t: "Not one letter. Nothing! Those four are gone.", m: "shocked" }
          : { t: `${row.bulls} in place, ${row.cows} out of place. ${MAX_ATTEMPTS - next.length} left.`, m: "smug" },
      );
    }
  }, [playing, current, secret, history]);

  const tapKey = (k: string) => {
    if (noteMode) {
      sfx("click");
      setCrossed((s) => {
        const n = new Set(s);
        if (n.has(k)) n.delete(k);
        else n.add(k);
        return n;
      });
    } else type(k);
  };

  // physical keyboard
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("input, textarea, [contenteditable='true']")) return;
      if (e.key === "Enter") {
        if (t?.closest?.("button")) return;
        e.preventDefault();
        submit();
      } else if (e.key === "Backspace") back();
      else if (/^[a-zA-Z]$/.test(e.key)) type(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, submit, back, type]);

  useEffect(() => {
    if (!history.length) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView?.({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [history.length]);

  const done = () => {
    sfx("click");
    const res = { level: 2 as const, passed: 1, total: 1, humanity, timeMs: timeMs.current, cleared: true };
    if (standalone) setPhase("result");
    else onComplete(res);
  };

  const slots = Array.from({ length: WORD_LENGTH }, (_, i) => current[i] ?? "");
  const mood: Mood = bubble.m;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: -0.3 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={`${CARD} relative mx-auto w-full max-w-[640px] px-4 pb-6 pt-4 sm:px-7 sm:pb-8 sm:pt-6`}
    >
      {phase !== "result" && (
        <>
          <div className="flex items-center gap-3">
            <CaptchaBot mood={mood} size={78} hooded />
            <div className="relative min-w-0 flex-1 bg-paper-2 px-3 py-2 sm:px-4" style={{ borderRadius: "18px 26px 16px 22px / 22px 16px 26px 18px" }} aria-live="polite">
              <p className="text-sm leading-snug text-ink sm:text-base">{bubble.t}</p>
            </div>
          </div>
          <svg viewBox="0 0 300 8" preserveAspectRatio="none" className="my-4 h-2 w-full" aria-hidden>
            <path d="M2 5 C 60 2, 120 7, 180 4 S 270 3, 298 5" fill="none" stroke="var(--navy)" strokeOpacity=".25" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key={`intro-${attempt}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col items-center gap-3 py-2 text-center">
            <p className={`${LABEL} text-sm text-violet`}>Cows &amp; Bulls</p>
            <h2 className={`${TITLE} -rotate-1 text-3xl text-navy sm:text-4xl`}>Wordle with no colours</h2>
            <p className="max-w-md text-base leading-snug text-navy">
              Guess my secret 4-letter word in {MAX_ATTEMPTS} tries. No letter repeats.
            </p>
            <p className="max-w-md rounded-2xl bg-paper-2 px-4 py-3 text-left text-sm leading-snug text-navy sm:text-base">
              <b>Bull</b>: right letter, right spot. <b>Cow</b>: right letter, wrong spot.
              <span className="mt-1 block text-navy/70">Secret TALE, guess BATH: 1 bull (A), 1 cow (T). Zero of both turns the row red and greys out its letters.</span>
            </p>
            <button type="button" onClick={start} data-cursor="begin" className={`${BTN} mt-2 text-lg`}>
              {attempt === 0 ? "Begin the trial" : "Try again"}
            </button>
          </motion.div>
        )}

        {playing && (
          <motion.div key={`play-${attempt}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className={`${TITLE} -rotate-1 text-2xl text-navy sm:text-3xl`}>Crack the word</h2>
              <span className="hand rounded-full bg-navy px-3 py-1 text-sm text-paper" aria-label={`${MAX_ATTEMPTS - history.length} tries left`}>
                {MAX_ATTEMPTS - history.length} / {MAX_ATTEMPTS}
              </span>
            </div>

            <ol className="flex max-h-[220px] flex-col gap-2 overflow-y-auto rounded-2xl bg-paper-2 p-3 sm:max-h-[260px]" aria-label="Guess history">
              {history.length === 0 && <li className="p-1 text-sm text-navy/70">No guesses yet. Type a {WORD_LENGTH}-letter word.</li>}
              {history.map((h, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2.5">
                  <span className="hand w-4 text-xs text-navy/60">{i + 1}</span>
                  <span className="flex gap-1.5">
                    {[...h.guess].map((c, j) => (
                      <Tile key={j} c={c} small miss={h.miss} />
                    ))}
                  </span>
                  <span className="ml-auto flex gap-1.5" aria-label={`${h.bulls} bulls, ${h.cows} cows`}>
                    <Dots n={h.bulls} kind="bull" />
                    <Dots n={h.cows} kind="cow" />
                  </span>
                </li>
              ))}
              <li ref={endRef} aria-hidden />
            </ol>

            <motion.div key={shake} animate={shake ? { x: [0, -8, 7, -4, 0] } : undefined} transition={{ duration: 0.3 }} className="flex justify-center gap-1.5 sm:gap-2" aria-label="Current guess">
              {slots.map((c, i) => (
                <Tile key={i} c={c} filled={!!c} active={i === current.length} />
              ))}
            </motion.div>
            <p role="alert" className="hand min-h-5 text-center text-sm text-rose">{error}</p>

            <div className="flex flex-col items-center gap-1.5" aria-label="Keyboard">
              {ROWS.map((row, ri) => (
                <div key={row} className="flex w-full justify-center gap-1 sm:gap-1.5">
                  {ri === 2 && (
                    <button type="button" onClick={submit} data-cursor="enter" className="hand h-12 shrink-0 rounded-xl border-2 border-navy bg-navy px-3 text-xs text-paper active:scale-95">
                      Enter
                    </button>
                  )}
                  {[...row].map((k) => {
                    const out = eliminated.has(k);
                    const x = crossed.has(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => tapKey(k)}
                        aria-pressed={x}
                        aria-label={out ? `${k}, not in the word` : x ? `${k}, crossed out` : k}
                        className={`marker h-12 min-w-0 max-w-[40px] flex-1 rounded-xl border-2 text-base active:scale-95 ${
                          out ? "border-navy/20 bg-navy/25 text-paper" : "border-navy/70 bg-white text-navy"
                        } ${x ? "line-through opacity-40" : ""}`}
                        style={{ lineHeight: 1 }}
                      >
                        {k}
                      </button>
                    );
                  })}
                  {ri === 2 && (
                    <button type="button" onClick={back} aria-label="Backspace" data-cursor="back" className="hand h-12 shrink-0 rounded-xl border-2 border-navy/70 bg-white px-3 text-xs text-navy active:scale-95">
                      Back
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNoteMode((n) => !n)}
                aria-pressed={noteMode}
                className={`hand mt-1 rounded-full border-2 border-dashed px-4 py-2 text-xs ${noteMode ? "border-navy bg-navy text-paper" : "border-navy/50 text-navy"}`}
              >
                {noteMode ? "Notes on: tap letters to cross out" : "Notes off: tap to cross out letters"}
              </button>
            </div>
          </motion.div>
        )}

        {(phase === "won" || phase === "lost") && (
          <motion.div key={`end-${attempt}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} className="flex flex-col items-center gap-4 py-3 text-center">
            <Stamp pass={phase === "won"} />
            <p className="text-base text-navy">
              {phase === "won"
                ? `You found ${secret} in ${history.length} ${history.length === 1 ? "guess" : "guesses"}.`
                : "The secret word was:"}
            </p>
            <span className="flex gap-1.5">
              {[...secret].map((c, i) => (
                <Tile key={i} c={c} filled />
              ))}
            </span>
            {phase === "won" ? (
              <button type="button" onClick={done} data-cursor="next" className={BTN}>
                {standalone ? "See my humanity →" : "Cross to the tower →"}
              </button>
            ) : (
              <button type="button" onClick={start} data-cursor="retry" className={BTN}>Try again</button>
            )}
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <ResultScreen
              level={2}
              results={[{ pass: true, score: humanity / 100, quip: "", mood: "proud" }]}
              titles={["Cows & Bulls"]}
              timeMs={timeMs.current}
              onRestart={() => {
                setBubble({ t: "Back again? Persistence: human trait or while-loop?", m: "smug" });
                setPhase("intro");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
