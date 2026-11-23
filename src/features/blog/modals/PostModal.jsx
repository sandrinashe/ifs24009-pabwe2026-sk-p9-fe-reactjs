import { lazy, Suspense, useEffect, useState } from 'react'
import { FieldError, Modal, PageLoader, SubmitButton } from '../../../components/Ui'
import { showToast } from '../../../helpers/toolsHelper'
import useInput from '../../../hooks/useInput'
import { createPost, updatePost } from '../api/blogApi'

const MarkdownEditor = lazy(() => import('../../../components/MarkdownEditor'))

export const CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

const blank = { title: '', category: 'Umum', excerpt: '', cover_image_path: '', is_published: false }

/** Modal layar penuh untuk membuat/menyunting artikel (Toast UI Editor). */
export default function PostModal({ open, post, initial, onClose, onSaved }) {
  const { values, bind, reset } = useInput(blank)
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [session, setSession] = useState(0)

  useEffect(() => {
    if (!open) return
    const src = post ?? initial ?? {}
    reset({
      title: src.title ?? '',
      category: src.category && CATEGORIES.includes(src.category) ? src.category : 'Umum',
      excerpt: src.excerpt ?? '',
      cover_image_path: src.cover_image_path ?? '',
      is_published: Boolean(post?.is_published),
    })
    setContent(src.content ?? '')
    setErrors({})
    setFormError('')
    setSession((n) => n + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, post, initial])

  const submit = async (event) => {
    event.preventDefault()
    const found = {}
    if (!values.title.trim()) found.title = 'Judul wajib diisi.'
    if (!content.trim()) found.content = 'Konten artikel wajib diisi.'
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length) return
    setProcessing(true)
    try {
      const payload = {
        title: values.title.trim(),
        category: values.category,
        excerpt: values.excerpt.trim(),
        content,
        cover_image_path: values.cover_image_path.trim(),
        is_published: values.is_published,
      }
      if (post) await updatePost(post.id, payload)
      else await createPost(payload)
      showToast(post ? 'Artikel berhasil diperbarui.' : 'Artikel berhasil dibuat.')
      onSaved()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      fullScreen
      title={post ? 'Edit Artikel' : 'Tambah Artikel'}
      labelledBy="post-modal-title"
      footer={
        <>
          <button type="button" className="btn-outline" onClick={onClose}>
            Batal
          </button>
          <SubmitButton processing={processing} form="post-form" className="btn-primary">
            Simpan
          </SubmitButton>
        </>
      }
    >
      <form id="post-form" onSubmit={submit} noValidate className="mx-auto max-w-[1600px] space-y-5">
        {formError && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
            {formError}
          </p>
        )}
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div>
            <label htmlFor="post-title" className="label">Judul</label>
            <input id="post-title" data-autofocus type="text" className="field" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'post-title-error' : undefined} {...bind('title')} />
            <FieldError id="post-title-error" message={errors.title} />
          </div>
          <div>
            <label htmlFor="post-category" className="label">Kategori</label>
            <select id="post-category" className="field" {...bind('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label htmlFor="post-excerpt" className="label">Ringkasan (1–2 kalimat)</label>
            <textarea id="post-excerpt" rows={3} className="field" {...bind('excerpt')} />
          </div>
          <div>
            <label htmlFor="post-cover" className="label">Alamat gambar sampul (opsional)</label>
            <input id="post-cover" type="url" inputMode="url" placeholder="https://..." className="field" {...bind('cover_image_path')} />
            <label className="mt-4 flex min-h-11 items-center gap-3 text-sm font-bold">
              <input type="checkbox" className="size-5 accent-berry" checked={values.is_published} onChange={bind('is_published').onChange} />
              Terbitkan sekarang
            </label>
          </div>
        </div>
        <div>
          <p id="post-content-label" className="label">Isi artikel (Markdown)</p>
          <Suspense fallback={<PageLoader label="Memuat editor..." />}>
            <MarkdownEditor key={session} value={content} onChange={setContent} labelledBy="post-content-label" />
          </Suspense>
          <FieldError id="post-content-error" message={errors.content} />
        </div>
      </form>
    </Modal>
  )
}
