import { site } from '../../config/site'
import { Card, DotIcon, Reveal, Section } from '../ui'

const TONES = ['surface', 'highlight', 'primary']

export function Steps({ title = 'How it works', items = site.steps }) {
  return (
    <Section id="how">
      <h2 className="display-lg mb-8 md:mb-10">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <Card tone={TONES[i % TONES.length]} className="flex h-full min-h-[300px] flex-col justify-between gap-10 p-7 md:p-8">
              <DotIcon name={s.icon} tone={TONES[i % TONES.length] === 'primary' ? 'light' : 'ink'} />
              <div>
                <h3 className="display-sm">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed opacity-80">{s.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
