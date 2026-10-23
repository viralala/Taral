import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/** Progress indicator for multi-step forms. <Stepper steps={['A','B','C']} current={1} /> */
export function Stepper({ steps, current, className }) {
  return (
    <ol className={cn('flex items-center gap-2', className)}>
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors',
                done ? 'bg-ink text-on-ink' : active ? 'bg-primary text-on-primary' : 'dotted text-muted',
              )}
            >
              {done ? <Check size={16} strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn('hidden text-sm font-medium sm:block', active ? 'text-ink' : 'text-muted')}>{s}</span>
            {i < steps.length - 1 && <span className={cn('mx-1 h-px flex-1', done ? 'bg-ink' : 'border-t-[1.5px] border-dotted border-ink/30')} />}
          </li>
        )
      })}
    </ol>
  )
}
