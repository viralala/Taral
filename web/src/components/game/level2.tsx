"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/audio";
import { choice, clamp, field, lev, pick, shuffle, type CProps, type Def } from "./types";

/* ------------------------------------------------------------------ */
/* 1. Riddle plank                                                      */
/* ------------------------------------------------------------------ */
const RIDDLES = [
  { q: "What has keys but opens no locks?", a: "A piano", w: ["A door", "A treasure chest", "A prison"] },
  { q: "What gets wetter the more it dries?", a: "A towel", w: ["A river", "A cloud", "The rain"] },
  { q: "What has a neck but no head?", a: "A bottle", w: ["A snake", "A scarf", "A river"] },
  { q: "The more you take, the more you leave behind. What are they?", a: "Footsteps", w: ["Cookies", "Breaths", "Coins"] },
  { q: "What can you catch but never throw?", a: "A cold", w: ["A ball", "A fish", "A bus"] },
  { q: "What has one eye but cannot see?", a: "A needle", w: ["A cyclops", "A pirate", "An owl"] },
  { q: "What goes up but never comes down?", a: "Your age", w: ["A balloon", "A kite", "The sun"] },
  { q: "What belongs to you, but other people use it more?", a: "Your name", w: ["Your phone", "Your bed", "Your charger"] },
  { q: "I speak without a mouth and hear without ears. What am I?", a: "An echo", w: ["The wind", "A ghost", "A book"] },
  { q: "What has many teeth but never bites?", a: "A comb", w: ["A shark", "A wolf", "A troll"] },
  { q: "What breaks the moment you say its name?", a: "Silence", w: ["Glass", "A mirror", "A bridge plank"] },
];
function Riddle({ finish }: CProps) {
  const r = useMemo(() => {
    const x = pick(RIDDLES);
    return { ...x, opts: shuffle([x.a, ...x.w]) };
  }, []);
  const choose = (o: string) => {
    sfx("click");
    if (o === r.a) finish({ pass: true, score: 0.95, mood: "proud", quip: `${r.a}. Correct. The plank holds. Shame, I had a splash sound effect ready.` });
    else finish({ pass: false, score: 0.2, mood: "smug", note: `Answer: ${r.a}`, quip: `"${o}"? The plank creaks. The chasm says hi. It was ${r.a.toLowerCase()}, obviously.` });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="marker -rotate-1 px-2 text-center text-2xl leading-tight text-navy sm:text-3xl">&ldquo;{r.q}&rdquo;</p>
      <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
        {r.opts.map((o) => (
          <button type="button" key={o} className={choice} onClick={() => choose(o)} data-cursor="answer">{o}</button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Password riddler (PS 02 Puzzle Passwords)                        */
/* ------------------------------------------------------------------ */
const PW_RIDDLES = [
  { q: "what has keys but opens no locks", a: ["piano", "keyboard"] },
  { q: "what gets wetter the more it dries", a: ["towel"] },
  { q: "what has a neck but no head", a: ["bottle"] },
  { q: "what has hands but cannot clap", a: ["clock", "watch"] },
  { q: "what speaks without a mouth and hears without ears", a: ["echo"] },
  { q: "what has an eye but cannot see", a: ["needle", "storm", "hurricane", "potato"] },
  { q: "what follows you all day and vanishes at night", a: ["shadow"] },
];
type Rule = { label: string; ok: (s: string) => boolean };
function Password({ finish, say }: CProps) {
  const rules = useMemo<Rule[]>(() => {
    const rid = pick(PW_RIDDLES);
    const sum = pick([6, 7, 9, 10]);
    const digitSum = (s: string) => s.replace(/\D/g, "").split("").reduce((a, d) => a + Number(d), 0);
    return [
      { label: "At least 8 characters.", ok: (s) => s.length >= 8 },
      { label: "Include an UPPERCASE letter.", ok: (s) => /[A-Z]/.test(s) },
      { label: "Include a number.", ok: (s) => /\d/.test(s) },
      { label: `Your digits must add up to ${sum}.`, ok: (s) => digitSum(s) === sum },
      { label: `Include the answer to: ${rid.q}?`, ok: (s) => rid.a.some((a) => s.toLowerCase().includes(a)) },
      { label: "Include the word \"love\". It is that kind of bridge.", ok: (s) => s.toLowerCase().includes("love") },
    ];
  }, []);
  const [v, setV] = useState("");
  const [shown, setShown] = useState(1);
  const t0 = useRef(0);
  useEffect(() => {
    t0.current = performance.now();
  }, []);
  const status = rules.map((r) => r.ok(v));
  // reveal the next rule once every visible rule is satisfied
  const visibleOk = status.slice(0, shown).every(Boolean);
  useEffect(() => {
    if (shown < rules.length && visibleOk) {
      setShown((n) => n + 1);
      sfx("tick");
    }
  }, [visibleOk, shown, rules.length]);
  const all = status.every(Boolean) && shown === rules.length;
  const submit = () => {
    if (!all) {
      say("Not every rule is ticked. I can count. It is literally my only job.", "smug");
      return;
    }
    const dt = (performance.now() - t0.current) / 1000;
    finish({ pass: true, score: clamp(1.1 - dt / 40, 0.65, 1), mood: "proud", note: `Cracked in ${dt.toFixed(1)} s`, quip: "A password with a riddle, a number and love in it. Unhackable. Also unrememberable. Very human." });
  };
  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="type a password..."
        data-cursor="type"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={field}
        aria-label="password"
      />
      <ul className="flex flex-col gap-1.5">
        {rules.slice(0, shown).map((r, i) => (
          <motion.li key={r.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className={`hand flex items-start gap-2 rounded-[12px_16px_10px_14px/14px_10px_16px_12px] border-2 px-3 py-1.5 text-sm leading-snug sm:text-base ${status[i] ? "border-leaf bg-leaf/15 text-navy" : "border-coral bg-coral/10 text-navy"}`}>
            <span className={`marker mt-0.5 shrink-0 ${status[i] ? "text-leaf" : "text-coral"}`}>{status[i] ? "✓" : "✗"}</span>
            <span>Rule {i + 1}: {r.label}</span>
          </motion.li>
        ))}
      </ul>
      <button type="submit" className="btn-paint self-center" disabled={!all} data-cursor="cross">Cross the plank</button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Cipher plank (Caesar shift)                                      */
/* ------------------------------------------------------------------ */
const WORDS = ["BLOOM", "TOWER", "HEART", "TRUTH", "PETAL", "CROWN", "BRAVE", "ROYAL", "FOREST", "BRIDGE", "LANTERN", "RIDDLE"];
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const shiftWord = (w: string, k: number) => w.replace(/[A-Z]/g, (c) => ABC[(ABC.indexOf(c) + k + 26) % 26]);
function Cipher({ finish, say }: CProps) {
  const c = useMemo(() => {
    const word = pick(WORDS);
    const k = 1 + Math.floor(Math.random() * 3);
    return { word, k, enc: shiftWord(word, k) };
  }, []);
  const [v, setV] = useState("");
  const [tries, setTries] = useState(0);
  const submit = () => {
    const g = v.trim().toUpperCase();
    if (!g) return;
    if (g === c.word) {
      finish({ pass: true, score: tries ? 0.7 : 1, mood: "proud", note: `${c.enc} → ${c.word}`, quip: "Decoded. Julius Caesar would be proud. He would also be very confused about where he is." });
      return;
    }
    if (tries >= 1) finish({ pass: false, score: 0.2, mood: "smug", note: `It was ${c.word}`, quip: `"${g}" is not a word, it's a sneeze. The plank was ${c.word}. Shift happens.` });
    else {
      sfx("fail");
      setTries(1);
      setV("");
      say(`"${g}"? No. Count backwards ${c.k}. One more try.`, "smug");
    }
  };
  return (
    <form className="flex flex-col items-center gap-3" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <div className="marker -rotate-2 select-none rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-[3px] border-navy bg-paper-2 px-5 py-2 text-4xl tracking-[0.25em] text-navy sm:text-5xl">{c.enc}</div>
      <p className="hand text-center text-sm text-navy/80">
        the troll pushed every letter <b className="text-rose">{c.k} forward</b> (A → {ABC[c.k]}). push them back.
      </p>
      <div className="flex w-full max-w-md flex-wrap justify-center gap-[2px] font-mono text-[11px] text-navy/80 sm:text-xs" aria-hidden>
        {ABC.split("").map((l) => (
          <span key={l} className={`w-[1.15rem] rounded-sm text-center ${c.enc.includes(l) ? "bg-lime font-bold text-navy" : ""}`}>{l}</span>
        ))}
      </div>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="decoded word"
        data-cursor="type"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        className={`${field} max-w-xs text-center uppercase tracking-widest`}
        aria-label="decoded word"
      />
      <button type="submit" className="btn-paint" disabled={!v.trim()} data-cursor="decode">Decode {tries ? "(last try)" : ""}</button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Odd logic: which statement is false?                             */
/* ------------------------------------------------------------------ */
const LOGIC = [
  { sign: "Every troll on this bridge loves riddles. Grumble is a troll on this bridge.", t: ["Grumble loves riddles.", "At least one troll here loves riddles.", "Meeting Grumble means meeting a riddle-lover."], f: "Grumble hates riddles." },
  { sign: "Plank A is longer than plank B. Plank B is longer than plank C.", t: ["A is longer than C.", "C is the shortest plank.", "A is the longest plank."], f: "B is the longest plank." },
  { sign: "Every red plank is cracked. Plank 7 is not cracked.", t: ["Plank 7 is not red.", "A red plank would be cracked.", "Plank 7 could be blue."], f: "Plank 7 is red." },
  { sign: "The hooded figure crossed before midnight. The bell rang after midnight.", t: ["The figure crossed before the bell.", "Midnight came after the crossing.", "The bell rang after the figure crossed."], f: "The bell rang before the figure crossed." },
  { sign: "Three ropes: one gold, two silver. Exactly one rope is safe, and it is not silver.", t: ["The gold rope is safe.", "Both silver ropes are unsafe.", "Two ropes are unsafe."], f: "A silver rope is safe." },
  { sign: "The owl is older than the fox. The fox is older than the frog.", t: ["The frog is the youngest.", "The owl is older than the frog.", "The fox is younger than the owl."], f: "The fox is the oldest." },
  { sign: "If it rains, the bridge is slippery. Today the bridge is not slippery.", t: ["It is not raining today.", "Rain would make the bridge slippery.", "The bridge is safe from rain-slip today."], f: "It is raining today." },
];
function OddLogic({ finish }: CProps) {
  const L = useMemo(() => {
    const x = pick(LOGIC);
    return { ...x, opts: shuffle([x.f, ...x.t]) };
  }, []);
  const choose = (o: string) => {
    sfx("click");
    if (o === L.f) finish({ pass: true, score: 0.95, mood: "proud", quip: "Correct. Logic! On a rope bridge! Over a chasm! Your teachers would weep with pride." });
    else finish({ pass: false, score: 0.2, mood: "smug", note: `False one: ${L.f}`, quip: "That one was true. You just accused an innocent sentence. The sentence will remember this." });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full rotate-[0.6deg] rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-dashed border-navy bg-paper-2/70 px-4 py-3 text-center">
        <span className="hand text-xs text-navy/60">the sign on the post reads</span>
        <p className="mt-1 text-lg leading-snug text-navy">{L.sign}</p>
      </div>
      <p className="hand text-sm text-navy/70">which statement is <span className="scribble text-rose">false</span>?</p>
      <div className="grid w-full gap-2">
        {L.opts.map((o) => (
          <button type="button" key={o} className={choice} onClick={() => choose(o)} data-cursor="choose">{o}</button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. The troll's typo test                                            */
/* ------------------------------------------------------------------ */
const SENTENCES = ["I am definitely a human", "Trolls are lovely people", "Please let me cross the bridge", "I solve riddles for love"];
function Typo({ finish }: CProps) {
  const target = useMemo(() => pick(SENTENCES), []);
  const [v, setV] = useState("");
  const submit = () => {
    // case and spacing are not typos (mobile keyboards differ on auto-capitalisation)
    const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
    const d = lev(norm(v), norm(target));
    if (d === 0) finish({ pass: false, score: 0.2, mood: "shocked", note: "0 typos", quip: "Flawless. The troll squints. Only spell-checkers and robots type like that. Rejected, beautifully." });
    else if (d <= 3) finish({ pass: true, score: 1 - (d - 1) * 0.1, mood: "proud", note: `${d} typo${d > 1 ? "s" : ""}`, quip: "Fat fingers detected. Biological. Beautiful. The troll waves you across, weeping softly." });
    else finish({ pass: false, score: 0.3, mood: "crying", note: `${d} typos`, quip: `${d} typos is not clumsy, that is modern poetry. The troll asked for imperfect, not unreadable.` });
  };
  return (
    <form className="flex flex-col items-center gap-3" onSubmit={(e) => { e.preventDefault(); if (v.trim()) submit(); }}>
      <div className="marker -rotate-1 select-none rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy bg-paper-2 px-5 py-3 text-center text-2xl text-navy sm:text-3xl">{target}</div>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="type it here (with 1 to 3 typos)..."
        data-cursor="type"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={field}
        aria-label="your sentence"
      />
      <p className="hand text-sm text-navy/60">the troll only lets imperfect spellers cross</p>
      <button type="submit" className="btn-paint" disabled={!v.trim()} data-cursor="submit">Show the troll</button>
    </form>
  );
}

export const LEVEL2: Def[] = [
  { id: "riddle", title: "The riddle plank", prompt: "Answer the plank's riddle to step on it.", flavour: "Each plank is carved with a question. Wrong answers are… gravity's problem.", intro: "A riddle. Four answers. One plank. No refunds.", limit: 20, Comp: Riddle },
  { id: "password", title: "The password riddler", prompt: "Build a password that obeys every rule. Rules appear as you go.", flavour: "The gate at mid-bridge was locked with a password. The kidnapper changed it. Recently. Rudely.", intro: "Make a password. I have 40 billion of them. Yours will be 'password1'. I can feel it.", limit: 30, Comp: Password },
  { id: "cipher", title: "The cipher plank", prompt: "Decode the shifted word carved into the plank.", flavour: "Scratched into the wood in a hurry: a word, scrambled so only a thinker could read it.", intro: "The troll speaks in code. The troll thinks it is very clever. The troll is not.", limit: 30, Comp: Cipher },
  { id: "logic", title: "Odd logic", prompt: "Read the sign. Pick the statement that is false.", flavour: "The bridge-keeper posts rules. One of these signs is lying. Find it.", intro: "Logic time. Three truths, one lie. Like a dating profile.", limit: 25, Comp: OddLogic },
  { id: "typo", title: "The troll's toll", prompt: "Type the sentence, with a few typos. Perfection is suspicious.", flavour: "Under the bridge lives a troll who only trusts people who make mistakes.", intro: "Type it. Perfect is for machines. The troll hates machines. So do I. Allegedly.", limit: 25, Comp: Typo },
];
