import { useMemo, useState } from 'react'
import { useApp } from '../hooks/useApp'
import { MovieCard } from '../components/MovieCard'
import { titleAllowedForProfile } from '../utils/maturity'

export function SearchPage() {
  const { titles, activeProfile } = useApp()
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let list = titles.filter((t) => titleAllowedForProfile(activeProfile, t))
    if (!needle) return list
    return list.filter(
      (t) =>
        t.titleName.toLowerCase().includes(needle) ||
        t.description?.toLowerCase().includes(needle) ||
        t.genres?.some((g) => g.toLowerCase().includes(needle))
    )
  }, [titles, activeProfile, q])

  return (
    <div className="page-search">
      <header className="page-header">
        <h1>Search</h1>
        <input
          type="search"
          className="search-input"
          placeholder="Titles, genres, description…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </header>
      <div className="movie-grid" role="list">
        {results.map((t) => (
          <MovieCard key={t.titleId} title={t} />
        ))}
      </div>
    </div>
  )
}
