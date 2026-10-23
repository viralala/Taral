import { cn } from '../../lib/cn'
import { useInView } from '../../lib/useReveal'

const tones = {
  surface: 'bg-surface text-ink',
  ink: 'bg-ink text-on-ink',
  primary: 'bg-primary text-on-primary',
  accent: 'bg-accent text-on-accent',
  highlight: 'bg-highlight text-on-highlight',
  muted: 'bg-surface-2 text-ink',
}

/** Big rounded card. <Card tone="accent" className="p-8">...</Card> */
export function Card({ tone = 'surface', as: Tag = 'div', className, children, ...props }) {
  return (
    <Tag className={cn('relative overflow-hidden rounded-card', tones[tone], className)} {...props}>
      {children}
    </Tag>
  )
}

/** Small pill label (yellow by default, as in "Metalayer" / "Announcement"). */
export function Badge({ tone = 'highlight', className, children }) {
  const t = {
    highlight: 'bg-highlight text-on-highlight',
    primary: 'bg-primary text-on-primary',
    accent: 'bg-accent text-on-accent',
    ink: 'bg-ink text-on-ink',
    outline: 'dotted',
    success: 'bg-success/15 text-success',
    danger: 'bg-danger/15 text-danger',
  }[tone]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none', t, className)}>
      {children}
    </span>
  )
}

export function Container({ className, children }) {
  return <div className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

/** Section wrapper with an anchor id and consistent vertical rhythm. */
export function Section({ id, className, children }) {
  return (
    <section id={id} className={cn('scroll-mt-24 py-10 md:py-14', className)}>
      <Container>{children}</Container>
    </section>
  )
}

/** Fades + lifts children in when scrolled into view. */
export function Reveal({ delay = 0, className, children, as: Tag = 'div' }) {
  const [ref, inView] = useInView()
  return (
    <Tag ref={ref} className={cn('reveal', inView && 'is-in', className)} style={{ '--delay': `${delay}ms` }}>
      {children}
    </Tag>
  )
}
