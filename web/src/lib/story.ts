// The whole storyline in one place. Narration audio never says the heroes' names
// (players type their own), so `say` is name-free and `caption` may use {hero} / {love}.
// Audio files live in /public/audio/<id>.mp3 and were generated with ElevenLabs (eleven_v4, "Storyteller Mom").

export type SceneArt =
  | "kingdom" | "meet" | "king" | "taken" | "note" | "montage" | "glimpse"
  | "forest" | "bridge" | "door"
  | "rescue" | "reveal" | "blessing" | "reunion";

export type Line = {
  id: string;          // audio file id
  art: SceneArt;       // which painted scene to show
  caption: string;     // on-screen text, word-revealed
  say: string;         // exact prompt sent to TTS (with audio tags)
  title?: string;      // optional big hand-drawn title card
  hold?: number;       // fallback duration in ms when audio is off or missing
};

export const INTRO: Line[] = [
  {
    id: "intro-1", art: "kingdom", title: "MIT-WPU",
    caption: "Once upon a time, in the kingdom of MIT-WPU, the great Pixathon of Insight AI lit up every tower.",
    say: "Once upon a time, in the kingdom of MIT-WPU… the great Pixathon of Insight AI lit up every tower.",
  },
  {
    id: "intro-2", art: "meet", title: "{hero} & {love}",
    caption: "Beneath the cherry blossom tree, two hearts met, and for a moment, even the petals forgot to fall.",
    say: "[warmly] Beneath the cherry blossom tree, two hearts met… and for a moment, even the petals forgot to fall.",
  },
  {
    id: "intro-3", art: "king", title: "King Rudra",
    caption: "But King Rudra had other plans. “This match,” he thundered, “will never be.”",
    say: "[dramatically] But King Rudra had other plans. [short pause] “This match,” he thundered, “will NEVER be.”",
  },
  {
    id: "intro-4", art: "taken",
    caption: "Then, one moonless night, a hooded figure slipped through the gardens, and {love} was gone.",
    say: "[nervous] Then, one moonless night, a hooded figure slipped through the gardens… and the one they loved was gone.",
  },
  {
    id: "intro-5", art: "note",
    caption: "Only a note remained. “Solve the three trials and find me.”",
    say: "[whispers] Only a note remained. [softly] “Solve the three trials… and find me.”",
  },
  {
    id: "intro-6", art: "montage",
    caption: "The Forest of Clues. The Bridge of Insight. And the Final Challenge.",
    say: "[excited] The Forest of Clues. The Bridge of Insight. And the Final Challenge.",
  },
  {
    id: "intro-7", art: "glimpse",
    caption: "Three trials stand between two hearts, and a love worth every puzzle.",
    say: "[warmly] Three trials stand between two hearts… and a love worth every puzzle.",
  },
];

export const LEVEL_INTRO: Record<1 | 2 | 3, Line> = {
  1: {
    id: "level-1", art: "forest", title: "The Forest of Clues",
    caption: "Here, the trees watch you back. Look closely. Only a human eye sees what truly matters.",
    say: "[curious] The Forest of Clues. Here, the trees watch you back. [short pause] Look closely… only a human eye sees what truly matters.",
  },
  2: {
    id: "level-2", art: "bridge", title: "The Bridge of Insight",
    caption: "Every plank is a riddle. Think wrong, and you take the scenic route. Down.",
    say: "[mischievously] The Bridge of Insight. Every plank is a riddle. [short pause] Think wrong… and you take the scenic route. Down.",
  },
  3: {
    id: "level-3", art: "door", title: "The Final Challenge",
    caption: "Behind this door lies the truth. Prove your heart is human, one last time.",
    say: "[dramatically] The Final Challenge. Behind this door lies the truth. [softly] Prove your heart is human… one last time.",
  },
};

export const ENDING: Line[] = [
  {
    id: "end-1", art: "rescue",
    caption: "The last lock broke, and there, at last, {hero} and {love} were together again.",
    say: "[breathless] The last lock broke… and there, at last, they were together again.",
  },
  {
    id: "end-2", art: "reveal", title: "Unmasked",
    caption: "And the hooded figure? The royal CAPTCHA, CAPT. CHA, who only wanted to find one truly human heart.",
    say: "[surprised] And the hooded figure? [short pause] [chuckles] The royal CAPTCHA, Captain Cha… who only wanted to find one truly human heart.",
  },
  {
    id: "end-3", art: "blessing",
    caption: "King Rudra bowed his head. “Anyone who solves every trial for love has my blessing.”",
    say: "[warmly] King Rudra bowed his head. “Anyone who solves every trial for love,” he said, “has my blessing.”",
  },
  {
    id: "end-4", art: "reunion", title: "The End",
    caption: "And beneath the cherry blossoms, where it all began, the petals finally fell again.",
    say: "[softly] And beneath the cherry blossoms, where it all began… the petals finally fell again. [pause] The end.",
  },
];

export const LEVELS = {
  1: { name: "The Forest of Clues", kind: "Observation", clue: "The note smells of cherry blossom and printer ink." },
  2: { name: "The Bridge of Insight", kind: "Riddles", clue: "The figure wore a cloak stitched with tiny traffic lights." },
  3: { name: "The Final Challenge", kind: "The truth", clue: "Every lock in this tower asks the same question: are you human?" },
} as const;

export function fill(text: string, hero: string, love: string) {
  return text.replaceAll("{hero}", hero || "the hero").replaceAll("{love}", love || "their beloved");
}
