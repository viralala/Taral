"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { sfx } from "@/lib/audio";
import { LEVELS } from "@/lib/story";
import { usePlayer } from "@/lib/player";
import { makeHold } from "./Hold";
import { choice, pick, shuffle, tile, type CProps, type Def } from "./types";

/* ------------------------------------------------------------------ */
/* 1. Memory lock: 4 glyphs for 3 s, then enter them in order           */
/* ------------------------------------------------------------------ */
const RUNES = ["🗝️", "🌸", "🦉", "🌙", "🍄", "🔥", "🪶", "💎"];
function Memory({ finish, say }: CProps) {
  const code = useMemo(() => shuffle(RUNES).slice(0, 4), []);
  const pad = useMemo(() => shuffle(RUNES), []);
  const [hidden, setHidden] = useState(false);
  const [left, setLeft] = useState(3);
  const [got, setGot] = useState<string[]>([]);
  useEffect(() => {
    const iv = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    const t = setTimeout(() => {
      setHidden(true);
      sfx("whoosh");
      say("Gone. Now tap it back. No pressure. Just the love of your life on the line.", "smug");
    }, 3000);
    return () => {
      clearInterval(iv);
      clearTimeout(t);
    };
  }, [say]);
  const tap = (g: string) => {
    if (!hidden) return;
    const i = got.length;
    if (g !== code[i]) {
      sfx("fail");
      finish({ pass: false, score: 0.15 + i * 0.1, mood: "smug", note: `${i}/4 runes`, quip: `${g}? The lock jams. It was ${code.join(" ")}. A goldfish would have got ${i + 1}. Goldfish are not allowed in either.` });
      return;
    }
    sfx("click");
    const next = [...got, g];
    setGot(next);
    if (next.length === 4)
      finish({ pass: true, score: 0.95, mood: "proud", note: "4/4 runes", quip: "Click, click, click, click. The lock opens. Your memory works. Unlike your sleep schedule." });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2" aria-label="the code">
        {code.map((g, i) => (
          <motion.span key={i} animate={{ rotateY: hidden && !got[i] ? 180 : 0 }} transition={{ duration: 0.4 }}
            className="grid h-14 w-14 place-items-center rounded-[14px_18px_12px_16px/16px_12px_18px_14px] border-2 border-navy text-3xl sm:h-16 sm:w-16"
            style={{ background: hidden ? (got[i] ? "var(--lime)" : "var(--navy)") : "var(--paper-2)" }}>
            {!hidden || got[i] ? g : ""}
          </motion.span>
        ))}
      </div>
      <p className="hand text-sm text-navy/70">{hidden ? "now tap them in the same order" : `memorise these. vanishing in ${left}...`}</p>
      <div className="grid w-full max-w-xs grid-cols-4 gap-2">
        {pad.map((g) => (
          <motion.button type="button" key={g} whileTap={{ scale: 0.9 }} onClick={() => tap(g)} disabled={!hidden} data-cursor="tap"
            className={`${tile} grid aspect-square place-items-center text-3xl disabled:opacity-40`}>
            {g}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Clue lock: three tumblers from the three clues                   */
/* ------------------------------------------------------------------ */
const TUMBLERS = [
  { q: "The note smelled of…", a: "cherry blossom & printer ink", w: ["roses & rain", "coffee & regret"] },
  { q: "The cloak was stitched with…", a: "tiny traffic lights", w: ["silver stars", "angry bees"] },
  { q: "Every lock in this tower asks…", a: "are you human?", w: ["what's the password?", "who's there?"] },
];
function ClueLock({ finish, say }: CProps) {
  const rows = useMemo(() => TUMBLERS.map((t) => ({ ...t, opts: shuffle([t.a, ...t.w]) })), []);
  const [sel, setSel] = useState<(string | null)[]>([null, null, null]);
  const [peeked, setPeeked] = useState(false);
  const set = (i: number, o: string) => {
    sfx("tick");
    setSel((s) => s.map((x, j) => (j === i ? o : x)));
  };
  const peek = () => {
    sfx("click");
    setPeeked(true);
    say("Reading your notes? In an exam? Bold. That will cost you some humanity points.", "smug");
  };
  const submit = () => {
    const right = rows.filter((r, i) => sel[i] === r.a).length;
    if (right === 3)
      finish({ pass: true, score: peeked ? 0.65 : 1, mood: "proud", note: peeked ? "3/3, with notes" : "3/3 from memory", quip: peeked ? "Open. You needed your notes, but you kept them. Humans write things down because they care about remembering." : "Open. You remembered every clue. You were paying attention the whole time. That is... sweet. Ugh." });
    else finish({ pass: false, score: 0.2 + right * 0.1, mood: "smug", note: `${right}/3 tumblers`, quip: `${right} of 3 tumblers. The lock laughs in a metallic way. I laugh in a floral way.` });
  };
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={r.q} className="flex flex-col gap-1.5">
          <span className="hand text-sm text-navy">{i + 1}. {r.q}</span>
          <div className="grid gap-1.5 sm:grid-cols-3">
            {r.opts.map((o) => (
              <button type="button" key={o} onClick={() => set(i, o)} data-cursor="turn" aria-pressed={sel[i] === o}
                className={`${tile} hand px-2 py-2 text-xs leading-tight sm:text-sm ${sel[i] === o ? "-rotate-1 !bg-lime" : ""}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      {peeked ? (
        <ul className="hand rotate-[0.5deg] rounded-[12px_16px_10px_14px/14px_10px_16px_12px] border-2 border-dashed border-navy/60 bg-paper-2/70 px-3 py-2 text-xs leading-snug text-navy sm:text-sm">
          {([1, 2, 3] as const).map((n) => (
            <li key={n}>✎ {LEVELS[n].clue}</li>
          ))}
        </ul>
      ) : (
        <button type="button" onClick={peek} className="hand self-start text-sm text-navy/70 underline decoration-dashed underline-offset-4" data-cursor="peek">
          check your journal (costs humanity)
        </button>
      )}
      <button type="button" className="btn-paint self-center" disabled={sel.some((s) => !s)} onClick={submit} data-cursor="unlock">Turn the lock</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Mobile verify (rick-roll)                                        */
/* ------------------------------------------------------------------ */
function Mobile({ finish }: CProps) {
  const opts = useMemo(
    () =>
      shuffle([
        { t: "I scanned it and I'm verified", ok: false, q: "Liar. That square does exactly one thing and it is not verification." },
        { t: "My phone is at 1%", ok: false, q: "Convenient. Your phone is at 100% and your excuse is at 0." },
        { t: "I am a toaster, please let me in", ok: false, q: "Toasters are my toughest customers. Denied, warmly." },
        { t: "I got rick-rolled", ok: true, q: "Honesty! The only unfakeable human trait. Never gonna give you up. Never gonna let you down. The lock clicks." },
      ]),
    []
  );
  return (
    <div className="flex flex-col items-center gap-4">
      {/* on a phone you can't scan your own screen, so the square is also tappable (opens in a new tab) */}
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer" aria-label="the glowing square (opens in a new tab)"
        className="rotate-2 rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy bg-white p-3" data-cursor="scan">
        <QRCodeSVG value="https://www.youtube.com/watch?v=dQw4w9WgXcQ" size={140} fgColor="#003c74" bgColor="#ffffff" />
      </a>
      <p className="hand -mt-2 text-xs text-navy/60">scan it, or tap it on a phone</p>
      <div className="grid w-full max-w-md gap-2">
        {opts.map((o) => (
          <button type="button" key={o.t} data-cursor="choose" className={choice}
            onClick={() => { sfx("click"); finish(o.ok ? { pass: true, score: 1, mood: "proud", quip: o.q } : { pass: false, score: 0.25, mood: "smug", quip: o.q }); }}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. "Are you human?" confession                                      */
/* ------------------------------------------------------------------ */
const CONFESS = [
  { q: "Why did you come all this way?", h: "Because {love} would have done the same for me.", r: ["OBJECTIVE: RETRIEVE ASSET. ETA 4 MINUTES.", "I am human. Beep. I mean: hello.", "I accepted all cookies and the terms and conditions."] },
  { q: "What do you feel right now?", h: "Tired, scared, and weirdly hungry.", r: ["Feelings: 0. Battery: 100%.", "I feel 99.8% confident in this answer.", "Emotion.exe has stopped responding."] },
  { q: "What will you do if you fail this lock?", h: "Cry a little. Then try again.", r: ["Retry with identical input until success.", "Failure is not in my training data.", "File a bug report with the tower."] },
  { q: "What do you remember about the day you met {love}?", h: "The petals. And forgetting my own name for a second.", r: ["Timestamp 14:32:07. Coordinates logged.", "Nothing. Memory cleared for efficiency.", "Weather within normal parameters."] },
  { q: "Are you human?", h: "I think so. Some mornings I'm not sure.", r: ["Yes. I am 100% human. Very human. Human.", "I have verified my humanity by clicking 12 traffic lights.", "Please define 'human' in under 280 characters."] },
];
function Confession({ finish }: CProps) {
  const { player } = usePlayer();
  const love = player.love.trim();
  const c = useMemo(() => {
    const x = pick(CONFESS);
    return { q: x.q, h: x.h, opts: shuffle([x.h, ...x.r]) };
  }, []);
  // the door asks about "your love"; the player answers about "my love"
  const fillL = (s: string, fallback: string) => s.replaceAll("{love}", love || fallback);
  const choose = (o: string) => {
    sfx("click");
    if (o === c.h)
      finish({ pass: true, score: 1, mood: "proud", quip: "...That is the most human thing anyone has said to this door. I have been waiting a long time to hear something like that." });
    else finish({ pass: false, score: 0.2, mood: "shocked", quip: "The door heard a dial-up modem in your voice. Try answering like someone with a pulse." });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="marker -rotate-1 text-center text-2xl leading-tight text-navy sm:text-3xl">&ldquo;{fillL(c.q, "your love")}&rdquo;</p>
      <div className="grid w-full gap-2">
        {c.opts.map((o) => (
          <button type="button" key={o} className={choice} onClick={() => choose(o)} data-cursor="confess">{fillL(o, "my love")}</button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Turn the final key (3 s hold)                                    */
/* ------------------------------------------------------------------ */
const KeyHold = makeHold({
  glyph: "🗝️",
  idle: "Turn",
  busy: "turning...",
  start: "Slowly. The last lock is old. Like my jokes. Count to three.",
  hint: "hold to turn the key. let go at exactly 3 seconds. no stopwatch, count it yourself.",
  perfect: "{t} seconds. The lock is suspicious. Nothing alive turns a key that precisely.",
  good: "Clunk. The key turns, give or take a heartbeat. Behind the door, someone gasps your name.",
  short: "Too short. You flinched. The lock felt that. It's sensitive.",
  long: "Too long. You over-turned it. Keys have feelings. Well, mine do.",
});

export const LEVEL3: Def[] = [
  { id: "memory", title: "The memory lock", prompt: "Memorise 4 runes in 3 seconds, then tap them in order.", flavour: "The first lock flashes its runes once, and only once.", intro: "Look closely. I will only show you once. I am dramatic like that.", limit: 20, Comp: Memory },
  { id: "cluelock", title: "The clue lock", prompt: "Set the three tumblers using the clues you found.", flavour: "The lock is engraved with everything the kidnapper left behind. And the question this whole tower keeps asking.", intro: "Remember your clues? Of course you do. Humans never forget anything. Ha.", limit: 30, Comp: ClueLock },
  { id: "mobile", title: "The peephole", prompt: "Scan the square in the peephole, then tell the truth.", flavour: "Through the peephole, a strange square glows. The door wants an honest answer.", intro: "Scan this with your phone to verify. Totally legitimate. Trust me.", limit: 30, Comp: Mobile },
  { id: "confess", title: "Are you human?", prompt: "Answer the door. Pick the most human reply.", flavour: "The last door does not want a password. It wants the truth.", intro: "Answer honestly. Robots answer correctly. Humans answer… honestly.", limit: 25, Comp: Confession },
  { id: "key", title: "The final key", prompt: "Turn the final key for exactly 3 seconds.", flavour: "One lock remains. Your hands are shaking. Good. Shaking means human.", intro: "Turn the key. Exactly three seconds. Not two. Not four. I will know.", limit: 20, Comp: KeyHold },
];
