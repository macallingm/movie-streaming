import { MovieCard } from './MovieCard'

export function ContentRow({ label, titles, emptyHint }) {
  const hasItems = titles?.length > 0
  if (!hasItems && !emptyHint) return null
  return (
    <section className="content-row">
      <div className="content-row__head">
        <h3 className="content-row__title">{label}</h3>
      </div>
      {hasItems ? (
        <div className="content-row__track" role="list">
          {titles.map((t) => (
            <MovieCard key={`${t.titleId}-${t._resumeQuery || ''}`} title={t} />
          ))}
        </div>
      ) : emptyHint ? (
        <p className="content-row__empty muted">{emptyHint}</p>
      ) : null}
    </section>
  )
}
