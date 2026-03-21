import { NavLink, Outlet } from 'react-router-dom'

const sub = ({ isActive }) => ({
  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  padding: '0.35rem 0.75rem',
  borderRadius: 6,
  background: isActive ? 'rgba(229,9,20,0.35)' : 'transparent',
})

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <NavLink to="/" className="admin-back">
          ← Back to app
        </NavLink>
        <h1 className="admin-title">Content manager</h1>
        <nav className="admin-tabs" aria-label="Admin sections">
          <NavLink to="/admin" end style={sub}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/library" style={sub}>
            Library
          </NavLink>
          <NavLink to="/admin/users" style={sub}>
            Users
          </NavLink>
          <NavLink to="/admin/analytics" style={sub}>
            Analytics
          </NavLink>
        </nav>
      </header>
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  )
}
