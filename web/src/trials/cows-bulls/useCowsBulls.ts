// Headless Cows & Bulls: all game state and actions, no markup or styles.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MAX_ATTEMPTS, WORD_LENGTH, eliminatedLetters, pickSecret, scoreGuess, validateGuess } from "./logic";
import type { HistoryRow } from "./logic";

export type Status = "playing" | "won" | "lost";

export type CowsBullsOptions = {
  maxAttempts?: number;
  /** Fixed secret, for tests. */
  secret?: string;
  onSolve?: (r: { word: string; attempts: number; history: HistoryRow[] }) => void;
  onFail?: (r: { word: string; history: HistoryRow[] }) => void;
  /** Listen to the physical keyboard. Default true. */
  keyboard?: boolean;
  /** Called with an error message whenever a guess is rejected. */
  onInvalid?: (message: string) => void;
};

export function useCowsBulls({ maxAttempts = MAX_ATTEMPTS, secret: fixedSecret, onSolve, onFail, keyboard = true, onInvalid }: CowsBullsOptions = {}) {
  const [secret, setSecret] = useState<string>(() => (fixedSecret ? fixedSecret.toUpperCase() : pickSecret()));
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("playing");
  const [crossed, setCrossed] = useState<Set<string>>(() => new Set());
  const [noteMode, setNoteMode] = useState(false);

  // Keep the latest callbacks without re-binding the keyboard listener every render.
  const callbacks = useRef({ onSolve, onFail, onInvalid });
  useEffect(() => {
    callbacks.current = { onSolve, onFail, onInvalid };
  });

  const eliminated = useMemo(() => eliminatedLetters(history), [history]);

  const type = useCallback(
    (ch: string) => {
      if (status !== "playing") return;
      setError("");
      setCurrent((c) => (c.length < WORD_LENGTH ? c + ch.toUpperCase() : c));
    },
    [status],
  );

  const back = useCallback(() => {
    setError("");
    setCurrent((c) => c.slice(0, -1));
  }, []);

  const submit = useCallback(() => {
    if (status !== "playing") return;
    const v = validateGuess(current);
    if (!v.ok) {
      setError(v.message);
      callbacks.current.onInvalid?.(v.message);
      return;
    }
    const guess = current.toUpperCase();
    const next = [...history, { guess, ...scoreGuess(secret, guess) }];
    setHistory(next);
    setCurrent("");
    setError("");
    if (guess === secret) {
      setStatus("won");
      callbacks.current.onSolve?.({ word: secret, attempts: next.length, history: next });
    } else if (next.length >= maxAttempts) {
      setStatus("lost");
      callbacks.current.onFail?.({ word: secret, history: next });
    }
  }, [status, current, history, secret, maxAttempts]);

  const toggleCross = useCallback((ch: string) => {
    setCrossed((s) => {
      const n = new Set(s);
      if (n.has(ch)) n.delete(ch);
      else n.add(ch);
      return n;
    });
  }, []);

  const tapKey = useCallback((ch: string) => (noteMode ? toggleCross(ch) : type(ch)), [noteMode, toggleCross, type]);

  const playAgain = useCallback(() => {
    setSecret(pickSecret());
    setHistory([]);
    setCurrent("");
    setError("");
    setStatus("playing");
    setCrossed(new Set());
    setNoteMode(false);
  }, []);

  useEffect(() => {
    if (!keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('input, textarea, [contenteditable="true"]')) return;
      if (e.key === "Enter") {
        if (t?.closest?.("button")) return;
        e.preventDefault();
        submit();
      } else if (e.key === "Backspace") back();
      else if (/^[a-zA-Z]$/.test(e.key)) type(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboard, submit, back, type]);

  return {
    secret,
    history,
    current,
    error,
    status,
    attemptsLeft: maxAttempts - history.length,
    maxAttempts,
    wordLength: WORD_LENGTH,
    eliminated,
    crossed,
    noteMode,
    type,
    back,
    submit,
    tapKey,
    toggleCross,
    setNoteMode,
    playAgain,
  };
}
