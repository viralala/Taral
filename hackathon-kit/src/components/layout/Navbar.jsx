import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Moon, Sun, LogOut } from 'lucide-react'
import { site } from '../../config/site'
import { useAuth } from '../../lib/auth'
import { useTheme } from '../../lib/theme'
import { cn } from '../../lib/cn'
import { Button, Logo, SocialLink } from '../ui'

const Divider = () => <span className="h-6 border-l-[1.5px] border-dotted border-ink/30" aria-hidden="true" />

function NavLinks({ className }) {
  return (
    <nav className={cn('flex items-center gap-5', className)}>
      {site.nav.map((l) => (
        <Link key={l.label} to={l.href} className="text-[13.5px] font-medium text-ink/80 transition-colors hover:text-primary">
          {l.label}
        </Link>
      ))}
    </nav>
  )
}

function Actions({ compact }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex items-center gap-3">
      {!compact &&
        site.socials.map((s) => (
          <SocialLink key={s.type} {...s} className="text-ink transition-colors hover:text-primary" iconClassName="h-[18px] w-[18px]" />
        ))}
      <button onClick={toggleTheme} className="grid h-8 w-8 place-items-center rounded-full text-ink hover:bg-ink/5" aria-label="Toggle dark mode">
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <Divider />
      {user ? (
        <div className="flex items-center gap-2">
          <Button to="/account" size="sm" variant="dark">
            {user.name?.split(' ')[0] || 'Account'}
          </Button>
          <button onClick={logout} className="grid h-8 w-8 place-items-center rounded-full text-ink hover:bg-ink/5" aria-label="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <Button to={site.cta.href} size="sm">
          {site.cta.label}
        </Button>
      )}
    </div>
  )
}

function MobileMenu({ open, onClose }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] flex flex-col bg-bg px-4 pb-6 pt-20 transition-[opacity,transform] duration-300 md:hidden',
        open ? 'opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
      )}
    >
      <nav className="flex flex-col">
        {site.nav.map((l, i) => (
          <NavLink
            key={l.label}
            to={l.href}
            onClick={onClose}
            className="display-md border-b border-dotted border-ink/25 py-4 transition-[opacity,transform] duration-500"
            style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(10px)' }}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        <div className="mb-2 flex items-center gap-4">
          {site.socials.map((s) => (
            <SocialLink key={s.type} {...s} className="grid h-12 w-12 place-items-center rounded-full bg-primary text-on-primary" />
          ))}
          <button onClick={toggleTheme} className="ml-auto grid h-12 w-12 place-items-center rounded-full bg-ink/5" aria-label="Toggle dark mode">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        {user ? (
          <>
            <Button to="/account" block size="lg" onClick={onClose}>
              My account
            </Button>
            <Button variant="outline" block size="lg" onClick={() => (logout(), onClose())}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button to={site.cta.href} block size="lg" onClick={onClose}>
              {site.cta.label}
            </Button>
            <Button to="/login" variant="outline" block size="lg" onClick={onClose}>
              Sign in
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      {/* Full-width bar at the top of the page */}
      <header className="relative z-40">
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden md:block">
              <Divider />
            </span>
            <NavLinks className="hidden md:flex" />
          </div>
          <div className="hidden md:block">
            <Actions />
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative z-[70] grid h-11 w-11 place-items-center md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {/* Two offset bars, as in the mobile inspiration */}
            <span className={cn('absolute h-[3px] w-6 rounded-full bg-ink transition-transform duration-300', open ? 'rotate-45' : '-translate-y-[4px]')} />
            <span className={cn('absolute h-[3px] rounded-full bg-ink transition-all duration-300', open ? 'w-6 -rotate-45' : 'w-4 translate-x-1 translate-y-[4px]')} />
          </button>
        </div>
      </header>

      {/* Floating pill that appears once you scroll (desktop) */}
      <div
        className={cn(
          'fixed inset-x-0 top-4 z-50 hidden justify-center transition-[opacity,transform] duration-300 ease-out md:flex',
          scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-6 opacity-0',
        )}
      >
        <div className="flex items-center gap-5 rounded-full bg-surface/90 py-2 pl-5 pr-2 shadow-[0_8px_30px_rgb(0_0_0/0.08)] ring-1 ring-line backdrop-blur-md">
          <Logo markOnly />
          <Divider />
          <NavLinks />
          <Divider />
          <Actions compact />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div
        className={cn(
          'fixed inset-x-3 top-3 z-50 flex h-14 items-center justify-between rounded-full bg-surface/90 pl-5 pr-1.5 shadow-lg ring-1 ring-line backdrop-blur-md transition-[opacity,transform] duration-300 md:hidden',
          scrolled && !open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0',
        )}
      >
        <Logo className="scale-90 origin-left" />
        <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center" aria-label="Open menu">
          <span className="absolute h-[3px] w-6 -translate-y-[4px] rounded-full bg-ink" />
          <span className="absolute h-[3px] w-4 translate-x-1 translate-y-[4px] rounded-full bg-ink" />
        </button>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
