# AI_LOG

A running record of the prompts, tools and decisions behind the Taral project.

---

## 01. Set up the project

**Tool:** Claude Code (Claude Haiku 5.5)

**Prompt:**
> Make a repo named Taral, public, kept empty for now. Give Tana-38 collaborator access and link it to Vercel. We are in a puzzle building hackathon judged on prompts and vibe coding, so we need to showcase the repo and AI_LOG.md.

**What happened:** Created the empty public repo, added the collaborator and started the Vercel link. The project context went into a standing `context.md` so every new chat starts with the same rules.

**Takeaway:** Put the rules in a file the agent reads first. Consistency across sessions beats re-explaining.

---

## 02. Define the working context

**Tool:** Claude Code

**Prompt:**
> Use cool AI tools for the hackathon. If you need a connector, ask me. Keep a clean AI_LOG.md with 5 to 6 polished prompts, and refine them each time so the log reads well.

**What happened:** Set the rule that AI_LOG.md holds a small set of polished prompt entries, revised as the project moves.

**Takeaway:** A log is only useful to judges if it is curated, not a raw dump.

---

## 03. Choose the problem statement

**Tool:** Claude Code (Claude Haiku 5.5), with a screenshot of the four problem cards

**Prompt:**
> Here are the four problem statements. Choose the best one and make it unimaginably fun, advanced and polished.

**What happened:** Chose 01, Reimagine CAPTCHA. It is the most interactive of the four and the easiest to demo live. Puzzle Passwords is the runner-up. The PDF brief has not been read yet, so the choice is provisional.

**Takeaway:** A strong pick comes from the demo test: can a judge play with it in 30 seconds? Check the brief before committing.

---

## 04. Plan with Opus, build with a Sonnet squad

**Tool:** Claude Code (Opus 5.5 planner → 3 parallel Sonnet 5.5 agents), Supabase MCP

**Prompt:**
> Make a storytelling game with 3 levels, one per problem statement, for Open Innovation. Frontend like 2019.makemepulse.com (parallax, 3D, interactive) in a groovy pastel flower style. Fun: rick-roll QR, light ragebait, mogging, puns, then something deep, then motivation. I own the CAPTCHA level and the frontend; my partner builds levels 2 and 3. Next.js + Supabase. Plan with Opus, implement with Sonnet, fan out agents, make it fast.

**What happened:** Opus wrote the story (a burnt-out bot, CAPT. CHA, guards three gates), the design tokens, a shared cursor and smooth-scroll layer, the Supabase `runs` table with RLS, and `web/PLAN.md` with strict file ownership per agent. Three Sonnet agents then built the WebGL landing, the CAPTCHA game (6 challenge types, random 4 per run) and the fun shell (rick-roll QR, idle heckler, leaderboard, placeholder slots for levels 2 and 3) at the same time.

**Takeaway:** Parallel agents only work when the plan draws hard file boundaries and fixes the shared interfaces first.

---

## 05. Turn it into a fairytale, with a real narrator

**Tool:** Claude Code (Opus 5.5 lead, Opus builders), ElevenLabs connector, Kaizen by makemepulse as the visual reference

**Prompt:**
> Integrate a short fairytale: a prince and princess in the kingdom of MIT-WPU, King Rudra refuses the marriage, a hooded figure kidnaps the princess, a note says "Solve the three trials and find me." Seven-scene opening cinematic, three trials, an ending, Play Again. Ask the player for their name and their partner's name. Narrate it with ElevenLabs, add music where nobody is talking, and match kaizen.makemepulse.com.

**What happened:** The lead studied Kaizen live (loader, word-by-word underlined captions, painterly brush-stroke scenes, cream and navy UI) and wrote the script so the narrator never says a name, which lets any couple star in it. 14 lines were voiced with ElevenLabs ("Storyteller Mom", eleven_v4). When the API rate-limited, the last 8 lines were generated as one take and split on silence with ffmpeg. Music is a generative Web Audio score that ducks under the voice. Two Opus builders worked in parallel with strict file ownership: one on the cinematic shell and 14 painted SVG scenes, one on the trials. A dynamic workflow of four Opus reviewers then audited and fixed 21 defects.

**Takeaway:** Write narration to survive personalisation. Name-free audio plus named captions gave a custom story without generating audio per player.

---

## 06. Listen to the playtest

**Tool:** Claude Code (Opus 5.5), a two-agent dynamic workflow

**Prompt:**
> The fonts overlap on a lot of screens. Add more fun, cut the small subtext, make it concise, punny and human. Leave Trials 2 and 3 alone: Tana will add her games there, so make the code ready for that. Make everything user friendly.

**What happened:** The root cause of the overlaps was one line: the marker font had line-height 0.95, so wrapped titles collided. A small in-browser detector then checked every screen at 1024 px and 375 px for overlapping, clipped or tiny text. The trial card lost its duplicate labels and sub-lines. Trial 1 gained confetti, combo chips, a fail shake, forest puns and a new "Blink back" challenge. Trials 2 and 3 became one-file plug-in slots (`src/trials/trial2.tsx`, `trial3.tsx`) with a kit, a template and `TRIALS.md` for Tana.

**Takeaway:** Fix the cause, not the symptom. Then measure every screen instead of eyeballing a few.

---

## Open items

- [x] Problem statement chosen
- [x] Read the PDF brief and confirm the must-haves
- [x] First build step: Level 1 CAPTCHA (6 challenge types, random 4 per run, pass/fail, restart)
- [ ] Tana: swap her games into `web/src/trials/trial2.tsx` and `trial3.tsx` (see `web/TRIALS.md`)
- [ ] Point the Vercel project at `web/` and add the Supabase env vars
