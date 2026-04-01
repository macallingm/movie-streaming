import { NavLink, Outlet } from 'react-router-dom'

const subNavLink = ({ isActive }) => ({
  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  display: 'block',
  padding: '0.55rem 0.85rem',
  borderRadius: 8,
  fontSize: '0.95rem',
  background: isActive ? 'rgba(229,9,20,0.2)' : 'transparent',
  borderLeft: isActive ? '3px solid #e50914' : '3px solid transparent',
  marginLeft: '-3px',
})

export function ProfileLayout() {
  return (
    <div className="profile-account">
      <header className="profile-account__intro page-header">
        <h1>Account</h1>
        <p className="muted">
          Manage membership, profiles, and preferences (StreamLab prototype).
        </p>
      </header>
      <div className="profile-account__grid">
        <nav className="profile-account__subnav" aria-label="Account sections">
          <NavLink to="/profile" end style={subNavLink}>
            Overview
          </NavLink>
          <NavLink to="/profile/billing" style={subNavLink}>
            Membership &amp; billing
          </NavLink>
          <NavLink to="/profile/settings" style={subNavLink}>
            Edit settings
          </NavLink>
          <NavLink to="/profile/password" style={subNavLink}>
            Update password
          </NavLink>
        </nav>
        <div className="profile-account__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
