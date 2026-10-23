# AI_LOG

The prompts, tools and decisions behind **Taral: The Three Trials**, in the order we made them. Each entry has the prompt we typed (lightly trimmed for length), what the AI did with it, and what we took away. Where a result was only partly good, we say so.

**Tools at a glance**

| Tool | Used for |
| --- | --- |
| Claude Code, Opus 5.5 | Planning the story, design system and build plan; leading the redesign; reviewing |
| Claude Code, Sonnet 5.5 (3 parallel agents) | First build of the landing, the CAPTCHA game and the fun shell |
| Claude Code, Haiku 5.5 | Repo setup and light housekeeping |
| ElevenLabs connector | Voicing the 14 narration lines |
| Supabase MCP | Creating the `runs` table and its security policies |
| Vercel | Hosting, auto-deploy from `main` |
| Reference sites | 2019.makemepulse.com and kaizen.makemepulse.com for motion and look |

---

## 01. Set up the repo and the ground rules

**Tool:** Claude Code (Haiku 5.5)

**Prompt:**
> Make a repo called Taral, public, and keep it empty for now. Add Tana-38 as a collaborator and link it to Vercel. It's a puzzle hackathon judged on prompts and vibe coding, so the repo and AI_LOG.md are what we'll be showing. Use cool AI tools where they help, and ask me before you set up any connector.

**What happened:** The repo, the collaborator invite and the Vercel link were done in one go. We also wrote a short standing context file with the event rules, so that every new chat started from the same page.

**What we learned:** Rules written in a file beat rules repeated in chat. Every later session stayed consistent because of it.

---

## 02. Pick the problem statement

**Tool:** Claude Code (Haiku 5.5), with a photo of the four problem cards

**Prompt:**
> These are the four problem statements. Which one is best for us? Whatever we pick, I want it to be properly fun and polished, not a quick demo.

**What happened:** It picked **01, Reimagine CAPTCHA** and gave its reasoning: it is the easiest to play in front of a judge, and it has the most room for surprise. Puzzle Passwords was the runner-up. We then read the PDF brief ourselves and confirmed the must-haves: clear pass or fail, under 30 seconds per challenge, runs in the browser, restart without reloading, and at least three challenge types.

**What we learned:** We tested the idea with one question, "can a judge play this in 30 seconds?", and then checked it against the brief before building anything. Puzzle Passwords was not wasted: its riddle-and-password idea became the Bridge of Insight trial.

---

## 03. Plan with Opus, build with a Sonnet squad

**Tool:** Claude Code (Opus 5.5 as planner, then 3 parallel Sonnet 5.5 agents), Supabase MCP

**Prompt:**
> Let's make a storytelling game with three levels, one for each problem statement, for Open Innovation. I want the frontend to feel like 2019.makemepulse.com: parallax, 3D, interactive, in a groovy pastel flower style. Mix in some fun: a rick-roll QR, a bit of ragebait, puns, then something deep, then something motivating. I'm doing the CAPTCHA level and the frontend, and my partner is doing levels 2 and 3. Use Next.js and Supabase. Plan with Opus, build with Sonnet, run agents in parallel and make it quick.

**What happened:** Opus wrote the story (a burnt-out bot called CAPT. CHA guards three gates), the colour and type tokens, the `runs` table with row-level security, and a build plan that gave each agent its own set of files. Three Sonnet agents then built, at the same time: the WebGL landing page, the CAPTCHA game (6 challenge types, 4 drawn at random per run), and the fun shell (rick-roll QR, an idle heckler, the leaderboard).

**What we learned:** Parallel agents only work if the plan fixes the shared interfaces first and says who owns which file. Without that they overwrite each other.

---

## 04. Turn it into a fairytale with a real narrator

**Tool:** Claude Code (Opus 5.5 lead plus Opus builders), ElevenLabs connector, kaizen.makemepulse.com as the visual reference

**Prompt:**
> I want a short fairytale in the game. A prince and princess in the kingdom of MIT-WPU. King Rudra refuses the marriage, a hooded figure kidnaps the princess, and the note says "Solve the three trials and find me." Give me a seven-scene opening, then the three trials, then an ending and a Play Again button. Ask the player for their own name and their partner's name. Narrate it with ElevenLabs, put music wherever nobody is talking, and make it look like kaizen.makemepulse.com.

**What happened:** The lead studied Kaizen (loader, captions that reveal word by word with the current word underlined, painterly scenes, cream and navy UI) and wrote the script so the narrator never says a name. That means any couple can star in it. 14 lines were voiced with the "Storyteller Mom" voice. When the API rate-limited us, the last 8 lines were generated as one long take and cut apart on silences with ffmpeg. The music is generated live with the Web Audio API and ducks under the voice. Two Opus builders worked in parallel, one on the cinematic shell and its 14 painted SVG scenes, the other on the trials. A four-agent review workflow then found and fixed 21 defects.

**What we learned:** Write narration so it survives personalisation. Audio with no names plus captions with names gave a custom story without generating audio for each player.

---

## 05. Listen to the playtest

**Tool:** Claude Code (Opus 5.5), a two-agent workflow

**Prompt:**
> The text overlaps on a lot of screens, please fix that. Add more fun, but cut the small subtext so it's short, punny and sounds like a person wrote it. Leave Trials 2 and 3 alone, because Tana will add her games there, so just make the code ready for her to plug them in. Make everything easy to use.

**What happened:** The cause of the overlaps was one line: the marker font had a line-height of 0.95, so wrapped titles collided. After fixing it, a small in-browser checker looked at every screen at 1024 px and 375 px for overlapping, clipped or tiny text. Trial 1 gained confetti, combo chips, a shake on failure, forest puns and a new "Blink back" challenge. Trials 2 and 3 became one-file plug-in slots with a shared kit, a template and a short guide (`web/TRIALS.md`).

**What we learned:** Fix the cause, not the symptom, and then measure every screen instead of eyeballing a few.

---

## 06. Clean the repo and document the project

**Tool:** Claude Code (Sonnet 5.5)

**Prompt:**
> Clean the repo. Remove all the inspiration material and the hackathon kit, and keep only the main storytelling game website and AI_LOG.md. Fill in the prompts so they match the website, written so they read like we typed them ourselves, with no placeholders left. Add a good animated README with the tools we used, how we used AI and how everything is integrated, and write a script for the presentation using the workflow in the problem statement.

**What happened:** The inspiration folder, the unused Vite starter kit, the private context file and the stale build plan were removed, along with the default Next.js boilerplate. We checked that `npm run build` and `npm run lint` still passed afterwards. We added an animated README (hand-built SVGs, no external services), this log, and a timed presentation script in `PRESENTATION.md`. The database section of the README was checked against the live `runs` table so the columns and limits are real.

**What we learned:** Documentation is part of the product when the judges read the repo. Checking it against the running system keeps it honest.

---

## Where we are

- [x] Problem statement chosen and checked against the brief
- [x] Level 1 CAPTCHA game, then the full three-trial story with narration and music
- [x] Live leaderboard on Supabase
- [x] Playtest fixes and a repo clean-up
- [ ] Tana swaps her own games into `web/src/trials/trial2.tsx` and `trial3.tsx` if she wants to (the shared engine already plays full Trials 2 and 3)
