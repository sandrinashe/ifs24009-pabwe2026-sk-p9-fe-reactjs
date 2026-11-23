import { useEffect, useRef } from 'react'
import { Link } from '../helpers/navigation'
import { Arrow, Close, Spinner } from './Icons'

/** Tombol pil + lingkaran panah seperti referensi HUSH. */
export function ArrowButton({ to, children, variant = 'primary', ...rest }) {
  const pill = variant === 'primary' ? 'btn-primary' : variant === 'white' ? 'btn-white' : 'btn-outline'
  const circle = variant === 'white' ? 'bg-white text-berry-dark' : 'bg-berry text-white'
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5" {...rest}>
      <span className={pill}>{children}</span>
      <span className={`inline-flex size-11 items-center justify-center rounded-full transition group-hover:translate-x-1 ${circle}`}>
        <Arrow />
      </span>
    </Link>
  )
}

export function SubmitButton({ processing, children, className = 'btn-primary', ...rest }) {
  return (
    <button type="submit" disabled={processing} aria-busy={processing} className={className} {...rest}>
      {processing && <Spinner />}
      {children}
    </button>
  )
}

export function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="error-text">
      {message}
    </p>
  )
}

export function PageLoader({ label = 'Memuat...' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-24 text-muted">
      <Spinner size={22} />
      <span className="font-semibold">{label}</span>
    </div>
  )
}

export function StatusBadge({ published }) {
  return <span className={`pill ${published ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'}`}>{published ? 'Terbit' : 'Draf'}</span>
}

/** Dialog modal; fullScreen = tata letak layar penuh (max-w-[96vw]) dengan header & footer berwarna kontras. */
export function Modal({ open, onClose, title, children, footer, fullScreen = false, labelledBy = 'modal-title' }) {
  const panel = useRef(null)
  const previous = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    previous.current = document.activeElement
    document.body.style.overflow = 'hidden'
    const focusables = () => panel.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []
    const t = window.setTimeout(() => (panel.current?.querySelector('[data-autofocus]') ?? focusables()[0])?.focus(), 30)

    const onKey = (event) => {
      if (event.key === 'Escape') {
        closeRef.current()
      } else if (event.key === 'Tab') {
        const items = Array.from(focusables()).filter((el) => !el.disabled)
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  const shell = fullScreen
    ? 'relative mx-auto my-[2vh] flex h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl'
    : 'relative m-auto flex max-h-[90vh] w-[min(32rem,92vw)] flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl'

  return (
    <div className="fixed inset-0 z-50 flex bg-ink/60" role="presentation">
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={shell}>
        <header className="flex items-center justify-between gap-4 bg-berry-dark px-5 py-4 text-white sm:px-8">
          <h2 id={labelledBy} className="font-display text-xl font-extrabold sm:text-2xl">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/15">
            <Close />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">{children}</div>
        {footer && <footer className="flex flex-wrap items-center justify-end gap-3 bg-petal px-5 py-4 sm:px-8">{footer}</footer>}
      </div>
    </div>
  )
}
