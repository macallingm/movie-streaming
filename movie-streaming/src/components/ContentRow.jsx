import { MovieCard } from './MovieCard'

export function ContentRow({ label, titles }) {
  if (!titles?.length) return null
  return (
    <section className="content-row">
      <div className="content-row__head">
        <h3 className="content-row__title">{label}</h3>
      </div>
      <div className="content-row__track" role="list">
        {titles.map((t) => (
          <MovieCard key={t.titleId} title={t} />
        ))}
      </div>
    </section>
  )
}
