import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useUiStrings } from '../hooks/useUiStrings'
import { UI_LOCALES } from '../locales/ui'

const LANG_CODES = ['en', 'es', 'fil', 'fr']

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
  const { t } = useUiStrings()

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
      const bundle = UI_LOCALES[value] || UI_LOCALES.en
      setLangMessage(
        bundle.settings_langUpdated ?? UI_LOCALES.en.settings_langUpdated
      )
    } catch (err) {
      setLangError(err.message || 'Could not update language')
    } finally {
      setLangSaving(false)
    }
  }

  return (
    <div className="profile-section profile-settings">
      <header className="page-header profile-section__header">
        <h1>{t('settings_title')}</h1>
        <p className="muted">
          {t('settings_subtitle', { name: activeProfile?.profileName || '—' })}
        </p>
      </header>

      <section className="panel profile-settings__panel" id="languages">
        <h2>{t('settings_displayLanguage')}</h2>
        <p className="muted small">{t('settings_displayLanguageHelp')}</p>
        <div className="profile-settings__field-row">
          <label htmlFor="profile-lang" className="sr-only">
            {t('settings_langLabel')}
          </label>
          <select
            id="profile-lang"
            className="profile-settings__select"
            value={currentLang}
            disabled={langSaving || !activeProfile}
            onChange={handleLanguageChange}
          >
            {LANG_CODES.map((code) => (
              <option key={code} value={code}>
                {t(`lang_${code}`)}
              </option>
            ))}
          </select>
          {langSaving && <span className="muted small">{t('settings_saving')}</span>}
        </div>
        {langMessage && <p className="api-banner api-banner--info">{langMessage}</p>}
        {langError && <p className="auth-error">{langError}</p>}
      </section>

      <section className="panel profile-settings__menu">
        <h2 className="profile-settings__menu-title">{t('settings_moreProto')}</h2>
        <ul className="profile-settings-menu-list">
          <li className="profile-settings-menu-row profile-settings-menu-row--static">
            <span className="profile-settings-menu-row__icon" aria-hidden>
              ◎
            </span>
            <span>
              <span className="profile-settings-menu-row__title">
                {t('settings_playback')}
              </span>
              <span className="profile-settings-menu-row__sub muted small">
                {t('settings_playbackSub')}
              </span>
            </span>
          </li>
          <li className="profile-settings-menu-row profile-settings-menu-row--static">
            <span className="profile-settings-menu-row__icon" aria-hidden>
              ✉
            </span>
            <span>
              <span className="profile-settings-menu-row__title">
                {t('settings_notifications')}
              </span>
              <span className="profile-settings-menu-row__sub muted small">
                {t('settings_notificationsSub')}
              </span>
            </span>
          </li>
        </ul>
      </section>

      <section className="panel" id="activity">
        <h2>{t('settings_viewingActivity')}</h2>
        <p className="muted small">{t('settings_viewingActivityHelp')}</p>
        {activityRows.length === 0 ? (
          <p className="empty-state muted">{t('settings_noActivity')}</p>
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
                    {t('settings_watched')} {row.progress}
                    {row.completed ? ` · ${t('settings_completed')}` : ''}
                  </div>
                </div>
                {row.watchTo && (
                  <Link className="btn-text" to={row.watchTo}>
                    {t('settings_resume')}
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
