import Link from "next/link";
import { RickQR } from "@/components/fun";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="display text-6xl text-cocoa md:text-8xl">404: This page failed the CAPTCHA</h1>
      <p className="hand text-3xl text-cocoa">It selected every traffic light and still got rejected. Relatable.</p>
      <RickQR size={220} caption="scan to find the page (trust me)" />
      <Link href="/" data-cursor="home" className="pill bg-blush hover:bg-blush-deep">
        Take me home
      </Link>
    </main>
  );
}
