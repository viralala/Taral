import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Backdrop, Nav } from "@/components/fun";
import { LEVELS } from "@/lib/story";
import TrialPractice from "@/trials/Practice";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ n: "1" }, { n: "2" }, { n: "3" }];
}

const parse = (n: string) => (n === "1" || n === "2" || n === "3" ? (Number(n) as 1 | 2 | 3) : null);
const TINT = { 1: "forest", 2: "bridge", 3: "tower" } as const;

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const level = parse((await params).n);
  return { title: level ? `Practice · ${LEVELS[level].name} — Taral` : "Taral" };
}

export default async function LevelPage({ params }: { params: Promise<{ n: string }> }) {
  const level = parse((await params).n);
  if (!level) notFound();
  return (
    <main className="relative min-h-screen overflow-x-hidden pb-12">
      <Backdrop tint={TINT[level]} />
      <Nav />
      <div className="relative z-10 mx-auto mt-6 flex w-full max-w-[640px] flex-col gap-4 px-4 sm:mt-10">
        <div className="flex flex-wrap items-end justify-between gap-2 text-paper">
          <div>
            <p className="hand text-xs text-paper/60">practice mode</p>
            <h1 className="marker text-3xl sm:text-4xl">{LEVELS[level].name}</h1>
          </div>
          <div className="hand flex gap-2 text-xs sm:text-sm">
            {([1, 2, 3] as const).map((l) => (
              <Link
                key={l}
                href={`/level/${l}`}
                data-cursor="go"
                aria-current={l === level ? "page" : undefined}
                className={`rounded-full border-2 px-3 py-1 transition ${l === level ? "border-lime bg-lime text-navy" : "border-paper/40 text-paper/80 hover:border-lime"}`}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
        <TrialPractice key={level} n={level} />
        <Link href="/" data-cursor="story" className="hand self-center text-sm text-paper/80 underline underline-offset-4 hover:text-lime">
          Play the full story →
        </Link>
      </div>
    </main>
  );
}
