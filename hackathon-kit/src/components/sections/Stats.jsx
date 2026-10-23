import { useEffect, useState } from 'react'
import { site } from '../../config/site'
import { useInView } from '../../lib/useReveal'
import { Card, Section } from '../ui'

function CountUp({ value, decimals = 0, run }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    const dur = 1400
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur)
      setN(value * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, value])
  return n.toFixed(decimals)
}

export function Stats({ items = site.stats }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  return (
    <Section>
      <Card tone="ink" className="p-7 md:p-12">
        <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {items.map((s, i) => (
            <div key={s.label} className={i > 0 ? 'lg:border-l-[1.5px] lg:border-dotted lg:border-on-ink/25 lg:pl-8' : ''}>
              <p className="display text-[clamp(2.75rem,6vw,5rem)] tabular-nums">
                <CountUp value={s.value} decimals={s.decimals} run={inView} />
                <span className="text-primary">{s.suffix}</span>
              </p>
              <p className="mt-2 text-sm opacity-65">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  )
}
