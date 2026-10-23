import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav, Footer, RageToast } from "@/components/fun";
import { BlobFlower, StarFlower } from "@/components/Flower";

const LEVELS: Record<string, { title: string; ps: string; quip: string }> = {
  "2": {
    title: "The Password Riddler",
    ps: "PS 02",
    quip: "Passwords are just riddles you forgot the answer to. I have 40 billion of them. Yours is 'password1'.",
  },
  "3": {
    title: "The Final Puzzle",
    ps: "PS 03",
    quip: "This is the last gate. Also the one I haven't finished writing insults for. Be gentle.",
  },
};

export function generateStaticParams() {
  return [{ n: "2" }, { n: "3" }];
}

// PARTNER: replace <ComingSoon/> with your game component
function ComingSoon({ title, ps, quip }: { title: string; ps: string; quip: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="relative">
        <BlobFlower className="h-32 w-32" />
        <StarFlower className="absolute -right-8 -top-4 h-14 w-14 spin-slow" color="var(--butter)" />
      </div>
      <span className="pill bg-sky">{ps}</span>
      <h1 className="display text-6xl text-cocoa md:text-8xl">{title}</h1>
      <p className="hand max-w-xl text-3xl text-cocoa">&ldquo;{quip}&rdquo;</p>
      <p className="max-w-md text-cocoa/80">
        Your teammate is building this level right now. Like a bridge built mid-crossing.
      </p>
      <Link href="/level/1" data-cursor="back" className="pill bg-blush hover:bg-blush-deep">
        Back to Level 1
      </Link>
    </div>
  );
}

export default async function LevelPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const lvl = LEVELS[n];
  if (!lvl) notFound();
  return (
    <main className="relative">
      <Nav />
      <ComingSoon {...lvl} />
      <Footer />
      <RageToast />
    </main>
  );
}
