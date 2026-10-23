"use client";
import { useEffect, useRef, useState } from "react";

// A glowing blossom firefly (Kaizen's guided bird, reimagined) that leaves a trail of painted petals.
// The ring springs behind it and blooms with a label over any [data-cursor="label"] element.
// Only on fine pointers; touch devices keep their native behaviour.
export default function Cursor() {
  const fly = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [inside, setInside] = useState(true);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    const r = { ...m };
    const f = { ...m };
    let raf = 0;
    let last = 0;
    let lastLabel: string | null = null;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      m.x = e.clientX; m.y = e.clientY;
      const t = (e.target as Element | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const l = t ? t.dataset.cursor || "" : null;
      if (l !== lastLabel) { lastLabel = l; setLabel(l); }
      const now = performance.now();
      if (!reduce && now - last > 55) { last = now; petal(e.clientX, e.clientY); }
    };
    const loop = () => {
      f.x += (m.x - f.x) * 0.45; f.y += (m.y - f.y) * 0.45;
      r.x += (m.x - r.x) * 0.14; r.y += (m.y - r.y) * 0.14;
      if (fly.current) fly.current.style.transform = `translate3d(${f.x}px,${f.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px,${r.y}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    const leave = () => setInside(false);
    const enter = () => setInside(true);
    addEventListener("pointermove", move);
    addEventListener("pointerdown", d);
    addEventListener("pointerup", u);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", d);
      removeEventListener("pointerup", u);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!on) return null;
  const big = label !== null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: inside ? 1 : 0, transition: "opacity .3s" }}>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="hand flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[11px] leading-tight text-navy"
          style={{
            width: big ? 84 : 34, height: big ? 84 : 34,
            border: big ? "0 solid transparent" : "1.5px solid rgba(246,181,200,.7)",
            background: big ? "rgba(246,181,200,.92)" : "transparent",
            boxShadow: big ? "0 0 30px 6px rgba(246,181,200,.35)" : "none",
            borderRadius: big ? "58% 42% 55% 45% / 45% 55% 45% 55%" : "50%",
            scale: down ? 0.82 : 1,
            transition: "width .35s cubic-bezier(.3,1.4,.5,1), height .35s cubic-bezier(.3,1.4,.5,1), background .25s, border-radius .4s, scale .2s",
          }}
        >
          <span style={{ opacity: big ? 1 : 0, transition: "opacity .2s" }}>{label}</span>
        </div>
      </div>
      <div ref={fly} className="absolute left-0 top-0">
        <div className="-translate-x-1/2 -translate-y-1/2" style={{ opacity: big ? 0 : 1, transition: "opacity .2s" }}>
          <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,242,10,.45) 0%, rgba(246,181,200,.25) 45%, transparent 70%)", animation: "twinkle 2.2s ease-in-out infinite" }} />
          <svg viewBox="-12 -12 24 24" className="spin-slow relative block h-6 w-6">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-5.5" rx="3.6" ry="5.4" fill="#f6b5c8" transform={`rotate(${a})`} />
            ))}
            <circle r="3" fill="#e8f20a" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const PETALS = ["#f6b5c8", "#ef3f7a", "#e8f20a", "#ffb98a", "#f9cfdc"];
let live = 0;

/** One painted petal that tumbles down and fades out. */
function petal(x: number, y: number) {
  if (live > 28) return;
  live++;
  const el = document.createElement("span");
  const c = PETALS[(Math.random() * PETALS.length) | 0];
  const s = 6 + Math.random() * 6;
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${s}px;height:${s * 0.7}px;border-radius:100% 0 100% 0;background:${c};pointer-events:none;z-index:99;opacity:.9;box-shadow:0 0 6px ${c}66;transform:translate(-50%,-50%) rotate(${Math.random() * 360}deg);transition:transform 1.1s cubic-bezier(.2,.8,.2,1),opacity 1.1s ease-out;`;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = `translate(${(Math.random() - 0.5) * 60 - 50}%, ${28 + Math.random() * 46}px) rotate(${Math.random() * 540}deg) scale(.35)`;
    el.style.opacity = "0";
  });
  setTimeout(() => { el.remove(); live--; }, 1150);
}
