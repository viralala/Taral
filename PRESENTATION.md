# Presentation script: Taral, The Three Trials

**Length:** about 5 minutes (demo included). **Speakers:** Viral leads, Tana joins for the middle section. Every `[DO]` is something on screen. Everything in quotes is spoken.

**Before you go on**
- Open the live site on `/` in a fresh tab, volume up, headphones off so the room hears the narrator.
- Open `/leaderboard` in a second tab and `AI_LOG.md` on GitHub in a third.
- Have your phone ready for the rick-roll QR in Trial 3.
- Keep one backup: `/level/1` works without the story if time is short.

---

## 1. The hook (0:00 to 0:30)

**[DO]** Show the landing screen with the loader.

> "Every day, billions of us are asked to prove we're human. Click the traffic lights. Tick the box. It's the most boring moment on the internet. We asked a different question: what if proving you're human was the fun part?"

> "This is Taral. It's a fairytale where every gate is a CAPTCHA."

## 2. The problem we picked (0:30 to 1:00)

> "We chose problem statement 01, Reimagine CAPTCHA. The brief asks for a playable challenge a human can clear in under 30 seconds, that they enjoy, and that plays with what makes us human. And the must-haves are: clear pass or fail, under 30 seconds per challenge, runs in the browser, restart without reloading, and at least three challenge types."

> "We hit all five. We have 17 challenge types, and every trial deals three random ones, so no two runs are the same."

## 3. Live demo (1:00 to 3:15)

**[DO]** Click to start. Type two names, for example a judge's name and a friend's.

> "The story stars whoever is playing. I'll type my name and my partner's."

**[DO]** Let the first intro scene play for about 10 seconds, with sound.

> "The narrator is ElevenLabs. Notice it never says our names, but the captions do. That's deliberate, so one set of audio works for any couple."

**[DO]** Press SKIP, then start Trial 1, the Forest of Clues.

> "Trial 1 is observation. Here's the runaway firefly checkbox. You just have to tick it. It doesn't want to be ticked."

**[DO]** Play one challenge, ideally the firefly or "hold your breath for exactly 3 seconds". Point at the timer and the PASS or FAIL stamp.

> "Every challenge has a visible timer under 30 seconds and an instant PASS or FAIL. If we fail the trial, we get a new draw straight away, no reload."

**[DO]** Hand over to Tana for Trial 2, or jump to `/level/2`.

> **Tana:** "Trial 2 is the Bridge of Insight. These are riddles and reasoning. My favourite is the troll's toll, where you have to type a sentence with a few typos, because the troll only trusts imperfect people. Perfection is suspicious."

**[DO]** Jump to Trial 3 via `/level/3`, or keep playing. Show the peephole QR and scan it with your phone.

> "The final trial asks one question: are you human? One lock uses the clues you collected in the earlier trials. Another asks you to scan a QR with your phone to verify. Totally legitimate."

**[DO]** Play the ending (or skip to it) and show the reveal scene.

> "And the twist: the hooded kidnapper was CAPT. CHA, the royal CAPTCHA, who only wanted to find one truly human heart."

**[DO]** Open the score screen, save the run, then switch to the leaderboard tab.

> "Each run gets a humanity score and a funny verdict, saved live to a leaderboard."

## 4. How we used AI (3:15 to 4:15)

**[DO]** Show the pipeline diagram in the README, or `AI_LOG.md`.

> "We built this with AI at every step, and the whole prompt history is in AI_LOG.md in the repo."

> "First, we planned with Opus. It wrote the story, the design tokens, the database schema and a plan that said which agent owns which files. Then three Sonnet agents built the first version in parallel. That only worked because the plan fixed the shared interfaces first."

> "Then we asked for a fairytale and a real narrator. ElevenLabs voiced 14 lines. When the API rate-limited us, we generated the last eight as one take and cut them apart on silences. The music is generated live in the browser, and it ducks under the voice."

> "After a playtest, text was overlapping on some screens. The AI found it was one line-height value. We fixed the cause, then had a four-agent Opus review check every screen at desktop and phone width and fix 21 defects."

> "Our biggest lesson: AI is fast, but only as good as the prompt and the boundaries you give it. Rules in a file, hard file ownership, and fixing causes instead of symptoms."

## 5. Tech and wrap-up (4:15 to 5:00)

> "Under the hood: Next.js and React with TypeScript and Tailwind, Framer Motion for animation, Supabase for the leaderboard, and Vercel for hosting. Every painted scene is SVG drawn in code. There's no backend of our own, and the trials are plug-in files so a new game is one file."

> "To recap: a CAPTCHA game with 17 challenge types, a narrated fairytale that stars the player, a live leaderboard, and a documented AI workflow you can read start to finish."

> "Taral asks one thing of you: stay weird. Robots can't. Thank you."

---

## Likely questions

| Question | Short answer |
| --- | --- |
| Is it real security? | No. It's a game about the idea of a CAPTCHA, as the brief says. |
| How do you stop cheating the leaderboard? | We don't, since there is nothing to protect. Row-level security limits the table to anonymous reads and inserts, and column checks cap name length and score range. |
| Why a story? | A puzzle is more fun when you care why you're solving it. The story is the reason for the puzzles. |
| What would you build next? | AI-generated puzzles per visitor, and more trials from other players. |
| How did you split the work? | Viral did the concept, Trial 1, the story shell and frontend. Tana owns Trials 2 and 3. Each trial is its own file. |

## If something goes wrong

- **No sound:** carry on, the captions run on a timer without audio. Say "the narrator is ElevenLabs" and move on.
- **Slow Wi-Fi:** use `/level/1`, which skips the cinematic.
- **Leaderboard empty:** play one run live and show it appear.
- **Over time:** cut section 2 and one trial from the demo.

