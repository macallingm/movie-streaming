import { Link } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { invoices } from '../data/mockData'

export function BillingPage() {
  const { user, subscription, currentPlan } = useApp()
  const mine = invoices.filter((i) => i.userId === user.userId)

  return (
    <div className="page-billing">
      <header className="page-header">
        <h1>Billing</h1>
        <p className="muted">Subscription tiers and invoices (mock data).</p>
      </header>

      <section className="panel billing-plan">
        <h2>Current plan</h2>
        {subscription && currentPlan ? (
          <>
            <p className="plan-name">{currentPlan.planName}</p>
            <ul className="plan-facts">
              <li>${currentPlan.monthlyPrice.toFixed(2)} / month</li>
              <li>Max streams: {currentPlan.maxStreams}</li>
              <li>Max resolution: {currentPlan.maxResolution}</li>
              <li>Status: {subscription.status}</li>
              <li>Next billing: {subscription.nextBillingDate}</li>
              <li>Payment: {subscription.paymentProvider}</li>
            </ul>
          </>
        ) : (
          <p>No active subscription on file.</p>
        )}
        <Link className="btn btn-primary" to="/subscribe">
          Change plan
        </Link>
      </section>

      <section className="panel">
        <h2>Invoices</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.date}</td>
                <td>${inv.amount.toFixed(2)}</td>
                <td>{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
