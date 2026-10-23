"use client";
/* ============================================================================
 * TRIAL 3 · The Vault of the Stolen Tiara (Puzzle Passwords)
 *
 * Challenge 1: read 4 clues, accuse the culprit (Rabbit).
 * Challenge 2: answer a random riddle, then build a password that contains the
 *              culprit's name, the riddle's answer, and is 12+ characters.
 * No timer. onComplete is called once, from "Onward →", after a win.
 * ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { BTN, BTN_GHOST, CARD, CaptchaBot, LABEL, Stamp, TITLE, sfx } from "./kit";
import type { TrialProps } from "./types";
import { CLUES, CULPRIT, NUDGES, RIDDLES, SUSPECTS, type Riddle } from "./vault/data";

const pickRiddle = (avoid?: Riddle | null): Riddle => {
  const pool = RIDDLES.filter((r) => r !== avoid);
  return pool[Math.floor(Math.random() * pool.length)];
};

export default function Trial3({ onComplete, standalone }: TrialProps) {
  const [round, setRound] = useState(0);
  const [riddle, setRiddle] = useState<Riddle | null>(null); // picked after mount (no hydration mismatch)
  const [pick, setPick] = useState("");
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [nudge, setNudge] = useState("");
  const [pw, setPw] = useState("");
  const t0 = useRef(0);
  const timeMs = useRef(0);
  const lastRiddle = useRef<Riddle | null>(null);
  const sounded = useRef(false);

  useEffect(() => {
    const r = pickRiddle(lastRiddle.current);
    lastRiddle.current = r;
    setRiddle(r);
    t0.current = Date.now();
    sounded.current = false;
  }, [round]);

  const low = pw.toLowerCase();
  const rules = [
    {
      ok: solved && low.includes("rabbit"),
      text: solved ? `Contains the culprit's name: ${CULPRIT}` : "Contains the culprit",
    },
    { ok: !!riddle && riddle.answers.some((a) => low.includes(a)), text: "Contains the riddle's answer" },
    { ok: pw.length >= 12, text: "At least 12 characters" },
  ];
  const won = solved && rules.every((r) => r.ok);

  useEffect(() => {
    if (won && !sounded.current) {
      sounded.current = true;
      timeMs.current = Date.now() - t0.current;
      sfx("pass");
    }
  }, [won]);

  const accuse = () => {
    if (solved || !pick) return;
    if (pick === CULPRIT) {
      sfx("chime");
      setSolved(true);
      setNudge("");
    } else {
      sfx("fail");
      setWrong((w) => w + 1);
      setNudge(NUDGES[wrong % NUDGES.length]);
    }
  };

  const restart = () => {
    sfx("whoosh");
    setPick("");
    setSolved(false);
    setWrong(0);
    setNudge("");
    setPw("");
    setRiddle(null);
    setRound((r) => r + 1);
  };

  const done = () => {
    sfx("click");
    onComplete({
      level: 3,
      passed: 2,
      total: 2,
      humanity: Math.max(40, 100 - wrong * 15),
      timeMs: timeMs.current,
      cleared: true,
    });
  };

  return (
    <div className={`${CARD} mx-auto flex w-full max-w-[640px] flex-col items-center gap-4 p-6 text-center`}>
      <CaptchaBot mood={won ? "proud" : "smug"} size={78} />
      <p className={`${LABEL} text-sm text-violet`}>Trial 3</p>
      <h2 className={`${TITLE} text-3xl text-navy sm:text-4xl`}>The Vault of the Stolen Tiara</h2>
      <p className="text-base text-ink">Catch the thief, then lock up a silly password to open the vault.</p>

      {/* Challenge 1 */}
      <section className="flex w-full flex-col gap-3 text-left">
        <p className={`${LABEL} text-sm text-violet`}>Challenge 1 · Whodunit</p>
        <ul className="flex flex-col gap-2 rounded-2xl border-2 border-navy bg-paper-2 p-4">
          {CLUES.map((c, i) => (
            <li key={i} className="text-base text-ink">
              {i + 1}. {c}
            </li>
          ))}
        </ul>
        <label htmlFor="vault-accuse" className="text-base font-bold text-navy">
          Who stole the tiara?
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            id="vault-accuse"
            value={pick}
            disabled={solved}
            onChange={(e) => setPick(e.target.value)}
            className="min-h-12 flex-1 rounded-2xl border-2 border-navy bg-paper-2 px-3 text-base text-ink disabled:opacity-70"
          >
            <option value="">Pick a suspect...</option>
            {SUSPECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="button" onClick={accuse} disabled={solved || !pick} className={`${BTN} min-h-12`}>
            {solved ? "Caught!" : "Accuse"}
          </button>
        </div>
        {nudge && !solved && (
          <p role="status" className="text-base text-rose">
            {nudge}
          </p>
        )}
        {solved && (
          <p role="status" className="text-base font-bold text-leaf">
            Rabbit it is! The tiara is found. Now for the vault.
          </p>
        )}
      </section>

      {/* Challenge 2 */}
      {solved && riddle && (
        <section className="flex w-full flex-col gap-3 text-left">
          <p className={`${LABEL} text-sm text-violet`}>Challenge 2 · The vault lock</p>
          <p className="rounded-2xl border-2 border-navy bg-paper-2 p-4 text-base font-bold text-ink">{riddle.q}</p>
          <label htmlFor="vault-pw" className="text-base font-bold text-navy">
            Make a password
          </label>
          <input
            id="vault-pw"
            type="text"
            value={pw}
            disabled={won}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Type here..."
            className="min-h-12 w-full rounded-2xl border-2 border-navy bg-paper-2 px-3 text-base text-ink"
          />
          <ul className="flex flex-col gap-2" aria-live="polite">
            {rules.map((r) => (
              <li
                key={r.text}
                className="flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-base"
                style={{
                  borderColor: r.ok ? "var(--leaf)" : "var(--navy)",
                  color: r.ok ? "var(--leaf)" : "var(--ink)",
                  opacity: r.ok ? 1 : 0.65,
                }}
              >
                <span aria-hidden="true" className="w-5 font-bold">
                  {r.ok ? "✓" : "•"}
                </span>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {won && (
        <div className="flex w-full flex-col items-center gap-3">
          <Stamp pass />
          <p className="text-base font-bold text-navy">The vault swings open and the tiara sparkles. Rabbit, you cheeky thing!</p>
          {!standalone && (
            <button type="button" onClick={done} className={BTN}>
              Onward →
            </button>
          )}
        </div>
      )}

      {(won || solved || wrong > 0) && (
        <button type="button" onClick={restart} className={BTN_GHOST}>
          {won && standalone ? "Play again" : "Try again"}
        </button>
      )}

      <p className="text-sm text-ink opacity-70">Don&apos;t use a real password.</p>
    </div>
  );
}
