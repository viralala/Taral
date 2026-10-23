"use client";
// TRIAL 2 · The Bridge of Insight (Tana). Cows & Bulls, "Wordle with no colours".
// Game code lives in ./cows-bulls. Result contract: see ./types.ts and TRIALS.md.
import CowsBulls from "./cows-bulls/CowsBulls";
import type { TrialProps } from "./types";

export default function Trial2(props: TrialProps) {
  return <CowsBulls {...props} />;
}
