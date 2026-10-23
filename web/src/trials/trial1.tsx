"use client";
// TRIAL 1 · The Forest of Clues (Viral). Uses the shared CAPTCHA LevelGame.
import LevelGame from "@/components/game/LevelGame";
import type { TrialProps } from "./types";

export default function Trial1({ onComplete, standalone }: TrialProps) {
  return <LevelGame level={1} onComplete={onComplete} standalone={standalone} />;
}
