import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../hooks/useApp'
import { HeroBanner } from '../components/HeroBanner'
import { ContentRow } from '../components/ContentRow'
import { fetchTrendingMovies, posterUrl } from '../services/tmdb'
import { titleAllowedForProfile } from '../utils/maturity'

export function HomePage() {
  const { titles, activeProfile } = useApp()
  const [trendingMeta, setTrendingMeta] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const list = await fetchTrendingMovies()
      if (!cancelled && list[0]) setTrendingMeta(list[0])
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const visible = useMemo(
    () => titles.filter((t) => titleAllowedForProfile(activeProfile, t)),
    [titles, activeProfile]
  )

  const featured = visible[0] ?? titles[0]
  const heroBackdrop = trendingMeta
    ? posterUrl(trendingMeta.backdrop_path, 'w1280')
    : null
  const heroPoster = trendingMeta
    ? posterUrl(trendingMeta.poster_path)
    : featured?.moviePosterUrl

  const heroTitle = featured
    ? {
        ...featured,
        titleName: trendingMeta?.title ?? featured.titleName,
        description: trendingMeta?.overview ?? featured.description,
      }
    : null

  const trendingRow = visible.slice(0, 8)
  const newThisWeek = visible.filter((t) => t.releaseYear >= 2024).slice(0, 8)
  const continueWatching = visible.slice(0, 5)

  return (
    <div className="page-home">
      <HeroBanner
        title={heroTitle}
        backdropUrl={heroBackdrop}
        posterUrl={heroPoster}
      />
      <ContentRow label="Trending now" titles={trendingRow} />
      <ContentRow
        label="New this week"
        titles={newThisWeek.length ? newThisWeek : visible}
      />
      <ContentRow label="Continue watching" titles={continueWatching} />
    </div>
  )
}
