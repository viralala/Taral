import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { rules, useForm } from '../../lib/useForm'
import { Button, Checkbox, Field, Input, PasswordInput, useToast } from '../../components/ui'
import { AuthLayout } from './AuthLayout'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const form = useForm({ email: '', password: '', remember: true }, (v) => ({
    email: rules.required(v.email) || rules.email(v.email),
    password: rules.required(v.password),
  }))

  const onSubmit = form.submit(async ({ email, password }) => {
    const user = await login(email, password)
    toast({ title: `Welcome back, ${user.name.split(' ')[0]}`, tone: 'success' })
    navigate(location.state?.from || '/account', { replace: true })
  })

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to pick up where you left off.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {form.serverError && (
          <div className="flex items-center gap-2 rounded-tile bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
            <AlertCircle size={16} /> {form.serverError}
          </div>
        )}
        <Field label="Email" error={form.error('email')}>
          {({ id }) => <Input id={id} type="email" autoComplete="email" placeholder="you@email.com" {...form.field('email')} />}
        </Field>
        <Field label="Password" error={form.error('password')}>
          {({ id }) => <PasswordInput id={id} autoComplete="current-password" placeholder="••••••••" {...form.field('password')} />}
        </Field>
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={form.values.remember} onChange={(e) => form.setValue('remember', e.target.checked)} />
          <a href="#" className="text-sm font-medium text-ink underline-offset-4 hover:underline">
            Forgot password?
          </a>
        </div>
        <Button size="lg" block loading={form.submitting}>
          Sign in
        </Button>
        <p className="rounded-tile bg-surface-2 px-4 py-3 text-[13px] text-muted">
          Demo account: <b className="text-ink">demo@kiln.test</b> / <b className="text-ink">demo1234</b>
        </p>
        <p className="text-center text-sm text-muted">
          New here?{' '}
          <Link to="/signup" className="font-medium text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
