"use client";
/* ============================================================================
 * TRIAL 2 · The Bridge of Insight
 *
 * Ships with the shared CAPTCHA engine (riddles, passwords, ciphers). To use a
 * custom game instead, replace the default export and call
 * props.onComplete({...}) when the player clears it.
 *
 *   - Shape of the result: see TrialResult in ./types.ts (and TRIALS.md).
 *   - Theme pieces ready to use: import from "./kit".
 *   - A small working example to copy: ./TemplateTrial.tsx
 *   - Nothing else needs to change. The story and /level/2 pick this file up.
 * ========================================================================== */
import LevelGame from "@/components/game/LevelGame";
import type { TrialProps } from "./types";

export default function Trial2({ onComplete, standalone }: TrialProps) {
  return <LevelGame level={2} onComplete={onComplete} standalone={standalone} />;
}
