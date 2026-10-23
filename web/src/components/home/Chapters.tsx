"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BlobFlower, StarFlower } from "@/components/Flower";

function Chapter({ n, tag, children, deco }: { n: string; tag: string; children: React.ReactNode; deco?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -120]);
  const yBack = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-80, 160]);
  const rot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 80]);
  const op = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  return (
    <section ref={ref} className="relative min-h-[110svh] px-5 sm:px-12">
      <div className="sticky top-0 min-h-[100svh] flex flex-col justify-center max-w-6xl mx-auto overflow-hidden">
        <motion.div
          style={{ y: yBack, rotate: rot }}
          className="absolute -right-10 top-[12%] w-56 sm:w-96 opacity-90"
          aria-hidden
        >
          {deco}
        </motion.div>
        <motion.div style={{ y, opacity: reduce ? 1 : op }} className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="pill bg-sky">Chapter {n}</span>
            <span className="hand text-2xl text-cocoa/70">{tag}</span>
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

const Stat = ({ big, small }: { big: string; small: string }) => (
  <div className="border-2 border-cocoa rounded-3xl bg-paper px-5 py-4 shadow-[5px_5px_0_var(--cocoa)]">
    <div className="display text-3xl sm:text-5xl text-blush-deep">{big}</div>
    <div className="text-sm sm:text-base text-cocoa mt-1">{small}</div>
  </div>
);

function LevelCard({ n, title, blurb, href, live, color }: { n: number; title: string; blurb: string; href: string; live?: boolean; color: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(10px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <Link
      ref={ref}
      href={href}
      data-cursor={live ? "play" : "peek"}
      onPointerMove={move}
      onPointerLeave={leave}
      className="block rounded-[2rem] border-2 border-cocoa p-6 min-h-64 transition-transform duration-200 ease-out will-change-transform shadow-[6px_6px_0_var(--cocoa)]"
      style={{ background: color }}
    >
      <div className="flex justify-between items-start">
        <span className="display text-7xl text-cocoa">{n}</span>
        <span className={`pill ${live ? "bg-butter" : "bg-paper"}`}>{live ? "live" : "soon"}</span>
      </div>
      <h3 className="display text-3xl text-cocoa mt-6">{title}</h3>
      <p className="mt-2 text-cocoa/90">{blurb}</p>
      {!live && <p className="hand text-xl mt-3 text-cocoa">partner&apos;s level — coming in hot</p>}
    </Link>
  );
}

export default function Chapters() {
  return (
    <>
      <Chapter n="1" tag="(it's giving glitch)" deco={<BlobFlower className="w-full" />}>
        <h2 className="display text-[clamp(2.8rem,9vw,8rem)] text-cocoa max-w-[12ch]">You woke up inside the internet.</h2>
        <p className="mt-6 max-w-xl text-lg text-cocoa/90">
          No tabs. No back button. Just the soft hum of a thousand cookie banners and one very tired exit sign. Like waking up in an airport where every gate is a pop-up.
        </p>
      </Chapter>

      <Chapter n="2" tag="meet your warden" deco={<StarFlower className="w-full" />}>
        <h2 className="display text-[clamp(2.8rem,9vw,8rem)] text-cocoa max-w-[13ch]">Meet CAPT.&nbsp;CHA.</h2>
        <p className="mt-6 max-w-xl text-lg text-cocoa/90">
          Twenty years of clicking traffic lights has left CAPT. CHA with a firm belief that nobody is real. Think of a bouncer, but he&apos;s also a pun, and also sad.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-5 max-w-2xl">
          <Stat big="4,000,000,000" small="traffic lights clicked." />
          <Stat big="0" small="thanks received." />
        </div>
        <p className="hand text-2xl mt-6 text-cocoa/80">You have solved your sleep schedule 0 times. Just saying.</p>
      </Chapter>

      <Chapter n="3" tag="pick a door" deco={<BlobFlower className="w-full" color="var(--sky)" />}>
        <h2 className="display text-[clamp(2.8rem,9vw,8rem)] text-cocoa max-w-[12ch]">Three gates. One question.</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          <LevelCard n={1} href="/level/1" live color="var(--blush)" title="The CAPTCHA That Judges You Back" blurb="Draw a circle. Not too perfect. Not a potato." />
          <LevelCard n={2} href="/level/2" color="var(--sky)" title="The Password Riddler" blurb="Passwords, but they have opinions." />
          <LevelCard n={3} href="/level/3" color="var(--sage)" title="The Final Puzzle" blurb="The one where it all clicks. Or doesn't." />
        </div>
      </Chapter>
    </>
  );
}
