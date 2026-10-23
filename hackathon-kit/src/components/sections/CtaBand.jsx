import { site } from '../../config/site'
import { Button, Card, Halftone, Section } from '../ui'

export function CtaBand({ data = site.ctaBand }) {
  return (
    <Section>
      <Card tone="primary" className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
          <h2 className="display-lg">{data.title}</h2>
          <div>
            <p className="max-w-sm text-[15px] opacity-90">{data.body}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button to={data.primary.href} variant="dark">
                {data.primary.label}
              </Button>
              <Button to={data.secondary.href} variant="light">
                {data.secondary.label}
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-[260px] p-3 md:p-4">
          <div className="h-full overflow-hidden rounded-panel">
            <Halftone colors={['--ink', '--primary']} cell={11} speed={0.8} />
          </div>
        </div>
      </Card>
    </Section>
  )
}
