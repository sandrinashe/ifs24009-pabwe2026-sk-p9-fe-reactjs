import { Check, Doc, Pencil } from '../../../components/Icons'

/** 3 kartu statistik: Total Artikel, Terbit, Draf. */
export default function PostStats({ stats }) {
  const items = [
    { label: 'Total Artikel', value: stats?.total_articles ?? 0, icon: Doc, tone: 'bg-berry text-white' },
    { label: 'Terbit', value: stats?.total_selesai ?? 0, icon: Check, tone: 'bg-white text-ink ring-1 ring-line' },
    { label: 'Draf', value: stats?.belum_selesai ?? 0, icon: Pencil, tone: 'bg-petal text-berry-dark' },
  ]
  return (
    <ul className="grid gap-4 sm:grid-cols-3" aria-label="Ringkasan artikel">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <li key={label} className={`flex items-center justify-between gap-4 rounded-[2rem] p-6 ${tone}`}>
          <div>
            <p className="text-sm font-bold">{label}</p>
            <p className="mega mt-2 text-6xl" data-testid={`stat-${label}`}>
              {value}
            </p>
          </div>
          <Icon size={36} />
        </li>
      ))}
    </ul>
  )
}
