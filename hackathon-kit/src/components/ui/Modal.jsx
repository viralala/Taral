import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

/** <Modal open={open} onClose={() => setOpen(false)} title="...">...</Modal> */
export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('relative w-full max-w-lg rounded-card bg-surface p-6 text-ink shadow-2xl animate-[pop-in_.22s_cubic-bezier(.2,.8,.2,1)] sm:p-8', className)}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && <h2 className="display-sm">{title}</h2>}
          <button onClick={onClose} className="-mr-2 -mt-1 grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
