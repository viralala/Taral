import { BigHeadline, CtaBand, Faq, Features, Hero, Marquee, News, Stats, Steps } from '../components/sections'

// Reorder, delete or duplicate sections freely — each one reads its copy from src/config/site.js
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      {/* One dot field behind the headline and the feature cards, as in the inspiration */}
      <div className="dot-grid">
        <BigHeadline dots={false} />
        <Features />
      </div>
      <Stats />
      <Steps />
      <News />
      <Faq />
      <CtaBand />
    </>
  )
}
