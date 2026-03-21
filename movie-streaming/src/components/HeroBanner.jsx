import { Link } from 'react-router-dom'

export function HeroBanner({ title, backdropUrl, posterUrl }) {
  const bg = backdropUrl || posterUrl
  return (
    <section
      className="hero-banner"
      style={
        bg
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(8,10,12,0.97) 0%, rgba(8,10,12,0.75) 42%, rgba(8,10,12,0.2) 100%), url(${bg})`,
            }
          : undefined
      }
    >
      <div className="hero-banner__inner">
        <p className="hero-eyebrow">
          {title?.type === 'Show' ? 'Series' : 'Movie'}
        </p>
        <h2 className="hero-title">{title?.titleName ?? 'Featured'}</h2>
        <p className="hero-desc">{title?.description}</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to={`/watch/${title?.titleId}`}>
            Play
          </Link>
          <button type="button" className="btn btn-secondary">
            Watch trailer
          </button>
        </div>
      </div>
    </section>
  )
}
