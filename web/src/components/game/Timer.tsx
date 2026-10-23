"use client";
import { useEffect, useRef, useState } from "react";

export default function Timer({ limit, onTimeout, active }: { limit: number; onTimeout: () => void; active: boolean }) {
  const [left, setLeft] = useState(limit);
  const cb = useRef(onTimeout);
  cb.current = onTimeout;
  useEffect(() => {
    if (!active) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const l = Math.max(0, limit - (Date.now() - t0) / 1000);
      setLeft(l);
      if (l <= 0) {
        clearInterval(id);
        cb.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [limit, active]);
  const urgent = left <= 5;
  return (
    <div className="flex items-center gap-3" aria-label="time left">
      <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-cocoa bg-paper">
        <div className="h-full rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${(left / limit) * 100}%`, background: urgent ? "var(--blush-deep)" : "var(--butter)" }} />
      </div>
      <span className={`display w-12 text-right text-2xl tabular-nums ${urgent ? "text-blush-deep" : "text-cocoa"}`}>{Math.ceil(left)}s</span>
    </div>
  );
}
