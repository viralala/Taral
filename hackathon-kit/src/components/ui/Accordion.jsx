import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

/** <Accordion items={[{ q, a }]} /> — one open at a time. */
export function Accordion({ items, className }) {
  const [open, setOpen] = useState(0)
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={cn('rounded-panel transition-colors', isOpen ? 'bg-surface' : 'bg-surface/60 hover:bg-surface')}>
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-medium"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              {it.q}
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300', isOpen ? 'rotate-45 bg-primary text-on-primary' : 'bg-ink/5')}>
                <Plus size={18} />
              </span>
            </button>
            <div className={cn('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <p className="max-w-2xl px-6 pb-6 text-muted">{it.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
