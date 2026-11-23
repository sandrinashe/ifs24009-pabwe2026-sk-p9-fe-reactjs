import { useEffect, useRef, useState } from 'react'
import { Dots } from './Icons'

/** Menu aksi (⋮) yang dapat dioperasikan keyboard: Esc menutup, fokus kembali ke tombol. */
export default function KebabMenu({ label, items }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const button = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    root.current?.querySelector('[role="menuitem"]')?.focus()
    const away = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    const key = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <div ref={root} className="relative inline-block text-left">
      <button ref={button} type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="inline-flex size-11 items-center justify-center rounded-full hover:bg-petal">
        <Dots />
      </button>
      {open && (
        <div role="menu" aria-label={label} className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-line">
          {items.map(({ key, text, icon: Icon, onSelect, danger }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onSelect()
              }}
              className={`flex min-h-11 w-full items-center gap-3 px-4 text-sm font-bold hover:bg-petal ${danger ? 'text-red-700' : 'text-ink'}`}
            >
              <Icon size={18} />
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
