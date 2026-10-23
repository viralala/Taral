"use client";
import { TRIALS } from "./index";

const noop = () => {};

/** The /level/n practice route: the same trial, standalone (no story to hand the result to). */
export default function TrialPractice({ n }: { n: 1 | 2 | 3 }) {
  const Trial = TRIALS[n].Component;
  return <Trial onComplete={noop} standalone />;
}
