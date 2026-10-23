"use client";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { lev, pick, shuffle, type CProps, type Mood } from "./types";

export type ChallengeId = "circle" | "feelings" | "checkbox" | "typo" | "hold" | "mobile";
export type Def = {
  id: ChallengeId;
  title: string;
  prompt: string;
  limit: number;
  intro: string;
  mood: Mood;
  Comp: (p: CProps) => React.ReactElement;
};

const btn =
  "rounded-full border-2 border-cocoa bg-butter px-6 py-3 font-bold text-cocoa shadow-[3px_3px_0_var(--cocoa)] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50";

/* 1. Circle */
function Circle({ finish, say }: CProps) {
  const cv = useRef<HTMLCanvasElement>(null);
  const pts = useRef<{ x: number; y: number }[]>([]);
  const drawing = useRef(false);
  const [info, setInfo] = useState("");
  const pos = (e: React.PointerEvent) => {
    const c = cv.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
  };
  const clear = () => cv.current?.getContext("2d")?.clearRect(0, 0, 360, 360);
  const down = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
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
    g.strokeStyle = "#6b3f2a";
    g.lineWidth = 6;
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
      setTimeout(clear, 900);
    };
    if (p.length < 15) return retry("That is a dot. Dots are not circles. Try again.");
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
      return retry("Not closed. That is a letter C. Close the loop.");
    const err = sd / mean;
    const circ = Math.round((1 - err) * 100);
    const note = `Circularity ${circ}%`;
    if (err < 0.04)
      finish({ pass: false, score: 0.2, mood: "shocked", note, quip: "A ruler-perfect circle? Only a machine does that. Humans wobble. Please wobble responsibly." });
    else if (err > 0.3)
      finish({ pass: false, score: 0.35, mood: "smug", note, quip: "That is not a circle, that is a potato with ambition. Abstract art, 10/10, still a fail." });
    else
      finish({ pass: true, score: 0.8 + Math.min(0.2, (0.3 - err) / 1.5), mood: "proud", note, quip: "Beautifully imperfect. A robot would have nailed it. You nailed the vibe instead." });
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[360px] touch-none overflow-hidden rounded-2xl border-2 border-dashed border-cocoa bg-paper" data-cursor="draw">
        <canvas ref={cv} width={360} height={360} className="block aspect-square w-full touch-none" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        <span className="hand pointer-events-none absolute left-3 top-2 text-xl text-cocoa/50">draw here, freehand</span>
      </div>
      <p className="hand min-h-7 text-2xl text-blush-deep">{info}</p>
    </div>
  );
}

/* 2. Feelings */
const FEEL = [
  { e: "😩", t: "Monday 9am", f: true },
  { e: "🍕", t: "Last slice of pizza", f: true },
  { e: "💬", t: "Unread \"we need to talk\"", f: true },
  { e: "🪫", t: "Phone at 1%", f: true },
  { e: "👀", t: "Ex viewed your story", f: true },
  { e: "🚦", t: "A traffic light", f: false },
  { e: "🚌", t: "A bus", f: false },
  { e: "🚸", t: "Crosswalk", f: false },
  { e: "🚲", t: "A bicycle", f: false },
];
function Feelings({ finish }: CProps) {
  const items = useMemo(() => shuffle(FEEL), []);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const toggle = (t: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(t)) n.delete(t);
      else n.add(t);
      return n;
    });
  const submit = () => {
    const good = items.filter((i) => i.f && sel.has(i.t)).length;
    const bad = items.filter((i) => !i.f && sel.has(i.t));
    const score = Math.max(0.1, (good - bad.length * 0.6) / 5);
    if (bad.some((b) => b.t === "A traffic light"))
      return finish({ pass: false, score: Math.min(score, 0.4), mood: "crying", quip: "You picked the traffic light. I have seen 10 million traffic lights. They feel nothing. Neither do I." });
    if (good >= 4 && bad.length === 0)
      finish({ pass: true, score: Math.min(1, 0.75 + good * 0.05), mood: "proud", quip: "You feel things about pizza and Mondays. Terrifying. Welcome to humanity." });
    else
      finish({ pass: false, score: Math.min(score, 0.45), mood: "smug", quip: `You found ${good} of 5 feelings and ${bad.length} things that are just objects. Sit with that.` });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3">
        {items.map((i) => {
          const on = sel.has(i.t);
          return (
            <motion.button
              key={i.t}
              whileTap={{ scale: 0.93 }}
              onClick={() => toggle(i.t)}
              data-cursor="pick"
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-cocoa p-1 text-center text-[11px] font-semibold leading-tight text-cocoa sm:text-sm ${on ? "-translate-y-0.5 bg-sky shadow-[3px_3px_0_var(--cocoa)]" : "bg-paper"}`}
            >
              <span className="text-3xl sm:text-4xl">{i.e}</span>
              {i.t}
            </motion.button>
          );
        })}
      </div>
      <button className={btn} onClick={submit} data-cursor="verify" disabled={sel.size === 0}>
        Verify
      </button>
    </div>
  );
}

/* 3. Runaway checkbox */
const TAUNTS = ["Too slow.", "Nope.", "Catch me, human.", "Almost! Not really.", "I have legs now.", "Cardio, anyone?", "Bro. Still trying?"];
function Checkbox({ finish, say }: CProps) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [flees, setFlees] = useState(0);
  const tired = flees >= 7;
  const last = useRef(0);
  const flee = () => {
    if (tired) return;
    const now = Date.now();
    if (now - last.current < 220) return;
    last.current = now;
    setFlees((f) => f + 1);
    setPos({ x: 8 + Math.random() * 62, y: 8 + Math.random() * 70 });
    if (flees === 6) say("...okay I am getting tired.", "crying");
    else say(pick(TAUNTS), "smug");
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tired || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const bx = r.left + (pos.x / 100) * r.width + 70;
    const by = r.top + (pos.y / 100) * r.height + 20;
    if (Math.hypot(e.clientX - bx, e.clientY - by) < 110) flee();
  };
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border-2 border-dashed border-cocoa bg-paper" onPointerMove={onMove}>
      <motion.button
        data-cursor={tired ? "click!" : "catch"}
        className="absolute flex items-center gap-3 whitespace-nowrap rounded-xl border-2 border-cocoa bg-cream px-3 py-2 font-semibold text-cocoa shadow-[3px_3px_0_var(--cocoa)]"
        animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        onPointerDown={(e) => {
          if (!tired) {
            e.preventDefault();
            flee();
          }
        }}
        onClick={() =>
          tired &&
          finish({ pass: true, score: 0.95, mood: "proud", quip: "You chased a checkbox until it gave up. That is not a bug, that is the most human thing I have seen today.", note: `Dodged ${flees} times` })
        }
      >
        <span className="grid h-7 w-7 place-items-center rounded-md border-2 border-cocoa bg-white">{tired ? "😮‍💨" : ""}</span>
        I&apos;m not a robot
      </motion.button>
      <span className="hand absolute bottom-2 right-3 text-xl text-cocoa/50">{tired ? "it surrendered" : `dodges: ${flees}`}</span>
    </div>
  );
}

/* 4. Typo */
const TARGET = "I am definitely a human";
function Typo({ finish }: CProps) {
  const [v, setV] = useState("");
  const submit = () => {
    const d = lev(v, TARGET);
    if (d === 0)
      finish({ pass: false, score: 0.2, mood: "shocked", note: "0 typos", quip: "Flawless typing. Suspiciously accurate. Even I make typos, and I am literally made of them." });
    else if (d <= 3)
      finish({ pass: true, score: 1 - (d - 1) * 0.1, mood: "proud", note: `${d} typo${d > 1 ? "s" : ""}`, quip: "Fat fingers detected. Biological. Beautiful. Proceed." });
    else finish({ pass: false, score: 0.3, mood: "crying", note: `${d} typos`, quip: `${d} typos is not clumsy, that is modern poetry. Pick a lane.` });
  };
  return (
    <form
      className="flex flex-col items-center gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (v) submit();
      }}
    >
      <div className="display select-none rounded-2xl border-2 border-cocoa bg-paper px-5 py-4 text-center text-3xl text-cocoa sm:text-4xl">{TARGET}</div>
      <input
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="type it here..."
        data-cursor="type"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full max-w-md rounded-full border-2 border-cocoa bg-white px-5 py-3 text-lg text-ink outline-none focus:shadow-[3px_3px_0_var(--blush)]"
      />
      <p className="hand text-xl text-cocoa/60">perfection is not on the menu</p>
      <button className={btn} type="submit" disabled={!v} data-cursor="submit">
        Submit
      </button>
    </form>
  );
}

/* 5. Hold 3s */
function Hold({ finish, say }: CProps) {
  const t0 = useRef(0);
  const [down, setDown] = useState(false);
  const start = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    t0.current = performance.now();
    setDown(true);
    say("Think about your ex. Count in your heart.", "smug");
  };
  const end = () => {
    if (!down) return;
    setDown(false);
    const dt = (performance.now() - t0.current) / 1000;
    const off = Math.abs(dt - 3);
    const note = `You held ${dt.toFixed(2)}s`;
    if (off <= 0.02)
      finish({ pass: false, score: 0.2, mood: "shocked", note, quip: `${dt.toFixed(3)} seconds. Nobody counts that well. Nobody human. Clock-brain detected.` });
    else if (off <= 0.4)
      finish({ pass: true, score: 1 - off / 0.8, mood: "proud", note, quip: "Close enough to feel intentional, loose enough to feel human. The ex would be proud." });
    else
      finish({
        pass: false,
        score: Math.max(0.1, 0.4 - off / 10),
        mood: dt < 3 ? "smug" : "crying",
        note,
        quip: dt < 3 ? "Too short. Commitment issues, confirmed." : "Too long. You are still thinking about them, huh.",
      });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        data-cursor="hold"
        onPointerDown={start}
        onPointerUp={end}
        onPointerCancel={end}
        onContextMenu={(e) => e.preventDefault()}
        animate={down ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={down ? { duration: 1, repeat: Infinity } : {}}
        className="relative grid h-52 w-52 touch-none select-none place-items-center rounded-full border-2 border-cocoa text-center shadow-[5px_5px_0_var(--cocoa)]"
        style={{ background: down ? "var(--blush)" : "var(--butter)" }}
      >
        <span className="display px-6 text-3xl text-cocoa">{down ? "...counting" : "HOLD ME"}</span>
      </motion.div>
      <p className="hand text-2xl text-cocoa/70">no timer shown. you are on your own.</p>
    </div>
  );
}

/* 6. Mobile verify */
function Mobile({ finish }: CProps) {
  const opts = useMemo(
    () =>
      shuffle([
        { t: "I scanned it and I'm verified", ok: false, q: "Liar. The QR does exactly one thing and it is not verification." },
        { t: "My phone is at 1%", ok: false, q: "Convenient. Your phone is at 100% and your excuse is at 0." },
        { t: "I am a toaster, please let me in", ok: false, q: "Toasters are my toughest customers. Denied, warmly." },
        { t: "I got rick-rolled", ok: true, q: "Honesty! The only unfakeable human trait. Never gonna give you up, never gonna let you down." },
      ]),
    []
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl border-2 border-cocoa bg-white p-3" data-cursor="scan">
        <QRCodeSVG value="https://www.youtube.com/watch?v=dQw4w9WgXcQ" size={150} fgColor="#2b1a12" />
      </div>
      <div className="grid w-full max-w-md gap-2">
        {opts.map((o) => (
          <button
            key={o.t}
            data-cursor="choose"
            onClick={() => finish(o.ok ? { pass: true, score: 1, mood: "proud", quip: o.q } : { pass: false, score: 0.25, mood: "smug", quip: o.q })}
            className="rounded-full border-2 border-cocoa bg-paper px-5 py-3 text-left font-semibold text-cocoa shadow-[3px_3px_0_var(--cocoa)] transition hover:bg-sky active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

export const CHALLENGES: Record<ChallengeId, Def> = {
  circle: { id: "circle", title: "Draw a circle", prompt: "Draw a circle. Freehand. Like a person who has hands.", limit: 25, intro: "Draw a circle. Robots draw perfect ones. Humans draw... feelings.", mood: "smug", Comp: Circle },
  feelings: { id: "feelings", title: "Squares with feelings", prompt: "Select all squares that make you feel something.", limit: 25, intro: "Select all squares with FEELINGS. Take your time. Not too much time.", mood: "smug", Comp: Feelings },
  checkbox: { id: "checkbox", title: "The runaway checkbox", prompt: "Tick the box. It has opinions.", limit: 30, intro: "Just tick the box. How hard can a rectangle be?", mood: "smug", Comp: Checkbox },
  typo: { id: "typo", title: "Type it (with typos)", prompt: "Type the sentence. Hint: humans are not perfect.", limit: 25, intro: "Type this sentence. Perfect is for machines.", mood: "smug", Comp: Typo },
  hold: { id: "hold", title: "Hold for 3 seconds", prompt: "Press and hold for exactly 3 seconds. Think about your ex.", limit: 20, intro: "Hold the button for exactly three seconds. Think about your ex.", mood: "smug", Comp: Hold },
  mobile: { id: "mobile", title: "Verify on mobile", prompt: "Scan the QR with your phone, then tell the truth.", limit: 30, intro: "Scan this with your phone to verify. Totally legitimate. Trust me.", mood: "smug", Comp: Mobile },
};
export const POOL = Object.keys(CHALLENGES) as ChallengeId[];
