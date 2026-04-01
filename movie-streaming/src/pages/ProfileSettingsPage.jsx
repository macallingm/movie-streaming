import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

const DISPLAY_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fil', label: 'Filipino' },
  { value: 'fr', label: 'French' },
]

function formatDuration(sec) {
  if (sec == null || Number.isNaN(sec)) return '—'
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function ProfileSettingsPage() {
  const {
    activeProfile,
    patchProfile,
    watchProgress,
    getTitleById,
  } = useApp()

  const [langSaving, setLangSaving] = useState(false)
  const [langMessage, setLangMessage] = useState('')
  const [langError, setLangError] = useState('')

  const currentLang = activeProfile?.languagePref || 'en'

  const activityRows = useMemo(() => {
    if (!activeProfile?.profileId) return []
    return watchProgress
      .filter((w) => w.profileId === activeProfile.profileId)
      .map((w) => {
        const title = getTitleById(w.titleId)
        const name = title?.titleName || `Title ${w.titleId}`
        const ep =
          w.seasonNumber != null && w.episodeNumber != null
            ? `S${w.seasonNumber} · E${w.episodeNumber}`
            : null
        return {
          key: `${w.progressId || w.titleId}-${w.seasonNumber}-${w.episodeNumber}`,
          name,
          ep,
          progress: formatDuration(w.progressSeconds),
          completed: w.completed,
          updatedAt: w.updatedAt,
          watchTo: title
            ? `/watch/${encodeURIComponent(title.titleId)}${
                ep
                  ? `?season=${w.seasonNumber}&episode=${w.episodeNumber}`
                  : ''
              }`
            : null,
        }
      })
      .sort((a, b) => {
        const ta = new Date(a.updatedAt || 0).getTime()
        const tb = new Date(b.updatedAt || 0).getTime()
        return tb - ta
      })
  }, [watchProgress, activeProfile?.profileId, getTitleById])

  const handleLanguageChange = async (e) => {
    const value = e.target.value
    if (!activeProfile?.profileId || value === currentLang) return
    setLangSaving(true)
    setLangMessage('')
    setLangError('')
    try {
      await patchProfile(activeProfile.profileId, { languagePref: value })
      setLangMessage('Display language updated.')
    } catch (err) {
      setLangError(err.message || 'Could not update language')
    } finally {
      setLangSaving(false)
    }
  }

  return (
    <div className="profile-section profile-settings">
      <header className="page-header profile-section__header">
        <h1>Edit settings</h1>
        <p className="muted">
          Languages, viewing activity, and other preferences for{' '}
          <strong>{activeProfile?.profileName}</strong>.
        </p>
      </header>

      <section className="panel profile-settings__panel" id="languages">
        <h2>Display language</h2>
        <p className="muted small">
          Applies to this profile (menus and on-screen text where supported).
        </p>
        <div className="profile-settings__field-row">
          <label htmlFor="profile-lang" className="sr-only">
            Display language
          </label>
          <select
            id="profile-lang"
            className="profile-settings__select"
            value={currentLang}
            disabled={langSaving || !activeProfile}
            onChange={handleLanguageChange}
          >
            {DISPLAY_LANGUAGES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {langSaving && <span className="muted small">Saving…</span>}
        </div>
        {langMessage && <p className="api-banner api-banner--info">{langMessage}</p>}
        {langError && <p className="auth-error">{langError}</p>}
      </section>

      <section className="panel profile-settings__menu">
        <h2 className="profile-settings__menu-title">More (prototype)</h2>
        <ul className="profile-settings-menu-list">
          <li className="profile-settings-menu-row profile-settings-menu-row--static">
            <span className="profile-settings-menu-row__icon" aria-hidden>
              ◎
            </span>
            <span>
              <span className="profile-settings-menu-row__title">
                Playback &amp; quality
              </span>
              <span className="profile-settings-menu-row__sub muted small">
                Autoplay and quality follow your plan (coming soon).
              </span>
            </span>
          </li>
          <li className="profile-settings-menu-row profile-settings-menu-row--static">
            <span className="profile-settings-menu-row__icon" aria-hidden>
              ✉
            </span>
            <span>
              <span className="profile-settings-menu-row__title">
                Notifications
              </span>
              <span className="profile-settings-menu-row__sub muted small">
                Email and device alerts (coming soon).
              </span>
            </span>
          </li>
        </ul>
      </section>

      <section className="panel" id="activity">
        <h2>Viewing activity</h2>
        <p className="muted small">
          Progress for the active profile from Watch history (MongoDB).
        </p>
        {activityRows.length === 0 ? (
          <p className="empty-state muted">No viewing activity yet.</p>
        ) : (
          <ul className="viewing-activity-list">
            {activityRows.map((row) => (
              <li key={row.key} className="viewing-activity-row">
                <div>
                  <span className="viewing-activity-title">{row.name}</span>
                  {row.ep && (
                    <span className="muted small"> · {row.ep}</span>
                  )}
                  <div className="muted small">
                    Watched {row.progress}
                    {row.completed ? ' · Completed' : ''}
                  </div>
                </div>
                {row.watchTo && (
                  <Link className="btn-text" to={row.watchTo}>
                    Resume
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
