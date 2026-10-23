import { LEVELS } from "@/lib/story";
import Trial1 from "./trial1";
import Trial2 from "./trial2";
import Trial3 from "./trial3";
import type { TrialComponent } from "./types";

export type { TrialComponent, TrialProps, TrialResult } from "./types";

/**
 * The three trials of the story. "/" plays them in order; "/level/n" is the practice route.
 * To swap a game, edit that trial's file only. See TRIALS.md.
 */
export const TRIALS: Record<1 | 2 | 3, { name: string; Component: TrialComponent; owner: string }> = {
  1: { name: LEVELS[1].name, Component: Trial1, owner: "Viral" },
  2: { name: LEVELS[2].name, Component: Trial2, owner: "Tana" },
  3: { name: LEVELS[3].name, Component: Trial3, owner: "Tana" },
};
