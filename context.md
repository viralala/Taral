# Taral: hackathon context

Read this at the start of every new chat. These are the standing settings for this project.

## Event
- Puzzle building hackathon, judged on prompt engineering and vibe coding ability.
- Judges read the repo and AI_LOG.md. The prompts are the product as much as the code.
- Build window: 4:00 to 6:00 PM. See "Problem statement" below.

## Problem statement
One theme, Puzzles, with 4 statements: 01 Reimagine CAPTCHA ("Prove you're human. Make it fun."), 02 Puzzle Passwords ("Your password must contain a riddle."), 03 Puzzle with a Twist ("Take a puzzle everyone knows. Break one rule."), 04 Open Innovation Puzzles ("Any puzzle. Your rules.").

Our entry mashes up all 4: a story game where a prince journeys back to his princess and solves puzzles on the way.
- Viral: storytelling frontend.
- Tanaya: the puzzles.
  1. Puzzle with a Twist: Cows & Bulls (Wordle with no colours, only bull/cow counts). 4-letter words only, no repeated letters, real words only, 10 attempts. The one colour rule: a guess with 0 bulls and 0 cows turns red and its letters grey out on the keyboard. Players can also cross letters out by hand (notes).
  2. Puzzle Passwords: design pending.
  3. CAPTCHA: design pending.

## Puzzle contract (for integration)
- Viral is building his own UI from scratch, not the hackathon-kit UI. Puzzles must never import from the kit (`components/ui`, Tailwind classes, theme tokens).
- Each puzzle lives in `hackathon-kit/src/puzzles/<id>/` as three layers: `logic.js` (plain JS rules), `use<Puzzle>.js` (headless React hook: state and actions, no markup), and `<Puzzle>.jsx` + its own prefixed CSS file (ready-made view, themable through CSS variables).
- Every puzzle component takes `onSolve(result)` and `onFail(result)` and needs no router, auth or API. Story scenes render it and react to the callback.
- `src/puzzles/index.js` lists all puzzles. The demo route is `/puzzle/:id`.

## Repo
- Name: Taral
- Visibility: public
- Collaborator: Tana-38 (write access)
- Linked to Vercel.
- Kept empty of app code. The only tracked file is AI_LOG.md. Do not commit hackathon-kit/ or other local folders.
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
