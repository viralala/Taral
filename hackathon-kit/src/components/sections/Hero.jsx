import { useLayoutEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { Button, Container, Halftone } from '../ui'

/**
 * SVG path for a rounded rectangle with two rectangular "bites" taken out:
 * one top-left (where the headline sits) and one bottom-right (where the CTA sits).
 * Every corner, convex or concave, gets radius r.
 */
function notchedPath(w, h, tl, br, r) {
  const a = tl.w, b = tl.h, c = br.w, d = br.h
  return [
    `M ${a + r} 0`,
    `H ${w - r}`, `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - d - r}`, `A ${r} ${r} 0 0 1 ${w - r} ${h - d}`,
    `H ${w - c + r}`, `A ${r} ${r} 0 0 0 ${w - c} ${h - d + r}`,
    `V ${h - r}`, `A ${r} ${r} 0 0 1 ${w - c - r} ${h}`,
    `H ${r}`, `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${b + r}`, `A ${r} ${r} 0 0 1 ${r} ${b}`,
    `H ${a - r}`, `A ${r} ${r} 0 0 0 ${a} ${b - r}`,
    `V ${r}`, `A ${r} ${r} 0 0 1 ${a + r} 0`,
    'Z',
  ].join(' ')
}

function useMediaQuery(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useLayoutEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

export function Hero({ title = site.hero.title, subtitle = site.hero.subtitle, primary = site.hero.primary, secondary = site.hero.secondary, colors }) {
  const wrapRef = useRef(null)
  const tlRef = useRef(null)
  const brRef = useRef(null)
  const [path, setPath] = useState(null)
  const isMd = useMediaQuery('(min-width: 768px)')

  useLayoutEffect(() => {
    if (!isMd) return setPath(null)
    const update = () => {
      const W = wrapRef.current.offsetWidth
      const H = wrapRef.current.offsetHeight
      const tl = { w: tlRef.current.offsetWidth, h: tlRef.current.offsetHeight }
      const br = { w: brRef.current.offsetWidth, h: brRef.current.offsetHeight }
      setPath(notchedPath(W, H, tl, br, 26))
    }
    const ro = new ResizeObserver(update)
    ;[wrapRef, tlRef, brRef].forEach((r) => ro.observe(r.current))
    update()
    return () => ro.disconnect()
  }, [isMd])

  return (
    <section className="pb-6 pt-2 md:pb-10">
      <Container>
        <div ref={wrapRef} className="flex flex-col gap-6 md:relative md:block md:h-[clamp(560px,76vh,780px)]">
          {/* Headline — sits in the top-left bite */}
          <div ref={tlRef} className="md:absolute md:left-0 md:top-0 md:max-w-[56%] md:pb-7 md:pr-8">
            <h1 className="display text-[clamp(3rem,7.2vw,7rem)] leading-[0.9] animate-[pop-in_.8s_cubic-bezier(.2,.8,.2,1)_both]">{title}</h1>
          </div>

          {/* CTA — sits in the bottom-right bite */}
          <div ref={brRef} className="order-2 md:absolute md:bottom-0 md:right-0 md:pl-5 md:pt-5">
            <div className="flex max-w-[400px] flex-col gap-5 md:w-[min(400px,34vw)]">
              <p className="text-[15px] leading-relaxed text-ink/85">{subtitle}</p>
              <div className="grid grid-cols-2 gap-2.5">
                <Button to={primary.href} size="md">
                  {primary.label}
                </Button>
                <Button to={secondary.href} variant="outline" size="md" className="border-solid border-ink/40">
                  {secondary.label}
                </Button>
              </div>
            </div>
          </div>

          {/* Halftone canvas, clipped to the notched shape on desktop */}
          <div
            className="order-3 aspect-[4/5] overflow-hidden rounded-card sm:aspect-[16/10] md:absolute md:inset-0 md:aspect-auto md:rounded-none"
            style={path ? { clipPath: `path('${path}')` } : undefined}
          >
            <Halftone colors={colors} />
          </div>
        </div>
      </Container>
    </section>
  )
}
