import { useCallback, useEffect, useState } from 'react'
import { Eye, Pencil, Plus, Sparkles, Trash } from '../../../components/Icons'
import KebabMenu from '../../../components/KebabMenu'
import { PageLoader, StatusBadge } from '../../../components/Ui'
import { navigate } from '../../../helpers/navigation'
import { confirmDialog, formatShortDate, showAlert, showToast } from '../../../helpers/toolsHelper'
import useDocumentMeta from '../../../hooks/useDocumentMeta'
import { deletePost, getMyPosts, getMyStats, togglePublish } from '../api/blogApi'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'
import PostModal from '../modals/PostModal'
import PostStats from './PostStats'

/** Ruang kerja penulis: statistik, tabel artikel, toggle terbit/draf, menu ⋮, modal editor & AI. */
export default function AuthorDashboard() {
  useDocumentMeta('Ruang Penulis', 'Kelola artikel milikmu: tulis, sunting, terbitkan, atau buat draf dengan AI.')
  const [data, setData] = useState({ loading: true, error: '', posts: [], stats: null })
  const [editor, setEditor] = useState({ open: false, post: null, initial: null })
  const [aiOpen, setAiOpen] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    try {
      const [posts, stats] = await Promise.all([getMyPosts(), getMyStats()])
      setData({ loading: false, error: '', posts: posts ?? [], stats })
    } catch (err) {
      setData((d) => ({ ...d, loading: false, error: err.message }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async (post) => {
    setBusyId(post.id)
    try {
      await togglePublish(post.id)
      showToast(post.is_published ? 'Artikel dikembalikan menjadi draf.' : 'Artikel berhasil diterbitkan.')
      await load()
    } catch (err) {
      showAlert('Gagal mengubah status', err.message)
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (post) => {
    if (!(await confirmDialog('Hapus artikel?', `"${post.title}" akan dihapus permanen.`, 'Ya, hapus'))) return
    try {
      await deletePost(post.id)
      showToast('Artikel dihapus.')
      await load()
    } catch (err) {
      showAlert('Gagal menghapus', err.message)
    }
  }

  const { loading, error, posts, stats } = data

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mega text-ink" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}>
            ruang penulis
          </h1>
          <p className="mt-3 text-muted">Kelola artikelmu: tulis, sunting, dan atur status terbit.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-soft" onClick={() => setAiOpen(true)}>
            <Sparkles size={18} />
            AI Generator
          </button>
          <button type="button" className="btn-primary" onClick={() => setEditor({ open: true, post: null, initial: null })}>
            <Plus size={18} />
            Tambah Artikel
          </button>
        </div>
      </div>

      <div className="mt-8">
        <PostStats stats={stats} />
      </div>

      <section aria-labelledby="my-posts" className="mt-10">
        <h2 id="my-posts" className="font-display text-2xl font-extrabold">
          Artikel saya
        </h2>
        {loading ? (
          <PageLoader label="Memuat artikel..." />
        ) : error ? (
          <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 font-semibold text-red-800">
            {error}
          </p>
        ) : posts.length === 0 ? (
          <div className="mt-4 rounded-[2rem] bg-white p-10 text-center ring-1 ring-line" role="status">
            <p className="font-display text-2xl font-extrabold">Belum ada artikel.</p>
            <p className="mt-2 text-muted">Klik "Tambah Artikel" atau minta AI membuat draf pertamamu.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[2rem] bg-white ring-1 ring-line" role="region" aria-label="Tabel artikel saya" tabIndex={0}>
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Daftar artikel milik Anda</caption>
              <thead className="bg-petal text-berry-dark">
                <tr>
                  <th scope="col" className="px-5 py-3 font-extrabold">Judul</th>
                  <th scope="col" className="px-5 py-3 font-extrabold">Kategori</th>
                  <th scope="col" className="px-5 py-3 font-extrabold">Status</th>
                  <th scope="col" className="px-5 py-3 font-extrabold">Diterbitkan</th>
                  <th scope="col" className="px-5 py-3 text-right font-extrabold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <th scope="row" className="max-w-md px-5 py-4 font-bold">
                      <span className="line-clamp-2">{post.title}</span>
                    </th>
                    <td className="px-5 py-4">{post.category}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={post.is_published}
                          aria-label={`Terbitkan: ${post.title}`}
                          disabled={busyId === post.id}
                          onClick={() => toggle(post)}
                          className={`relative inline-flex h-11 w-16 items-center rounded-full px-1 transition ${post.is_published ? 'bg-berry' : 'bg-muted'}`}
                        >
                          <span className={`inline-block size-8 rounded-full bg-white shadow transition-transform ${post.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                        <StatusBadge published={post.is_published} />
                      </div>
                    </td>
                    <td className="px-5 py-4">{formatShortDate(post.published_at)}</td>
                    <td className="px-5 py-4 text-right">
                      <KebabMenu
                        label={`Aksi untuk ${post.title}`}
                        items={[
                          { key: 'view', text: 'Lihat', icon: Eye, onSelect: () => (post.is_published ? navigate(`/posts/${post.slug}`) : showToast('Terbitkan artikel dahulu agar bisa dilihat publik.', 'info')) },
                          { key: 'edit', text: 'Edit', icon: Pencil, onSelect: () => setEditor({ open: true, post, initial: null }) },
                          { key: 'delete', text: 'Hapus', icon: Trash, danger: true, onSelect: () => remove(post) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <PostModal
        open={editor.open}
        post={editor.post}
        initial={editor.initial}
        onClose={() => setEditor({ open: false, post: null, initial: null })}
        onSaved={() => {
          setEditor({ open: false, post: null, initial: null })
          load()
        }}
      />
      <AiPostGeneratorModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onApply={(draft) => {
          setAiOpen(false)
          setEditor({ open: true, post: null, initial: draft })
        }}
      />
    </>
  )
}
