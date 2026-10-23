"use client";
import { createContext, useContext, useEffect, useState } from "react";

// The player's name and their partner's name, typed on the name screen.
// Titles are the player's choice so the story fits any couple.
export type Title = "Prince" | "Princess" | "Royal";
export type Player = { hero: string; love: string; heroTitle: Title; loveTitle: Title };

const EMPTY: Player = { hero: "", love: "", heroTitle: "Prince", loveTitle: "Princess" };
const KEY = "taral.player";

const Ctx = createContext<{ player: Player; setPlayer: (p: Player) => void }>({ player: EMPTY, setPlayer: () => {} });

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setState] = useState<Player>(EMPTY);
  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setState({ ...EMPTY, ...JSON.parse(s) });
    } catch {}
  }, []);
  const setPlayer = (p: Player) => {
    setState(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  };
  return <Ctx.Provider value={{ player, setPlayer }}>{children}</Ctx.Provider>;
}

export const usePlayer = () => useContext(Ctx);

/** "Prince Viral" style display name; "Royal" titles collapse to just the name. */
export function styled(name: string, title: Title, fallback: string) {
  const n = name.trim() || fallback;
  return title === "Royal" ? n : `${title} ${n}`;
}
