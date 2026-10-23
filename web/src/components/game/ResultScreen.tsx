"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { animate, motion } from "framer-motion";
import { saveRun, topRuns, type Run } from "@/lib/supabase";
import type { Res } from "./types";

export function verdictFor(h: number) {
  if (h >= 85) return { v: "Certified Mostly Human", q: "You tried, you failed, you tried again. That is the whole species. Welcome." };
  if (h >= 70) return { v: "Beautifully Flawed", q: "Wobbly circles, fat-finger typos, and one chased checkbox. Chef's kiss." };
  if (h >= 50) return { v: "Barely Passing as Biological", q: "Human-ish. Like a bakery croissant in a gas station." };
  if (h >= 30) return { v: "Suspiciously Robotic", q: "Your precision scares me, and I am a firewall with feelings." };
  return { v: "Toaster With Ambitions", q: "A robot never doubts. That is why you are winning. But you are also not human. Try again." };
}

export default function ResultScreen({
  results, titles, timeMs, onRestart,
}: { results: Res[]; titles: string[]; timeMs: number; onRestart: () => void }) {
  const humanity = Math.round((results.reduce((a, r) => a + r.score, 0) / results.length) * 100);
  const { v, q } = verdictFor(humanity);
  const [shown, setShown] = useState(0);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "offline">("idle");
  const [top, setTop] = useState<Run[]>([]);

  useEffect(() => {
    const c = animate(0, humanity, { duration: 1.6, ease: "easeOut", onUpdate: (n) => setShown(Math.round(n)) });
    if (humanity >= 60) {
      import("canvas-confetti").then((m) => {
        const confetti = m.default;
        const colors = ["#ec8c8c", "#bfe3e4", "#f3d77a", "#b8d4a8", "#6b3f2a"];
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
        setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors }), 300);
        setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 500);
      });
    }
    topRuns(1, 5).then(setTop).catch(() => {});
    return () => c.stop();
  }, [humanity]);

  const save = async () => {
    if (!name.trim() || saved === "saving" || saved === "ok") return;
    setSaved("saving");
    const r = await saveRun({ name: name.trim().slice(0, 24), level: 1, humanity, time_ms: timeMs, verdict: v });
    setSaved(r.error ? "offline" : "ok");
    topRuns(1, 5).then(setTop).catch(() => {});
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="pill bg-sky">Level 1 complete</p>
      <div>
        <div className="display text-[7rem] leading-none text-blush-deep sm:text-[9rem]">{shown}<span className="text-5xl">%</span></div>
        <p className="hand -mt-2 text-2xl text-cocoa/70">humanity</p>
      </div>
      <motion.h2 initial={{ scale: 0.7, rotate: -4, opacity: 0 }} animate={{ scale: 1, rotate: -2, opacity: 1 }} transition={{ type: "spring", delay: 1.2 }} className="display rounded-2xl border-4 border-cocoa bg-butter px-5 py-3 text-4xl text-cocoa sm:text-5xl">
        {v}
      </motion.h2>
      <p className="hand max-w-md text-2xl text-cocoa">&ldquo;{q}&rdquo;</p>

      <ul className="flex flex-wrap justify-center gap-2">
        {results.map((r, i) => (
          <li key={i} className={`pill ${r.pass ? "bg-sage" : "bg-blush/50"}`}>{r.pass ? "✓" : "✗"} {titles[i]}</li>
        ))}
      </ul>

      <div className="flex w-full max-w-md flex-col gap-2 rounded-2xl border-2 border-cocoa bg-paper p-4">
        <p className="display text-2xl text-cocoa">Save to the Hall of Humans</p>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="your name" data-cursor="name"
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="min-w-0 flex-1 rounded-full border-2 border-cocoa bg-white px-4 py-2 text-ink outline-none" />
          <button onClick={save} disabled={!name.trim() || saved === "ok"} data-cursor="save"
            className="rounded-full border-2 border-cocoa bg-blush px-5 py-2 font-bold text-cocoa disabled:opacity-50">
            {saved === "ok" ? "Saved" : saved === "saving" ? "..." : "Save"}
          </button>
        </div>
        {saved === "offline" && <p className="hand text-xl text-cocoa/70">Leaderboard is offline. Your humanity remains yours.</p>}
        {top.length > 0 && (
          <ol className="mt-1 text-left">
            {top.map((t, i) => (
              <li key={t.id ?? i} className="flex items-center justify-between border-b border-dashed border-cocoa/30 py-1 text-sm font-semibold text-cocoa">
                <span>{i + 1}. {t.name}</span><span>{t.humanity}%</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={onRestart} data-cursor="again" className="rounded-full border-2 border-cocoa bg-paper px-6 py-3 font-bold text-cocoa shadow-[3px_3px_0_var(--cocoa)]">Play again</button>
        <Link href="/level/2" data-cursor="go" className="rounded-full border-2 border-cocoa bg-butter px-6 py-3 font-bold text-cocoa shadow-[3px_3px_0_var(--cocoa)]">Proceed to Level 2 →</Link>
      </div>
    </div>
  );
}
