import type { ComponentType } from "react";
import type { LevelResult } from "@/components/game/LevelGame";

/** What a trial hands back when the player clears it. */
export type TrialResult = LevelResult;

export type TrialProps = {
  /** Call once, when the player clears the trial. The story moves on to the clue card. */
  onComplete: (r: TrialResult) => void;
  /** true on the /level/n practice page: show your own result screen, the story is not running. */
  standalone?: boolean;
};

export type TrialComponent = ComponentType<TrialProps>;
