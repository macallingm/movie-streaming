import { useState } from 'react'
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
    requestDeviceSignInCode,
  } = useApp()

  const [tvCode, setTvCode] = useState(null)
  const [tvCodeErr, setTvCodeErr] = useState('')

  const handleGenerateTvCode = async () => {
    setTvCodeErr('')
    try {
      const data = await requestDeviceSignInCode()
      setTvCode(data?.code ?? null)
    } catch (e) {
      setTvCodeErr(e.message || 'Could not create code')
      setTvCode(null)
    }
  }

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
        <h2>TV &amp; other devices</h2>
        <p className="muted">
          Sign in on another browser without typing your password: generate a
          code here, then on the other device open Sign in → Use a sign-in code.
        </p>
        {tvCodeErr && <p className="auth-error">{tvCodeErr}</p>}
        {tvCode && (
          <p className="tv-code-display" aria-live="polite">
            Your code: <strong>{tvCode}</strong> (expires in about 10 minutes)
          </p>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleGenerateTvCode}
        >
          Generate sign-in code
        </button>
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
