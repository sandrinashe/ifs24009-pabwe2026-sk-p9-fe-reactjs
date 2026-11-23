import { Link } from '../helpers/navigation'
import { useAuth } from '../features/auth/AuthContext'

export default function SiteFooter() {
  const { user } = useAuth()
  const item = 'inline-flex min-h-11 items-center text-ink hover:text-berry'
  return (
    <footer className="mt-24 overflow-hidden bg-blush">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <p className="max-w-sm text-base text-muted">Delcom Blog adalah ruang menulis dan membaca yang rapi: temukan ide, terbitkan artikel, dan bangun komunitas pembaca.</p>
          <nav aria-label="Navigasi footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold">
              <li><Link to="/" className={item}>Beranda Publik</Link></li>
              {!user && (
                <>
                  <li><Link to="/login" className={item}>Halaman Login</Link></li>
                  <li><Link to="/register" className={item}>Halaman Register</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <p aria-hidden="true" className="mega mt-10 select-none whitespace-nowrap text-center text-bloom" style={{ fontSize: 'clamp(2.6rem, 12.4vw, 13rem)', marginBottom: '-0.12em' }}>
          DELCOM BLOG
        </p>
      </div>
      <div className="bg-berry-dark px-4 py-4 text-center text-sm font-semibold text-white">© {new Date().getFullYear()} Delcom Blog · PABWE 2026</div>
    </footer>
  )
}
