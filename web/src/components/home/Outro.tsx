"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Marquee } from "@/components/fun";
import { StarFlower } from "@/components/Flower";

const PUNS = [
  "Proving you're human is like arguing with a toaster about bread",
  "Ctrl+Alt+Defeat",
  "I'm not a robot, I'm just emotionally buffering",
  "Clicking traffic lights since 2004, still no thank-you card",
  "Trust issues, but make it HTTPS",
  "404: Confidence not found",
  "Your sleep schedule is a 500 Internal Server Error",
  "Passing a CAPTCHA is just peer pressure with pixels",
];

export default function Outro() {
  return (
    <>
      <div className="py-16 sm:py-24">
        <Marquee items={PUNS} />
      </div>

      <section className="px-5 sm:px-12 py-24 sm:py-40 max-w-5xl mx-auto text-center">
        <motion.p
          className="display text-[clamp(2rem,6vw,4.5rem)] text-cocoa"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
        >
          You scrolled this far and still haven&apos;t clicked anything. Bold.
        </motion.p>
        <motion.p
          className="hand text-3xl sm:text-5xl text-blush-deep mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-30%" }}
          transition={{ duration: 1.6 }}
        >
          A robot never doubts. That&apos;s why you&apos;re winning.
        </motion.p>
      </section>

      <section className="relative px-5 sm:px-12 pb-32 text-center">
        <StarFlower className="w-24 mx-auto spin-slow mb-6" />
        <h2 className="display text-[clamp(3rem,10vw,9rem)] text-cocoa">
          Ready to be
          <br />
          judged?
        </h2>
        <p className="mt-5 text-lg text-cocoa/80 max-w-md mx-auto">
          Being human was never about passing. It was about trying anyway.
        </p>
        <Link
          href="/level/1"
          data-cursor="go"
          className="inline-block mt-8 rounded-full bg-blush border-2 border-cocoa px-10 py-4 font-bold uppercase tracking-widest text-cocoa shadow-[5px_5px_0_var(--cocoa)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--cocoa)] transition-all"
        >
          Start Level 1
        </Link>
      </section>
    </>
  );
}
