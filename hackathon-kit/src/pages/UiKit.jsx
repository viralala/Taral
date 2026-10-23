import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { PALETTES, useTheme } from '../lib/theme'
import { cn } from '../lib/cn'
import {
  Accordion, Badge, Button, Card, Checkbox, Container, DOT_GLYPHS, DotIcon, Field, FileDrop, Halftone, Input, Modal, OptionTiles,
  PasswordInput, Segmented, Select, Skeleton, Spinner, Stepper, Switch, Textarea, useToast,
} from '../components/ui'

function Block({ title, children, className }) {
  return (
    <Card className={cn('p-6 md:p-8', className)}>
      <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">{title}</p>
      {children}
    </Card>
  )
}

const SWATCHES = ['bg', 'surface', 'surface-2', 'ink', 'muted', 'primary', 'accent', 'highlight', 'success', 'danger']

// Living reference of every component — open /ui during the hackathon and copy what you need.
export default function UiKit() {
  const { theme, toggleTheme, palette, setPalette } = useTheme()
  const toast = useToast()
  const [modal, setModal] = useState(false)
  const [sw, setSw] = useState(true)
  const [tile, setTile] = useState('Team')
  const [seg, setSeg] = useState('Week')
  const [files, setFiles] = useState([])
  const [step, setStep] = useState(1)

  return (
    <Container className="py-6 md:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge>Reference</Badge>
          <h1 className="display-lg mt-3">UI kit</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={PALETTES} value={palette} onChange={setPalette} />
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Block title="Colour tokens" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SWATCHES.map((s) => (
              <div key={s}>
                <div className="h-16 rounded-tile ring-1 ring-line" style={{ background: `var(--${s})` }} />
                <p className="mt-2 font-mono text-xs text-muted">--{s}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography" className="lg:col-span-2">
          <p className="display-xl">Display XL</p>
          <p className="display-lg mt-2">Display large</p>
          <p className="display-md mt-2">Display medium</p>
          <p className="display-sm mt-2">Display small</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">Body copy in DM Sans. Keep paragraphs short and calm next to the loud display type — the contrast is the whole look.</p>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap gap-2.5">
            <Button>Primary</Button>
            <Button variant="dark">Dark</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="light">Light</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">
              Large <ArrowRight size={18} />
            </Button>
            <Button loading>Loading</Button>
          </div>
        </Block>

        <Block title="Badges, spinner, skeleton">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Announcement</Badge>
            <Badge tone="primary">New</Badge>
            <Badge tone="accent">Beta</Badge>
            <Badge tone="ink">Ink</Badge>
            <Badge tone="outline">Outline</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="danger">Error</Badge>
            <Spinner className="ml-2 text-primary" />
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </Block>

        <Block title="Card tones" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {['surface', 'muted', 'ink', 'primary', 'accent', 'highlight'].map((t) => (
              <Card key={t} tone={t} className="flex h-32 items-end p-4 ring-1 ring-line">
                <span className="display-sm">{t}</span>
              </Card>
            ))}
          </div>
        </Block>

        <Block title="Dot icons">
          <div className="flex flex-wrap gap-3">
            {DOT_GLYPHS.map((g, i) => (
              <div key={g} className="flex flex-col items-center gap-1.5">
                <DotIcon name={g} size="sm" tone={i % 4 === 1 ? 'primary' : i % 4 === 3 ? 'accent' : 'ink'} />
                <span className="font-mono text-[11px] text-muted">{g}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Halftone">
          <div className="grid grid-cols-3 gap-3">
            {[
              ['--primary', '--accent'],
              ['--ink', '--primary'],
              ['--accent', '--highlight'],
            ].map((c) => (
              <div key={c.join()} className="aspect-square overflow-hidden rounded-panel">
                <Halftone colors={c} cell={7} />
              </div>
            ))}
          </div>
        </Block>

        <Block title="Inputs">
          <div className="flex flex-col gap-4">
            <Field label="Text" hint="Helper text">
              {({ id }) => <Input id={id} placeholder="Type here" />}
            </Field>
            <Field label="With error" error="This field is required">
              {({ id }) => <Input id={id} invalid placeholder="Oops" />}
            </Field>
            <Field label="Password">{({ id }) => <PasswordInput id={id} placeholder="••••••••" />}</Field>
            <Field label="Select">{({ id }) => <Select id={id} placeholder="Choose" options={['One', 'Two', 'Three']} />}</Field>
            <Field label="Textarea">{({ id }) => <Textarea id={id} placeholder="Longer text" />}</Field>
          </div>
        </Block>

        <Block title="Choices">
          <div className="flex flex-col gap-6">
            <OptionTiles options={['Solo', 'Team', 'Org']} value={tile} onChange={setTile} />
            <div className="rounded-panel bg-ink p-4">
              <OptionTiles tone="dark" options={['Solo', 'Team', 'Org']} value={tile} onChange={setTile} />
            </div>
            <Segmented options={['Day', 'Week', 'Month']} value={seg} onChange={setSeg} />
            <Switch checked={sw} onChange={setSw} label="Notifications" />
            <Checkbox label="I agree to the terms" defaultChecked />
          </div>
        </Block>

        <Block title="File upload">
          <FileDrop files={files} onChange={setFiles} />
        </Block>

        <Block title="Stepper, modal, toast">
          <Stepper steps={['Details', 'Choices', 'Review']} current={step} />
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setStep((s) => (s + 1) % 4)}>
              Next step
            </Button>
            <Button size="sm" variant="dark" onClick={() => setModal(true)}>
              Open modal
            </Button>
            <Button size="sm" onClick={() => toast({ title: 'Saved', body: 'Your changes are live.', tone: 'success' })}>
              Success toast
            </Button>
            <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Something failed', body: 'Try again.', tone: 'error' })}>
              Error toast
            </Button>
          </div>
        </Block>

        <Block title="Accordion" className="lg:col-span-2">
          <Accordion
            items={[
              { q: 'Where do I change colours?', a: 'src/styles/theme.css — every token is a CSS variable.' },
              { q: 'Where do I change copy?', a: 'src/config/site.js drives the navbar, every landing section, the footer and the form.' },
              { q: 'How do I connect a backend?', a: 'Set VITE_API_URL in .env.local. Until then requests go to src/mock/server.js.' },
            ]}
          />
        </Block>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Confirm action">
        <p className="text-muted">Modals close on Escape, on backdrop click and with the button below.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setModal(false)
              toast({ title: 'Confirmed', tone: 'success' })
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </Container>
  )
}
