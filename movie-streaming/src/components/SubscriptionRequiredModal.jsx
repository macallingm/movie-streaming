import { Link } from 'react-router-dom'

export function SubscriptionRequiredModal({ open, onClose }) {
  if (!open) return null
  return (
    <div
      className="auth-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="auth-modal"
        role="dialog"
        aria-labelledby="sub-gate-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sub-gate-title">Active subscription required</h2>
        <p className="muted small">
          You don&apos;t have an active subscription on file. Choose a plan to
          play movies and shows.
        </p>
        <div className="subscription-gate-actions">
          <Link
            to="/profile/billing"
            className="btn btn-primary btn-block"
            onClick={onClose}
          >
            View billing &amp; plans
          </Link>
          <Link
            to="/subscribe"
            className="btn btn-secondary btn-block"
            onClick={onClose}
          >
            Start a subscription
          </Link>
          <button type="button" className="btn btn-secondary btn-block" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
