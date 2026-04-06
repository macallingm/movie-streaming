import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import {
  latestProgressForTitle,
  progressBarPercent,
} from '../utils/watchProgressDisplay'

export function MovieCard({ title }) {
  const { guardPlayNavigation, watchProgress, activeProfileId, getTitleById } =
    useApp()
  const poster = title.moviePosterUrl

  const progressRow = useMemo(
    () =>
      latestProgressForTitle(
        watchProgress,
        activeProfileId,
        title?.titleId
      ),
    [watchProgress, activeProfileId, title?.titleId]
  )

  const fullTitle = useMemo(
    () => getTitleById(title.titleId) || title,
    [getTitleById, title]
  )

  const progressPct = useMemo(
    () => progressBarPercent(progressRow, fullTitle),
    [progressRow, fullTitle]
  )

  const inner = (
    <>
      <div className="movie-card__poster-wrap">
        <div
          className="movie-card__poster"
          style={
            poster ? { backgroundImage: `url(${poster})` } : undefined
          }
        />
        {progressPct > 0 && (
          <div className="movie-card__progress" aria-hidden>
            <div
              className="movie-card__progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
      <div className="movie-card__meta">
        <span className="movie-card__name">{title.titleName}</span>
        <span className="movie-card__year">{title.releaseYear}</span>
      </div>
    </>
  )

  if (title.tmdbId) {
    const to =
      title.tmdbType === 'tv'
        ? `/browse/tv/${title.tmdbId}`
        : `/browse/movie/${title.tmdbId}`
    return (
      <article className="movie-card" role="listitem">
        <Link to={to} className="movie-card__link">
          {inner}
        </Link>
      </article>
    )
  }

  const resume = title._resumeQuery || ''
  return (
    <article className="movie-card" role="listitem">
      <Link
        to={`/watch/${encodeURIComponent(title.titleId)}${resume}`}
        className="movie-card__link"
        onClick={guardPlayNavigation}
      >
        {inner}
      </Link>
    </article>
  )
}
