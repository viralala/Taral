"use client";
import { useId, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/audio";
import type { Player, Title } from "@/lib/player";

const TITLES: Title[] = ["Prince", "Princess", "Royal"];

function TitlePicker({ value, onChange, label }: { value: Title; onChange: (t: Title) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="mt-2 flex flex-wrap gap-2">
      {TITLES.map((t) => {
        const on = value === t;
        return (
          <button key={t} type="button" role="radio" aria-checked={on} onClick={() => { onChange(t); sfx("click"); }} data-cursor={t}
            className={`hand min-h-10 px-3.5 py-1.5 text-sm transition ${on ? "bg-navy text-paper" : "bg-paper-2/70 text-navy hover:bg-paper-2"}`}
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

/** "Who are you, traveller?" — both names + titles, required, ≤16 chars. */
export default function NamesForm({ initial, onSubmit }: { initial: Player; onSubmit: (p: Player) => void }) {
  const [p, setP] = useState<Player>(initial);
  const [error, setError] = useState("");
  const heroId = useId();
  const loveId = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const hero = p.hero.trim();
    const love = p.love.trim();
    if (!hero || !love) {
      setError(!hero ? "Every legend needs your name." : "Who are you searching for? Their name, please.");
      sfx("fail");
      return;
    }
    sfx("chime");
    onSubmit({ ...p, hero, love });
  };

  const field = "hand mt-1 w-full border-b-2 border-navy/40 bg-transparent px-1 py-2 text-xl text-navy outline-none placeholder:text-navy/35 focus:border-navy";

  return (
    <div className="absolute inset-0 z-30 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center px-4 py-20">
        <motion.form onSubmit={submit} noValidate
          initial={{ opacity: 0, y: 30, rotate: -1.5 }} animate={{ opacity: 1, y: 0, rotate: -0.6 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="paper-card w-full max-w-md px-6 py-8 md:px-9 md:py-10">
          <h1 className="marker text-4xl text-navy md:text-5xl">Who are you, traveller?</h1>

          <div className="mt-7">
            <label htmlFor={heroId} className="hand text-sm text-navy/75">Your name</label>
            <input id={heroId} value={p.hero} maxLength={16} required autoComplete="given-name" placeholder="e.g. Viral"
              onChange={(e) => { setP({ ...p, hero: e.target.value }); setError(""); }} className={field} />
            <TitlePicker label="Your title" value={p.heroTitle} onChange={(t) => setP({ ...p, heroTitle: t })} />
          </div>

          <div className="mt-7">
            <label htmlFor={loveId} className="hand text-sm text-navy/75">Your beloved&apos;s name</label>
            <input id={loveId} value={p.love} maxLength={16} required autoComplete="off" placeholder="e.g. Asha"
              onChange={(e) => { setP({ ...p, love: e.target.value }); setError(""); }} className={field} />
            <TitlePicker label="Their title" value={p.loveTitle} onChange={(t) => setP({ ...p, loveTitle: t })} />
          </div>

          <p className="hand mt-5 min-h-6 text-sm text-rose" role="alert">{error}</p>

          <button type="submit" data-cursor="begin" className="btn-paint mt-3 w-full text-lg">
            Once upon a time <span aria-hidden>→</span>
          </button>
        </motion.form>
      </div>
    </div>
  );
}
