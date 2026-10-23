"use client";
import { QRCodeSVG } from "qrcode.react";
import { StarFlower } from "../Flower";

export const RICK = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export default function RickQR({ size = 160, caption = "scan to skip the CAPTCHA" }: { size?: number; caption?: string }) {
  return (
    <div className="relative inline-flex flex-col items-center gap-2" data-cursor="scan">
      <StarFlower className="absolute -right-5 -top-5 h-12 w-12 spin-slow" />
      <div className="rounded-3xl border-2 border-cocoa bg-paper p-3">
        <QRCodeSVG value={RICK} size={size} fgColor="#6b3f2a" bgColor="#fbf7e6" level="M" />
      </div>
      <span className="hand text-2xl text-cocoa">{caption}</span>
    </div>
  );
}
