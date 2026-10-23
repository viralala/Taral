import { ArrowUpRight } from 'lucide-react'
import { site } from '../../config/site'
import { useFetch } from '../../lib/useFetch'
import { Badge, Button, Card, DotGlyph, Halftone, Reveal, Section, Skeleton } from '../ui'

function Cover({ type, title }) {
  if (type === 'halftone') return <Halftone colors={['--primary', '--accent']} cell={8} interactive={false} />
  if (type === 'ink')
    return (
      <div className="grid h-full place-items-center bg-ink bg-[radial-gradient(circle,rgb(255_255_255/0.12)_1.6px,transparent_2px)] bg-[length:10px_10px] p-6">
        <p className="display text-center text-[clamp(1.8rem,3vw,2.6rem)] text-primary">{title.split(' ').slice(0, 3).join(' ')}</p>
      </div>
    )
  return (
    <div className="grid h-full place-items-center bg-accent text-on-accent">
      <DotGlyph name="grid" className="h-20 w-20" />
    </div>
  )
}

export function News({ title = site.news.title, subtitle = site.news.subtitle }) {
  const { data: posts, loading, error, reload } = useFetch('/posts')

  return (
    <Section id="news">
      <div className="grid gap-4 lg:grid-cols-4">
        <Card tone="highlight" className="flex min-h-[260px] flex-col justify-between gap-6 p-7 md:p-8 lg:row-span-1">
          <h2 className="display-md">{title}</h2>
          <p className="text-[15px] leading-relaxed opacity-80">{subtitle}</p>
        </Card>

        {loading &&
          [0, 1, 2].map((i) => (
            <Card key={i} className="flex flex-col gap-4 p-3">
              <Skeleton className="aspect-[4/3] w-full rounded-panel" />
              <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </Card>
          ))}

        {error && (
          <Card className="flex flex-col items-start gap-4 p-8 lg:col-span-3">
            <p className="font-medium">Could not load posts: {error.message}</p>
            <Button variant="outline" size="sm" onClick={reload}>
              Try again
            </Button>
          </Card>
        )}

        {posts?.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <Card as="a" href="#news" className="group flex h-full flex-col p-3 transition-transform duration-300 hover:-translate-y-1">
              <div className="aspect-[4/3] overflow-hidden rounded-panel">
                <Cover type={p.cover} title={p.title} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-3 pt-5">
                <Badge>{p.tag}</Badge>
                <h3 className="font-display text-xl font-extrabold leading-tight [font-stretch:var(--display-stretch)]">{p.title}</h3>
                <div className="mt-auto flex items-center justify-between pt-2 text-[13px] text-muted">
                  {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <ArrowUpRight size={18} className="text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
