import { useEffect, useState } from 'react'
import { apiGet } from '../../services/api'

export function AdminUsers() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setErr('')
      try {
        const data = await apiGet('/api/admin/users')
        if (!cancelled) setRows(data || [])
      } catch (e) {
        if (!cancelled) {
          setErr(
            e.message ||
              'Could not load users (sign in as a content_manager account).'
          )
          setRows([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <p className="muted">
        Data from <code>GET /api/admin/users</code> (content managers only).
      </p>
      {err && (
        <p className="auth-error" role="alert">
          {err}
        </p>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Status</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
