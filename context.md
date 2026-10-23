# Taral: hackathon context

Read this at the start of every new chat. These are the standing settings for this project.

## Event
- Puzzle building hackathon, judged on prompt engineering and vibe coding ability.
- Judges read the repo and AI_LOG.md. The prompts are the product as much as the code.
- Build window: 4:00 to 6:00 PM.

## Problem statement
- Theme: Puzzles. Four statements were revealed at 3:42 PM: 01 Reimagine CAPTCHA ("Prove you're human. Make it fun."), 02 Puzzle Passwords ("Your password must contain a riddle."), 03 Puzzle with a Twist ("Take a puzzle everyone knows. Break one rule."), 04 Open Innovation Puzzles ("Any puzzle. Your rules.").
- Lead statement: 01 Reimagine CAPTCHA, inside an Open Innovation story game of three trials. Tanaya's puzzles bring in statements 02 and 03.
- Brief: `D:\Study SY\Taral\pixathon-problem-statements.pdf` (local only, not pushed). Confirmed against it.
- Mission: a playable, CAPTCHA-style challenge a human clears in under 30 seconds, that they enjoy, and that plays with what makes us human. No real security. It is a game about the idea of a CAPTCHA.
- Must-haves: clear pass/fail feedback; each challenge under 30 s; runs in the browser; restart without reloading; at least 3 challenge types or a random generator.

## Team split
- Viral: the story frontend in `web/` (Next.js + TypeScript + Supabase) and Trial 1 (CAPTCHA).
- Tanaya: the puzzles for Trials 2 and 3. The plug-in slots are `web/src/trials/trial2.tsx` and `trial3.tsx` (guide: `web/TRIALS.md`).
  - Puzzle with a Twist: Cows & Bulls (Wordle with no colours, only bull/cow counts). 4-letter words only, no repeated letters, real words only, 10 attempts. The one colour rule: a guess with 0 bulls and 0 cows turns red and its letters grey out on the keyboard. Players can also cross letters out by hand (notes). Built in `hackathon-kit/src/puzzles/cows-bulls/`, not yet wired into `web/`.
  - Puzzle Passwords: design pending.

## Puzzle contract (for integration)
- Puzzles must never depend on the hackathon-kit UI (`components/ui`, Tailwind classes, theme tokens). They plug into Viral's `web/` app.
- Each puzzle has three layers: `logic.js` (plain JS rules), `use<Puzzle>.js` (headless React hook: state and actions, no markup), and `<Puzzle>.jsx` + its own prefixed CSS file (ready-made view, themable through CSS variables).
- Every puzzle component takes `onSolve(result)` and `onFail(result)` and needs no router, auth or API. In `web/`, the trial file wraps it and maps `onSolve` to `onComplete({ level, passed, total, humanity, timeMs, cleared: true })`.

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
