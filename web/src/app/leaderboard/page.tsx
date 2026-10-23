"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase, topRuns, type Run } from "@/lib/supabase";
import { LEVELS } from "@/lib/story";
import { Backdrop, Blossom, Footer, Nav } from "@/components/fun";

const podium = ["var(--lime)", "var(--blossom)", "var(--mint)"];
const BAR = "M1 3 C 25 1.5, 50 4.5, 99 3";

export default function Leaderboard() {
  const [level, setLevel] = useState<1 | 2 | 3>(3);
  const [rows, setRows] = useState<Run[] | null>(null);

  useEffect(() => {
    let live = true;
    setRows(null);
    topRuns(level, 20).then((r) => live && setRows(r)).catch(() => live && setRows([]));
    return () => {
      live = false;
    };
  }, [level]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Backdrop tint="dusk" />
      <Nav />
      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-6 pt-10 sm:px-6 sm:pt-16">
        <p className="hand text-sm text-paper/60">the royal records</p>
        <h1 className="marker -rotate-1 text-5xl text-paper sm:text-7xl">Hall of Humans</h1>
        <p className="hand mt-3 text-base text-paper/80 sm:text-lg">CAPT. CHA has solved 4 billion CAPTCHAs. These people have at least tried.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {([3, 1, 2] as const).map((l) => (
            <button
              type="button"
              key={l}
              data-cursor="view"
              onClick={() => setLevel(l)}
              aria-pressed={level === l}
              className={`hand rounded-full border-2 px-4 py-1.5 text-xs transition sm:text-sm ${level === l ? "border-lime bg-lime text-navy" : "border-paper/40 text-paper/80 hover:border-lime"}`}
            >
              {LEVELS[l].name}
            </button>
          ))}
        </div>

        <div className="paper-card mt-6 px-3 py-4 sm:px-6 sm:py-6">
          {rows === null && <p className="hand py-6 text-center text-lg text-navy/70">Interrogating the royal database...</p>}
          {rows && rows.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="marker text-3xl text-navy">{supabase ? "No humans yet. Suspicious." : "The royal records are offline."}</p>
              {!supabase && <p className="hand text-sm text-navy/70">Scores can&apos;t be saved or shown right now. The trials still work.</p>}
              <Link href={`/level/${level}`} data-cursor="play" className="btn-paint">Be the first</Link>
            </div>
          )}
          <div className="space-y-2">
            {rows?.map((r, i) => (
              <motion.div
                key={`${level}-${i}-${r.name}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 border-2 border-navy/70 px-3 py-2"
                style={{
                  background: i < 3 ? podium[i] : "transparent",
                  borderRadius: "14px 20px 12px 18px / 18px 12px 20px 14px",
                  rotate: i < 3 ? `${(i - 1) * 0.6}deg` : undefined,
                }}
              >
                {i < 3 ? (
                  <div className="relative h-9 w-9 shrink-0">
                    <Blossom className="h-9 w-9" color="var(--paper)" />
                    <span className="marker absolute inset-0 grid place-items-center text-sm text-navy">{i + 1}</span>
                  </div>
                ) : (
                  <span className="marker w-9 shrink-0 text-center text-lg text-navy">{i + 1}</span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-base text-navy">{r.name}</span>
                    <span className="hand shrink-0 text-xs text-navy/70">{(r.time_ms / 1000).toFixed(1)} s</span>
                  </div>
                  <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="mt-1 h-2 w-full" aria-hidden>
                    <path d={BAR} stroke="var(--navy)" strokeOpacity=".15" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d={BAR} pathLength={1} strokeDasharray={`${Math.max(0, Math.min(100, r.humanity)) / 100} 1`} stroke="var(--navy)" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </svg>
                  {r.verdict && <p className="hand mt-0.5 truncate text-xs text-navy/80">{r.verdict}</p>}
                </div>
                <span className="marker text-xl text-navy">{Math.round(r.humanity)}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
