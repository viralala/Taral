# Taral: hackathon context

Read this at the start of every new chat. These are the standing settings for this project.

## Event
- Puzzle building hackathon, judged on prompt engineering and vibe coding ability.
- Judges read the repo and AI_LOG.md. The prompts are the product as much as the code.
- Build window: 4:00 to 6:00 PM. Pick one problem statement and build it in that window.

## Problem statement
- Theme: Puzzles. Four statements were revealed at 3:42 PM. The PDF has the full brief and must-haves (not yet shared with the agent).
- Chosen: 01 Reimagine CAPTCHA ("Prove you're human. Make it fun.").
- Runner-up: 02 Puzzle Passwords ("Your password must contain a riddle.").
- Why CAPTCHA: the most demoable and interactive of the four. It gives room for AI-generated puzzles per visitor, and it suits a judge-facing live demo.
- Open: confirm against the PDF brief before building. If the brief's must-haves rule it out, switch to the runner-up.

## Repo
- Name: Taral
- Visibility: public
- Collaborator: Tana-38 (write access, invite pending acceptance)
- Linked to Vercel project `taral` (main branch, auto-deploys on push).
- Pushed: context.md, AI_LOG.md, Inspiration/, hackathon-kit/ (Vite source, no node_modules or dist).
- Not pushed: the root `.claude/` folder.
- The user will ask for a rename later. Change the GitHub repo name, the local folder reference and the Vercel project together.

## AI_LOG.md rules
- Log every meaningful prompt sent to an AI tool in this project.
- Keep 5 to 6 polished prompt entries at a time. Tweak and improve them each time they are revised, so the log reads well to judges.
- Each entry: the prompt, the model or tool used, what it produced, and what was learned or changed.
- Keep it clean, readable and honest. Never fabricate a result.

## AI tools
- Use cool AI tools where they help. Ask the user for any connector needed before setting it up.

## Git conventions
- Commit only when asked or when the step requires it.
- Commit message trailer: `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`
- PR description trailer: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- Git identity in use: Viral <viral.1251070777@vit.edu>, GitHub account viralala.

## Working rules for the agent
- Ask before any outward-facing action beyond what the user has already approved (publishing, inviting people, deleting).
- Keep AI_LOG.md updated as the project moves forward.
