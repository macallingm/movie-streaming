import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

const linkStyle = ({ isActive }) => ({
  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.5rem 0.75rem',
  borderRadius: 8,
  fontSize: '0.95rem',
  background: isActive ? 'rgba(229,9,20,0.25)' : 'transparent',
  borderLeft: isActive ? '3px solid #e50914' : '3px solid transparent',
})

export function SidebarNav() {
  const { signOut, user } = useApp()
  const navigate = useNavigate()
  const showAdmin = user?.role === 'content_manager'

  return (
    <nav className="sidebar-nav" aria-label="Main">
      <div className="sidebar-brand">StreamLab</div>
      <NavLink to="/search" style={linkStyle} title="Search">
        <i className="bi bi-search sidebar-nav__icon" aria-hidden />
        Search
      </NavLink>
      <NavLink to="/" end style={linkStyle}>
        <i className="bi bi-house sidebar-nav__icon" aria-hidden />
        Home
      </NavLink>
      <NavLink to="/movies" style={linkStyle}>
        <i className="bi bi-film sidebar-nav__icon" aria-hidden />
        Movies
      </NavLink>
      <NavLink to="/tv" style={linkStyle}>
        <i className="bi bi-tv sidebar-nav__icon" aria-hidden />
        TV Shows
      </NavLink>
      <NavLink to="/my-list" style={linkStyle}>
        <i className="bi bi-plus-lg sidebar-nav__icon" aria-hidden />
        My List
      </NavLink>
      <NavLink to="/profile" style={linkStyle}>
        <i className="bi bi-person-fill sidebar-nav__icon" aria-hidden />
        Profile
      </NavLink>
      {showAdmin && (
        <NavLink to="/admin" style={linkStyle}>
          <i className="bi bi-shield-lock sidebar-nav__icon" aria-hidden />
          Admin
        </NavLink>
      )}
      <button
        type="button"
        className="sidebar-signout"
        onClick={() => {
          signOut()
          navigate('/signin')
        }}
      >
        Sign out
      </button>
    </nav>
  )
}
