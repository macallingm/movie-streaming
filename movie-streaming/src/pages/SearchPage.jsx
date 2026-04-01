import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MovieCard } from '../components/MovieCard'
import {
  fetchPopularMovies,
  fetchPopularTv,
  mapTmdbMovieToTitle,
  mapTmdbTvToTitle,
  searchTmdbMovies,
  searchTmdbTv,
} from '../services/tmdb'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [tmdbResults, setTmdbResults] = useState([])
  const [searching, setSearching] = useState(true)

  useEffect(() => {
    let cancelled = false
    const needle = q.trim()
    ;(async () => {
      if (!needle) {
        const [movieChunks, tvChunks] = await Promise.all([
          Promise.all([fetchPopularMovies(1), fetchPopularMovies(2)]),
          Promise.all([fetchPopularTv(1), fetchPopularTv(2)]),
        ])
        if (cancelled) return
        const seen = new Set()
        setTmdbResults(
          [...movieChunks.flat().map(mapTmdbMovieToTitle), ...tvChunks.flat().map(mapTmdbTvToTitle)]
            .filter(Boolean)
            .filter((t) => {
              if (seen.has(t.titleId)) return false
              seen.add(t.titleId)
              return true
            })
        )
        setSearching(false)
        return
      }
      const [movieChunks, tvChunks] = await Promise.all([
        Promise.all([searchTmdbMovies(needle, 1), searchTmdbMovies(needle, 2)]),
        Promise.all([searchTmdbTv(needle, 1), searchTmdbTv(needle, 2)]),
      ])
      if (cancelled) return
      const seen = new Set()
      setTmdbResults(
        [...movieChunks.flat().map(mapTmdbMovieToTitle), ...tvChunks.flat().map(mapTmdbTvToTitle)]
          .filter(Boolean)
          .filter((t) => {
            if (seen.has(t.titleId)) return false
            seen.add(t.titleId)
            return true
          })
      )
      setSearching(false)
    })()
    return () => {
      cancelled = true
    }
  }, [q])

  const results = useMemo(() => {
    return tmdbResults
  }, [tmdbResults])

  const setQueryInUrl = (next) => {
    const trimmed = next.trim()
    if (trimmed) {
      setSearchParams({ q: next }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <div className="page-search">
      <header className="page-header">
        <h1>Search</h1>
        <input
          type="search"
          className="search-input"
          placeholder="Search movies and TV shows…"
          value={q}
          onChange={(e) => {
            setSearching(true)
            setQueryInUrl(e.target.value)
          }}
          autoFocus
        />
      </header>
      <div className="movie-grid" role="list">
        {results.map((t) => (
          <MovieCard key={t.titleId} title={t} />
        ))}
      </div>
      {searching && <p className="muted small">Loading results…</p>}
      {!searching && results.length === 0 && (
        <p className="empty-state">No titles matched your search.</p>
      )}
    </div>
  )
}
