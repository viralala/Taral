import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { cn } from '../../lib/cn'

// Scrolls to #hash targets after navigation, otherwise to the top.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/** Navbar + page + footer. dots adds the halftone dot field behind the page. */
export function SiteLayout({ dots = false, footer = true }) {
  return (
    <div className={cn('flex min-h-dvh flex-col', dots && 'dot-grid')}>
      <ScrollManager />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {footer && <Footer />}
    </div>
  )
}
