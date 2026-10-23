import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { site } from '../config/site'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { rules, useForm } from '../lib/useForm'
import {
  Badge, Button, Card, Checkbox, Container, DotIcon, Field, FileDrop, Input, OptionTiles, Segmented, Select, Stepper, Textarea, useToast,
} from '../components/ui'

// Multi-step form. Rename the fields / steps to match the problem statement.
const STEPS = [
  { title: 'Your details', fields: ['name', 'email', 'phone', 'organisation'] },
  { title: 'Requirements', fields: ['category', 'priority', 'topic', 'description'] },
  { title: 'Review', fields: ['consent'] },
]

export default function Apply() {
  const { user } = useAuth()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState([])
  const [done, setDone] = useState(null)
  const w = site.wizard

  const form = useForm(
    {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      organisation: '',
      category: w.categories[0].value,
      priority: w.priorities[1],
      topic: '',
      description: '',
      consent: false,
    },
    (v) => ({
      name: rules.required(v.name),
      email: rules.required(v.email) || rules.email(v.email),
      phone: rules.phone(v.phone),
      topic: rules.required(v.topic, 'Pick a topic'),
      description: rules.required(v.description) || rules.min(20)(v.description),
      consent: !v.consent && 'Please confirm to submit',
    }),
  )

  // The signed-in user can load after first render — prefill once it arrives.
  useEffect(() => {
    if (!user) return
    if (!form.values.name) form.setValue('name', user.name)
    if (!form.values.email) form.setValue('email', user.email)
  }, [user])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, done])

  const next = () => form.check(STEPS[step].fields) && setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)

  const onSubmit = form.submit(async (values) => {
    const res = await api.post('/submissions', { ...values, files: files.map((f) => f.name) })
    toast({ title: 'Submitted', body: `Reference ${res.id.toUpperCase()}`, tone: 'success' })
    setDone(res)
  })

  if (done) {
    return (
      <Container className="max-w-3xl py-10 md:py-16">
        <Card className="flex flex-col items-center gap-6 p-10 text-center md:p-16">
          <DotIcon name="check" tone="primary" size="lg" />
          <h1 className="display-lg">You are all set</h1>
          <p className="max-w-md text-muted">
            We received your request. Your reference is <b className="text-ink">{done.id.toUpperCase()}</b>. We will reply to {done.email}.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Button to="/">Back home</Button>
            <Button
              variant="outline"
              onClick={() => {
                form.reset()
                setFiles([])
                setStep(0)
                setDone(null)
              }}
            >
              Submit another
            </Button>
          </div>
        </Card>
      </Container>
    )
  }

  const v = form.values
  return (
    <Container className="max-w-3xl py-6 md:py-12">
      <Badge>Step {step + 1} of {STEPS.length}</Badge>
      <h1 className="display-lg mt-4">{w.title}</h1>
      <p className="mt-3 text-muted">{w.subtitle}</p>

      <Stepper steps={STEPS.map((s) => s.title)} current={step} className="mt-8" />

      <Card as="form" onSubmit={step === STEPS.length - 1 ? onSubmit : (e) => (e.preventDefault(), next())} noValidate className="mt-6 p-6 md:p-10">
        <div key={step} className="animate-[pop-in_.3s_ease-out] flex flex-col gap-5">
          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required error={form.error('name')}>
                  {({ id }) => <Input id={id} placeholder="Ada Lovelace" {...form.field('name')} />}
                </Field>
                <Field label="Email" required error={form.error('email')}>
                  {({ id }) => <Input id={id} type="email" placeholder="you@email.com" {...form.field('email')} />}
                </Field>
                <Field label="Phone" hint="Optional" error={form.error('phone')}>
                  {({ id }) => <Input id={id} type="tel" placeholder="+91 98765 43210" {...form.field('phone')} />}
                </Field>
                <Field label="Organisation" hint="Optional">
                  {({ id }) => <Input id={id} placeholder="Company, college or team" {...form.field('organisation')} />}
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Who is this for?">
                <OptionTiles options={w.categories} value={v.category} onChange={(x) => form.setValue('category', x)} name="Category" />
              </Field>
              <Field label="Priority">
                <Segmented options={w.priorities} value={v.priority} onChange={(x) => form.setValue('priority', x)} />
              </Field>
              <Field label="Topic" required error={form.error('topic')}>
                {({ id }) => (
                  <Select id={id} placeholder="Choose one" options={['General question', 'Feature request', 'Report a problem', 'Partnership']} {...form.field('topic')} />
                )}
              </Field>
              <Field label="Describe what you need" required hint={`${v.description.length}/500`} error={form.error('description')}>
                {({ id }) => <Textarea id={id} maxLength={500} placeholder="The more detail, the better we can help." {...form.field('description')} />}
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Attachments" hint="Optional">
                <FileDrop files={files} onChange={setFiles} />
              </Field>
              <div className="rounded-panel bg-surface-2 p-5">
                <p className="mb-3 text-sm font-semibold">Summary</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  {[
                    ['Name', v.name],
                    ['Email', v.email],
                    ['For', w.categories.find((c) => c.value === v.category)?.label],
                    ['Priority', v.priority],
                    ['Topic', v.topic],
                    ['Files', files.length || 'None'],
                  ].map(([k, val]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className="truncate font-medium">{val || '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <Checkbox label="I confirm the information above is correct." checked={v.consent} onChange={(e) => form.setValue('consent', e.target.checked)} />
                {form.error('consent') && <p className="mt-1.5 text-[13px] text-danger">{form.error('consent')}</p>}
              </div>
              {form.serverError && <p className="text-sm text-danger">{form.serverError}</p>}
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t-[1.5px] border-dotted border-ink/25 pt-6">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={back}>
              <ArrowLeft size={16} /> Back
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button type="submit">
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button type="submit" loading={form.submitting}>
              Submit
            </Button>
          )}
        </div>
      </Card>
    </Container>
  )
}
