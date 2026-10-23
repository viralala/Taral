import { Button, Card, Container, Halftone } from '../components/ui'

export default function NotFound() {
  return (
    <Container className="py-4 md:py-8">
      <Card tone="accent" className="grid min-h-[520px] md:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-between gap-10 p-8 md:p-12">
          <h1 className="display-lg">
            Oh no!
            <br />
            You've lost
            <br />
            your way!
          </h1>
          <div>
            <p className="max-w-sm text-[15px] opacity-90">The page you are looking for doesn't exist or has been moved. Please go back to the homepage.</p>
            <Button to="/" variant="light" className="mt-6">
              Back to home page
            </Button>
          </div>
        </div>
        <div className="relative min-h-[280px] overflow-hidden">
          <div className="absolute inset-0 opacity-90 [mask-image:radial-gradient(circle_at_60%_55%,black_30%,transparent_72%)]">
            <Halftone colors={['--accent', '--ink']} cell={10} />
          </div>
          <p
            className="display absolute inset-0 grid -rotate-6 place-items-center text-[clamp(7rem,20vw,16rem)] text-ink"
            style={{ WebkitTextStroke: '3px var(--on-accent)', paintOrder: 'stroke fill' }}
          >
            404
          </p>
        </div>
      </Card>
    </Container>
  )
}
