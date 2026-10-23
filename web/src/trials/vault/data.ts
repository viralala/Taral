/** Data for Trial 3, The Vault of the Stolen Tiara. */

export const SUSPECTS = ["Frog", "Rabbit", "Otter"] as const;
export const CULPRIT = "Rabbit";

export const CLUES = [
  "Frog spent all evening splashing in the pond.",
  "Otter was busy juggling pebbles by the river.",
  "The thief left muddy footprints with long back feet.",
  "A half-nibbled carrot was found next to the empty tiara stand.",
];

export const NUDGES = [
  "Hmm, not quite. Read the clues once more!",
  "Close, but that one has an alibi.",
  "Nope! Even detectives need a second look.",
  "Good guess, wrong animal. Try again!",
];

export type Riddle = { q: string; answers: string[] };

export const RIDDLES: Riddle[] = [
  { q: "What goes up but never comes down?", answers: ["age"] },
  { q: "What has keys but opens no locks?", answers: ["piano", "pianos", "keyboard"] },
  { q: "What gets wetter the more it dries?", answers: ["towel", "towels"] },
  { q: "What has hands but cannot clap?", answers: ["clock", "clocks", "watch"] },
  { q: "What has a face and two hands but no arms or legs?", answers: ["clock", "clocks", "watch"] },
  { q: "What has a neck but no head?", answers: ["bottle", "bottles", "shirt"] },
  { q: "What can you catch but not throw?", answers: ["cold", "colds"] },
  { q: "What has teeth but cannot bite?", answers: ["comb", "combs", "zipper"] },
  { q: "What runs but never walks?", answers: ["river", "water", "rivers", "stream"] },
  { q: "What has one eye but cannot see?", answers: ["needle", "needles"] },
  { q: "What comes down but never goes up?", answers: ["rain", "raindrop", "raindrops"] },
  { q: "What has a bed but never sleeps?", answers: ["river", "rivers"] },
];
