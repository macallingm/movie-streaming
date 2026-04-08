import { useEffect, useMemo, useState } from 'react'
import { MovieCard } from '../components/MovieCard'
import { titleAllowedForProfile } from '../utils/maturity'
import { fetchPopularMovies, mapTmdbMovieToTitle } from '../services/tmdb'
import { useApp } from '../hooks/useApp'
import { yearSelectOptionsFromTitles } from '../utils/yearFilterOptions'

export function MoviesPage() {
  const { activeProfile } = useApp()
  const [genre, setGenre] = useState('all')
  const [year, setYear] = useState('all')
  const [rating, setRating] = useState('all')
  const [tmdbTitles, setTmdbTitles] = useState([])
  const [tmdbPage, setTmdbPage] = useState(1)
  const [tmdbLoading, setTmdbLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const pages = [1, 2, 3]
      const chunks = await Promise.all(pages.map((p) => fetchPopularMovies(p)))
      if (cancelled) return
      const mapped = chunks.flat().map(mapTmdbMovieToTitle).filter(Boolean)
      const seen = new Set()
      setTmdbTitles(
        mapped.filter((t) => {
          if (seen.has(t.titleId)) return false
          seen.add(t.titleId)
          return true
        })
      )
      setTmdbLoading(false)
      setTmdbPage(3)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const loadMoreTmdb = async () => {
    if (tmdbLoading) return
    const nextPage = tmdbPage + 1
    setTmdbLoading(true)
    const chunk = await fetchPopularMovies(nextPage)
    const mapped = chunk.map(mapTmdbMovieToTitle).filter(Boolean)
    setTmdbTitles((prev) => {
      const seen = new Set(prev.map((t) => t.titleId))
      const next = mapped.filter((t) => !seen.has(t.titleId))
      return [...prev, ...next]
    })
    setTmdbPage(nextPage)
    setTmdbLoading(false)
  }

  const allTitles = tmdbTitles

  const genres = useMemo(() => {
    const s = new Set()
    allTitles.forEach((t) => t.genres?.forEach((g) => s.add(g)))
    return ['all', ...[...s].sort()]
  }, [allTitles])

  const years = useMemo(
    () => yearSelectOptionsFromTitles(allTitles),
    [allTitles]
  )

  const ratings = ['all', 'G', 'PG', '14A', '18+']

  const filtered = useMemo(() => {
    let list = allTitles.filter((t) => titleAllowedForProfile(activeProfile, t))
    if (genre !== 'all') list = list.filter((t) => t.genres?.includes(genre))
    if (year !== 'all') list = list.filter((t) => String(t.releaseYear) === year)
    if (rating !== 'all') list = list.filter((t) => t.maturityRating === rating)
    return list
  }, [
    allTitles,
    activeProfile,
    genre,
    year,
    rating,
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
      </div>
      <div className="movie-grid" role="list">
        {filtered.map((t) => (
          <MovieCard key={t.titleId} title={t} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-state">No titles match these filters.</p>
      )}
      <div className="catalog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadMoreTmdb}
          disabled={tmdbLoading}
        >
          {tmdbLoading ? 'Loading more…' : 'Load more movies'}
        </button>
      </div>
    </div>
  )
}
