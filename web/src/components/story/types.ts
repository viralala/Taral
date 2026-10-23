import type { ReactNode } from "react";

/** One parallax plane. depth 0 = sky (barely moves), 1+ = foreground (moves most). */
export type Layer = { depth: number; node: ReactNode };

export type ArtDef = {
  sky: string;          // CSS background behind all layers
  layers: Layer[];
  petals?: number;      // falling cherry petals overlay
  fireflies?: number;   // glowing drifting motes overlay
  fireflyColor?: string;
  overlay?: ReactNode;  // HTML composition instead of / on top of svg (montage)
};
