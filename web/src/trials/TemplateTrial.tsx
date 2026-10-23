"use client";
/**
 * TEMPLATE TRIAL: copy me into trial2.tsx or trial3.tsx and make it yours.
 * One puzzle, a timer, a PASS/FAIL stamp, a retry, and onComplete. Not registered anywhere.
 */
import { useEffect, useRef, useState } from "react";
import { BTN, BTN_GHOST, CARD, CaptchaBot, LABEL, Stamp, TITLE, Timer, sfx } from "./kit";
import type { TrialProps } from "./types";

const LIMIT = 15; // seconds. Keep every challenge at 30 or under.
const OPTIONS = ["🍕", "🚦", "🐈", "🌸"]; // the puzzle: tap the blossom
const ANSWER = "🌸";

type Phase = "play" | "pass" | "fail";

export default function TemplateTrial({ onComplete, standalone }: TrialProps) {
  const [phase, setPhase] = useState<Phase>("play");
  const [round, setRound] = useState(0); // bump to restart without a reload
  const t0 = useRef(0);
  useEffect(() => {
    t0.current = Date.now(); // the clock starts with every round
  }, [round]);

  const start = () => {
    sfx("whoosh");
    setPhase("play");
    setRound((r) => r + 1);
  };

  const answer = (pick: string) => {
    if (phase !== "play") return;
    const ok = pick === ANSWER;
    sfx(ok ? "pass" : "fail");
    setPhase(ok ? "pass" : "fail");
  };

  const done = () => {
    sfx("click");
    // The story only needs this once the player clears the trial.
    onComplete({ level: 2, /* your trial number */ passed: 1, total: 1, humanity: 100, timeMs: Date.now() - t0.current, cleared: true });
  };

  return (
    <div className={`${CARD} mx-auto flex w-full max-w-[640px] flex-col items-center gap-4 p-6 text-center`}>
      <CaptchaBot mood={phase === "pass" ? "proud" : phase === "fail" ? "crying" : "smug"} size={78} />
      <p className={`${LABEL} text-sm text-violet`}>Template trial</p>
      <h2 className={`${TITLE} text-3xl text-navy sm:text-4xl`}>Tap the blossom</h2>

      {phase === "play" && (
        <>
          <div className="w-full">
            <Timer key={round} limit={LIMIT} active onTimeout={() => answer("timeout")} />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {OPTIONS.map((o) => (
              <button key={o} type="button" onClick={() => answer(o)} className="rounded-2xl border-2 border-navy bg-paper-2 p-3 text-4xl active:scale-95">
                {o}
              </button>
            ))}
          </div>
        </>
      )}

      {phase !== "play" && (
        <>
          <Stamp pass={phase === "pass"} />
          {phase === "pass" && !standalone && (
            <button type="button" onClick={done} className={BTN}>Onward →</button>
          )}
          <button type="button" onClick={start} className={BTN_GHOST}>Try again</button>
        </>
      )}
    </div>
  );
}
