import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Spinner } from './Spinner'

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  dark: 'bg-ink text-on-ink hover:bg-ink/85',
  light: 'bg-surface text-ink hover:bg-surface-2',
  accent: 'bg-accent text-on-accent hover:brightness-110',
  // Dotted outline that fills solid on hover (as in the video)
  outline: 'dotted text-ink hover:bg-ink hover:text-on-ink hover:border-transparent',
  ghost: 'text-ink hover:bg-ink/5',
}

const sizes = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
  icon: 'h-11 w-11',
}

/**
 * <Button>Save</Button>
 * <Button variant="outline" to="/apply">Book a call</Button>   (router link)
 * <Button href="https://...">External</Button>                 (anchor)
 * <Button loading>Saving</Button>
 */
export function Button({ variant = 'primary', size = 'md', to, href, loading, block, className, children, ...props }) {
  const classes = cn(
    'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium',
    'transition-[background-color,color,border-color,transform,filter] duration-200 active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    block && 'w-full',
    className,
  )
  const content = (
    <>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </>
  )
  if (to) {
    // In-page hash links on the current route should just scroll.
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {content}
    </button>
  )
}
