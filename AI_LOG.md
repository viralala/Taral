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

## Open items

- [ ] Problem statement (waiting on the user)
- [ ] First build step after the statement is in
