"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { animate, motion } from "framer-motion";
import { saveRun, topRuns, type Run } from "@/lib/supabase";
import { usePlayer } from "@/lib/player";
import { LEVELS } from "@/lib/story";
import { sfx } from "@/lib/audio";
import type { Level, Res } from "./types";

export function verdictFor(h: number) {
  if (h >= 85) return { v: "Certified Mostly Human", q: "You tried, you failed, you tried again. That is the whole species. Welcome." };
  if (h >= 70) return { v: "Beautifully Flawed", q: "Wobbly moons, fat-finger typos and one chased firefly. Chef's kiss." };
  if (h >= 50) return { v: "Barely Passing as Biological", q: "Human-ish. Like a bakery croissant from a petrol station." };
  if (h >= 30) return { v: "Suspiciously Robotic", q: "Your precision scares me, and I am a firewall with feelings." };
  return { v: "Toaster With Ambitions", q: "A robot never doubts. That is why you are winning. But you are also not human. Try again." };
}

/** Standalone practice result: humanity %, verdict, save to the leaderboard, restart. */
export default function ResultScreen({
  level, results, titles, timeMs, onRestart,
}: { level: Level; results: Res[]; titles: string[]; timeMs: number; onRestart: () => void }) {
  const { player } = usePlayer();
  const humanity = Math.round((results.reduce((a, r) => a + r.score, 0) / Math.max(1, results.length)) * 100);
  const { v, q } = verdictFor(humanity);
  const [shown, setShown] = useState(0);
  const [name, setName] = useState(player.hero);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "offline">("idle");
  const [top, setTop] = useState<Run[]>([]);

  useEffect(() => {
    const c = animate(0, humanity, { duration: 1.6, ease: "easeOut", onUpdate: (n) => setShown(Math.round(n)) });
    sfx("chime");
    if (humanity >= 60) {
      import("canvas-confetti").then((m) => {
        const confetti = m.default;
        const colors = ["#e8f20a", "#7cc35a", "#f6b5c8", "#f2795a", "#9b5bd4", "#efead7"];
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
        setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors }), 300);
        setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors }), 500);
      }).catch(() => {});
    }
    topRuns(level, 5).then(setTop).catch(() => {});
    return () => c.stop();
  }, [humanity, level]);

  const save = async () => {
    if (!name.trim() || saved === "saving" || saved === "ok") return;
    sfx("click");
    setSaved("saving");
    try {
      const r = await saveRun({ name: name.trim().slice(0, 24), level, humanity, time_ms: Math.round(timeMs), verdict: v });
      setSaved(r.error ? "offline" : "ok");
    } catch {
      setSaved("offline"); // network down: don't leave the button stuck on "..."
    }
    topRuns(level, 5).then(setTop).catch(() => {});
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <p className="hand text-sm text-navy/70">{LEVELS[level].name} · practice cleared</p>
      <div>
        <div className="marker text-[5.5rem] leading-none text-navy sm:text-[7.5rem]">
          {shown}<span className="text-4xl">%</span>
        </div>
        <p className="hand -mt-1 text-lg text-navy/70">humanity · {(timeMs / 1000).toFixed(1)} s</p>
      </div>
      <motion.h2
        initial={{ scale: 0.7, rotate: -4, opacity: 0 }}
        animate={{ scale: 1, rotate: -2, opacity: 1 }}
        transition={{ type: "spring", delay: 1.2 }}
        className="marker bg-lime px-5 py-2 text-3xl text-navy sm:text-4xl"
        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      >
        {v}
      </motion.h2>
      <p className="hand max-w-md text-lg text-navy">&ldquo;{q}&rdquo;</p>

      <ul className="flex flex-wrap justify-center gap-2">
        {results.map((r, i) => (
          <li key={i} className={`hand rounded-full border-2 px-3 py-1 text-sm ${r.pass ? "border-leaf bg-leaf/20" : "border-rose bg-rose/10"}`}>
            {r.pass ? "✓" : "✗"} {titles[i]}
          </li>
        ))}
      </ul>

      <div className="flex w-full max-w-md flex-col gap-2 rounded-[18px_26px_16px_22px/22px_16px_26px_18px] border-2 border-dashed border-navy/60 bg-paper-2/60 p-4">
        <p className="marker text-xl text-navy">Sign the Hall of Humans</p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="your name"
            data-cursor="name"
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="min-w-0 flex-1 rounded-full border-2 border-navy bg-white/80 px-4 py-2 text-ink outline-none focus:shadow-[0_0_0_3px_var(--lime)]"
            aria-label="your name"
          />
          <button type="button" onClick={save} disabled={!name.trim() || saved === "ok" || saved === "saving"} data-cursor="save" className="btn-paint !px-5 !py-2">
            {saved === "ok" ? "Saved" : saved === "saving" ? "..." : "Save"}
          </button>
        </div>
        {saved === "offline" && <p className="hand text-sm text-navy/70">The leaderboard is offline. Your humanity remains yours.</p>}
        {top.length > 0 && (
          <ol className="mt-1 text-left">
            {top.map((t, i) => (
              <li key={t.id ?? i} className="hand flex items-center justify-between border-b border-dashed border-navy/25 py-1 text-sm text-navy">
                <span className="truncate">{i + 1}. {t.name}</span>
                <span>{Math.round(t.humanity)}%</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => { sfx("click"); onRestart(); }} data-cursor="again" className="btn-ghost text-navy">Practice again</button>
        <Link href="/" data-cursor="story" className="btn-paint">Play the full story →</Link>
      </div>
      <Link href="/leaderboard" data-cursor="go" className="hand text-sm text-navy/70 underline underline-offset-4">see the leaderboard</Link>
    </div>
  );
}
