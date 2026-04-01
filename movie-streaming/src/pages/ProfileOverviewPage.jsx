import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

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
          Signed in as
        </p>
        <p className="profile-overview__email">{user?.email}</p>
        <p className="muted">
          Account status: <strong>{user?.status}</strong>
        </p>
      </section>

      <section className="panel">
        <h2>Profiles</h2>
        <p className="muted">
          Switch who is watching (maturity and language follow each profile).
        </p>
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
        <h2>Membership</h2>
        {subscription && currentPlan ? (
          <>
            <p className="plan-name">{currentPlan.planName}</p>
            <p className="muted">
              Next billing: {subscription.nextBillingDate || '—'} · Status:{' '}
              {subscription.status}
            </p>
          </>
        ) : (
          <p className="muted">No active subscription on file.</p>
        )}
        <Link className="profile-quick-link profile-quick-link--inline" to="/profile/billing">
          Manage membership
          <span className="profile-quick-link__chevron" aria-hidden>
            ›
          </span>
        </Link>
      </section>

      <section className="panel">
        <h2>Quick links</h2>
        <ul className="profile-quick-links">
          <li>
            <Link className="profile-quick-link" to="/subscribe">
              <span className="profile-quick-link__label">Change plan</span>
              <span className="profile-quick-link__chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link className="profile-quick-link" to="/profile/billing">
              <span className="profile-quick-link__label">
                Billing &amp; invoices
              </span>
              <span className="profile-quick-link__chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
          <li>
            <Link className="profile-quick-link" to="/profile/settings">
              <span>
                <span className="profile-quick-link__label">Edit settings</span>
                <span className="profile-quick-link__sub muted small">
                  Languages, viewing activity, and more
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
                <span className="profile-quick-link__label">Update password</span>
                <span className="profile-quick-link__sub muted small">
                  Change your sign-in password
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
    </div>
  )
}
