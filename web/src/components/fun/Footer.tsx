import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto mt-16 w-full max-w-5xl px-4 pb-8 sm:px-6">
      <p className="marker text-3xl text-paper sm:text-5xl">Stay weird. Robots can&apos;t.</p>
      <div className="hand mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-paper/20 pt-4 text-xs text-paper/70 sm:text-sm">
        <span>A Taral production · Pixathon by Insight AI</span>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer" data-cursor="trust me" className="underline underline-offset-4 hover:text-lime">
          Terms of Service
        </a>
        <Link href="/leaderboard" data-cursor="go" className="underline underline-offset-4 hover:text-lime">Leaderboard</Link>
      </div>
    </footer>
  );
}
