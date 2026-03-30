import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function SubscribePage() {
  const {
    subscriptionPlans,
    selectedPlanId,
    setSelectedPlanId,
    activateSubscription,
  } = useApp()
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const selected = subscriptionPlans.find((p) => p.planId === selectedPlanId)

  async function completeCheckout() {
    if (!selected) return
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

  return (
    <div className="subscribe-page">
      <header className="subscribe-header">
        <Link to="/" className="subscribe-signout">
          Home
        </Link>
      </header>
      {step === 1 && (
        <div className="subscribe-step">
          <h1>Choose your plan</h1>
          <p className="muted">
            Plans load from the API (<code>GET /api/plans</code>). Completing
            checkout calls <code>POST /api/subscriptions/me</code> (requires
            sign-in).
          </p>
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
            onClick={() => setStep(2)}
          >
            Next
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
