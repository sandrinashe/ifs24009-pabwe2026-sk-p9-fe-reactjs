import { Avatar } from './Art'
import { Logout, Search } from './Icons'
import { Link } from '../helpers/navigation'
import { Logo } from '../features/blog/components/StickyNavbar'
import { useAuth } from '../features/auth/AuthContext'

/** Kerangka ruang kerja (Penulis/Admin): top bar + konten full width tanpa sidebar. */
export default function WorkspaceShell({ path, onLogout, children }) {
  const { user } = useAuth()
  const tab = (to, label) => {
    const active = path === to
    return (
      <Link to={to} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ${active ? 'bg-berry text-white' : 'text-ink hover:bg-petal'}`}>
        {label}
      </Link>
    )
  }
  return (
    <div className="min-h-screen bg-blush">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <Logo />
            <nav aria-label="Navigasi ruang kerja" className="flex items-center gap-1">
              {tab('/author', 'Ruang Penulis')}
              {user?.role === 'admin' && tab('/admin', 'Panel Admin')}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-soft">
              <Search size={18} />
              <span className="hidden sm:inline">Lihat Blog</span>
              <span className="sr-only sm:hidden">Lihat Blog</span>
            </Link>
            <span className="hidden items-center gap-2 text-sm font-bold md:inline-flex">
              <Avatar user={user} size={32} />
              {user?.username}
            </span>
            <button type="button" onClick={onLogout} className="btn-outline">
              <Logout size={18} />
              <span className="hidden sm:inline">Keluar</span>
              <span className="sr-only sm:hidden">Keluar</span>
            </button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1800px] px-4 py-8 outline-none sm:px-8">
        {children}
      </main>
    </div>
  )
}
