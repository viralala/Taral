"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BlobFlower, StarFlower } from "@/components/Flower";
import CaptchaBot from "@/components/game/CaptchaBot";
import Timer from "@/components/game/Timer";
import Stamp from "@/components/game/Stamp";
import ResultScreen from "@/components/game/ResultScreen";
import { CHALLENGES, POOL, type ChallengeId } from "@/components/game/Challenges";
import { pick, shuffle, type Mood, type Res } from "@/components/game/types";

type Phase = "intro" | "play" | "stamp" | "result";

const INTERLUDES = [
  "CAPT. CHA has solved 4 billion CAPTCHAs. You have solved your sleep schedule 0 times.",
  "This button is load-bearing for your ego.",
  "A robot never doubts. That is why you are winning. Wait, no. That is why you are losing.",
  "Last gate. Failing is just a very enthusiastic way of trying.",
];
const TIMEOUT = [
  "Time. Is. Up. Even the loading spinner felt secondhand embarrassment.",
  "You thought about it so long I aged out of my firmware.",
  "Overthinking: the most human bug there is.",
];

export default function Level1() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<ChallengeId[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Res[]>([]);
  const [bubble, setBubble] = useState<{ t: string; m: Mood }>({
    t: "Halt. Nobody leaves the internet until they prove they are human. I have been clicking traffic lights for 20 years. I am fine.",
    m: "smug",
  });
  const lock = useRef(false);
  const t0 = useRef(0);
  const total = useRef(0);

  const say = useCallback((t: string, m: Mood = "smug") => setBubble({ t, m }), []);

  const begin = (i: number, ord: ChallengeId[]) => {
    lock.current = false;
    t0.current = Date.now();
    setIdx(i);
    setPhase("play");
    say(CHALLENGES[ord[i]].intro, CHALLENGES[ord[i]].mood);
  };

  const start = () => {
    const ord = shuffle(POOL).slice(0, 4);
    setOrder(ord);
    setResults([]);
    total.current = 0;
    begin(0, ord);
  };

  const finish = useCallback((r: Res) => {
    if (lock.current) return;
    lock.current = true;
    total.current += Date.now() - t0.current;
    setResults((rs) => [...rs, r]);
    setBubble({ t: r.quip, m: r.mood });
    setPhase("stamp");
  }, []);

  const timeout = useCallback(() => {
    finish({ pass: false, score: 0.1, mood: "crying", quip: pick(TIMEOUT), note: "Out of time" });
  }, [finish]);

  const next = () => {
    if (idx + 1 >= order.length) {
      setPhase("result");
      setBubble({ t: "The verdict is in. I may be crying. It is just a rendering glitch.", m: "proud" });
    } else begin(idx + 1, order);
  };

  const restart = () => {
    setPhase("intro");
    setOrder([]);
    setResults([]);
    setIdx(0);
    setBubble({ t: "Back again? Persistence is either a human trait or a while-loop. Let us find out.", m: "smug" });
  };

  const def = order[idx] ? CHALLENGES[order[idx]] : null;
  const last = results[results.length - 1];

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream px-4 py-6 sm:py-10">
      <BlobFlower className="pointer-events-none absolute -left-16 top-24 w-44 opacity-60 spin-slow" color="var(--sky)" />
      <StarFlower className="pointer-events-none absolute -right-10 bottom-10 w-40 opacity-70" />

      <div className="relative mx-auto flex max-w-2xl flex-col gap-5">
        <div className="flex items-center justify-between">
          <Link href="/" data-cursor="home" className="pill bg-paper">← Home</Link>
          <div className="flex items-center gap-2" aria-label="progress">
            {[0, 1, 2, 3].map((i) => {
              const r = results[i];
              return (
                <span key={i} className="h-4 w-4 rounded-full border-2 border-cocoa transition-colors"
                  style={{ background: r ? (r.pass ? "var(--sage)" : "var(--blush-deep)") : phase === "play" && i === idx ? "var(--butter)" : "var(--paper)" }} />
              );
            })}
          </div>
        </div>

        {/* CAPT. CHA + bubble */}
        <div className="flex items-center gap-3 sm:gap-5">
          <CaptchaBot mood={bubble.m} size={110} />
          <AnimatePresence mode="wait">
            <motion.div key={bubble.t} initial={{ opacity: 0, x: -10, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              className="relative flex-1 rounded-3xl border-2 border-cocoa bg-paper px-4 py-3 shadow-[4px_4px_0_var(--cocoa)]">
              <span className="pill mb-1 !px-2 !py-0 !text-[10px] bg-blush">CAPT. CHA</span>
              <p className="text-sm font-medium leading-snug text-ink sm:text-base">{bubble.t}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative rounded-3xl border-2 border-cocoa bg-cream/80 p-4 shadow-[6px_6px_0_var(--cocoa)] sm:p-6">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4 py-4 text-center">
                <p className="pill bg-sky">Level 1</p>
                <h1 className="display text-5xl text-cocoa sm:text-7xl">The CAPTCHA that judges you back</h1>
                <p className="hand text-2xl text-cocoa/70">4 gates. 30 seconds each. Be imperfect on purpose.</p>
                <button onClick={start} data-cursor="start" className="rounded-full border-2 border-cocoa bg-butter px-8 py-4 text-lg font-bold text-cocoa shadow-[4px_4px_0_var(--cocoa)] transition hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                  Prove I am human
                </button>
              </motion.div>
            )}

            {phase === "play" && def && (
              <motion.div key={`play-${idx}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="display text-3xl text-cocoa sm:text-4xl">{def.title}</h2>
                  <span className="hand shrink-0 text-xl text-cocoa/60">{idx + 1} / {order.length}</span>
                </div>
                <p className="text-sm text-cocoa/80">{def.prompt}</p>
                <Timer key={idx} limit={def.limit} onTimeout={timeout} active />
                <def.Comp finish={finish} say={say} />
              </motion.div>
            )}

            {phase === "stamp" && last && (
              <motion.div key={`stamp-${idx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-4 py-4 text-center">
                <Stamp pass={last.pass} />
                {last.note && <p className="pill bg-butter">{last.note}</p>}
                <p className="hand max-w-md text-2xl text-cocoa">&ldquo;{INTERLUDES[idx % INTERLUDES.length]}&rdquo;</p>
                <button onClick={next} data-cursor="next" className="rounded-full border-2 border-cocoa bg-butter px-7 py-3 font-bold text-cocoa shadow-[3px_3px_0_var(--cocoa)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                  {idx + 1 >= order.length ? "See my verdict" : "Next gate →"}
                </button>
              </motion.div>
            )}

            {phase === "result" && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <ResultScreen results={results} titles={order.map((o) => CHALLENGES[o].title)} timeMs={total.current} onRestart={restart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
