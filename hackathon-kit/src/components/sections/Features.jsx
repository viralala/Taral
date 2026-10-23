import { useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import { site } from '../../config/site'
import { api } from '../../lib/api'
import { Badge, Button, Card, DotGlyph, DotIcon, Halftone, Input, OptionTiles, Reveal, Section, useToast } from '../ui'

function BuildCard({ icon, title, bullets }) {
  return (
    <Card className="flex min-h-[440px] flex-col justify-between gap-10 p-7 md:p-10">
      <DotIcon name={icon} />
      <div>
        <h3 className="display-md">{title}</h3>
        <ul className="mt-5 flex flex-col gap-3 text-[15px] leading-relaxed">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function PickerCard({ groups }) {
  const [values, setValues] = useState(() => groups.map((g, i) => g.options[i % g.options.length]))
  return (
    <Card tone="accent" className="flex min-h-[440px] items-center justify-center p-5 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-3">
        {groups.map((g, i) => (
          <div key={g.title} className="rounded-panel bg-ink p-4 text-on-ink shadow-xl">
            <p className="mb-3 font-display text-lg font-extrabold [font-stretch:var(--display-stretch)]">{g.title}</p>
            <OptionTiles
              tone="dark"
              name={g.title}
              options={g.options}
              value={values[i]}
              onChange={(v) => setValues((all) => all.map((x, j) => (j === i ? v : x)))}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

function TextCard({ icon, title, body, link, tone = 'surface' }) {
  return (
    <Card tone={tone} className="flex min-h-[420px] flex-col justify-between gap-10 p-7 md:p-10">
      <DotIcon name={icon} tone={tone === 'surface' ? 'ink' : 'light'} />
      <div>
        <h3 className="display-md max-w-[14ch]">{title}</h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed opacity-85">{body}</p>
        {link && (
          <Button to={link.href} variant={tone === 'surface' ? 'outline' : 'light'} size="sm" className="mt-6">
            {link.label} <Play size={12} fill="currentColor" />
          </Button>
        )}
      </div>
    </Card>
  )
}

function VisualCard() {
  return (
    <Card tone="accent" className="min-h-[340px] md:min-h-[420px]">
      <div className="absolute inset-0">
        <Halftone colors={['--accent', '--ink']} cell={12} speed={0.7} />
      </div>
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-xs rounded-panel bg-ink p-5 text-on-ink shadow-2xl">
          <div className="flex items-center justify-between">
            <Badge tone="highlight">Live</Badge>
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-on-ink/30" />
              <span className="h-2 w-2 rounded-full bg-on-ink/30" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </span>
          </div>
          <DotGlyph name="spark" className="mx-auto my-6 h-16 w-16 text-on-ink" />
          <div className="h-1.5 overflow-hidden rounded-full bg-on-ink/15">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-on-ink" />
          </div>
          <p className="mt-3 text-xs opacity-60">Processing 2,481 events / sec</p>
        </div>
      </div>
    </Card>
  )
}

function SubscribeCard() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/subscribe', { email })
      toast({ title: 'You are on the list', body: `We will write to ${email}.`, tone: 'success' })
      setEmail('')
    } catch (err) {
      toast({ title: 'Could not subscribe', body: err.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card tone="highlight" className="flex min-h-[420px] flex-col justify-between gap-8 p-7 md:p-10">
      <DotIcon name="heart" />
      <form onSubmit={submit}>
        <h3 className="display-md">Stay in the loop</h3>
        <p className="mt-3 text-[15px] opacity-80">One short email when something ships. No spam.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="border-ink/20 bg-surface" />
          <Button variant="dark" loading={loading} className="h-12 shrink-0">
            Subscribe <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </Card>
  )
}

export function Features({ data = site.features }) {
  const [a, b] = data.split
  return (
    <Section id="features" className="pt-4 md:pt-6">
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <BuildCard {...data.primary} />
        </Reveal>
        <Reveal delay={100}>
          <PickerCard groups={data.picker} />
        </Reveal>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.35fr]">
        <Reveal>
          <TextCard {...a} />
        </Reveal>
        <Reveal delay={100}>
          <VisualCard />
        </Reveal>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <TextCard {...b} />
        </Reveal>
        <Reveal delay={100}>
          <SubscribeCard />
        </Reveal>
      </div>
    </Section>
  )
}
