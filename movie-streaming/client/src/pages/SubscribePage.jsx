import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

const SUBSCRIBE_RESUME_KEY = 'streamlab_subscribe_resume'

export function SubscribePage() {
  const {
    subscriptionPlans,
    selectedPlanId,
    setSelectedPlanId,
    activateSubscription,
    signedIn,
  } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const selected = subscriptionPlans.find((p) => p.planId === selectedPlanId)

  useEffect(() => {
    if (!signedIn || subscriptionPlans.length === 0) return
    const raw = sessionStorage.getItem(SUBSCRIBE_RESUME_KEY)
    if (!raw) return
    try {
      const resume = JSON.parse(raw)
      if (
        resume.planId &&
        subscriptionPlans.some((p) => p.planId === resume.planId)
      ) {
        setSelectedPlanId(resume.planId)
      }
      if (resume.step === 2) setStep(2)
    } catch {
      /* ignore */
    } finally {
      sessionStorage.removeItem(SUBSCRIBE_RESUME_KEY)
    }
  }, [signedIn, subscriptionPlans, setSelectedPlanId])

  function goToPaymentStep() {
    if (!selected) return
    if (!signedIn) {
      sessionStorage.setItem(
        SUBSCRIBE_RESUME_KEY,
        JSON.stringify({ step: 2, planId: selected.planId })
      )
      navigate('/signin', { state: { from: { pathname: '/subscribe' } } })
      return
    }
    setStep(2)
  }

  async function completeCheckout() {
    if (!selected) return
    if (!signedIn) {
      setErr('Please sign in to complete checkout.')
      navigate('/signin', { state: { from: { pathname: '/subscribe' } } })
      return
    }
    setErr('')
    setBusy(true)
    try {
      await activateSubscription(selected.planId, 'PayPal')
      setStep(1)
    } catch (e) {
      setErr(
        e.message ||
          'Could not update subscription. Sign in and ensure the API is running.'
      )
    } finally {
      setBusy(false)
    }
  }

  const subscribeLocation = { pathname: '/subscribe' }

  return (
    <div className="subscribe-page">
      <header className="subscribe-header">
        <Link to="/" className="subscribe-home">
          Home
        </Link>
        <div className="subscribe-header__right">
          {!signedIn && (
            <nav className="subscribe-header__auth" aria-label="Account">
              <Link to="/signin" state={{ from: subscribeLocation }}>
                Sign in
              </Link>
              <Link to="/signup" state={{ from: subscribeLocation }}>
                Sign up
              </Link>
            </nav>
          )}
        </div>
      </header>
      {step === 1 && (
        <div className="subscribe-step">
          <h1>Choose your plan</h1>
          <p className="muted">
            Plans load from the API (<code>GET /api/plans</code>). Checkout uses{' '}
            <code>POST /api/subscriptions/me</code> and requires a signed-in
            account.
          </p>
          {!signedIn && (
            <p className="muted small">
              Pick a plan, then continue — you&apos;ll sign in (or create an
              account) before payment.
            </p>
          )}
          {subscriptionPlans.length === 0 && (
            <p className="muted">No plans returned — check API and seed.</p>
          )}
          <div className="plan-grid">
            {subscriptionPlans.map((p) => (
              <button
                key={p.planId}
                type="button"
                className={
                  p.planId === selectedPlanId ? 'plan-card selected' : 'plan-card'
                }
                onClick={() => setSelectedPlanId(p.planId)}
              >
                <div className="plan-card__head">{p.planName}</div>
                <ul>
                  <li>${p.monthlyPrice.toFixed(2)} / mo</li>
                  <li>{p.maxResolution} max</li>
                  <li>{p.maxStreams} stream(s)</li>
                </ul>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!selected}
            onClick={goToPaymentStep}
          >
            {signedIn ? 'Next' : 'Continue to sign in'}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="subscribe-step subscribe-pay">
          <div className="pay-card">
            <h2>Choose how to pay</h2>
            <p className="muted small">
              Prototype: choosing a method activates the selected plan on your
              account via the API.
            </p>
            {err && (
              <p className="auth-error" role="alert">
                {err}
              </p>
            )}
            <button
              type="button"
              className="pay-option"
              disabled={busy}
              onClick={completeCheckout}
            >
              Credit or debit card
              <span>Visa · Mastercard →</span>
            </button>
            <button
              type="button"
              className="pay-option"
              disabled={busy}
              onClick={completeCheckout}
            >
              Mobile money / digital wallet
              <span>PayPal · others →</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={busy}
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
