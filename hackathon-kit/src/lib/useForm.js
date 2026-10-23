import { useState } from 'react'

/**
 * Minimal form state + validation.
 *
 * const form = useForm({ email: '' }, (v) => ({ email: !v.email && 'Required' }))
 * <Input {...form.field('email')} />           // value, onChange, onBlur, invalid
 * <Field error={form.error('email')}>...</Field>
 * <form onSubmit={form.submit(async (values) => ...)}>
 */
export const rules = {
  required: (v, msg = 'This field is required') => (v == null || String(v).trim() === '' ? msg : null),
  email: (v) => (v && !/^\S+@\S+\.\S+$/.test(v) ? 'Enter a valid email' : null),
  min: (n) => (v) => (v && String(v).length < n ? `Must be at least ${n} characters` : null),
  phone: (v) => (v && !/^[+\d][\d\s-]{7,}$/.test(v) ? 'Enter a valid phone number' : null),
}

export function useForm(initial, validate = () => ({})) {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  const errors = Object.fromEntries(Object.entries(validate(values) || {}).filter(([, e]) => e))

  const setValue = (name, value) => setValues((v) => ({ ...v, [name]: value }))
  const error = (name) => (touched[name] ? errors[name] : undefined)

  const field = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setValue(name, e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    invalid: Boolean(error(name)),
  })

  // Validate a subset of fields (for multi-step forms). Returns true if they are all valid.
  const check = (names = Object.keys(values)) => {
    setTouched((t) => ({ ...t, ...Object.fromEntries(names.map((n) => [n, true])) }))
    return names.every((n) => !errors[n])
  }

  const submit = (fn) => async (e) => {
    e?.preventDefault()
    setServerError(null)
    if (!check()) return
    setSubmitting(true)
    try {
      await fn(values)
    } catch (err) {
      setServerError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setValues(initial)
    setTouched({})
  }

  return { values, errors, error, field, setValue, check, submit, submitting, serverError, reset }
}
