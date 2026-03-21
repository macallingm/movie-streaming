import { Link } from 'react-router-dom'

export function MovieCard({ title }) {
  const poster = title.moviePosterUrl
  return (
    <article className="movie-card" role="listitem">
      <Link to={`/watch/${title.titleId}`} className="movie-card__link">
        <div
          className="movie-card__poster"
          style={
            poster
              ? { backgroundImage: `url(${poster})` }
              : undefined
          }
        />
        <div className="movie-card__meta">
          <span className="movie-card__name">{title.titleName}</span>
          <span className="movie-card__year">{title.releaseYear}</span>
        </div>
      </Link>
    </article>
  )
}
