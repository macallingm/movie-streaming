import { users, subscriptions } from '../../data/mockData'

export function AdminUsers() {
  const rows = users.map((u) => {
    const sub = subscriptions.find((s) => s.userId === u.userId)
    return { ...u, sub }
  })

  return (
    <div>
      <h2>Users</h2>
      <p className="muted">
        View subscribers and status — suspend accounts in the full product.
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Status</th>
            <th>Subscription</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.status}</td>
              <td>{u.sub ? `${u.sub.status} (${u.sub.planId})` : '—'}</td>
              <td>
                <button type="button" className="btn-text" disabled>
                  Suspend (mock)
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
