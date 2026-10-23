"use client";
import { motion } from "framer-motion";

export default function Stamp({ pass }: { pass: boolean }) {
  const c = pass ? "#4f8a4a" : "var(--blush-deep)";
  return (
    <motion.div
      initial={{ scale: 3.2, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: -9, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 15, mass: 0.7 }}
      className="display inline-block select-none rounded-2xl px-8 py-2 text-7xl sm:text-8xl"
      style={{ color: c, border: `8px double ${c}`, mixBlendMode: "multiply" }}
    >
      {pass ? "PASS" : "FAIL"}
    </motion.div>
  );
}
