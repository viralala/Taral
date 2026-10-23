import type { Metadata } from "next";
import { Permanent_Marker, Patrick_Hand_SC, Patrick_Hand } from "next/font/google";
import Cursor from "@/components/Cursor";
import { PlayerProvider } from "@/lib/player";
import "./globals.css";

// Kaizen sets type in "Salted" (licensed). These free Google fonts carry the same hand-lettered feel.
const marker = Permanent_Marker({ variable: "--font-marker", subsets: ["latin"], weight: "400" });
const hand = Patrick_Hand_SC({ variable: "--font-hand", subsets: ["latin"], weight: "400" });
const body = Patrick_Hand({ variable: "--font-body", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Taral — The Three Trials",
  description: "A fairytale CAPTCHA adventure in the kingdom of MIT-WPU. Made for Pixathon by Insight AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${marker.variable} ${hand.variable} ${body.variable} antialiased grain`}>
        <PlayerProvider>
          <Cursor />
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
