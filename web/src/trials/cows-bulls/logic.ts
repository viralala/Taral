// Pure game rules. No React, no DOM: usable from any UI.
import { SECRETS, GUESSES } from "./words";

export const WORD_LENGTH = 4;
export const MAX_ATTEMPTS = 10;

export type Score = { bulls: number; cows: number; miss: boolean };
export type HistoryRow = Score & { guess: string };
export type Validation = { ok: true } | { ok: false; reason: "length" | "letters" | "repeat" | "not-a-word"; message: string };

export function pickSecret(): string {
  return SECRETS[Math.floor(Math.random() * SECRETS.length)];
}

// Secret and guess have no repeated letters, so simple membership counting is exact.
export function scoreGuess(secret: string, guess: string): Score {
  const s = String(secret).toUpperCase();
  const g = String(guess).toUpperCase();
  let bulls = 0;
  let cows = 0;
  for (let i = 0; i < g.length; i++) {
    if (g[i] === s[i]) bulls++;
    else if (s.includes(g[i])) cows++;
  }
  return { bulls, cows, miss: bulls === 0 && cows === 0 };
}

// Letters proven absent: every letter of a guess that scored 0 bulls and 0 cows.
export function eliminatedLetters(history: HistoryRow[]): Set<string> {
  const out = new Set<string>();
  for (const h of history) if (h.miss) for (const c of h.guess) out.add(c);
  return out;
}

export function isWord(word: unknown): boolean {
  return GUESSES.has(String(word ?? "").toUpperCase());
}

export function validateGuess(guess: unknown): Validation {
  const g = String(guess ?? "").trim().toUpperCase();
  if (g.length !== WORD_LENGTH) {
    return { ok: false, reason: "length", message: `Use exactly ${WORD_LENGTH} letters.` };
  }
  if (!/^[A-Z]+$/.test(g)) {
    return { ok: false, reason: "letters", message: "Letters only, please." };
  }
  if (new Set(g).size !== g.length) {
    return { ok: false, reason: "repeat", message: "No repeated letters allowed." };
  }
  if (!isWord(g)) {
    return { ok: false, reason: "not-a-word", message: "That one is not in our word list." };
  }
  return { ok: true };
}
