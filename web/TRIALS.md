# Adding a trial

A **trial** is one mini-game in the story. The player goes:
cinematic → Trial 1 → clue → Trial 2 → clue → Trial 3 → ending.

Trial 1 is Viral's. Trials 2 and 3 are Tana's. All three currently run on the shared
`LevelGame` engine (riddles and ciphers for Trial 2, locks and a final key for Trial 3),
so the story works end to end. Any trial can be swapped for a custom game without
touching the rest of the app.

## The swap: 3 steps

1. Open `src/trials/trial2.tsx` (or `trial3.tsx`).
2. Replace the default export with your game. It gets `{ onComplete, standalone }`.
3. When the player clears it, call `onComplete({...})`. Done. Nothing else to edit.

Need a starting point? Copy `src/trials/TemplateTrial.tsx`: one puzzle, a timer,
a PASS/FAIL stamp, a retry button. It already compiles.

## The result you hand back

```ts
onComplete({ level: 2, passed: 3, total: 3, humanity: 87, timeMs: 41200, cleared: true });
```

| field      | meaning                                      |
| ---------- | -------------------------------------------- |
| `level`    | your trial number: `2` or `3`                |
| `passed`   | challenges the player got right              |
| `total`    | challenges played                            |
| `humanity` | 0 to 100, your "how human was that" score    |
| `timeMs`   | time spent playing, in milliseconds          |
| `cleared`  | always `true` (only call it on a win)        |

`standalone` is `true` on the practice page: show your own "you win" screen there,
since no story is waiting for the result.

## The kit

`import { ... } from "@/trials/kit"` gives you the house style for free:

- `Timer`, `Stamp`, `CaptchaBot` (the hooded voice), `sfx("pass")`
- `usePlayer()` for the hero's and beloved's names, `saveRun` for the leaderboard
- class names: `CARD`, `BTN`, `BTN_GHOST`, `TITLE`, `LABEL`

## Test it

- `npm run dev`, then open `/level/2` or `/level/3` (practice, no story).
- Or play from `/` to see it inside the full tale.
- `npx tsc --noEmit` and `npx eslint src/trials` before you push.

## House rules

- 30 seconds or less per challenge.
- A clear PASS or FAIL every time. No "maybe".
- Retry without reloading the page.
- Works on phones: big tap targets, no hover-only tricks.
- Short text, big jokes. One line of instructions beats three.
- No `leading-none` on `marker` titles, and never stack text on top of text.
