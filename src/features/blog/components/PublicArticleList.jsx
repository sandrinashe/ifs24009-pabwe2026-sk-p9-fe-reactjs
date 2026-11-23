import { useEffect, useState } from 'react'
import { ChromeBlob } from '../../../components/Art'
import { Search } from '../../../components/Icons'
import { ArrowButton, PageLoader } from '../../../components/Ui'
import useDebounce from '../../../hooks/useDebounce'
import useDocumentMeta from '../../../hooks/useDocumentMeta'
import { useAuth } from '../../auth/AuthContext'
import { getCategories, getPublicPosts } from '../api/blogApi'
import ArticleCard from './ArticleCard'

const FALLBACK_CATEGORIES = ['Teknologi', 'Pendidikan', 'Gaya Hidup', 'Bisnis', 'Opini', 'Umum']

function Hero() {
  const { user } = useAuth()
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden px-4 pb-8 pt-10 sm:px-8 sm:pt-16">
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-6 text-sm font-bold uppercase tracking-widest text-berry">Platform blog multi-penulis</p>
        <h1 id="hero-title" className="mega relative z-0 text-center text-ink" style={{ fontSize: 'clamp(3.6rem, 12vw, 12rem)' }}>
          <span className="block lg:inline">tulis</span> <span className="block lg:inline">suaramu</span>
        </h1>
        <ChromeBlob className="floaty pointer-events-none absolute -left-4 -top-2 z-10 h-24 w-24 sm:left-[1%] sm:top-0 sm:h-44 sm:w-44" />
        <ChromeBlob tint="pink" className="floaty pointer-events-none absolute -right-2 -bottom-8 z-10 h-28 w-28 sm:right-[1%] sm:h-48 sm:w-48" />
      </div>

      <div className="relative z-20 mx-auto mt-10 grid max-w-7xl gap-8 sm:mt-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-muted">Tentang kami</p>
          <p className="font-display text-xl font-extrabold">Apa yang kami lakukan</p>
        </div>
        <div>
          <p className="font-display text-xl font-extrabold leading-snug sm:text-2xl">Setiap artikel Delcom Blog adalah perpaduan kreativitas dan kejelasan: ditulis penulis, dibaca siapa saja.</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {user ? (
              <ArrowButton to={user.role === 'admin' ? '/admin' : '/author'}>Buka ruang kerja</ArrowButton>
            ) : (
              <>
                <ArrowButton to="/login">Masuk</ArrowButton>
                <ArrowButton to="/register" variant="outline">
                  Daftar Penulis
                </ArrowButton>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Beranda galeri artikel publik: pencarian real-time + filter kategori pill. */
export default function PublicArticleList() {
  useDocumentMeta(null, 'Delcom Blog: baca, cari, dan terbitkan artikel Teknologi, Pendidikan, Gaya Hidup, Bisnis, dan Opini.')
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('Semua')
  const [state, setState] = useState({ loading: true, error: '', posts: [] })
  const query = useDebounce(q.trim(), 300)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    setState((s) => ({ ...s, loading: true, error: '' }))
    getPublicPosts({ q: query, category }, ctrl.signal)
      .then((posts) => setState({ loading: false, error: '', posts: posts ?? [] }))
      .catch((err) => {
        if (err?.name !== 'AbortError') setState({ loading: false, error: err.message, posts: [] })
      })
    return () => ctrl.abort()
  }, [query, category])

  const { loading, error, posts } = state
  const pill = (label) => {
    const active = category === label
    return (
      <li key={label}>
        <button
          type="button"
          aria-pressed={active}
          onClick={() => setCategory(label)}
          className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ${active ? 'bg-white text-berry-dark' : 'bg-berry-dark text-white hover:bg-ink'}`}
        >
          {label}
        </button>
      </li>
    )
  }

  return (
    <>
      <Hero />

      <section id="artikel" aria-labelledby="articles-title" className="scroll-mt-16 bg-band px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 id="articles-title" className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
              Artikel terbaru
            </h2>
          </div>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="mx-auto mt-8 max-w-2xl">
            <label htmlFor="search-articles" className="sr-only">
              Cari artikel berdasarkan judul atau isi
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <Search />
              </span>
              <input id="search-articles" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul atau isi artikel..." className="field rounded-full pl-12" autoComplete="off" />
            </div>
          </form>

          <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Filter kategori">
            {pill('Semua')}
            {categories.map(pill)}
          </ul>

          <p role="status" className="sr-only">
            {loading ? 'Memuat artikel' : `${posts.length} artikel ditemukan`}
          </p>

          {loading && posts.length === 0 && !error ? (
            <div className="mt-10 text-white">
              <PageLoader label="Memuat artikel..." />
            </div>
          ) : error ? (
            <div role="alert" className="mt-10 rounded-[2.5rem] bg-white p-10 text-center text-ink">
              <p className="font-display text-2xl font-extrabold">Artikel belum dapat dimuat.</p>
              <p className="mt-2 text-muted">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-10 rounded-[2.5rem] bg-white/20 p-10 text-center text-white">
              <p className="font-display text-2xl font-extrabold">Belum ada artikel yang cocok.</p>
              <p className="mt-2">Coba kata kunci atau kategori lain.</p>
            </div>
          ) : (
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id}>
                  <ArticleCard post={post} tone="band" level={3} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="about-title" className="relative mx-auto mt-20 grid max-w-7xl gap-10 px-4 sm:px-8 md:grid-cols-2 md:items-center">
        <div className="max-w-md">
          <h2 id="about-title" className="font-display text-2xl font-extrabold">Tim kami</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">Kami bersemangat tentang tulisan yang jernih dan inovasi dalam cara bercerita. Setiap penulis mendapat ruang sendiri untuk menyusun, menyunting, dan menerbitkan artikel.</p>
          <p className="mt-4 text-base leading-relaxed text-muted">Dengan editor Markdown dan asisten AI yang terhubung ke mesin pencari, draf awal yang relevan siap dalam hitungan detik tanpa kehilangan suara pribadi.</p>
          <div className="mt-6">
            <ArrowButton to="/register">Mulai menulis</ArrowButton>
          </div>
        </div>
        <div className="relative mx-auto h-72 w-full max-w-md sm:h-96" aria-hidden="true">
          <div className="absolute right-0 top-0 h-3/4 w-3/4 rounded-[3rem] bg-gradient-to-br from-chrome to-white shadow-inner" />
          <ChromeBlob className="floaty absolute -left-2 top-4 h-36 w-36" />
          <ChromeBlob tint="pink" className="absolute bottom-0 left-1/3 h-44 w-44" />
        </div>
      </section>
    </>
  )
}
