"use client";
import { QRCodeSVG } from "qrcode.react";
import Blossom from "./Blossom";

export const RICK = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export default function RickQR({ size = 160, caption = "scan to skip the CAPTCHA" }: { size?: number; caption?: string }) {
  return (
    <div className="relative inline-flex flex-col items-center gap-3" data-cursor="scan">
      <Blossom className="absolute -right-6 -top-6 h-14 w-14 spin-slow" />
      <div className="paper-card rotate-2 p-3">
        <QRCodeSVG value={RICK} size={size} fgColor="#003c74" bgColor="#efead7" level="M" />
      </div>
      <span className="hand text-base text-paper/80">{caption}</span>
    </div>
  );
}
