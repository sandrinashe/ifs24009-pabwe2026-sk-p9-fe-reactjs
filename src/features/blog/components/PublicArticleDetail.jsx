import { useEffect, useState } from 'react'
import { CoverArt } from '../../../components/Art'
import { ArrowLeft, Clock } from '../../../components/Icons'
import MarkdownViewer from '../../../components/MarkdownViewer'
import { PageLoader } from '../../../components/Ui'
import { Link } from '../../../helpers/navigation'
import { formatDate } from '../../../helpers/toolsHelper'
import useDocumentMeta from '../../../hooks/useDocumentMeta'
import { getPublicPost } from '../api/blogApi'

/** Halaman baca artikel (full width) dengan render Markdown. */
export default function PublicArticleDetail({ slug }) {
  const [state, setState] = useState({ loading: true, error: '', status: 0, post: null })

  useEffect(() => {
    let alive = true
    setState({ loading: true, error: '', status: 0, post: null })
    getPublicPost(slug)
      .then((post) => alive && setState({ loading: false, error: '', status: 200, post }))
      .catch((err) => alive && setState({ loading: false, error: err.message, status: err.status ?? 0, post: null }))
    return () => {
      alive = false
    }
  }, [slug])

  const { loading, error, status, post } = state
  useDocumentMeta(post?.title ?? (error ? 'Artikel tidak ditemukan' : 'Memuat artikel'), post?.excerpt)

  if (loading) return <PageLoader label="Memuat artikel..." />

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8">
        <h1 className="mega text-ink" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
          {status === 404 ? 'artikel tidak ada' : 'gagal memuat'}
        </h1>
        <p className="mt-6 text-lg text-muted" role="alert">
          {status === 404 ? 'Artikel ini tidak ditemukan atau belum diterbitkan.' : error}
        </p>
        <Link to="/" className="btn-primary mt-8">
          Kembali ke beranda
        </Link>
      </div>
    )
  }

  return (
    <article className="px-4 pt-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-berry hover:underline">
          <ArrowLeft size={18} />
          Kembali ke semua artikel
        </Link>
        <header className="mt-4">
          <p className="flex flex-wrap items-center gap-3">
            <span className="pill bg-berry text-white">{post.category}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted">
              <Clock size={16} />
              {post.reading_time} menit baca
            </span>
          </p>
          <h1 className="mega mt-4 text-ink" style={{ fontSize: 'clamp(2.4rem, 7vw, 6.5rem)', lineHeight: 0.92 }}>
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-6 max-w-4xl text-xl text-muted">{post.excerpt}</p>}
          <p className="mt-4 text-sm font-semibold text-muted">
            Oleh <span className="text-ink">{post.author_name}</span> · {formatDate(post.published_at)}
          </p>
        </header>
        <CoverArt post={post} className="mt-8 aspect-[21/9] w-full" rounded="rounded-[2rem]" />
        <div className="mx-auto mt-10 w-full max-w-5xl">
          <MarkdownViewer content={post.content} />
        </div>
      </div>
    </article>
  )
}
