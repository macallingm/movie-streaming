import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function MovieCard({ title }) {
  const { guardPlayNavigation } = useApp()
  const poster = title.moviePosterUrl
  const inner = (
    <>
      <div
        className="movie-card__poster"
        style={
          poster ? { backgroundImage: `url(${poster})` } : undefined
        }
      />
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
