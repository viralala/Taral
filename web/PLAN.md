# TARAL — "Are You Even Human?"  (build spec, written by Opus, implemented by Sonnet agents)

Open Innovation submission. A 3-level story game; each level is one hackathon problem statement.
- Level 1 — **The CAPTCHA That Judges You Back** (PS 01 Reimagine CAPTCHA) — built here.
- Level 2 — **The Password Riddler** (PS 02 Puzzle Passwords) — partner's game, slot only.
- Level 3 — **The Final Puzzle** (PS 03) — partner's game, slot only.

## Story
You wake up inside the internet. A tired, dramatic security bot named **CAPT. CHA** (a CAPTCHA with
20 years of clicking-traffic-lights trauma) blocks the exit: "Nobody leaves until they prove they're human."
Each level is a gate. Between gates CAPT. CHA monologues: ragebait → mogging → existential crisis → motivation.
The ending flips it: "Being human was never about passing. It was about trying anyway." Humanity score saved to Supabase.

## Visual direction (ref: 2019.makemepulse.com + user's groovy pastel flower images)
- Cream paper bg, blush 5-petal blob flowers outlined in cocoa, thin pink asterisk flowers, sky/blush pill tags,
  Fraunces wonky serif display, Space Grotesk body, Caveat for handwritten asides.
- Makemepulse vibes: full-viewport WebGL hero with floating 3D objects reacting to mouse (parallax), scroll-driven
  chapter reveals, giant serif text that splits/masks in, custom cursor (done), sticky "chapter" transitions,
  "hold to enter" interaction to start. Keep theme elements SPARSE — lots of cream breathing room.
- Tokens already in `src/app/globals.css` (Tailwind: bg-cream, text-cocoa, bg-blush, bg-sky, bg-butter, bg-sage,
  text-ink, bg-night, font-display via `.display`, `.hand`, `.pill`). Components: `@/components/Flower`
  (BlobFlower, StarFlower), cursor labels via `data-cursor="play"` attribute on any element.
- Libraries installed: framer-motion, three, @react-three/fiber, @react-three/drei, lenis (already global),
  qrcode.react, canvas-confetti, @supabase/supabase-js (`@/lib/supabase`: saveRun, topRuns).

## Tone (all copy)
Funny puns, similes, metaphors, light ragebait ("This button is load-bearing for your ego"), mogging
("CAPT. CHA has solved 4 billion CAPTCHAs. You have solved your sleep schedule 0 times."), then sudden deep
one-liners ("A robot never doubts. That's why you're winning."), ending in motivation. Never mean-spirited.
Rick-roll QR appears at least twice (hero "scan to skip the CAPTCHA" and in-game "verify via mobile").
QR value: https://www.youtube.com/watch?v=dQw4w9WgXcQ

## Routes / ownership (agents must only touch their own files)
| Agent | Files |
|---|---|
| A — Landing | `src/app/page.tsx`, `src/components/home/*` |
| B — CAPTCHA game | `src/app/level/1/page.tsx`, `src/components/game/*` |
| C — Fun + shell | `src/app/level/[n]/page.tsx` (levels 2,3 placeholders), `src/app/leaderboard/page.tsx`, `src/app/not-found.tsx`, `src/components/fun/*` (RickQR, Ragebait toast, Marquee, Nav, Footer) |

Shared (read-only for agents): `globals.css`, `layout.tsx`, `Cursor.tsx`, `Flower.tsx`, `supabase.ts`.
Agent A imports `Nav`/`Footer`/`RickQR`/`Marquee` from `@/components/fun` — Agent C must export exactly:
`export { default as Nav } ...`, `Footer`, `RickQR` (props: `{ size?: number; caption?: string }`), `Marquee` (props: `{ items: string[] }`),
`RageToast` (mount once, randomly heckles idle users after ~12s idle).

## Level 1 game spec (Agent B)
- Start screen → 4 random challenges from a pool of 6 (generator) → result screen. Each challenge has a visible
  timer (max 20–30 s), clear PASS/FAIL feedback (stamp animation + CAPT. CHA quip), and a "Try again" restart
  without reload. Score = humanity % (avg across challenges, failing gives partial). Name input → saveRun level 1.
- Challenge pool:
  1. **Draw a circle** — canvas; robots draw perfect circles. Pass if circularity error is between 4% and 30%
     ("too perfect = robot", "too wobbly = abstract art"). Show score.
  2. **Select all squares with feelings** — 3x3 grid of emoji/situations (e.g. "Monday 9am", "Last slice of pizza",
     "Unread 'we need to talk'", "a traffic light"). Correct = the emotionally loaded ones; traffic light is the trap
     ("CAPT. CHA: 'I have seen 10 million traffic lights. They feel nothing. Neither do I.'").
  3. **The Runaway Checkbox** — "I'm not a robot" checkbox that flees the cursor; gets tired after enough attempts
     (humans are stubborn). Pass if clicked before timer.
  4. **Type it with a typo** — "Type: I am definitely a human" — must contain exactly 1–3 typos (Levenshtein).
     Perfect typing fails ("suspiciously accurate").
  5. **Hold for exactly 3 seconds** — while thinking about your ex. Pass within ±0.4 s; robots are too precise
     (±0.02 s also fails, lol).
  6. **Verify via mobile** — rick-roll QR + 3 fake buttons; the honest answer "I got rick-rolled" passes.
- CAPT. CHA character: a floating SVG/CSS face (round blush flower with eyes that follow cursor) with speech
  bubble; moods: smug, shocked, crying, proud.
- After result: confetti on pass, "Proceed to Level 2 →" link (`/level/2`), leaderboard top 5 via topRuns(1).

## Done
`npm run build` passes with no type errors.
