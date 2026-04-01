import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  fetchTvSeason,
  fetchTvWithCredits,
  formatRuntimeMinutes,
  mapTmdbTvDetailToTitle,
  posterUrl,
} from '../services/tmdb'
import { useApp } from '../hooks/useApp'

function pctVote(voteAverage) {
  if (voteAverage == null || Number.isNaN(voteAverage)) return null
  return Math.round(voteAverage * 10)
}

export function TmdbTvBrowsePage() {
  const {
    guardPlayNavigation,
    toggleTmdbMyList,
    isTmdbInMyList,
  } = useApp()
  const { tmdbId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [seasonData, setSeasonData] = useState(null)
  const [seasonNum, setSeasonNum] = useState(1)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setErr(null)
      setLoading(true)
      const d = await fetchTvWithCredits(tmdbId)
      if (cancelled) return
      if (!d) {
        setErr('Could not load this show. Check your TMDb API key in .env.')
        setData(null)
        setLoading(false)
        return
      }
      const firstSeason = d.seasons?.find((s) => s.season_number > 0)?.season_number || 1
      const season = await fetchTvSeason(tmdbId, firstSeason)
      if (cancelled) return
      setData(d)
      setSeasonNum(firstSeason)
      setSeasonData(season)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [tmdbId])

  const loadSeason = async (n) => {
    if (!tmdbId) return
    setSeasonNum(n)
    const season = await fetchTvSeason(tmdbId, n)
    setSeasonData(season)
  }

  const backdrop = data?.backdrop_path
    ? posterUrl(data.backdrop_path, 'w1280')
    : data?.poster_path
      ? posterUrl(data.poster_path, 'w1280')
      : null
  const poster = data?.poster_path ? posterUrl(data.poster_path, 'w500') : null
  const year = data?.first_air_date ? String(data.first_air_date).slice(0, 4) : ''
  const genres = data?.genres?.map((g) => g.name).filter(Boolean).join(' · ') || ''
  const score = pctVote(data?.vote_average)
  const creators = useMemo(() => {
    const c = Array.isArray(data?.created_by) ? data.created_by : []
    return c.map((row) => row.name).filter(Boolean).slice(0, 3)
  }, [data])

  if (loading) {
    return (
      <div className="title-browse title-browse--loading">
        <p className="muted">Loading…</p>
      </div>
    )
  }
  if (err || !data) {
    return (
      <div className="title-browse title-browse--empty">
        <p>{err || 'Not found.'}</p>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  const trailerTo = `/watch/${encodeURIComponent(`tmdb-tv-${data.id}`)}?mode=trailer`
  const listTitle = mapTmdbTvDetailToTitle(data)
  const inList = listTitle ? isTmdbInMyList(listTitle.titleId) : false

  return (
    <div className="title-browse">
      <div
        className={
          backdrop
            ? 'title-browse__hero title-browse__hero--backdrop'
            : 'title-browse__hero'
        }
        style={backdrop ? { '--browse-backdrop': `url(${backdrop})` } : undefined}
      >
        <div className="title-browse__scrim" />
        <button type="button" className="title-browse__back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="title-browse__inner">
          <div className="title-browse__poster-wrap">
            {poster ? (
              <img src={poster} alt="" className="title-browse__poster" />
            ) : (
              <div className="title-browse__poster title-browse__poster--empty" />
            )}
          </div>
          <div className="title-browse__info">
            <h1 className="title-browse__name">
              {data.name}
              {year ? <span className="title-browse__year"> ({year})</span> : null}
            </h1>
            <div className="title-browse__meta">
              {score != null && <span className="title-browse__score">{score}% match</span>}
              {year && <span>{year}</span>}
              {data.number_of_seasons ? <span>{data.number_of_seasons} seasons</span> : null}
              {data.adult && <span className="title-browse__mature">18+</span>}
            </div>
            {genres && <p className="title-browse__genres">{genres}</p>}
            <div className="title-browse__actions">
              <Link
                className="btn btn-primary title-browse__play"
                to={trailerTo}
                onClick={guardPlayNavigation}
              >
                ▶ Play
              </Link>
              {listTitle && (
                <button
                  type="button"
                  className={`btn btn-icon-mylist${inList ? ' btn-icon-mylist--on' : ''}`}
                  onClick={() => toggleTmdbMyList(listTitle)}
                  aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                  title={inList ? 'Remove from My List' : 'Add to My List'}
                >
                  {inList ? '✓' : '+'}
                </button>
              )}
              <Link className="btn btn-secondary" to="/tv">
                More shows
              </Link>
            </div>
            {data.overview && <p className="title-browse__overview">{data.overview}</p>}
            {creators.length > 0 && (
              <p className="title-browse__credits muted small">Created by: {creators.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="filter-bar">
          <label>
            Season
            <select
              value={seasonNum}
              onChange={(e) => loadSeason(Number(e.target.value))}
            >
              {(data.seasons || [])
                .filter((s) => s.season_number > 0)
                .map((s) => (
                  <option key={s.id || s.season_number} value={s.season_number}>
                    Season {s.season_number}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div className="tv-episodes">
          {(seasonData?.episodes || []).map((ep) => {
            const playEpTo = `/watch/${encodeURIComponent(`tmdb-tv-${data.id}`)}?season=${seasonNum}&episode=${ep.episode_number || 1}`
            return (
              <Link
                key={ep.id || ep.episode_number}
                className="tv-episode"
                to={playEpTo}
                onClick={guardPlayNavigation}
              >
                <span className="tv-episode__index">{ep.episode_number}.</span>
                <span className="tv-episode__name">
                  {ep.name || `Episode ${ep.episode_number}`}
                </span>
                <span className="tv-episode__runtime">
                  {formatRuntimeMinutes(ep.runtime) || `${ep.runtime || 45}m`}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
