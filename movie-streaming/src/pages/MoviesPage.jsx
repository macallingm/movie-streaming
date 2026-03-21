import { useMemo, useState } from 'react'
import { useApp } from '../hooks/useApp'
import { MovieCard } from '../components/MovieCard'
import { titleAllowedForProfile } from '../utils/maturity'

export function MoviesPage() {
  const { titles, activeProfile, watchProgress } = useApp()
  const [genre, setGenre] = useState('all')
  const [year, setYear] = useState('all')
  const [rating, setRating] = useState('all')
  const [filterWatching, setFilterWatching] = useState(false)

  const genres = useMemo(() => {
    const s = new Set()
    titles.forEach((t) => t.genres?.forEach((g) => s.add(g)))
    return ['all', ...[...s].sort()]
  }, [titles])

  const years = useMemo(() => {
    const s = new Set(titles.map((t) => String(t.releaseYear)))
    return ['all', ...[...s].sort((a, b) => Number(b) - Number(a))]
  }, [titles])

  const ratings = ['all', 'G', 'PG', '14A', '18+']

  const filtered = useMemo(() => {
    let list = titles.filter((t) => titleAllowedForProfile(activeProfile, t))
    if (genre !== 'all') list = list.filter((t) => t.genres?.includes(genre))
    if (year !== 'all') list = list.filter((t) => String(t.releaseYear) === year)
    if (rating !== 'all') list = list.filter((t) => t.maturityRating === rating)
    if (filterWatching) {
      const ids = new Set(
        watchProgress
          .filter((w) => w.profileId === activeProfile.profileId && !w.completed)
          .map((w) => w.titleId)
      )
      list = list.filter((t) => ids.has(t.titleId))
    }
    return list
  }, [
    titles,
    activeProfile,
    genre,
    year,
    rating,
    filterWatching,
    watchProgress,
  ])

  return (
    <div className="page-movies">
      <header className="page-header">
        <h1>Browse library</h1>
        <p className="muted">
          Filter by genre, year, rating, or titles you are watching.
        </p>
      </header>
      <div className="filter-bar">
        <label>
          Genre
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === 'all' ? 'All genres' : g}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y === 'all' ? 'All years' : y}
              </option>
            ))}
          </select>
        </label>
        <label>
          Rating
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {ratings.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'All ratings' : r}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={filterWatching}
            onChange={(e) => setFilterWatching(e.target.checked)}
          />
          Currently watching
        </label>
      </div>
      <div className="movie-grid" role="list">
        {filtered.map((t) => (
          <MovieCard key={t.titleId} title={t} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-state">No titles match these filters.</p>
      )}
    </div>
  )
}
