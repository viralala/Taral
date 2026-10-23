import { useId, useRef, useState } from 'react'
import { Check, ChevronDown, Eye, EyeOff, UploadCloud, X } from 'lucide-react'
import { cn } from '../../lib/cn'

const control =
  'w-full rounded-tile border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-muted/70 ' +
  'transition-[border-color,box-shadow] duration-150 outline-none ' +
  'focus:border-ink focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_22%,transparent)] ' +
  'aria-[invalid=true]:border-danger disabled:opacity-60'

/** Label + control + hint/error. Children receive the generated id via render prop or just use `id`. */
export function Field({ label, hint, error, required, className, children, id: idProp }) {
  const auto = useId()
  const id = idProp || auto
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-primary"> *</span>}
        </label>
      )}
      {typeof children === 'function' ? children({ id, invalid: Boolean(error) }) : children}
      {error ? (
        <p className="text-[13px] text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ className, invalid, ...props }) {
  return <input aria-invalid={invalid || undefined} className={cn(control, 'h-12', className)} {...props} />
}

export function PasswordInput({ className, invalid, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} aria-invalid={invalid || undefined} className={cn(control, 'h-12 pr-12', className)} {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export function Textarea({ className, invalid, rows = 4, ...props }) {
  return <textarea rows={rows} aria-invalid={invalid || undefined} className={cn(control, 'resize-y py-3 leading-relaxed', className)} {...props} />
}

export function Select({ className, invalid, options = [], placeholder, ...props }) {
  return (
    <div className="relative">
      <select aria-invalid={invalid || undefined} className={cn(control, 'h-12 appearance-none pr-10', className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value
          const l = typeof o === 'string' ? o : o.label
          return (
            <option key={v} value={v}>
              {l}
            </option>
          )
        })}
      </select>
      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  )
}

export function Checkbox({ label, className, checked, onChange, ...props }) {
  return (
    <label className={cn('inline-flex cursor-pointer select-none items-start gap-3 text-[15px]', className)}>
      <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer absolute inset-0 cursor-pointer opacity-0" {...props} />
        <span className="h-5 w-5 rounded-[6px] border-[1.5px] border-ink/40 bg-surface transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent" />
        <Check size={14} strokeWidth={3} className="pointer-events-none absolute text-on-ink opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      <span className="text-ink">{label}</span>
    </label>
  )
}

export function Switch({ checked, onChange, label, className }) {
  return (
    <label className={cn('inline-flex cursor-pointer select-none items-center gap-3 text-[15px]', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={cn('relative h-7 w-12 rounded-full transition-colors duration-200', checked ? 'bg-primary' : 'bg-ink/20')}
      >
        <span
          className={cn(
            'absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-[cubic-bezier(.3,1.4,.5,1)]',
            checked && 'translate-x-5',
          )}
        />
      </button>
      {label && <span className="text-ink">{label}</span>}
    </label>
  )
}

/**
 * Selectable tiles with dotted borders — the "Rollup stack" picker from the inspiration.
 * tone="dark" for use inside ink panels, "light" on paper.
 */
export function OptionTiles({ options, value, onChange, tone = 'light', columns = 3, className, name }) {
  const dark = tone === 'dark'
  return (
    <div role="radiogroup" aria-label={name} className={cn('grid gap-2', className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              'flex min-h-[76px] flex-col items-start justify-between gap-3 rounded-tile p-3 text-left text-[13px] transition-all duration-200 active:scale-[0.98]',
              active
                ? dark
                  ? 'bg-surface text-ink'
                  : 'bg-ink text-on-ink'
                : cn('dotted', dark ? 'text-on-ink hover:bg-on-ink/10' : 'text-ink hover:bg-ink/5'),
            )}
          >
            <span className={cn('grid h-6 w-6 place-items-center rounded-full', active ? (dark ? 'bg-ink text-on-ink' : 'bg-surface text-ink') : 'bg-current/15')}>
              {opt.icon ?? (active ? <Check size={14} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />)}
            </span>
            <span className="font-medium leading-tight">
              {opt.label}
              {opt.hint && <span className={cn('mt-0.5 block font-normal opacity-60')}>{opt.hint}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Pill-style segmented choice. */
export function Segmented({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 self-start rounded-full bg-ink/5 p-1', className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn('h-9 rounded-full px-4 text-sm font-medium transition-colors', value === o ? 'bg-ink text-on-ink' : 'text-muted hover:text-ink')}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Drag-and-drop file picker. onChange receives File[]. */
export function FileDrop({ files = [], onChange, accept, multiple = true, hint = 'PNG, JPG or PDF up to 10MB' }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)
  const add = (list) => onChange?.(multiple ? [...files, ...list] : list.slice(0, 1))
  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add([...e.dataTransfer.files])
        }}
        className={cn(
          'dotted flex w-full flex-col items-center justify-center gap-2 rounded-panel px-6 py-10 text-center transition-colors',
          over ? 'bg-highlight text-on-highlight' : 'text-ink hover:bg-ink/5',
        )}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-on-ink">
          <UploadCloud size={22} />
        </span>
        <span className="font-medium">
          Drop files here or <span className="underline underline-offset-4">browse</span>
        </span>
        <span className="text-[13px] text-muted">{hint}</span>
      </button>
      <input ref={inputRef} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => add([...e.target.files])} />
      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-tile bg-surface-2 px-4 py-2.5 text-sm">
              <span className="truncate">{f.name}</span>
              <span className="flex shrink-0 items-center gap-3 text-muted">
                {(f.size / 1024).toFixed(0)} KB
                <button type="button" aria-label={`Remove ${f.name}`} onClick={() => onChange(files.filter((_, j) => j !== i))} className="hover:text-ink">
                  <X size={16} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
