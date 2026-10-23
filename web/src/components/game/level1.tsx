"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/audio";
import { makeHold } from "./Hold";
import { clamp, pick, shuffle, tile, type CProps, type Def } from "./types";

/* ------------------------------------------------------------------ */
/* 1. Draw the moon (freehand circle)                                   */
/* ------------------------------------------------------------------ */
function Moon({ finish, say }: CProps) {
  const cv = useRef<HTMLCanvasElement>(null);
  const pts = useRef<{ x: number; y: number }[]>([]);
  const drawing = useRef(false);
  const [info, setInfo] = useState("");
  const [drew, setDrew] = useState(false);
  const wipe = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(wipe.current), []);
  const pos = (e: React.PointerEvent) => {
    const c = cv.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
  };
  const clear = () => cv.current?.getContext("2d")?.clearRect(0, 0, 360, 300);
  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    clearTimeout(wipe.current); // a pending wipe from the last retry must not erase this new stroke
    drawing.current = true;
    setDrew(true);
    clear();
    setInfo("");
    pts.current = [pos(e)];
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const a = pts.current[pts.current.length - 1];
    const b = pos(e);
    pts.current.push(b);
    const g = cv.current!.getContext("2d")!;
    g.strokeStyle = "#e8f20a";
    g.shadowColor = "#e8f20a";
    g.shadowBlur = 10;
    g.lineWidth = 7;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(a.x, a.y);
    g.lineTo(b.x, b.y);
    g.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const p = pts.current;
    const retry = (m: string) => {
      setInfo(m);
      say(m, "smug");
      wipe.current = setTimeout(clear, 900);
    };
    if (p.length < 15) return retry("That's a star. Cute. I asked for the moon.");
    const xs = p.map((q) => q.x);
    const ys = p.map((q) => q.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const rs = p.map((q) => Math.hypot(q.x - cx, q.y - cy));
    const mean = rs.reduce((a, b) => a + b, 0) / rs.length;
    const sd = Math.sqrt(rs.reduce((a, b) => a + (b - mean) ** 2, 0) / rs.length);
    let ang = 0;
    for (let i = 1; i < p.length; i++) {
      let d = Math.atan2(p[i].y - cy, p[i].x - cx) - Math.atan2(p[i - 1].y - cy, p[i - 1].x - cx);
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      ang += d;
    }
    const gap = Math.hypot(p[0].x - p[p.length - 1].x, p[0].y - p[p.length - 1].y);
    if (mean < 30 || Math.abs(ang) < Math.PI * 1.7 || gap > mean * 0.7)
      return retry("A crescent? Close the loop. Full moon, please.");
    const err = sd / mean;
    const note = `Roundness ${Math.round((1 - err) * 100)}%`;
    if (err < 0.04)
      finish({ pass: false, score: 0.2, mood: "shocked", note, quip: "Compass-perfect? Suspicious. Real humans have shaky hands." });
    else if (err > 0.3)
      finish({ pass: false, score: 0.35, mood: "smug", note, quip: "That's a potato with ambition. Even the owls hooted." });
    else
      finish({ pass: true, score: 0.8 + Math.min(0.2, (0.3 - err) / 1.5), mood: "proud", note, quip: "Wobbly, glowing, perfectly imperfect. Moss-t impressive." });
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full max-w-[400px] touch-none overflow-hidden rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy" data-cursor="draw"
        style={{ background: "linear-gradient(180deg, var(--night), var(--dusk) 70%, #1d4a3a)" }}>
        <svg viewBox="0 0 360 300" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {[[40, 40], [300, 60], [120, 30], [250, 120], [70, 140], [330, 180]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="var(--paper)" style={{ animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite` }} />
          ))}
          {[20, 70, 120, 175, 230, 285, 335].map((x, i) => (
            <path key={x} d={`M${x - 26} 300 L${x} ${232 - (i % 3) * 18} L${x + 26} 300Z`} fill="#123a33" stroke="#0b2622" strokeWidth="2" />
          ))}
        </svg>
        <canvas ref={cv} width={360} height={300} className="relative block aspect-[6/5] w-full touch-none" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        {!drew && (
          <span className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-5xl opacity-30" aria-hidden style={{ animation: "twinkle 2.4s ease-in-out infinite" }}>
            🌕
          </span>
        )}
      </div>
      <p className="hand min-h-6 text-center text-base text-rose">{info}</p>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* 3. Catch the firefly checkbox (runaway checkbox)                      */
/* ------------------------------------------------------------------ */
const TAUNTS = ["Too slow.", "Bzzt. Nope.", "Catch me, human.", "Almost! Not really.", "Cardio, anyone?", "Fireflies don't do paperwork.", "Light work. For me."];
function Firefly({ finish, say }: CProps) {
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 16, y: 16 }); // px inside the box
  const [flees, setFlees] = useState(0);
  // fingers can't hover, so on touch every tap near it is a chase step and it tires sooner
  const [need, setNeed] = useState(7);
  const tired = flees >= need;
  const last = useRef(0);
  const flee = () => {
    if (tired) return;
    const now = Date.now();
    if (now - last.current < 220) return;
    last.current = now;
    const b = box.current;
    const k = btn.current;
    const maxX = b && k ? Math.max(0, b.clientWidth - k.offsetWidth - 16) : 120;
    const maxY = b && k ? Math.max(0, b.clientHeight - k.offsetHeight - 16) : 150;
    // best of 3 random spots: the one farthest from where it is now, so the dodge reads clearly
    let best = pos;
    let bestD = -1;
    for (let i = 0; i < 3; i++) {
      const c = { x: 8 + Math.random() * maxX, y: 8 + Math.random() * maxY };
      const d = Math.hypot(c.x - pos.x, c.y - pos.y);
      if (d > bestD) [best, bestD] = [c, d];
    }
    setPos(best);
    const n = flees + 1;
    setFlees(n);
    if (n >= need) say("Okay, okay. I'm pooped. Tap me.", "crying");
    else say(pick(TAUNTS), "smug");
  };
  const near = (e: React.PointerEvent, pad: number) => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return false;
    const dx = Math.max(0, Math.abs(e.clientX - (r.left + r.width / 2)) - r.width / 2);
    const dy = Math.max(0, Math.abs(e.clientY - (r.top + r.height / 2)) - r.height / 2);
    return Math.hypot(dx, dy) < pad;
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tired || e.pointerType !== "mouse") return;
    if (near(e, 60)) flee();
  };
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") return;
    if (need !== 5) setNeed(5);
    // a tap on or near the firefly (fat-finger friendly) makes it hop
    if (!tired && near(e, 48)) flee();
  };
  const onClick = () => {
    // ignore the click from the same press that made it give up: catching takes a fresh tap
    if (!tired || Date.now() - last.current < 350) return;
    finish({ pass: true, score: 0.95, mood: "proud", note: `Dodged ${flees} times`, quip: "You out-stubborned a firefly. Deeply, gloriously human." });
  };
  return (
    <div className="flex flex-col items-center gap-2">
    <div ref={box} className="relative h-64 w-full touch-none select-none overflow-hidden rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy"
      style={{ background: "radial-gradient(circle at 30% 20%, #1d4a3a, var(--night) 75%)" }} onPointerMove={onMove} onPointerDown={onDown}>
      <motion.button
        ref={btn}
        type="button"
        data-cursor={tired ? "click!" : "catch"}
        className="absolute flex items-center gap-2 whitespace-nowrap rounded-[14px_18px_12px_16px/16px_12px_18px_14px] border-2 border-navy bg-paper px-3 py-2 text-navy"
        style={{ boxShadow: tired ? "none" : "0 0 24px 6px rgba(232,242,10,.55)" }}
        initial={false}
        animate={{ left: pos.x, top: pos.y }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        onPointerDown={(e) => {
          if (!tired && e.pointerType === "mouse") {
            e.preventDefault();
            flee();
          }
        }}
        onClick={onClick}
      >
        <span className="grid h-7 w-7 place-items-center rounded-md border-2 border-navy bg-white">{tired ? "✓" : "✨"}</span>
        <span className="hand text-sm">I&apos;m not a robot</span>
      </motion.button>
    </div>
    <p className="hand min-h-6 text-base text-navy/70" aria-live="polite">{tired ? "It gave up. Tap it!" : "✨".repeat(Math.min(flees, need))}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Hold your breath (3 s)                                            */
/* ------------------------------------------------------------------ */
const OwlHold = makeHold({
  glyph: "🦉",
  idle: "Hold",
  busy: "shh...",
  start: "Shh. Count in your head. Owl be watching.",
  perfect: "{t} s exactly? Nobody with lungs is that precise.",
  good: "Right on time, give or take a heartbeat. Hoo-ray!",
  short: "Too short. The owl heard you gasp.",
  long: "Too long! Breathe. I need you alive.",
});

/* ------------------------------------------------------------------ */
/* 5. Spot the odd one (5x5)                                            */
/* ------------------------------------------------------------------ */
type OddSet = { base: string; odd: string; flip?: boolean };
const ODD_SETS: OddSet[] = [
  { base: "🌲", odd: "🎄" },
  { base: "🌸", odd: "💮" },
  { base: "🍀", odd: "☘️" },
  { base: "🌕", odd: "🌝" },
  { base: "🍁", odd: "🍂" },
  // only asymmetric, side-facing emoji can be mirrored (a front-facing owl or mushroom looks identical flipped)
  { base: "🐌", odd: "🐌", flip: true },
  { base: "🦔", odd: "🦔", flip: true },
  { base: "🐿️", odd: "🐿️", flip: true },
];
function OddOne({ finish, say }: CProps) {
  const { set, at } = useMemo(() => ({ set: pick(ODD_SETS), at: Math.floor(Math.random() * 25) }), []);
  const [miss, setMiss] = useState<number[]>([]);
  const t0 = useRef(0);
  useEffect(() => {
    t0.current = performance.now();
  }, []);
  const click = (i: number) => {
    if (i === at) {
      sfx("click");
      const dt = (performance.now() - t0.current) / 1000;
      const note = `Found in ${dt.toFixed(1)} s`;
      if (miss.length === 0)
        finish({ pass: true, score: clamp(1 - dt / 60, 0.7, 1), mood: "proud", note, quip: dt < 3 ? "Sharp eyes. Are you part hawk? Hawks are allowed." : "Found it. Curious humans are tree-mendous at this." });
      else finish({ pass: true, score: 0.6, mood: "smug", note, quip: "Second try. Mistake, then fix. Annoyingly human." });
      return;
    }
    if (miss.includes(i)) return;
    sfx("fail");
    const next = [...miss, i];
    setMiss(next);
    if (next.length >= 2)
      finish({ pass: false, score: 0.25, mood: "smug", note: "2 wrong picks", quip: "Those were identical. Guessing with confidence? Very bot." });
    else say("Perfectly normal one. One more miss and you're out.", "smug");
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid w-full max-w-[340px] grid-cols-5 gap-1.5 sm:gap-2">
        {Array.from({ length: 25 }, (_, i) => {
          const isOdd = i === at;
          const g = isOdd ? set.odd : set.base;
          return (
            <motion.button
              type="button"
              key={i}
              data-cursor="spot"
              whileTap={{ scale: 0.9 }}
              onClick={() => click(i)}
              disabled={miss.includes(i)}
              className={`${tile} grid aspect-square place-items-center text-2xl disabled:opacity-30 sm:text-3xl`}
              aria-label={`tile ${i + 1}`}
            >
              <span style={isOdd && set.flip ? { display: "inline-block", transform: "scaleX(-1)" } : undefined}>{g}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Pattern path: what comes next?                                    */
/* ------------------------------------------------------------------ */
const GLYPHS = ["🌲", "🍄", "🌸", "🪨", "🦉", "🍃", "🐸", "🌙", "🦋", "🌰"];
const SHAPES = ["AB", "ABC", "AAB", "ABB", "ABCB", "AABB"];
function makePattern() {
  if (Math.random() < 0.2) {
    const moons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
    const s = Math.floor(Math.random() * 3);
    const seq = moons.slice(s, s + 5);
    const ans = moons[s + 5];
    const opts = shuffle([ans, ...shuffle(moons.filter((m) => m !== ans)).slice(0, 3)]);
    return { seq, ans, opts };
  }
  const shape = pick(SHAPES);
  const g = shuffle(GLYPHS);
  const map: Record<string, string> = { A: g[0], B: g[1], C: g[2] };
  const full = Array.from({ length: 12 }, (_, i) => map[shape[i % shape.length]]);
  const len = Math.max(6, Math.min(8, shape.length * 2 + 1));
  const seq = full.slice(0, len);
  const ans = full[len];
  const used = Array.from(new Set(Object.values(map).slice(0, new Set(shape).size)));
  const pool = [...used.filter((u) => u !== ans), g[3], g[4]];
  const opts = shuffle([ans, ...pool.slice(0, 3)]);
  return { seq, ans, opts };
}
function Pattern({ finish }: CProps) {
  const p = useMemo(makePattern, []);
  const choose = (o: string) => {
    sfx("click");
    if (o === p.ans)
      finish({ pass: true, score: 0.95, mood: "proud", quip: "Right stone! Same as a robot, just with more anxiety." });
    else
      finish({ pass: false, score: 0.25, mood: "smug", note: `It was ${p.ans}`, quip: `${o}? The path wanted ${p.ans}. Rocky start.` });
  };
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2" aria-label="sequence">
        {p.seq.map((g, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/70 bg-paper-2 text-2xl sm:h-12 sm:w-12" style={{ rotate: `${(i % 3) - 1}deg` }}>
            {g}
          </motion.span>
        ))}
        <span className="marker grid h-11 w-11 place-items-center rounded-full border-2 border-dashed border-navy text-2xl text-navy sm:h-12 sm:w-12">?</span>
      </div>
      <div className="grid w-full max-w-xs grid-cols-4 gap-2">
        {p.opts.map((o) => (
          <motion.button type="button" key={o} whileTap={{ scale: 0.9 }} onClick={() => choose(o)} data-cursor="step" className={`${tile} grid aspect-square place-items-center text-3xl`}>
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Blink back: tap the moment every glowing eye is shut              */
/* ------------------------------------------------------------------ */
const EYES = [
  { x: 64, y: 62 },
  { x: 182, y: 44 },
  { x: 298, y: 70 },
  { x: 112, y: 140 },
  { x: 250, y: 132 },
];
const ROUNDS = 3;
const WINDOW = 650; // ms all eyes stay shut
const HIT = ["Gotcha! Eye see you.", "Caught them napping.", "Blink and you'd miss it. You didn't."];
const EARLY = ["Too soon! Someone was still peeking.", "One eye was open. Sneaky forest.", "Patience. The forest is shy."];
type Mark = "hit" | "miss";
function Blink({ finish, say }: CProps) {
  const [shut, setShut] = useState<boolean[]>(() => EYES.map(() => false));
  const [marks, setMarks] = useState<Mark[]>([]);
  const tap = useRef<() => void>(() => {});
  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, f: () => void) => ts.push(setTimeout(f, ms));
    const clearAll = () => {
      ts.forEach(clearTimeout);
      ts.length = 0;
    };
    const openAll = () => setShut(EYES.map(() => false));
    const setEye = (i: number, v: boolean) => setShut((s) => s.map((x, j) => (j === i ? v : x)));
    let round = 0;
    let hits = 0;
    let closedAt = 0;
    let judged = true;

    const done = () => {
      const note = `${hits}/${ROUNDS} blinks caught`;
      if (hits === ROUNDS) finish({ pass: true, score: 0.97, mood: "proud", note, quip: "Caught every blink. The forest feels seen. Tree-mendous." });
      else if (hits >= 2) finish({ pass: true, score: 0.8, mood: "proud", note, quip: "Two of three. Patient, a little jumpy. Very human." });
      else finish({ pass: false, score: 0.3, mood: "smug", note, quip: "The forest blinked. You flinched. Eye-ronic, really." });
    };
    const settle = (hit: boolean, line: string) => {
      judged = true;
      closedAt = 0;
      clearAll();
      round++;
      if (hit) hits++;
      sfx(hit ? "click" : "fail");
      setMarks((m) => [...m, hit ? "hit" : "miss"]);
      say(line, hit ? "proud" : "smug");
      later(350, openAll);
      later(round >= ROUNDS ? 800 : 1000, round >= ROUNDS ? done : start);
    };
    const start = () => {
      clearAll();
      openAll();
      judged = false;
      closedAt = 0;
      const T = 1600 + Math.random() * 1400;
      // decoy blinks: single eyes flutter shut
      const decoys = 3 + Math.floor(Math.random() * 3);
      for (let k = 0; k < decoys; k++) {
        const at = 200 + Math.random() * (T - 800);
        const e = Math.floor(Math.random() * EYES.length);
        later(at, () => setEye(e, true));
        later(at + 200, () => setEye(e, false));
      }
      // the tease: all but one close, then they all pop open again
      if (Math.random() < 0.6) {
        const keep = Math.floor(Math.random() * EYES.length);
        later(T - 650, () => setShut(EYES.map((_, j) => j !== keep)));
        later(T - 280, openAll);
      }
      // the real blink: a quick cascade, then every eye is shut for WINDOW ms
      shuffle(EYES.map((_, i) => i)).forEach((e, k) => later(T + k * 60, () => setEye(e, true)));
      const full = T + (EYES.length - 1) * 60;
      later(full, () => {
        setShut(EYES.map(() => true));
        closedAt = performance.now();
      });
      later(full + WINDOW, () => {
        closedAt = 0;
        openAll();
        if (!judged) settle(false, "Too slow. They're wide awake again.");
      });
    };
    tap.current = () => {
      if (judged) return;
      if (closedAt) settle(true, pick(HIT));
      else settle(false, pick(EARLY));
    };
    later(700, start);
    return () => {
      clearAll();
      tap.current = () => {};
    };
  }, [finish, say]);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => tap.current()}
        data-cursor="now!"
        aria-label="Tap when every eye is shut"
        className="relative block h-60 w-full touch-manipulation select-none overflow-hidden rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-navy transition active:scale-[0.99]"
        style={{ background: "radial-gradient(circle at 50% 30%, #1d4a3a, var(--night) 75%)" }}
      >
        <svg viewBox="0 0 360 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
          {[20, 80, 140, 200, 260, 320].map((x, i) => (
            <path key={x} d={`M${x - 34} 240 L${x} ${176 - (i % 3) * 16} L${x + 34} 240Z`} fill="#123a33" stroke="#0b2622" strokeWidth="2" />
          ))}
          {EYES.map((p, i) => (
            <g key={i} style={{ filter: "drop-shadow(0 0 6px rgba(232,242,10,.7))" }}>
              {[-13, 13].map((dx) => (
                <g key={dx}>
                  <motion.ellipse cx={p.x + dx} cy={p.y} rx="9" initial={false} animate={{ ry: shut[i] ? 0.9 : 7 }} transition={{ duration: 0.08 }} fill="var(--lime)" />
                  <motion.circle cx={p.x + dx} cy={p.y} r="3" initial={false} animate={{ opacity: shut[i] ? 0 : 1 }} transition={{ duration: 0.05 }} fill="var(--night)" />
                </g>
              ))}
            </g>
          ))}
        </svg>
      </button>
      <div className="flex gap-2" aria-label={`${marks.filter((m) => m === "hit").length} caught`}>
        {Array.from({ length: ROUNDS }, (_, i) => (
          <span key={i} className="grid h-8 w-8 place-items-center rounded-full border-2 border-navy text-base"
            style={{ background: marks[i] === "hit" ? "var(--leaf)" : marks[i] === "miss" ? "var(--blossom)" : "transparent" }}>
            {marks[i] === "hit" ? "👁️" : marks[i] === "miss" ? "😵" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export const LEVEL1: Def[] = [
  { id: "moon", title: "Draw the moon", prompt: "Draw a full moon. Freehand.", intro: "Robots draw circles. Humans draw feelings.", limit: 15, Comp: Moon },
  { id: "firefly", title: "Catch the firefly", prompt: "Tick the box. It flees.", intro: "Just tick the box. How hard can it be?", limit: 15, Comp: Firefly },
  { id: "breath", title: "Hold your breath", prompt: "Hold for exactly 3 seconds.", intro: "Three seconds. No phones. The owl reports to me.", limit: 15, Comp: OwlHold },
  { id: "odd", title: "Spot the odd one", prompt: "One is different. Find it.", intro: "Spot the imposter. It's not me. Probably.", limit: 15, Comp: OddOne },
  { id: "pattern", title: "The pattern path", prompt: "Which stone comes next?", intro: "Humans love patterns. You order the same snack, right?", limit: 15, Comp: Pattern },
  { id: "blink", title: "Blink back", prompt: "Tap when every eye is shut.", intro: "The forest is watching. Wait for it to blink.", limit: 15, Comp: Blink },
];
