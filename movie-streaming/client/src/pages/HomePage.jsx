import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../hooks/useApp'
import { HeroBanner } from '../components/HeroBanner'
import { ContentRow } from '../components/ContentRow'
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTrendingTv,
  fetchNowPlayingMovies,
  mapTmdbMovieToTitle,
  mapTmdbTvToTitle,
  posterUrl,
} from '../services/tmdb'
import { titleAllowedForProfile } from '../utils/maturity'

/** Max titles per horizontal row after maturity filter (TMDb ~20 per page). */
const HOME_ROW_MAX_ITEMS = 48

async function fetchTmdbPagesDeduped(fetchPage, pageCount) {
  const parts = await Promise.all(
    Array.from({ length: pageCount }, (_, i) => fetchPage(i + 1))
  )
  const merged = parts.flat()
  const seen = new Set()
  return merged.filter((item) => {
    const id = item?.id
    if (id == null || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function tmdbListForProfile(list, profile) {
  return list
    .map(mapTmdbMovieToTitle)
    .filter(Boolean)
    .filter((t) => titleAllowedForProfile(profile, t))
    .slice(0, HOME_ROW_MAX_ITEMS)
}

function tmdbTvListForProfile(list, profile) {
  return list
    .map(mapTmdbTvToTitle)
    .filter(Boolean)
    .filter((t) => titleAllowedForProfile(profile, t))
    .slice(0, HOME_ROW_MAX_ITEMS)
}

export function HomePage() {
  const { activeProfile, signedIn, watchProgress, getTitleById } = useApp()
  const [trendingMeta, setTrendingMeta] = useState(null)
  const [tmdbTrending, setTmdbTrending] = useState([])
  const [tmdbNowPlaying, setTmdbNowPlaying] = useState([])
  const [tmdbPopular, setTmdbPopular] = useState([])
  const [tmdbTrendingTv, setTmdbTrendingTv] = useState([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [trending, nowPlaying, popular, trendingTv] = await Promise.all([
        fetchTmdbPagesDeduped(fetchTrendingMovies, 3),
        fetchTmdbPagesDeduped(fetchNowPlayingMovies, 3),
        fetchTmdbPagesDeduped(fetchPopularMovies, 3),
        fetchTmdbPagesDeduped(fetchTrendingTv, 3),
      ])
      if (cancelled) return
      if (trending[0]) setTrendingMeta(trending[0])
      setTmdbTrending(trending)
      setTmdbNowPlaying(nowPlaying)
      setTmdbPopular(popular)
      setTmdbTrendingTv(trendingTv)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const featured = useMemo(
    () => mapTmdbMovieToTitle(trendingMeta),
    [trendingMeta]
  )
  const heroBackdrop = trendingMeta
    ? posterUrl(trendingMeta.backdrop_path, 'w1280')
    : null
  const heroPoster = trendingMeta
    ? posterUrl(trendingMeta.poster_path)
    : featured?.moviePosterUrl

  const trendingRow = useMemo(() => {
    return tmdbListForProfile(tmdbTrending, activeProfile)
  }, [tmdbTrending, activeProfile])

  const newThisWeek = useMemo(() => {
    return tmdbListForProfile(tmdbNowPlaying, activeProfile)
  }, [tmdbNowPlaying, activeProfile])

  const popularPicks = useMemo(() => {
    return tmdbListForProfile(tmdbPopular, activeProfile)
  }, [tmdbPopular, activeProfile])
  const trendingShows = useMemo(
    () => tmdbTvListForProfile(tmdbTrendingTv, activeProfile),
    [tmdbTrendingTv, activeProfile]
  )

  const continueWatching = useMemo(() => {
    if (!signedIn || !activeProfile?.profileId) return []
    const pid = String(activeProfile.profileId)
    const rows = [...watchProgress]
      .filter(
        (w) =>
          String(w.profileId) === pid &&
          !w.completed &&
          (w.progressSeconds || 0) > 15
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      )
    const byTitle = new Map()
    for (const row of rows) {
      const tid = String(row.titleId)
      if (!byTitle.has(tid)) byTitle.set(tid, row)
    }
    const out = []
    for (const row of byTitle.values()) {
      const t = getTitleById(row.titleId)
      if (!t) continue
      const q =
        t.type === 'Show' &&
        row.seasonNumber != null &&
        row.episodeNumber != null
          ? `?season=${row.seasonNumber}&episode=${row.episodeNumber}`
          : ''
      out.push({ ...t, _resumeQuery: q })
      if (out.length >= 18) break
    }
    return out
  }, [signedIn, activeProfile, watchProgress, getTitleById])

  const continueLabel = activeProfile?.profileName
    ? `Continue Watching for ${activeProfile.profileName}`
    : 'Continue Watching'

  return (
    <div className="page-home">
      <HeroBanner
        title={featured}
        backdropUrl={heroBackdrop}
        posterUrl={heroPoster}
      />
      {continueWatching.length > 0 && (
        <ContentRow label={continueLabel} titles={continueWatching} />
      )}
      <ContentRow label="Trending now" titles={trendingRow} />
      <ContentRow label="New this week" titles={newThisWeek} />
      <ContentRow label="Trending TV shows" titles={trendingShows} />
      <ContentRow
        label="Popular picks"
        titles={popularPicks}
        emptyHint="Add VITE_TMDB_API_KEY to .env to load TMDb titles."
      />
    </div>
  )
}
