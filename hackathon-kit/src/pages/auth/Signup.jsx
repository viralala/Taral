import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { rules, useForm } from '../../lib/useForm'
import { cn } from '../../lib/cn'
import { Button, Checkbox, Field, Input, PasswordInput, useToast } from '../../components/ui'
import { AuthLayout } from './AuthLayout'

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const form = useForm({ name: '', email: '', password: '', terms: false }, (v) => ({
    name: rules.required(v.name),
    email: rules.required(v.email) || rules.email(v.email),
    password: rules.required(v.password) || rules.min(8)(v.password),
    terms: !v.terms && 'Please accept to continue',
  }))
  const s = strength(form.values.password)

  const onSubmit = form.submit(async ({ name, email, password }) => {
    await signup({ name, email, password })
    toast({ title: 'Account created', body: 'You are signed in.', tone: 'success' })
    navigate('/account')
  })

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute. No card required.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {form.serverError && (
          <div className="flex items-center gap-2 rounded-tile bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            <AlertCircle size={16} /> {form.serverError}
          </div>
        )}
        <Field label="Full name" error={form.error('name')}>
          {({ id }) => <Input id={id} autoComplete="name" placeholder="Ada Lovelace" {...form.field('name')} />}
        </Field>
        <Field label="Email" error={form.error('email')}>
          {({ id }) => <Input id={id} type="email" autoComplete="email" placeholder="you@email.com" {...form.field('email')} />}
        </Field>
        <Field label="Password" error={form.error('password')}>
          {({ id }) => (
            <>
              <PasswordInput id={id} autoComplete="new-password" placeholder="At least 8 characters" {...form.field('password')} />
              <div className="mt-1 grid grid-cols-4 gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn('h-1 rounded-full transition-colors', i < s ? (s < 2 ? 'bg-danger' : s < 4 ? 'bg-primary' : 'bg-success') : 'bg-ink/10')}
                  />
                ))}
              </div>
            </>
          )}
        </Field>
        <div>
          <Checkbox
            label={
              <>
                I agree to the <a href="#" className="underline underline-offset-4">terms</a> and <a href="#" className="underline underline-offset-4">privacy policy</a>
              </>
            }
            checked={form.values.terms}
            onChange={(e) => form.setValue('terms', e.target.checked)}
          />
          {form.error('terms') && <p className="mt-1.5 text-[13px] text-danger">{form.error('terms')}</p>}
        </div>
        <Button size="lg" block loading={form.submitting}>
          Create account
        </Button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
