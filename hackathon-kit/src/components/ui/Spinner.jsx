import { cn } from '../../lib/cn'

export function Spinner({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5 animate-spin', className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// Grey placeholder block while data loads: <Skeleton className="h-6 w-40" />
export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-tile bg-ink/10', className)} />
}
