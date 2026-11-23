import { useEffect, useState } from 'react'
import SiteFooter from './components/SiteFooter'
import { PageLoader } from './components/Ui'
import WorkspaceShell from './components/WorkspaceShell'
import AdminDashboard from './features/admin/components/AdminDashboard'
import { useAuth } from './features/auth/AuthContext'
import AuthPage from './features/auth/components/AuthPage'
import { logout } from './features/auth/api/authApi'
import AuthorDashboard from './features/blog/components/AuthorDashboard'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'
import PublicArticleList from './features/blog/components/PublicArticleList'
import StickyNavbar from './features/blog/components/StickyNavbar'
import { Link, navigate, usePathname } from './helpers/navigation'
import { showToast } from './helpers/toolsHelper'
import useDocumentMeta from './hooks/useDocumentMeta'

/** Mengurai path menjadi nama rute + parameter. */
export function matchRoute(path) {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  if (clean === '/' || clean === '/public') return { name: 'home' }
  if (clean === '/login') return { name: 'login' }
  if (clean === '/register') return { name: 'register' }
  if (clean === '/author') return { name: 'author' }
  if (clean === '/admin') return { name: 'admin' }
  const m = clean.match(/^\/posts\/([^/]+)$/)
  if (m) return { name: 'post', slug: decodeURIComponent(m[1]) }
  return { name: 'notfound' }
}

function NotFound() {
  useDocumentMeta('Halaman tidak ditemukan')
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8">
      <h1 className="mega text-ink" style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}>
        404
      </h1>
      <p className="mt-6 text-lg text-muted">Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="btn-primary mt-8">
        Kembali ke beranda
      </Link>
    </div>
  )
}

/** Mengalihkan ke rute lain sebagai efek (dipakai untuk penjagaan akses). */
function Redirect({ to }) {
  useEffect(() => navigate(to, { replace: true }), [to])
  return <PageLoader label="Mengalihkan..." />
}

export default function App() {
  const path = usePathname()
  const { user, checking, signOut } = useAuth()
  const route = matchRoute(path)
  const [, force] = useState(0)

  useEffect(() => {
    const expired = () => force((n) => n + 1)
    window.addEventListener('auth:expired', expired)
    return () => window.removeEventListener('auth:expired', expired)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      /* token tetap dibuang di sisi klien */
    }
    signOut()
    showToast('Anda telah keluar.')
    navigate('/')
  }

  const skip = (
    <a href="#main" className="sr-only z-[70] rounded-full bg-berry px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
      Lewati ke konten utama
    </a>
  )

  const isWorkspace = route.name === 'author' || route.name === 'admin'
  if (isWorkspace) {
    let body
    if (checking) body = <PageLoader label="Memeriksa sesi..." />
    else if (!user) body = <Redirect to="/login" />
    else if (route.name === 'admin' && user.role !== 'admin') body = <Redirect to="/author" />
    else body = route.name === 'admin' ? <AdminDashboard /> : <AuthorDashboard />
    return (
      <>
        {skip}
        <WorkspaceShell path={path} onLogout={handleLogout}>
          {body}
        </WorkspaceShell>
      </>
    )
  }

  let page
  switch (route.name) {
    case 'home':
      page = <PublicArticleList />
      break
    case 'post':
      page = <PublicArticleDetail slug={route.slug} />
      break
    case 'login':
    case 'register':
      page = user ? <Redirect to={user.role === 'admin' ? '/admin' : '/author'} /> : <AuthPage mode={route.name} />
      break
    default:
      page = <NotFound />
  }

  return (
    <>
      {skip}
      <StickyNavbar path={path} onLogout={handleLogout} />
      <main id="main" tabIndex={-1} className="outline-none">
        {page}
      </main>
      <SiteFooter />
    </>
  )
}
