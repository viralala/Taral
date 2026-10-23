import Link from "next/link";
import Blossom from "./Blossom";

const links = [
  { href: "/", label: "The story" },
  { href: "/level/1", label: "Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
];

/** Minimal top bar for standalone pages: paper ink on the dark painted night. */
export default function Nav() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
      <Link href="/" data-cursor="home" className="flex items-center gap-2 text-paper">
        <Blossom className="h-7 w-7 spin-slow" />
        <span className="marker text-2xl sm:text-3xl">taral</span>
      </Link>
      <nav className="flex items-center gap-3 sm:gap-6">
        {links.map((l) => (
          <Link key={l.href} href={l.href} data-cursor="go" className={`hand text-xs text-paper/80 transition hover:text-lime sm:text-sm ${l.href === "/" ? "hidden sm:block" : ""}`}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
