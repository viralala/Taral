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

## 03. Hold the problem statement

**Tool:** Claude Code

**Prompt:**
> I will give you the problem statement later. Keep all of this as context so every new chat uses these settings.

**What happened:** Left a placeholder in `context.md` for the problem statement, to be filled once the user shares it.

**Takeaway:** Plan for missing inputs. Reserve the slot now, fill it when it arrives.

---

## 04. Keep the repo lean

**Tool:** Claude Code

**Prompt:**
> Keep the repo empty except for AI_LOG.md. Other local folders stay out of the commit.

**What happened:** Only AI_LOG.md is tracked. Local folders and `context.md` stay on the machine.

**Takeaway:** Judges read what is in the repo. Keep it deliberate.

---

## 05. Prepare for the next round

**Tool:** Claude Code

**Prompt:**
> When the problem statement arrives, add it to context.md, update the log, and tell me what to build first.

**What happened:** Planned the hand-off so the next chat picks up the statement and the log stays current.

**Takeaway:** Write the next prompt before it is needed. The log then shows the thinking, not just the output.

---

## 06. Choose the problem statement

**Tool:** Claude Code (Claude Haiku 5.5), with a screenshot of the four problem cards

**Prompt:**
> Here are the four problem statements. Choose the best one and make it unimaginably fun, advanced and polished.

**What happened:** Chose 01, Reimagine CAPTCHA. It is the most interactive of the four and the easiest to demo live. Puzzle Passwords is the runner-up. The PDF brief has not been read yet, so the choice is provisional.

**Takeaway:** A strong pick comes from the demo test: can a judge play with it in 30 seconds? Check the brief before committing.

---

## 07. Plan with Opus, build with a Sonnet squad

**Tool:** Claude Code (Opus 5.5 planner → 3 parallel Sonnet 5.5 agents), Supabase MCP

**Prompt:**
> Make a storytelling game with 3 levels, one per problem statement, for Open Innovation. Frontend like 2019.makemepulse.com (parallax, 3D, interactive) in a groovy pastel flower style. Fun: rick-roll QR, light ragebait, mogging, puns, then something deep, then motivation. I own the CAPTCHA level and the frontend; my partner builds levels 2 and 3. Next.js + Supabase. Plan with Opus, implement with Sonnet, fan out agents, make it fast.

**What happened:** Opus wrote the story (a burnt-out bot, CAPT. CHA, guards three gates), the design tokens, a shared cursor and smooth-scroll layer, the Supabase `runs` table with RLS, and `web/PLAN.md` with strict file ownership per agent. Three Sonnet agents then built the WebGL landing, the CAPTCHA game (6 challenge types, random 4 per run) and the fun shell (rick-roll QR, idle heckler, leaderboard, placeholder slots for levels 2 and 3) at the same time.

**Takeaway:** Parallel agents only work when the plan draws hard file boundaries and fixes the shared interfaces first.

---

## Open items

- [x] Problem statement chosen
- [x] Read the PDF brief and confirm the must-haves
- [x] First build step: Level 1 CAPTCHA (6 challenge types, random 4 per run, pass/fail, restart)
- [ ] Partner: drop levels 2 and 3 into `web/src/app/level/[n]/page.tsx`
- [ ] Point the Vercel project at `web/` and add the Supabase env vars
