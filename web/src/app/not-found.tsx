import Link from "next/link";
import { Backdrop, RickQR } from "@/components/fun";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Backdrop tint="dusk" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-7 px-4 py-12 text-center">
        <p className="hand text-sm text-paper/60">404 · lost in the forest</p>
        <h1 className="marker -rotate-1 text-5xl text-paper sm:text-7xl">This page failed the CAPTCHA</h1>
        <p className="hand max-w-xl text-lg text-paper/80">It selected every traffic light and still got rejected. Relatable.</p>
        <RickQR size={180} caption="scan to find the page (trust me)" />
        <Link href="/" data-cursor="home" className="btn-paint">Back to the story</Link>
      </div>
    </main>
  );
}
