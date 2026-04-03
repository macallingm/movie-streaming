import { BillingPanel } from '../components/BillingPanel'

export function ProfileBillingPage() {
  return (
    <div className="profile-section">
      <header className="page-header profile-section__header">
        <h1>Membership &amp; billing</h1>
        <p className="muted">
          Subscription and payment history from your account (API / MongoDB).
        </p>
      </header>
      <BillingPanel />
    </div>
  )
}
