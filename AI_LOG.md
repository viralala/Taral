# AI_LOG

A running record of the prompts, tools and decisions behind the Taral project.

---

## 01. Set up the project

**Tool:** Claude Code (Claude Haiku 5.5)

**Prompt:**
> Make a repo named Taral, public, kept empty for now. Give Tana-38 collaborator access and link it to Vercel. We are in a puzzle building hackathon judged on prompts and vibe coding, so we need to showcase the repo and AI_LOG.md.

> Use cool AI tools for the hackathon. If you need a connector, ask me. Keep a clean AI_LOG.md with 5 to 6 polished prompts, and refine them each time so the log reads well.

**What happened:** Created the empty public repo, added the collaborator and started the Vercel link. The project context went into a standing `context.md` so every new chat starts with the same rules, including this one: AI_LOG.md holds a small, curated set of entries, revised as the project moves.

**Takeaway:** Put the rules in a file the agent reads first. Consistency across sessions beats re-explaining, and a log only helps judges if it is curated, not a raw dump.

---

## 02. Choose the problem statement

**Tool:** Claude Code (Claude Haiku 5.5), with a screenshot of the four problem cards

**Prompt:**
> Here are the four problem statements. Choose the best one and make it unimaginably fun, advanced and polished.

**What happened:** Chose 01, Reimagine CAPTCHA. It is the most interactive of the four and the easiest to demo live. Puzzle Passwords is the runner-up. The PDF brief has not been read yet, so the choice is provisional.

**Takeaway:** A strong pick comes from the demo test: can a judge play with it in 30 seconds? Check the brief before committing.

---

## 03. Plan with Opus, build with a Sonnet squad

**Tool:** Claude Code (Opus 5.5 planner → 3 parallel Sonnet 5.5 agents), Supabase MCP

**Prompt:**
> Make a storytelling game with 3 levels, one per problem statement, for Open Innovation. Frontend like 2019.makemepulse.com (parallax, 3D, interactive) in a groovy pastel flower style. Fun: rick-roll QR, light ragebait, mogging, puns, then something deep, then motivation. I own the CAPTCHA level and the frontend; my partner builds levels 2 and 3. Next.js + Supabase. Plan with Opus, implement with Sonnet, fan out agents, make it fast.

**What happened:** Opus wrote the story (a burnt-out bot, CAPT. CHA, guards three gates), the design tokens, a shared cursor and smooth-scroll layer, the Supabase `runs` table with RLS, and `web/PLAN.md` with strict file ownership per agent. Three Sonnet agents then built the WebGL landing, the CAPTCHA game (6 challenge types, random 4 per run) and the fun shell (rick-roll QR, idle heckler, leaderboard, placeholder slots for levels 2 and 3) at the same time.

**Takeaway:** Parallel agents only work when the plan draws hard file boundaries and fixes the shared interfaces first.

---

## 04. Turn it into a fairytale, with a real narrator

**Tool:** Claude Code (Opus 5.5 lead, Opus builders), ElevenLabs connector, Kaizen by makemepulse as the visual reference

**Prompt:**
> Integrate a short fairytale: a prince and princess in the kingdom of MIT-WPU, King Rudra refuses the marriage, a hooded figure kidnaps the princess, a note says "Solve the three trials and find me." Seven-scene opening cinematic, three trials, an ending, Play Again. Ask the player for their name and their partner's name. Narrate it with ElevenLabs, add music where nobody is talking, and match kaizen.makemepulse.com.

**What happened:** The lead studied Kaizen live (loader, word-by-word underlined captions, painterly brush-stroke scenes, cream and navy UI) and wrote the script so the narrator never says a name, which lets any couple star in it. 14 lines were voiced with ElevenLabs ("Storyteller Mom", eleven_v4). When the API rate-limited, the last 8 lines were generated as one take and split on silence with ffmpeg. Music is a generative Web Audio score that ducks under the voice. Two Opus builders worked in parallel with strict file ownership: one on the cinematic shell and 14 painted SVG scenes, one on the trials. A dynamic workflow of four Opus reviewers then audited and fixed 21 defects.

**Takeaway:** Write narration to survive personalisation. Name-free audio plus named captions gave a custom story without generating audio per player.

---

## 05. Listen to the playtest

**Tool:** Claude Code (Opus 5.5), a two-agent dynamic workflow

**Prompt:**
> The fonts overlap on a lot of screens. Add more fun, cut the small subtext, make it concise, punny and human. Leave Trials 2 and 3 alone: Tana will add her games there, so make the code ready for that. Make everything user friendly.

**What happened:** The root cause of the overlaps was one line: the marker font had line-height 0.95, so wrapped titles collided. A small in-browser detector then checked every screen at 1024 px and 375 px for overlapping, clipped or tiny text. The trial card lost its duplicate labels and sub-lines. Trial 1 gained confetti, combo chips, a fail shake, forest puns and a new "Blink back" challenge. Trials 2 and 3 became one-file plug-in slots (`src/trials/trial2.tsx`, `trial3.tsx`) with a kit, a template and `TRIALS.md` for Tana.

**Takeaway:** Fix the cause, not the symptom. Then measure every screen instead of eyeballing a few.

---

## 06. Build puzzle 1: Cows & Bulls

**Tool:** Claude Code. Opus planned the work and set the contract. A workflow then ran three Sonnet agents: logic and UI in parallel, then an integration check.

**Prompt:**
> Puzzle with a Twist: Wordle, but break one rule, so there are no colours. Each guess only gets counts. A bull is a letter in the right place, a cow is a letter in the word but in the wrong place. If the word is TALE and the guess is BATH, that's 1 bull and 1 cow. 3 or 4 letters, no repeated letters, real words only, 10 attempts. It has to drop straight into my teammate's story frontend. I'm short on time, so make it fast.

**What happened:** Before any code was written, Opus fixed a shared contract: the exact `logic.js` exports and component props (`onSolve` and `onFail`). That let two agents build at once without colliding. A third agent ran the tests and the build, and both passed first time. A manual spot check then found real words like "BIG" being rejected, so the guess dictionary was widened from an MIT-licensed English word list, from 310 to 1,172 three-letter words and from 1,466 to 4,311 four-letter words.

**Revision, after the first playtest:**
> Only 4-letter words. If a guess gets 0 bulls and 0 cows, turn that row red and grey its letters out on the keyboard, like Wordle. Keep tap-to-cross-out. And remember my teammate is building the UI from scratch, so it has to be easy to drop into any UI.

The puzzle was split into three layers: plain JavaScript rules, a headless React hook that holds all game state, and an optional ready-made view with its own `cb-` prefixed CSS, themable through variables. Every dependency on the starter kit was removed. The "red row" is the game's single colour rule. It bends the twist (no colours) just enough to stay fair.

**Takeaway:** Parallel agents are only fast if the interface is pinned down first. Green tests are not the same as a good game: one human-style spot check caught what the tests missed. And when a teammate owns the UI, ship the logic headless and treat the visuals as an optional extra.

---

## Open items

- [x] Problem statement chosen
- [x] Read the PDF brief and confirm the must-haves
- [x] First build step: Level 1 CAPTCHA (6 challenge types, random 4 per run, pass/fail, restart)
- [x] Tana's first puzzle built: Cows & Bulls (`hackathon-kit/src/puzzles/cows-bulls/`)
- [ ] Tana: swap her games into `web/src/trials/trial2.tsx` and `trial3.tsx` (see `web/TRIALS.md`)
- [ ] Tana: design the second puzzle (Puzzle Passwords)
- [ ] Point the Vercel project at `web/` and add the Supabase env vars
