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
  const { signOut } = useApp()
  const navigate = useNavigate()

  return (
    <nav className="sidebar-nav" aria-label="Main">
      <div className="sidebar-brand">StreamLab</div>
      <NavLink to="/search" style={linkStyle} title="Search">
        <span aria-hidden>🔍</span> Search
      </NavLink>
      <NavLink to="/" end style={linkStyle}>
        <span aria-hidden>⌂</span> Home
      </NavLink>
      <NavLink to="/movies" style={linkStyle}>
        <span aria-hidden>▣</span> Movies
      </NavLink>
      <NavLink to="/tv" style={linkStyle}>
        <span aria-hidden>▤</span> TV Shows
      </NavLink>
      <NavLink to="/profile" style={linkStyle}>
        <span aria-hidden>＋</span> My List &amp; Profile
      </NavLink>
      <NavLink to="/billing" style={linkStyle}>
        <span aria-hidden>⚙</span> Billing
      </NavLink>
      <NavLink to="/admin" style={linkStyle}>
        <span aria-hidden>◈</span> Admin
      </NavLink>
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
