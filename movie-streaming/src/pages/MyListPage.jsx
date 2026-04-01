import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { MovieCard } from '../components/MovieCard'
import { titleAllowedForProfile } from '../utils/maturity'

export function MyListPage() {
  const {
    titles,
    activeProfile,
    myListTitleIds,
    toggleMyList,
    tmdbMyListTitles,
    toggleTmdbMyList,
  } = useApp()

  const myListTitles = titles.filter(
    (t) =>
      myListTitleIds.has(t.titleId) &&
      titleAllowedForProfile(activeProfile, t)
  )
  const tmdbMyListForProfile = tmdbMyListTitles.filter((t) =>
    titleAllowedForProfile(activeProfile, t)
  )
  const myListEmpty = myListTitles.length === 0 && tmdbMyListForProfile.length === 0

  return (
    <div className="page-my-list">
      <header className="page-header">
        <h1>My List</h1>
        <p className="muted">
          Saved titles for <strong>{activeProfile?.profileName}</strong>
        </p>
      </header>

      <section className="panel">
        <div className="movie-grid" role="list">
          {myListTitles.map((t) => (
            <div key={t.titleId} className="mylist-item">
              <MovieCard title={t} />
              <button
                type="button"
                className="btn-text"
                onClick={() => toggleMyList(t.titleId)}
              >
                Remove
              </button>
            </div>
          ))}
          {tmdbMyListForProfile.map((t) => (
            <div key={t.titleId} className="mylist-item">
              <MovieCard title={t} />
              <button
                type="button"
                className="btn-text"
                onClick={() => toggleTmdbMyList(t)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {myListEmpty && (
          <p className="empty-state">
            Nothing saved yet.{' '}
            <Link to="/movies">Browse the library</Link>
          </p>
        )}
      </section>
    </div>
  )
}
