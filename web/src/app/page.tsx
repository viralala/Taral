import { Nav, Footer, RageToast } from "@/components/fun";
import Hero from "@/components/home/Hero";
import Chapters from "@/components/home/Chapters";
import Outro from "@/components/home/Outro";

export default function Home() {
  return (
    <main className="relative bg-cream">
      <Nav />
      <Hero />
      <Chapters />
      <Outro />
      <Footer />
      <RageToast />
    </main>
  );
}
