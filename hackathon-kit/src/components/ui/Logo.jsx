import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { cn } from '../../lib/cn'

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 20" className={cn('h-[0.8em] w-auto', className)} aria-hidden="true">
      <path d="M0 20 L8.5 3.2 Q10.1 0 13.7 0 L18.3 0 Q21.9 0 23.5 3.2 L32 20 Z" fill="currentColor" />
    </svg>
  )
}

/** Brand lockup. markOnly shows just the shape (used in the floating pill nav). */
export function Logo({ markOnly, className }) {
  const { name, logo } = site.brand
  return (
    <Link to="/" className={cn('inline-flex items-center gap-1.5 text-primary', className)} aria-label={`${name} home`}>
      {logo !== 'auto' ? (
        <img src={logo} alt={name} className="h-7 w-auto" />
      ) : (
        <>
          <LogoMark className="text-[1.6rem]" />
          {!markOnly && <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.03em]">{name}</span>}
        </>
      )}
    </Link>
  )
}
