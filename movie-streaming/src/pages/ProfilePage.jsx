import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { MovieCard } from '../components/MovieCard'
import { titleAllowedForProfile } from '../utils/maturity'

export function ProfilePage() {
  const {
    user,
    activeProfile,
    setActiveProfileId,
    userProfiles,
    titles,
    myListTitleIds,
    toggleMyList,
  } = useApp()

  const myListTitles = titles.filter(
    (t) =>
      myListTitleIds.has(t.titleId) &&
      titleAllowedForProfile(activeProfile, t)
  )

  return (
    <div className="page-profile">
      <header className="page-header">
        <h1>Profile &amp; My List</h1>
        <p className="muted">
          {user.email} · Account status:{' '}
          <strong>{user.status}</strong>
        </p>
      </header>

      <section className="panel">
        <h2>Profiles</h2>
        <p className="muted">
          Switch maturity and language preferences (prototype).
        </p>
        <div className="profile-pills">
          {userProfiles.map((p) => (
            <button
              key={p.profileId}
              type="button"
              className={
                p.profileId === activeProfile.profileId ? 'pill active' : 'pill'
              }
              onClick={() => setActiveProfileId(p.profileId)}
            >
              {p.profileName} · {p.maturityLevel}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>My List</h2>
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
        </div>
        {myListTitles.length === 0 && (
          <p className="empty-state">
            Nothing saved yet.{' '}
            <Link to="/movies">Browse the library</Link>
          </p>
        )}
      </section>

      <section className="panel">
        <h2>Account settings</h2>
        <ul className="settings-list">
          <li>Language: {activeProfile.languagePref?.toUpperCase()}</li>
          <li>Playback: prototype — quality follows your plan</li>
          <li>
            <Link to="/billing">Manage subscription &amp; billing</Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
