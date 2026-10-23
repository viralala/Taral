# TARAL — The Three Trials (v2 spec, Opus)

A fairytale CAPTCHA adventure for Pixathon by Insight AI, set in the kingdom of MIT-WPU.
The player types their own name and their partner's name; the story stars them.
Visual and motion language follows **kaizen.makemepulse.com** (Awwwards): painterly brush-stroke scenes,
deep indigo → violet → peach skies, cream paper `#EFEAD7` + navy `#003C74` UI, hand-lettered UPPERCASE captions
that reveal word by word with the active word underlined, a loader percentage, "CLICK TO START", sound bars
top-right, "SKIP" bottom-right, chapter cards ("FIRST ACT"), film grain, a creature the cursor guides.

## Story (source of truth: `src/lib/story.ts`)
INTRO (7 narrated lines) → Level 1 Forest of Clues → Level 2 Bridge of Insight → Level 3 Final Challenge →
ENDING (4 narrated lines: rescue, reveal that the hooded kidnapper was CAPT. CHA the royal CAPTCHA, King Rudra's
blessing, reunion under the cherry blossoms) → completion screen with Play Again.
Narration audio never says names; captions/title cards use `fill(text, hero, love)`.

## Shared modules (DONE — import, never rewrite)
- `src/lib/story.ts` — INTRO, LEVEL_INTRO, ENDING, LEVELS, `fill()`, `SceneArt` union.
- `src/lib/audio.ts` — `unlockAudio()`, `music.start/setMood/stop`, `narrate(id, text, onProgress) → {done, cancel}`,
  `stopNarration()`, `sfx("pass"|"fail"|"click"|"tick"|"whoosh"|"chime")`, `setMuted/isMuted/onMuted/loadMutedPref`.
  Moods: night, blossom, forest, bridge, tower, joy.
- `src/lib/player.tsx` — `usePlayer() → { player: {hero, love, heroTitle, loveTitle}, setPlayer }`, `styled(name, title, fallback)`.
- `src/lib/supabase.ts` — `saveRun({name, level, humanity, time_ms, verdict})`, `topRuns(level, n)`.
- `src/app/globals.css` — tokens: paper, paper-2, navy, ink, night, dusk, violet, peach, coral, rose, blossom, lime, leaf, mint
  (Tailwind `bg-night`, `text-navy` …). Classes: `.marker` (Permanent Marker titles), `.hand` (Patrick Hand SC uppercase),
  `.scribble` underline, `.btn-paint` (lime blob button), `.btn-ghost`, `.paper-card`, keyframes drift/sway/petal-fall/twinkle/rise/kenburns.
- `public/audio/<line id>.mp3` — ElevenLabs narration (being generated; code must work if a file is missing: narrate() falls back to a timer).

## Contract between the two builders
`src/components/game/LevelGame.tsx` (Builder B) default export:
```ts
type LevelResult = { level: 1|2|3; passed: number; total: number; humanity: number; timeMs: number; cleared: boolean };
export default function LevelGame(props: {
  level: 1 | 2 | 3;
  onComplete?: (r: LevelResult) => void; // quest mode: called when the level is CLEARED (player may retry inside)
  standalone?: boolean;                    // /level/[n] practice mode: shows its own result screen + restart
}): JSX.Element
export type { LevelResult }
```
Each level = 3 challenges drawn at random from that level's pool. Cleared = at least 2 of 3 passed. If not cleared,
LevelGame shows a "The path closes. Try again" retry (new random draw) — no reload. Every challenge ≤ 30 s with a
visible timer, immediate PASS/FAIL stamp + sfx, and a story clue line.

## Builder A — story shell + cinematics (files: `src/app/page.tsx`, `src/components/story/*`, `src/components/Cursor.tsx`,
delete `src/components/home/*`, `src/components/SmoothScroll.tsx`, `src/components/Flower.tsx` only if nothing imports it)
Single-page quest state machine at `/`:
1. **Loader**: night bg, three painted dots, "A TARAL PRODUCTION · PIXATHON BY INSIGHT AI", counting % (preload the 14 mp3s
   with fetch, cap wait ~4 s), then "CLICK TO START" → `unlockAudio()`, `music.start("night")`.
2. **Names**: "WHO ARE YOU, TRAVELLER?" — your name + title (Prince / Princess / Royal), partner's name + title. Required,
   ≤ 16 chars, prefilled from usePlayer. Painted lime button "ONCE UPON A TIME →".
3. **Intro cinematic**: 7 INTRO lines. Each line = full-screen painted scene (`<Scene art=…/>`) + optional title card
   (`.marker`, fill names) + Kaizen caption (bottom-center, `.hand`, words appear one by one driven by narrate progress,
   current word underlined, upcoming words faint). Crossfade between scenes (~700 ms). Music moods: kingdom/meet→blossom,
   king/taken/note→night, montage/glimpse→joy. SKIP bottom-right skips the whole cinematic. Click anywhere advances a line.
   Ends with a big **BEGIN YOUR QUEST** button.
4. For each level 1..3: **chapter card** ("FIRST TRIAL"/"SECOND TRIAL"/"FINAL TRIAL" + level name) then LEVEL_INTRO line
   narrated over its scene (forest/bridge/door), then `<LevelGame level={n} onComplete=…/>` over a dimmed version of the
   scene, music mood forest/bridge/tower. Top HUD: level name, 3 progress petals for levels, sound toggle.
   After clearing: short interstitial with the level's `LEVELS[n].clue` ("CLUE FOUND") and Continue.
5. **Ending cinematic**: 4 ENDING lines, mood joy; then **completion screen**: "{hero} & {love} lived puzzlingly ever after",
   total humanity % (avg of levels), time, save to leaderboard (name = hero, level 3 row), link to /leaderboard,
   **PLAY AGAIN** (resets to intro, keeps names; also "change names").
Persistent UI (all phases after start): sound bars toggle top-right (animated bars, `setMuted`), SKIP during cinematics.
Painted scenes (`src/components/story/Scene.tsx` + art files): SVG, painterly — wobbly shapes run through an
`feTurbulence + feDisplacementMap` filter, layered brush strokes, grain, slow CSS drift/kenburns parallax driven by
pointer (CSS vars), falling cherry petals. Required arts: kingdom (castle towers on MIT-WPU hill under violet dusk, lanterns,
banner "PIXATHON"), meet (cherry tree, two silhouettes, petals), king (crown silhouette, red/coral sky, throne),
taken (moonless night, hooded figure carrying someone away), note (paper note close-up, handwriting "Solve the three
trials and find me."), montage (three panels: forest / bridge / door), glimpse (two silhouettes under blossoms, soft
focus), forest (deep green/teal trees with eyes glinting), bridge (rope bridge over violet chasm, mist), door (tower door
with three locks, torchlight), rescue (door open, light pours out), reveal (hood falls: CAPT. CHA flower-face bot,
sheepish), blessing (king lowering crown/hand, warm peach), reunion (cherry tree, petals falling, sunrise).
Silhouettes are simple, elegant, no faces needed. Cursor: a glowing blossom petal/firefly with a painted petal trail
(Kaizen's guided bird), grows over `[data-cursor]`.

## Builder B — gameplay (files: `src/components/game/*`, `src/app/level/**`, `src/app/leaderboard/page.tsx`,
`src/app/not-found.tsx`, `src/components/fun/*`)
- Refactor the Level 1 engine into `LevelGame` per the contract. Keep ALL six existing CAPTCHA mechanics working.
- Level 1 Forest of Clues (observation/visual) pool: feelings grid (reskin: "select every square that hides a clue"
  keep traffic-light trap), circle ("draw the moon over the forest"), runaway checkbox ("catch the firefly checkbox"),
  hold ("hold your breath for exactly 3 s while the owl watches"), plus NEW "spot the odd one" (5×5 grid of forest
  emoji/glyphs, one differs subtly) and NEW "pattern path" (sequence of glyphs — pick what comes next).
- Level 2 Bridge of Insight (riddles/reasoning, PS 02 Puzzle Passwords) pool, all NEW: riddle plank (random from ≥ 8
  short riddles, 4 choices), password riddler (build a password meeting live rules incl. one containing a riddle
  answer, rules tick as you type), cipher plank (Caesar-shifted short word with shift hint), odd logic (which statement
  is false), typo sentence (existing typo mechanic reskinned: "the troll only lets imperfect spellers cross").
- Level 3 Final Challenge pool (PS 03 / finale): memory lock (show 4 glyphs 3 s, then pick them in order), clue lock
  (combination from the three LEVELS clues — e.g. which item appeared in the note: blossom / ink / traffic lights),
  mobile rick-roll verify (existing), "are you human?" confession (choose the most human answer among robotic ones),
  plus hold (existing) reskinned as "turn the final key for exactly 3 s".
- Each challenge: title, 1-line prompt, story flavour line (CAPT. CHA's voice becomes the mysterious "Hooded Voice"
  in quest mode? NO — keep CAPT. CHA as the warden who heckles; the reveal at the end is that he is the kidnapper,
  so in levels show him as a hooded flower silhouette called "THE HOODED VOICE" with his same funny quips).
- Restyle game UI to the Kaizen theme: paper-card on dark painted background, navy ink, `.hand` labels, `.marker`
  titles, `.btn-paint` buttons, lime/coral PASS/FAIL stamps, timer as a brush-stroke bar. Use `sfx()` on pass/fail/clicks.
- `/level/[n]` (n = 1,2,3) = standalone practice using LevelGame standalone, with a link "Play the full story" → `/`.
  Remove `src/app/level/1` folder (merge into `[n]`), generateStaticParams 1..3.
- Restyle leaderboard + not-found + fun components to the new theme (remove RageToast/Marquee if unused).
- Works with touch, ≤ 30 s per challenge, mobile layout ≥ 360 px wide.

## Done =
`npm run build` passes (lint + types). Do NOT run `npm run dev`/`next dev`; do NOT run `npm run build` while the other
builder might be building — use `npx tsc --noEmit` for checks; the lead runs the final build.
