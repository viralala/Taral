import Link from "next/link";
import { BlobFlower } from "../Flower";

export default function Footer() {
  return (
    <footer className="relative mx-auto mt-32 max-w-7xl overflow-hidden px-6 pb-10 pt-20">
      <BlobFlower className="absolute -right-10 top-4 h-40 w-40 opacity-80" />
      <h2 className="display max-w-4xl text-6xl text-cocoa md:text-9xl">Stay weird. Robots can&apos;t.</h2>
      <p className="hand mt-6 text-2xl text-cocoa">A robot never doubts. That&apos;s why you&apos;re winning.</p>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-cocoa/30 pt-6 text-sm text-cocoa">
        <span>Built in 2 hours, one existential crisis at a time.</span>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noreferrer"
          data-cursor="trust me"
          className="underline"
        >
          Terms of Service
        </a>
        <Link href="/leaderboard" data-cursor="go" className="underline">
          Leaderboard
        </Link>
      </div>
    </footer>
  );
}
