"use client";
import { useEffect, useRef, useState } from "react";
import { StarFlower } from "./Flower";

// Flower cursor with a springy trailing ring and a petal trail.
// Any element with data-cursor="label" grows the ring and shows the label.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    const r = { ...m };
    let raf = 0;
    let last = 0;

    const move = (e: PointerEvent) => {
      m.x = e.clientX; m.y = e.clientY;
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(t ? t.dataset.cursor || "" : null);
      const now = performance.now();
      if (now - last > 45) { last = now; petal(e.clientX, e.clientY); }
    };
    const loop = () => {
      r.x += (m.x - r.x) * 0.16; r.y += (m.y - r.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${m.x}px,${m.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px,${r.y}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const d = () => setDown(true), u = () => setDown(false);
    addEventListener("pointermove", move);
    addEventListener("pointerdown", d);
    addEventListener("pointerup", u);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", d);
      removeEventListener("pointerup", u);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cocoa flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-cocoa transition-all duration-300 ease-out"
          style={{ width: label !== null ? 96 : 36, height: label !== null ? 96 : 36, background: label !== null ? "var(--butter)" : "transparent", scale: down ? 0.8 : 1 }}
        >
          {label}
        </div>
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[101] hidden md:block">
        <StarFlower className="-translate-x-1/2 -translate-y-1/2 w-5 h-5 spin-slow" />
      </div>
    </>
  );
}

const colors = ["#ec8c8c", "#bfe3e4", "#f3d77a", "#b8d4a8"];
function petal(x: number, y: number) {
  const el = document.createElement("span");
  const c = colors[(Math.random() * colors.length) | 0];
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:8px;height:12px;border-radius:50%;background:${c};pointer-events:none;z-index:99;transform:translate(-50%,-50%) rotate(${Math.random() * 360}deg);transition:transform .9s cubic-bezier(.2,.8,.2,1),opacity .9s;`;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = `translate(${(Math.random() - 0.5) * 40 - 50}%, ${30 + Math.random() * 40}px) rotate(${Math.random() * 720}deg) scale(.3)`;
    el.style.opacity = "0";
  });
  setTimeout(() => el.remove(), 950);
}
