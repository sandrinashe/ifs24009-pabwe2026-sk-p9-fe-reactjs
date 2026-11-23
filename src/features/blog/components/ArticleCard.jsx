import { CoverArt } from '../../../components/Art'
import { Clock } from '../../../components/Icons'
import { Link } from '../../../helpers/navigation'
import { formatShortDate } from '../../../helpers/toolsHelper'

/** Kartu artikel bergaya "bubble" ala referensi HUSH. */
export default function ArticleCard({ post, tone = 'light', level = 3 }) {
  const Heading = `h${level}`
  const band = tone === 'band'
  const to = `/posts/${post.slug}`
  return (
    <article className="group flex flex-col">
      <Link to={to} className="block" aria-label={`Baca: ${post.title}`}>
        <div className={`rounded-[3rem] p-3 ${band ? 'bg-white/20' : 'bg-petal'}`}>
          <CoverArt post={post} className="aspect-[4/5] transition duration-500 group-hover:scale-[1.02]" rounded="rounded-[2.4rem]" />
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col px-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`pill ${band ? 'bg-white text-berry-dark' : 'bg-berry text-white'}`}>{post.category}</span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${band ? 'text-white' : 'text-muted'}`}>
            <Clock size={14} />
            {post.reading_time} menit baca
          </span>
        </div>
        <Heading className={`mt-2 font-display text-xl font-extrabold leading-tight ${band ? 'text-white' : 'text-ink'}`}>
          <Link to={to} className="hover:underline">
            {post.title}
          </Link>
        </Heading>
        {post.excerpt && <p className={`mt-2 line-clamp-3 text-sm ${band ? 'text-white' : 'text-muted'}`}>{post.excerpt}</p>}
        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <p className={`min-w-0 truncate text-xs font-semibold ${band ? 'text-white' : 'text-muted'}`}>
            {post.author_name} · {formatShortDate(post.published_at)}
          </p>
          <Link to={to} tabIndex={-1} aria-hidden="true" className="btn min-h-9 shrink-0 bg-white px-4 text-xs text-berry-dark ring-1 ring-line hover:bg-petal">
            Baca
          </Link>
        </div>
      </div>
    </article>
  )
}
