import { Avatar } from '../../../components/Art'
import { Logout, Search, User } from '../../../components/Icons'
import { Link } from '../../../helpers/navigation'
import { useAuth } from '../../auth/AuthContext'

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`mega inline-block text-3xl text-berry ${className}`} aria-label="Delcom Blog, ke beranda">
      DELCOM
    </Link>
  )
}

/** Navbar sticky untuk halaman publik (tanpa sidebar). */
export default function StickyNavbar({ path, onLogout }) {
  const { user } = useAuth()
  const link = (to, label, active) => (
    <Link to={to} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center px-2 text-sm font-bold ${active ? 'text-berry underline decoration-2 underline-offset-8' : 'text-ink hover:text-berry'}`}>
      {label}
    </Link>
  )
  const workspace = user?.role === 'admin' ? { to: '/admin', label: 'Panel Admin' } : { to: '/author', label: 'Ruang Penulis' }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <Logo />
          <nav aria-label="Navigasi utama" className="flex items-center gap-1">
            {link('/', 'Beranda', path === '/' || path === '/public')}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a href="/#artikel" aria-label="Cari artikel" className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-petal">
            <Search />
          </a>
          {user ? (
            <>
              <Link to={workspace.to} className="btn-soft">
                <Avatar user={user} size={24} />
                <span className="hidden sm:inline">{workspace.label}</span>
                <span className="sr-only sm:hidden">{workspace.label}</span>
              </Link>
              <button type="button" onClick={onLogout} className="btn-outline">
                <Logout size={18} />
                <span className="hidden sm:inline">Keluar</span>
                <span className="sr-only sm:hidden">Keluar</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                <User size={18} />
                Masuk
              </Link>
              <Link to="/register" className="btn-primary">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
