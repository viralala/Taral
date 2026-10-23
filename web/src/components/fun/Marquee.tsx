import { StarFlower } from "../Flower";

export default function Marquee({ items }: { items: string[] }) {
  const row = (k: string) => (
    <div key={k} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={k === "b"}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="display text-3xl text-cocoa md:text-5xl">{t}</span>
          <StarFlower className="h-6 w-6 shrink-0" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee group overflow-hidden py-4">
      <div className="marquee-track flex w-max">
        {row("a")}
        {row("b")}
      </div>
      <style>{`
        .marquee-track{animation:marquee 30s linear infinite}
        .marquee:hover .marquee-track{animation-play-state:paused}
        @keyframes marquee{to{transform:translateX(-50%)}}
      `}</style>
    </div>
  );
}
