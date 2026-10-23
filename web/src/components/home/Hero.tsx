"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import HoldButton from "./HoldButton";
import { RickQR } from "@/components/fun";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const WORDS = ["Are", "you", "even", "human?"];
const ease = [0.22, 1, 0.36, 1] as const;
const TAGS: [string, string][] = [
  ["3 LEVELS", "bg-sky"],
  ["NO ROBOTS", "bg-blush"],
  ["CERTIFIED VIBES", "bg-butter"],
];

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <HeroScene />
      </div>
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-5 text-center pointer-events-none">
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-6"
          initial="h"
          animate="s"
          variants={{ s: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          {TAGS.map(([t, c]) => (
            <motion.span key={t} className={`pill ${c}`} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }}>
              {t}
            </motion.span>
          ))}
        </motion.div>
        <h1 className="display text-[clamp(3.5rem,13vw,12rem)] text-cocoa max-w-[15ch]">
          {WORDS.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.22em] last:mr-0">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.12, ease }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="hand text-2xl sm:text-3xl text-cocoa/80 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          a security bot has some questions. mostly about your feelings.
        </motion.p>
        <motion.div
          className="mt-8 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, type: "spring" }}
        >
          <HoldButton />
        </motion.div>
      </div>
      <div className="absolute bottom-5 right-5 z-10 hidden sm:flex flex-col items-center">
        <RickQR size={84} caption="scan to skip the captcha" />
      </div>
      <div className="absolute bottom-5 left-5 z-10 sm:hidden">
        <RickQR size={64} caption="scan to skip the captcha" />
      </div>
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hand text-xl text-cocoa/70 hidden sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        scroll, if you must ↓
      </motion.div>
    </section>
  );
}
