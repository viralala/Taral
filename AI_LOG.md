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

- [x] Problem statement (saved in context.md)
- [x] Puzzle 1: Cows & Bulls
- [ ] Puzzle 2: Puzzle Passwords (design pending)
- [ ] Puzzle 3: CAPTCHA (design pending)
- [ ] Hook the puzzles into Viral's story scenes
