"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { topRuns, type Run } from "@/lib/supabase";
import { Nav, Footer } from "@/components/fun";
import { BlobFlower } from "@/components/Flower";

const podium = ["var(--butter)", "var(--sky)", "var(--blush)"];

export default function Leaderboard() {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
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
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-36">
        <h1 className="display text-6xl text-cocoa md:text-8xl">Hall of Humans</h1>
        <p className="hand mt-4 text-2xl text-cocoa">
          CAPT. CHA has solved 4 billion CAPTCHAs. These people have at least tried.
        </p>
        <div className="mt-10 flex gap-3">
          {([1, 2, 3] as const).map((l) => (
            <button
              key={l}
              data-cursor="view"
              onClick={() => setLevel(l)}
              className={`pill ${level === l ? "bg-blush" : "bg-paper"}`}
            >
              Level {l}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          {rows === null && <p className="hand text-2xl text-cocoa">Interrogating the database...</p>}
          {rows && rows.length === 0 && (
            <p className="display py-16 text-center text-4xl text-cocoa">No humans yet. Suspicious.</p>
          )}
          {rows?.map((r, i) => (
            <motion.div
              key={`${level}-${i}-${r.name}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative flex items-center gap-4 rounded-3xl border-2 border-cocoa bg-paper px-4 py-3"
              style={i < 3 ? { background: podium[i] } : undefined}
            >
              {i < 3 ? (
                <div className="relative h-10 w-10 shrink-0">
                  <BlobFlower className="h-10 w-10" color="var(--paper)" />
                  <span className="display absolute inset-0 grid place-items-center text-lg text-cocoa">{i + 1}</span>
                </div>
              ) : (
                <span className="display w-10 shrink-0 text-center text-xl text-cocoa">{i + 1}</span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-semibold text-cocoa">{r.name}</span>
                  <span className="shrink-0 text-xs text-cocoa/70">{(r.time_ms / 1000).toFixed(1)}s</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full border border-cocoa bg-cream">
                  <div className="h-full bg-cocoa" style={{ width: `${Math.max(0, Math.min(100, r.humanity))}%` }} />
                </div>
                {r.verdict && <p className="hand mt-1 truncate text-lg text-cocoa">{r.verdict}</p>}
              </div>
              <span className="display text-2xl text-cocoa">{Math.round(r.humanity)}%</span>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
