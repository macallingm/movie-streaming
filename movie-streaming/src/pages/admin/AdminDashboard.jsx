import { Link } from 'react-router-dom'

export function AdminDashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p className="muted">
        Content manager home — quick links to library, users, and analytics.
      </p>
      <ul className="admin-links">
        <li>
          <Link to="/admin/library">Manage titles &amp; metadata</Link>
        </li>
        <li>
          <Link to="/admin/users">Subscribers &amp; suspension</Link>
        </li>
        <li>
          <Link to="/admin/analytics">Most-watched by genre</Link>
        </li>
      </ul>
    </div>
  )
}
