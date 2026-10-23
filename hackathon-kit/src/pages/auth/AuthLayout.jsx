import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { site } from '../../config/site'
import { Card, Halftone, Logo } from '../../components/ui'

/** Split screen: form on the left, animated halftone panel on the right. */
export function AuthLayout({ title, subtitle, children, aside = site.brand.tagline }) {
  return (
    <div className="grid min-h-dvh gap-3 p-3 lg:grid-cols-2">
      <div className="flex flex-col px-3 py-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
            <ArrowLeft size={16} /> Back home
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <h1 className="display-lg">{title}</h1>
          {subtitle && <p className="mt-3 text-[15px] text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <Card tone="ink" className="hidden min-h-[560px] lg:block">
        <div className="absolute inset-0">
          <Halftone colors={['--primary', '--accent']} cell={11} />
        </div>
        <div className="absolute inset-x-6 bottom-6 rounded-panel bg-surface p-7 text-ink shadow-2xl">
          <p className="display-sm">{aside}</p>
          <p className="mt-3 text-sm text-muted">— The {site.brand.name} team</p>
        </div>
      </Card>
    </div>
  )
}
