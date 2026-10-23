export type Mood = "smug" | "shocked" | "crying" | "proud";
export type Res = { pass: boolean; score: number; quip: string; mood: Mood; note?: string };
export type CProps = { finish: (r: Res) => void; say: (t: string, m?: Mood) => void };

export type Level = 1 | 2 | 3;
export type Def = {
  id: string;
  title: string;      // .marker heading
  prompt: string;     // one-line instruction
  flavour?: string;   // optional story line (not rendered; kept for trial authors)
  intro: string;      // what THE HOODED VOICE says when it starts
  limit: number;      // seconds, <= 30
  Comp: (p: CProps) => React.ReactElement;
};

export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
export const shuffle = <T,>(a: readonly T[]): T[] => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
export const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

export function lev(a: string, b: string) {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/* Shared Tailwind snippets for challenge UIs (paper card, navy ink). */
export const tile =
  "rounded-[14px_18px_12px_16px/16px_12px_18px_14px] border-2 border-navy/80 bg-paper-2/60 text-navy transition active:scale-95";
export const choice =
  "hand w-full rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy/80 bg-paper px-4 py-3 text-left text-base leading-tight text-navy transition hover:-rotate-[0.6deg] hover:bg-mint/60 active:scale-[0.98] sm:text-lg";
export const field =
  "w-full rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy bg-white/70 px-4 py-3 text-lg text-ink outline-none focus:bg-white focus:shadow-[0_0_0_3px_var(--lime)]";
