import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Caveat } from "next/font/google";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taral — Are You Even Human?",
  description: "A three-level story game about proving you're human. Level 1: the CAPTCHA that judges you back.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${grotesk.variable} ${caveat.variable} antialiased grain`}>
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
