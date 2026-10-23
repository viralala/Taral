"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TRIALS, type TrialResult as LevelResult } from "@/trials";
import { ENDING, INTRO, LEVEL_INTRO, fill, type Line, type SceneArt } from "@/lib/story";
import { loadMutedPref, music, sfx, stopNarration, unlockAudio, type Mood } from "@/lib/audio";
import { styled, usePlayer, type Player } from "@/lib/player";
import Stage from "./Stage";
import Loader from "./Loader";
import NamesForm from "./NamesForm";
import { Caption, TitleCard, useNarration } from "./Caption";
import { Logo, SkipButton, SoundToggle } from "./Chrome";
import { BeginPanel, ChapterCard, ClueCard, Completion, LevelHud, type Lvl } from "./Cards";
import { PaintDefs, STORY_CSS } from "./paint";

type Phase =
  | { k: "loading" } | { k: "names" } | { k: "intro"; i: number } | { k: "begin" }
  | { k: "chapter"; n: Lvl } | { k: "levelIntro"; n: Lvl } | { k: "play"; n: Lvl } | { k: "clue"; n: Lvl }
  | { k: "ending"; i: number } | { k: "done" };

const INTRO_MOOD: Partial<Record<SceneArt, Mood>> = {
  kingdom: "blossom", meet: "blossom", king: "night", taken: "night", note: "night", montage: "joy", glimpse: "joy",
};
const LEVEL_MOOD: Record<Lvl, Mood> = { 1: "forest", 2: "bridge", 3: "tower" };

function artOf(p: Phase): SceneArt {
  switch (p.k) {
    case "loading": case "names": return "kingdom";
    case "intro": return INTRO[p.i].art;
    case "begin": return "glimpse";
    case "chapter": case "levelIntro": case "play": case "clue": return LEVEL_INTRO[p.n].art;
    case "ending": return ENDING[p.i].art;
    case "done": return "reunion";
  }
}
function dimOf(p: Phase) {
  return { names: 0.45, chapter: 0.25, play: 0.62, clue: 0.55, done: 0.42 }[p.k as string] ?? 0;
}
function moodOf(p: Phase): Mood {
  switch (p.k) {
    case "loading": case "names": return "night";
    case "intro": return INTRO_MOOD[INTRO[p.i].art] ?? "night";
    case "chapter": case "levelIntro": case "play": case "clue": return LEVEL_MOOD[p.n];
    default: return "joy";
  }
}
function lineOf(p: Phase): { line: Line; pos: number; total: number } | null {
  if (p.k === "intro") return { line: INTRO[p.i], pos: p.i + 1, total: INTRO.length };
  if (p.k === "ending") return { line: ENDING[p.i], pos: p.i + 1, total: ENDING.length };
  if (p.k === "levelIntro") return { line: LEVEL_INTRO[p.n], pos: p.n, total: 3 };
  return null;
}

/** The whole fairytale at "/": loader → names → intro → three trials → ending → completion. */
export default function Quest() {
  const { player, setPlayer } = usePlayer();
  const [phase, setPhase] = useState<Phase>({ k: "loading" });
  const [results, setResults] = useState<Partial<Record<Lvl, LevelResult>>>({});
  const [run, setRun] = useState(0);
  const booted = useRef(false);

  const hero = styled(player.hero, player.heroTitle, "the hero");
  const love = styled(player.love, player.loveTitle, "their beloved");
  const started = phase.k !== "loading";
  const narrated = lineOf(phase);
  const caption = narrated ? fill(narrated.line.caption, hero, love) : "";

  const next = useCallback(() => {
    setPhase((p) => {
      if (p.k === "intro") return p.i < INTRO.length - 1 ? { k: "intro", i: p.i + 1 } : { k: "begin" };
      if (p.k === "ending") return p.i < ENDING.length - 1 ? { k: "ending", i: p.i + 1 } : { k: "done" };
      if (p.k === "levelIntro") return { k: "play", n: p.n };
      return p;
    });
  }, []);

  const skip = useCallback(() => {
    stopNarration();
    setPhase((p) => {
      if (p.k === "intro") return { k: "begin" };
      if (p.k === "ending") return { k: "done" };
      if (p.k === "levelIntro") return { k: "play", n: p.n };
      return p;
    });
  }, []);

  const progress = useNarration(narrated?.line.id ?? null, caption, next);

  // music follows the story
  const mood = moodOf(phase);
  useEffect(() => { if (started) music.setMood(mood); }, [mood, started]);

  // never leave a narrator talking or music playing after leaving the page
  useEffect(() => () => { stopNarration(); music.stop(); }, []);

  // keyboard: → / Space / Enter advances, Esc skips the cinematic
  useEffect(() => {
    if (!narrated) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); skip(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === " " || e.key === "Enter") {
        // a focused button (the full-screen "Next line" one included) already handles its own activation
        if ((e.target as Element | null)?.closest?.("button, a, input, textarea, select")) return;
        e.preventDefault();
        next();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [narrated, next, skip]);

  const start = async () => {
    // the loader stays clickable while it fades out; only the first tap boots the story
    if (booted.current) return;
    booted.current = true;
    loadMutedPref();
    try { await unlockAudio(); } catch {}
    music.start("night");
    sfx("chime");
    setPhase({ k: "names" });
  };

  const onNames = (p: Player) => {
    setPlayer(p);
    // the exiting form can still be submitted again; never rewind a tale that already moved on
    setPhase((cur) => (cur.k === "names" ? { k: "intro", i: 0 } : cur));
  };

  const onLevel = useCallback((r: LevelResult) => {
    setResults((prev) => ({ ...prev, [r.level]: r }));
    setPhase((p) => (p.k === "play" ? { k: "clue", n: p.n } : p));
  }, []);

  const afterClue = (n: Lvl) => setPhase(n < 3 ? { k: "chapter", n: (n + 1) as Lvl } : { k: "ending", i: 0 });

  const playAgain = () => {
    setResults({});
    setRun((r) => r + 1);
    setPhase({ k: "intro", i: 0 });
  };

  const done = Object.values(results).filter(Boolean) as LevelResult[];
  const humanity = done.length ? Math.round(done.reduce((a, r) => a + r.humanity, 0) / done.length) : 0;
  const timeMs = done.reduce((a, r) => a + r.timeMs, 0);

  return (
    <main className="fixed inset-0 overflow-hidden bg-night text-paper">
      <style>{STORY_CSS}</style>
      <PaintDefs />

      {started && <Stage art={artOf(phase)} dim={dimOf(phase)} />}

      {/* readability scrim behind captions */}
      {narrated && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45vh] bg-gradient-to-t from-night/80 via-night/35 to-transparent" />}

      <AnimatePresence mode="wait">
        {phase.k === "names" && <NamesForm key="names" initial={player} onSubmit={onNames} />}
      </AnimatePresence>

      {narrated && (
        <>
          <button type="button" onClick={next} data-cursor="next" aria-label="Next line"
            className="absolute inset-0 z-[15] h-full w-full cursor-pointer focus-visible:outline-none" />
          <AnimatePresence mode="wait">
            {narrated.line.title && phase.k !== "levelIntro" && (
              <motion.div key={narrated.line.id} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
                <TitleCard title={fill(narrated.line.title, player.hero.trim() || "the hero", player.love.trim() || "their beloved")} />
              </motion.div>
            )}
          </AnimatePresence>
          <Caption key={narrated.line.id} text={caption} progress={progress} />
          <p className="hand pointer-events-none fixed bottom-5 left-4 z-40 text-xs text-paper/60 tabular-nums md:bottom-7 md:left-6" aria-hidden>
            {String(narrated.pos).padStart(2, "0")} / {String(narrated.total).padStart(2, "0")}
          </p>
          <p className="hand pointer-events-none absolute inset-x-0 bottom-[5.5vh] z-20 text-center text-[11px] text-paper/45 md:bottom-[4vh]" aria-hidden>
            Tap to continue
          </p>
          <SkipButton onSkip={skip} />
        </>
      )}

      {phase.k === "begin" && <BeginPanel onBegin={() => setPhase({ k: "chapter", n: 1 })} onReplay={() => setPhase({ k: "intro", i: 0 })} />}

      {phase.k === "chapter" && <ChapterCard key={`c${phase.n}`} level={phase.n} onDone={() => setPhase({ k: "levelIntro", n: phase.n })} />}

      {phase.k === "play" && (
        <>
          <LevelHud level={phase.n} cleared={phase.n - 1} />
          <div className="absolute inset-0 z-30 overflow-y-auto overscroll-contain">
            <motion.div key={`p${phase.n}-${run}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center px-3 pb-12 pt-24 md:px-6 md:pt-28">
              <TrialSlot n={phase.n} onComplete={onLevel} />
            </motion.div>
          </div>
        </>
      )}

      {phase.k === "clue" && (
        <>
          <LevelHud level={phase.n} cleared={phase.n} />
          <ClueCard level={phase.n} humanity={results[phase.n]?.humanity ?? 0} onNext={() => afterClue(phase.n)} />
        </>
      )}

      {phase.k === "done" && (
        <Completion hero={hero} love={love} heroName={player.hero || "Anonymous"} humanity={humanity} timeMs={timeMs}
          onAgain={playAgain} onRename={() => { setResults({}); setPhase({ k: "names" }); }} />
      )}

      {started && phase.k !== "play" && phase.k !== "clue" && <Logo />}
      {started && <SoundToggle />}

      <AnimatePresence>{phase.k === "loading" && <Loader key="loader" onStart={start} />}</AnimatePresence>
    </main>
  );
}

/** Renders whichever game is registered for trial n in src/trials (Tana swaps trials 2 and 3 there). */
function TrialSlot({ n, onComplete }: { n: Lvl; onComplete: (r: LevelResult) => void }) {
  const Trial = TRIALS[n].Component;
  return <Trial onComplete={onComplete} />;
}
