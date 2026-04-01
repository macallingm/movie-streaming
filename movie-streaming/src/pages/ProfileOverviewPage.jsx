import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useUiStrings } from '../hooks/useUiStrings'

export function ProfileOverviewPage() {
  const {
    user,
    activeProfile,
    setActiveProfileId,
    userProfiles,
    subscription,
    currentPlan,
    requestDeviceSignInCode,
  } = useApp()
  const { t } = useUiStrings()

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

  return (
    <div className="profile-overview">
      <section className="panel profile-overview__identity">
        <p className="muted small" style={{ margin: '0 0 0.35rem' }}>
          {t('overview_signedInAs')}
        </p>
        <p className="profile-overview__email">{user?.email}</p>
        <p className="muted">
          {t('overview_accountStatus')} <strong>{user?.status}</strong>
        </p>
      </section>

      <section className="panel">
        <h2>{t('overview_profiles')}</h2>
        <p className="muted">{t('overview_profilesHelp')}</p>
        <div className="profile-pills">
          {userProfiles.map((p) => (
            <button
              key={p.profileId}
              type="button"
              className={
                p.profileId === activeProfile?.profileId ? 'pill active' : 'pill'
              }
              onClick={() => setActiveProfileId(p.profileId)}
            >
              {p.profileName} · {p.maturityLevel}
            </button>
          ))}
        </div>
      </section>

      <section className="panel profile-membership-card">
        <h2>{t('overview_membership')}</h2>
        {subscription && currentPlan ? (
          <>
            <p className="plan-name">{currentPlan.planName}</p>
            <p className="muted">
              {t('overview_nextBilling')} {subscription.nextBillingDate || '—'} ·{' '}
              {t('overview_status')} {subscription.status}
            </p>
          </>
        ) : (
          <p className="muted">{t('overview_noSub')}</p>
        )}
        <Link className="profile-quick-link profile-quick-link--inline" to="/profile/billing">
          {t('overview_manageMembership')}
          <span className="profile-quick-link__chevron" aria-hidden>
            ›
          </span>
        </Link>
      </section>

      <section className="panel">
        <h2>{t('overview_quickLinks')}</h2>
        <ul className="profile-quick-links">
          <li>
            <Link className="profile-quick-link" to="/subscribe">
              <span className="profile-quick-link__label">
                {t('overview_changePlan')}
              </span>
              <span className="profile-quick-link__chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link className="profile-quick-link" to="/profile/billing">
              <span className="profile-quick-link__label">
                {t('overview_billingInvoices')}
              </span>
              <span className="profile-quick-link__chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link className="profile-quick-link" to="/profile/settings">
              <span>
                <span className="profile-quick-link__label">
                  {t('overview_editSettings')}
                </span>
                <span className="profile-quick-link__sub muted small">
                  {t('overview_editSettingsSub')}
                </span>
              </span>
              <span className="profile-quick-link__chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link className="profile-quick-link" to="/profile/password">
              <span>
                <span className="profile-quick-link__label">
                  {t('overview_updatePassword')}
                </span>
                <span className="profile-quick-link__sub muted small">
                  {t('overview_updatePasswordSub')}
                </span>
              </span>
              <span className="profile-quick-link__chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="panel">
        <h2>{t('overview_tvDevices')}</h2>
        <p className="muted">{t('overview_tvDevicesHelp')}</p>
        {tvCodeErr && <p className="auth-error">{tvCodeErr}</p>}
        {tvCode && (
          <p className="tv-code-display" aria-live="polite">
            {t('overview_yourCode')} <strong>{tvCode}</strong>{' '}
            {t('overview_expires')}
          </p>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleGenerateTvCode}
        >
          {t('overview_generateCode')}
        </button>
      </section>
    </div>
  )
}
