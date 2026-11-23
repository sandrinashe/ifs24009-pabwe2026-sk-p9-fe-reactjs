import { useEffect, useState } from 'react'
import { Sparkles } from '../../../components/Icons'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { FieldError, Modal, SubmitButton } from '../../../components/Ui'
import useInput from '../../../hooks/useInput'
import { aiGenerate } from '../api/blogApi'
import { CATEGORIES } from './PostModal'

/** Modal layar penuh AI Blog Generator dengan opsi penelusuran search engine. */
export default function AiPostGeneratorModal({ open, onClose, onApply }) {
  const { values, bind, reset } = useInput({ topic: '', category: '', include_web_search: true })
  const [topicError, setTopicError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    if (open) {
      reset({ topic: '', category: '', include_web_search: true })
      setTopicError('')
      setFormError('')
      setDraft(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const generate = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!values.topic.trim()) {
      setTopicError('Topik wajib diisi.')
      return
    }
    setTopicError('')
    setLoading(true)
    setDraft(null)
    try {
      setDraft(
        await aiGenerate({
          topic: values.topic.trim(),
          category: values.category,
          include_web_search: values.include_web_search,
        }),
      )
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      fullScreen
      title="AI Blog Generator"
      labelledBy="ai-modal-title"
      footer={
        <>
          <button type="button" className="btn-outline" onClick={onClose}>
            Batal
          </button>
          <button type="button" className="btn-primary" disabled={!draft} onClick={() => onApply(draft)}>
            Terapkan ke Editor
          </button>
        </>
      }
    >
      <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <form onSubmit={generate} noValidate className="space-y-5">
          <div>
            <label htmlFor="ai-topic" className="label">Topik artikel</label>
            <textarea id="ai-topic" data-autofocus rows={4} className="field" placeholder="Contoh: Perkembangan AI di dunia pendidikan 2026" aria-invalid={Boolean(topicError)} aria-describedby={topicError ? 'ai-topic-error' : undefined} {...bind('topic')} />
            <FieldError id="ai-topic-error" message={topicError} />
          </div>
          <div>
            <label htmlFor="ai-category" className="label">Kategori (opsional)</label>
            <select id="ai-category" className="field" {...bind('category')}>
              <option value="">Biarkan AI memilih</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <label className="flex min-h-11 items-start gap-3 text-sm font-bold">
            <input type="checkbox" className="mt-0.5 size-5 accent-berry" checked={values.include_web_search} onChange={bind('include_web_search').onChange} />
            <span>
              Sertakan penelusuran search engine
              <span className="block text-xs font-semibold text-muted">Artikel memakai informasi terkini dan menampilkan sumber rujukan.</span>
            </span>
          </label>
          <SubmitButton processing={loading} className="btn-primary w-full">
            <Sparkles size={18} />
            {loading ? 'AI sedang menulis...' : 'Buat Draf Artikel'}
          </SubmitButton>
          <p role="status" className="text-sm font-semibold text-muted">
            {loading ? 'Proses dapat memakan waktu hingga 1–2 menit. Mohon tunggu.' : ''}
          </p>
          {formError && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
              {formError}
            </p>
          )}
        </form>

        <section aria-labelledby="ai-preview-title" className="min-w-0 rounded-[2rem] bg-blush p-6 ring-1 ring-line">
          <h3 id="ai-preview-title" className="font-display text-xl font-extrabold">
            Pratinjau draf
          </h3>
          {!draft ? (
            <p className="mt-3 text-muted">Draf yang dihasilkan AI akan tampil di sini. Tinjau, lalu terapkan ke editor untuk disunting dan disimpan.</p>
          ) : (
            <div className="mt-4">
              <p className="pill bg-berry text-white">{draft.category}</p>
              <p className="mega mt-3 text-4xl text-ink" style={{ lineHeight: 0.95 }}>{draft.title}</p>
              <p className="mt-3 text-muted">{draft.excerpt}</p>
              <div className="mt-6">
                <MarkdownViewer content={draft.content} />
              </div>
              {draft.sources?.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-display text-lg font-extrabold">Sumber rujukan</h4>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
                    {draft.sources.map((s, i) => (
                      <li key={`${s.url}-${i}`}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-bold text-berry underline">
                          {s.title || s.url}
                        </a>
                        {s.snippet && <span className="block text-muted">{s.snippet}</span>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Modal>
  )
}
