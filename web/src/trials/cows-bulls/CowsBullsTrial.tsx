"use client";
import { useEffect, useRef, useState } from "react";
import { BTN, BTN_GHOST, CARD, CaptchaBot, LABEL, Stamp, TITLE, sfx } from "../kit";
import type { TrialProps } from "../types";
import { useCowsBulls } from "./useCowsBulls";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function Count({ n, kind }: { n: number; kind: "bull" | "cow" }) {
  const label = kind === "bull" ? (n === 1 ? "bull" : "bulls") : n === 1 ? "cow" : "cows";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 border-navy px-2.5 py-1 text-sm font-bold ${kind === "bull" ? "bg-lime" : "bg-peach"}`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-navy" />
        ))}
      </span>
      {n} {label}
    </span>
  );
}

export default function CowsBullsTrial({ onComplete, standalone }: TrialProps) {
  const [round, setRound] = useState(0); // bump to restart without a reload
  const [result, setResult] = useState({ attempts: 0, timeMs: 0 });
  const t0 = useRef(0);
  const endRef = useRef<HTMLLIElement>(null);
  const g = useCowsBulls({
    onSolve: ({ attempts }) => {
      sfx("pass");
      setResult({ attempts, timeMs: Date.now() - t0.current });
    },
    onInvalid: () => sfx("fail"),
  });

  useEffect(() => {
    t0.current = Date.now();
  }, [round]);

  // a miss row (0 bulls, 0 cows) gets a fail sound
  const n = g.history.length;
  const lastMiss = n > 0 && g.history[n - 1].miss;
  useEffect(() => {
    if (lastMiss) sfx("fail");
  }, [n, lastMiss]);
  useEffect(() => {
    if (n) endRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [n]);
  useEffect(() => {
    if (g.status === "lost") sfx("fail");
  }, [g.status]);

  const restart = () => {
    sfx("whoosh");
    g.playAgain();
    setRound((r) => r + 1);
  };
  const key = (k: string) => {
    sfx("click");
    g.tapKey(k);
  };
  const done = () => {
    sfx("click");
    onComplete({ level: 2, passed: 1, total: 1, humanity: Math.max(10, 100 - (result.attempts - 1) * 10), timeMs: result.timeMs, cleared: true });
  };

  const won = g.status === "won";
  const slots = Array.from({ length: g.wordLength }, (_, i) => g.current[i] || "");
  const tile = "flex items-center justify-center rounded-xl border-2 border-navy font-bold text-navy";

  return (
    <div className={`${CARD} mx-auto flex w-full max-w-[640px] flex-col items-center gap-3 p-4 text-center sm:p-6`}>
      <CaptchaBot mood={won ? "proud" : g.status === "lost" ? "crying" : "smug"} size={72} />
      <p className={`${LABEL} text-sm text-violet`}>Puzzle with a twist</p>
      <h2 className={`${TITLE} text-3xl text-navy sm:text-4xl`}>Cows &amp; Bulls</h2>
      <p className="text-sm text-navy">
        Bull = right letter, right spot. Cow = right letter, wrong spot. Secret TALE, guess BATH: 1 bull, 1 cow.
      </p>
      <p className={`${LABEL} text-xs text-navy`}>
        {g.attemptsLeft} of {g.maxAttempts} tries left
      </p>

      <ol className="flex max-h-[34vh] w-full flex-col gap-2 overflow-y-auto" aria-label="Guess history">
        {n === 0 && <li className="text-sm text-violet">No guesses yet. Type a 4-letter word.</li>}
        {g.history.map((h, i) => (
          <li
            key={i}
            className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 px-3 py-2 ${h.miss ? "border-coral bg-coral/30" : "border-navy bg-paper-2"}`}
          >
            <span className="flex items-center gap-2">
              <span className={`${LABEL} w-5 text-xs text-violet`}>{i + 1}</span>
              <span className="flex gap-1">
                {[...h.guess].map((c, j) => (
                  <span key={j} className={`${tile} h-9 w-9 bg-paper text-lg`}>
                    {c}
                  </span>
                ))}
              </span>
            </span>
            <span className="flex gap-2" aria-label={`${h.bulls} bulls, ${h.cows} cows`}>
              <Count n={h.bulls} kind="bull" />
              <Count n={h.cows} kind="cow" />
            </span>
          </li>
        ))}
        <li ref={endRef} aria-hidden="true" />
      </ol>

      {g.status === "playing" ? (
        <>
          <div className="flex gap-2" aria-label="Current guess">
            {slots.map((c, i) => (
              <span key={i} className={`${tile} h-14 w-14 text-2xl ${c ? "bg-lime" : "bg-paper-2"} ${i === g.current.length ? "border-violet" : ""}`}>
                {c}
              </span>
            ))}
          </div>
          <p role="alert" className="min-h-6 text-sm font-bold text-coral">
            {g.error}
          </p>

          <div className="flex w-full flex-col gap-1.5" aria-label="Keyboard">
            {ROWS.map((row, ri) => (
              <div key={row} className="flex justify-center gap-1">
                {ri === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      sfx("click");
                      g.submit();
                    }}
                    className="h-12 min-w-14 rounded-lg border-2 border-navy bg-lime px-2 text-xs font-bold text-navy active:scale-95"
                  >
                    Enter
                  </button>
                )}
                {[...row].map((k) => {
                  const out = g.eliminated.has(k);
                  const crossed = g.crossed.has(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => key(k)}
                      aria-pressed={crossed}
                      aria-label={out ? `${k}, not in the word` : crossed ? `${k}, crossed out` : k}
                      className={`h-12 min-w-0 max-w-11 flex-1 rounded-lg border-2 font-bold active:scale-95 ${out ? "border-navy/30 bg-navy/20 text-navy/40" : "border-navy bg-paper-2 text-navy"} ${crossed ? "line-through decoration-coral decoration-[3px]" : ""}`}
                    >
                      {k}
                    </button>
                  );
                })}
                {ri === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      sfx("click");
                      g.back();
                    }}
                    aria-label="Backspace"
                    className="h-12 min-w-14 rounded-lg border-2 border-navy bg-paper-2 px-2 text-xs font-bold text-navy active:scale-95"
                  >
                    Back
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => g.setNoteMode(!g.noteMode)}
              aria-pressed={g.noteMode}
              className={`mx-auto mt-1 min-h-11 rounded-full border-2 border-navy px-4 text-sm font-bold ${g.noteMode ? "bg-violet text-paper" : "bg-paper text-navy"}`}
            >
              {g.noteMode ? "Notes on: tap letters to cross out" : "Notes off: tap to cross out letters"}
            </button>
          </div>
          <button type="button" onClick={restart} className={`${BTN_GHOST} min-h-11`}>
            Try again
          </button>
        </>
      ) : (
        <>
          <Stamp pass={won} />
          <p className="text-navy">{won ? `Cracked ${g.secret} in ${n} ${n === 1 ? "guess" : "guesses"}. Moo-velous!` : "Out of tries. The word was"}</p>
          {!won && (
            <span className="flex gap-2">
              {[...g.secret].map((c, i) => (
                <span key={i} className={`${tile} h-12 w-12 bg-lime text-xl`}>
                  {c}
                </span>
              ))}
            </span>
          )}
          {won && !standalone && (
            <button type="button" onClick={done} className={BTN}>
              Onward →
            </button>
          )}
          <button type="button" onClick={restart} className={`${won && standalone ? BTN : BTN_GHOST} min-h-11`}>
            {won && standalone ? "Play again" : "Try again"}
          </button>
        </>
      )}
    </div>
  );
}
