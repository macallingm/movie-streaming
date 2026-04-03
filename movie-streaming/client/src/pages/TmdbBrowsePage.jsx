import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  fetchMovieWithCredits,
  formatRuntimeMinutes,
  mapTmdbMovieDetailToTitle,
  posterUrl,
} from '../services/tmdb'
import { useApp } from '../hooks/useApp'
import { MyListCircleIcon } from '../components/MyListCircleIcon'

function pctVote(voteAverage) {
  if (voteAverage == null || Number.isNaN(voteAverage)) return null
  return Math.round(voteAverage * 10)
}

export function TmdbBrowsePage() {
  const {
    guardPlayNavigation,
    toggleTmdbMyList,
    isTmdbInMyList,
  } = useApp()
  const { tmdbId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setErr(null)
      setLoading(true)
      const d = await fetchMovieWithCredits(tmdbId)
      if (cancelled) return
      if (!d) {
        setErr('Could not load this title. Check your TMDb API key in .env.')
        setData(null)
      } else {
        setData(d)
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [tmdbId])

  const backdrop = data?.backdrop_path
    ? posterUrl(data.backdrop_path, 'w1280')
    : data?.poster_path
      ? posterUrl(data.poster_path, 'w1280')
      : null
  const poster = data?.poster_path ? posterUrl(data.poster_path, 'w500') : null

  const director = useMemo(() => {
    const crew = data?.credits?.crew
    if (!crew) return null
    return crew.find((c) => c.job === 'Director')?.name
  }, [data])

  const writers = useMemo(() => {
    const crew = data?.credits?.crew
    if (!crew) return []
    const names = crew
      .filter((c) =>
        ['Writer', 'Screenplay', 'Story'].includes(c.job)
      )
      .map((c) => c.name)
    return [...new Set(names)].slice(0, 3)
  }, [data])

  const cast = useMemo(() => {
    const c = data?.credits?.cast
    if (!Array.isArray(c)) return []
    return c.slice(0, 12)
  }, [data])

  const year = data?.release_date
    ? String(data.release_date).slice(0, 4)
    : ''
  const genres =
    data?.genres?.map((g) => g.name).filter(Boolean).join(' · ') || ''
  const runtime = formatRuntimeMinutes(data?.runtime)
  const score = pctVote(data?.vote_average)

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

  const watchTo = `/watch/${encodeURIComponent(`tmdb-${data.id}`)}`
  const listTitle = mapTmdbMovieDetailToTitle(data)
  const inList = listTitle ? isTmdbInMyList(listTitle.titleId) : false

  return (
    <div className="title-browse">
      <div
        className={
          backdrop
            ? 'title-browse__hero title-browse__hero--backdrop'
            : 'title-browse__hero'
        }
        style={
          backdrop
            ? { '--browse-backdrop': `url(${backdrop})` }
            : undefined
        }
      >
        <div className="title-browse__scrim" />
        <button
          type="button"
          className="title-browse__back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="title-browse__inner">
          <div className="title-browse__poster-wrap">
            {poster ? (
              <img
                src={poster}
                alt=""
                className="title-browse__poster"
              />
            ) : (
              <div className="title-browse__poster title-browse__poster--empty" />
            )}
          </div>
          <div className="title-browse__info">
            <h1 className="title-browse__name">
              {data.title}
              {year ? <span className="title-browse__year"> ({year})</span> : null}
            </h1>
            <div className="title-browse__meta">
              {score != null && (
                <span className="title-browse__score">{score}% match</span>
              )}
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
              {data.adult && <span className="title-browse__mature">18+</span>}
            </div>
            {genres && <p className="title-browse__genres">{genres}</p>}
            {data.tagline && (
              <p className="title-browse__tagline">{data.tagline}</p>
            )}
            <div className="title-browse__actions">
              <Link
                className="btn btn-primary title-browse__play"
                to={watchTo}
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
                  <MyListCircleIcon added={inList} />
                </button>
              )}
              <Link className="btn btn-secondary" to="/movies">
                More titles
              </Link>
            </div>
            {data.overview && (
              <p className="title-browse__overview">{data.overview}</p>
            )}
            {(director || writers.length > 0) && (
              <p className="title-browse__credits muted small">
                {director && <span>Director: {director}</span>}
                {director && writers.length > 0 && ' · '}
                {writers.length > 0 && (
                  <span>Writers: {writers.join(', ')}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <section className="title-browse__cast-block">
          <h2 className="title-browse__cast-heading">Cast</h2>
          <div className="title-browse__cast-row" role="list">
            {cast.map((person) => (
              <div key={person.id} className="title-browse__cast-card" role="listitem">
                <div
                  className="title-browse__cast-photo"
                  style={
                    person.profile_path
                      ? {
                          backgroundImage: `url(${posterUrl(person.profile_path, 'w185')})`,
                        }
                      : undefined
                  }
                />
                <div className="title-browse__cast-name">{person.name}</div>
                <div className="title-browse__cast-role muted small">
                  {person.character}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="title-browse__footnote muted small">
        Metadata from The Movie Database. Trailer playback is provided via
        YouTube where available.
      </p>
    </div>
  )
}
