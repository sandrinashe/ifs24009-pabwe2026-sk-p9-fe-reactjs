import { useEffect } from 'react'

const SITE = 'Delcom Blog'

/** Mengatur <title> dan meta description per halaman SPA. */
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — tulis suaramu`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
