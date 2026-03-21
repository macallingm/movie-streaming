import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function SubscribePage() {
  const { subscriptionPlans, selectedPlanId, setSelectedPlanId } = useApp()
  const [step, setStep] = useState(1)

  const selected = subscriptionPlans.find((p) => p.planId === selectedPlanId)

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
            Maps to <code>SubscriptionPlan</code> — one active subscription per
            user in the full system.
          </p>
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
              Your payment is encrypted in production. This screen maps to{' '}
              <code>Subscription</code> + payment provider (e.g. PayPal).
            </p>
            <button type="button" className="pay-option">
              Credit or debit card
              <span>Visa · Mastercard →</span>
            </button>
            <button type="button" className="pay-option">
              Mobile money / digital wallet
              <span>PayPal · others →</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setStep(1)}
            >
              Done (prototype)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
