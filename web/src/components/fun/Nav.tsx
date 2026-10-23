"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StarFlower } from "../Flower";

const links = [
  { href: "/", label: "Story" },
  { href: "/level/1", label: "Level 1" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const f = () => setStuck(window.scrollY > 80);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6">
      <nav
        className={`flex w-full items-center justify-between gap-3 rounded-full px-4 py-2 transition-all duration-500 md:px-6 ${
          stuck ? "max-w-3xl border-2 border-cocoa bg-paper/95 shadow-[3px_3px_0_var(--cocoa)]" : "max-w-7xl border-2 border-transparent"
        }`}
      >
        <Link href="/" data-cursor="home" className="flex items-center gap-2">
          <StarFlower className="h-6 w-6 spin-slow" />
          <span className="display text-3xl text-cocoa">taral</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="go"
              className={`text-xs font-semibold uppercase tracking-wider text-cocoa hover:underline md:text-sm ${l.href === "/" ? "hidden sm:block" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <span className="pill hidden bg-sky !py-1 !text-[0.65rem] lg:inline-flex">humanity: unverified</span>
        </div>
      </nav>
    </header>
  );
}
