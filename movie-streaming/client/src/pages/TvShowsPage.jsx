import { useEffect, useMemo, useState } from 'react'
import { MovieCard } from '../components/MovieCard'
import { titleAllowedForProfile } from '../utils/maturity'
import { fetchPopularTv, mapTmdbTvToTitle } from '../services/tmdb'
import { useApp } from '../hooks/useApp'
import { yearSelectOptionsFromTitles } from '../utils/yearFilterOptions'

export function TvShowsPage() {
  const { activeProfile } = useApp()
  const [genre, setGenre] = useState('all')
  const [year, setYear] = useState('all')
  const [rating, setRating] = useState('all')
  const [tvTitles, setTvTitles] = useState([])
  const [tvPage, setTvPage] = useState(1)
  const [tvLoading, setTvLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const pages = [1, 2, 3]
      const chunks = await Promise.all(pages.map((p) => fetchPopularTv(p)))
      if (cancelled) return
      const mapped = chunks.flat().map(mapTmdbTvToTitle).filter(Boolean)
      const seen = new Set()
      setTvTitles(
        mapped.filter((t) => {
          if (seen.has(t.titleId)) return false
          seen.add(t.titleId)
          return true
        })
      )
      setTvLoading(false)
      setTvPage(3)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const loadMoreTv = async () => {
    if (tvLoading) return
    const nextPage = tvPage + 1
    setTvLoading(true)
    const chunk = await fetchPopularTv(nextPage)
    const mapped = chunk.map(mapTmdbTvToTitle).filter(Boolean)
    setTvTitles((prev) => {
      const seen = new Set(prev.map((t) => t.titleId))
      return [...prev, ...mapped.filter((t) => !seen.has(t.titleId))]
    })
    setTvPage(nextPage)
    setTvLoading(false)
  }

  const genres = useMemo(() => {
    const s = new Set()
    tvTitles.forEach((t) => t.genres?.forEach((g) => s.add(g)))
    return ['all', ...[...s].sort()]
  }, [tvTitles])

  const years = useMemo(
    () => yearSelectOptionsFromTitles(tvTitles),
    [tvTitles]
  )

  const ratings = ['all', 'G', 'PG', '14A', '18+']

  const filtered = useMemo(() => {
    let list = tvTitles.filter((t) => titleAllowedForProfile(activeProfile, t))
    if (genre !== 'all') list = list.filter((t) => t.genres?.includes(genre))
    if (year !== 'all') list = list.filter((t) => String(t.releaseYear) === year)
    if (rating !== 'all') list = list.filter((t) => t.maturityRating === rating)
    return list
  }, [tvTitles, activeProfile, genre, year, rating])

  return (
    <div className="page-movies">
      <header className="page-header">
        <h1>Browse TV shows</h1>
        <p className="muted">Explore shows by genre, year, and rating.</p>
      </header>
      <div className="filter-bar">
        <label>
          Genre
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
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
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
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
      {filtered.length === 0 && <p className="empty-state">No TV shows matched.</p>}
      <div className="catalog-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadMoreTv}
          disabled={tvLoading}
        >
          {tvLoading ? 'Loading more…' : 'Load more TV shows'}
        </button>
      </div>
    </div>
  )
}
