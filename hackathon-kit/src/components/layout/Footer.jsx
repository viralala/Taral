import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { Button, Card, Container, Logo, SocialLink } from '../ui'

const ALL_SOCIALS = ['discord', 'x', 'telegram', 'github', 'linkedin', 'youtube', 'instagram']

export function Footer() {
  const socials = site.socials.length >= 4 ? site.socials : ALL_SOCIALS.map((type) => site.socials.find((s) => s.type === type) || { type, href: '#' }).slice(0, 7)

  return (
    <footer className="pb-6 pt-10 md:pb-10">
      <Container className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card tone="ink" className="flex flex-col justify-between gap-8 p-8 md:p-10">
          <Logo />
          <div>
            <p className="display-sm max-w-md">{site.footer.pitch}</p>
            <Button to={site.footer.cta.href} size="sm" className="mt-5">
              {site.footer.cta.label}
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2.5">
            {socials.map((s) => (
              <SocialLink
                key={s.type}
                {...s}
                className="grid aspect-square w-14 place-items-center rounded-full bg-primary text-on-primary transition-transform duration-200 hover:-translate-y-1 hover:bg-primary-hover sm:w-[60px]"
                iconClassName="h-6 w-6"
              />
            ))}
          </div>
          <Card className="flex flex-1 flex-col justify-between gap-6 p-8">
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {site.footer.links.map((l) => (
                <Link key={l.label} to={l.href} className="text-sm font-medium hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="border-t-[1.5px] border-dotted border-ink/30 pt-5 text-[13px] text-muted">
              {site.brand.name} {new Date().getFullYear()} © All rights reserved.
            </div>
          </Card>
        </div>
      </Container>
    </footer>
  )
}
