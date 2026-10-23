import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'

const ToastContext = createContext(() => {})

/** const toast = useToast(); toast({ title: 'Saved', body: '...', tone: 'success' | 'error' | 'info' }) */
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id))
  const toast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((all) => [...all, { id, tone: 'info', ...t }])
    setTimeout(() => dismiss(id), t.duration ?? 4000)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6">
        {toasts.map((t) => {
          const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? AlertCircle : Info
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-panel bg-ink p-4 text-on-ink shadow-2xl animate-[toast-in_.3s_cubic-bezier(.2,.8,.2,1)]"
            >
              <Icon size={20} className={cn('mt-0.5 shrink-0', t.tone === 'success' ? 'text-success' : t.tone === 'error' ? 'text-danger' : 'text-highlight')} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.title}</p>
                {t.body && <p className="mt-0.5 text-sm opacity-70">{t.body}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100" aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
