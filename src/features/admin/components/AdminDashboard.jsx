import { useCallback, useEffect, useState } from 'react'
import { Doc, Users } from '../../../components/Icons'
import { PageLoader, StatusBadge } from '../../../components/Ui'
import { formatShortDate } from '../../../helpers/toolsHelper'
import useDocumentMeta from '../../../hooks/useDocumentMeta'
import { getAllPosts, getUserPosts, getUsers } from '../api/adminApi'

function Table({ label, children }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-[2rem] bg-white ring-1 ring-line" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  )
}

const th = 'px-5 py-3 font-extrabold'

/** Panel admin: statistik pengguna, direktori pengguna, dan arsip seluruh artikel. */
export default function AdminDashboard() {
  useDocumentMeta('Panel Admin', 'Pantau seluruh pengguna dan artikel di Delcom Blog.')
  const [state, setState] = useState({ loading: true, error: '', users: [], posts: [] })
  const [filter, setFilter] = useState(null) // user yang sedang difilter
  const [listLoading, setListLoading] = useState(false)

  const load = useCallback(async () => {
    try {
      const [users, posts] = await Promise.all([getUsers(), getAllPosts()])
      setState({ loading: false, error: '', users: users ?? [], posts: posts ?? [] })
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const showUser = async (user) => {
    setFilter(user)
    setListLoading(true)
    try {
      const posts = await getUserPosts(user.id)
      setState((s) => ({ ...s, posts: posts ?? [], error: '' }))
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }))
    } finally {
      setListLoading(false)
    }
  }

  const showAll = async () => {
    setFilter(null)
    setListLoading(true)
    await load()
    setListLoading(false)
  }

  const { loading, error, users, posts } = state
  const totalPosts = users.reduce((n, u) => n + u.total_articles, 0)
  const totalPublished = users.reduce((n, u) => n + u.total_published, 0)
  const cards = [
    { label: 'Total Pengguna', value: users.length, icon: Users, tone: 'bg-berry text-white' },
    { label: 'Total Artikel', value: totalPosts, icon: Doc, tone: 'bg-white text-ink ring-1 ring-line' },
    { label: 'Artikel Terbit', value: totalPublished, icon: Doc, tone: 'bg-petal text-berry-dark' },
  ]

  return (
    <>
      <h1 className="mega text-ink" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}>
        panel admin
      </h1>
      <p className="mt-3 text-muted">Pantau pengguna dan seluruh artikel di sistem.</p>

      {loading ? (
        <PageLoader label="Memuat data..." />
      ) : (
        <>
          {error && (
            <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-semibold text-red-800">
              {error}
            </p>
          )}
          <ul className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Ringkasan sistem">
            {cards.map(({ label, value, icon: Icon, tone }) => (
              <li key={label} className={`flex items-center justify-between gap-4 rounded-[2rem] p-6 ${tone}`}>
                <div>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="mega mt-2 text-6xl">{value}</p>
                </div>
                <Icon size={36} />
              </li>
            ))}
          </ul>

          <section aria-labelledby="users-title" className="mt-10">
            <h2 id="users-title" className="font-display text-2xl font-extrabold">
              Direktori pengguna
            </h2>
            <Table label="Tabel pengguna">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <caption className="sr-only">Seluruh pengguna sistem</caption>
                <thead className="bg-petal text-berry-dark">
                  <tr>
                    <th scope="col" className={th}>ID</th>
                    <th scope="col" className={th}>Username</th>
                    <th scope="col" className={th}>Email</th>
                    <th scope="col" className={th}>Role</th>
                    <th scope="col" className={th}>Artikel</th>
                    <th scope="col" className={th}>Terbit</th>
                    <th scope="col" className={`${th} text-right`}>Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-5 py-4">{u.id}</td>
                      <th scope="row" className="px-5 py-4 font-bold">{u.username}</th>
                      <td className="px-5 py-4">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`pill ${u.role === 'admin' ? 'bg-berry text-white' : 'bg-petal text-berry-dark'}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-4">{u.total_articles}</td>
                      <td className="px-5 py-4">{u.total_published}</td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" className="btn-soft" onClick={() => showUser(u)} aria-label={`Lihat artikel milik ${u.username}`}>
                          Lihat artikel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Table>
          </section>

          <section aria-labelledby="posts-title" className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="posts-title" className="font-display text-2xl font-extrabold">
                {filter ? `Artikel milik ${filter.username}` : 'Arsip seluruh artikel'}
              </h2>
              {filter && (
                <button type="button" className="btn-outline" onClick={showAll}>
                  Tampilkan semua
                </button>
              )}
            </div>
            {listLoading ? (
              <PageLoader label="Memuat artikel..." />
            ) : posts.length === 0 ? (
              <p role="status" className="mt-4 rounded-[2rem] bg-white p-8 text-center text-muted ring-1 ring-line">
                Belum ada artikel.
              </p>
            ) : (
              <Table label="Tabel artikel">
                <table className="w-full min-w-[48rem] text-left text-sm">
                  <caption className="sr-only">Arsip artikel</caption>
                  <thead className="bg-petal text-berry-dark">
                    <tr>
                      <th scope="col" className={th}>Judul</th>
                      <th scope="col" className={th}>Penulis</th>
                      <th scope="col" className={th}>Kategori</th>
                      <th scope="col" className={th}>Status</th>
                      <th scope="col" className={th}>Diterbitkan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {posts.map((p) => (
                      <tr key={p.id}>
                        <th scope="row" className="max-w-md px-5 py-4 font-bold">
                          <span className="line-clamp-2">{p.title}</span>
                        </th>
                        <td className="px-5 py-4">{p.author_name || `#${p.user_id}`}</td>
                        <td className="px-5 py-4">{p.category}</td>
                        <td className="px-5 py-4"><StatusBadge published={p.is_published} /></td>
                        <td className="px-5 py-4">{formatShortDate(p.published_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Table>
            )}
          </section>
        </>
      )}
    </>
  )
}
