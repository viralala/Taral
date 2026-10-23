"use client";
/* ============================================================================
 * TRIAL 3 · The Final Challenge
 *
 * Ships with the shared CAPTCHA engine (memory lock, clue lock, key turn). To use a
 * custom game instead, replace the default export and call
 * props.onComplete({...}) when the player clears it.
 *
 *   - Shape of the result: see TrialResult in ./types.ts (and TRIALS.md).
 *   - Theme pieces ready to use: import from "./kit".
 *   - A small working example to copy: ./TemplateTrial.tsx
 *   - Nothing else needs to change. The story and /level/3 pick this file up.
 * ========================================================================== */
import LevelGame from "@/components/game/LevelGame";
import type { TrialProps } from "./types";

export default function Trial3({ onComplete, standalone }: TrialProps) {
  return <LevelGame level={3} onComplete={onComplete} standalone={standalone} />;
}
