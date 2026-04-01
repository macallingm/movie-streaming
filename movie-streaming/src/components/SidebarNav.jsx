import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useUiStrings } from '../hooks/useUiStrings'

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
  const { t } = useUiStrings()
  const navigate = useNavigate()
  const showAdmin = user?.role === 'content_manager'

  return (
    <nav className="sidebar-nav" aria-label="Main">
      <div className="sidebar-brand">StreamLab</div>
      <NavLink to="/search" style={linkStyle} title={t('nav_search')}>
        <i className="bi bi-search sidebar-nav__icon" aria-hidden />
        {t('nav_search')}
      </NavLink>
      <NavLink to="/" end style={linkStyle}>
        <i className="bi bi-house sidebar-nav__icon" aria-hidden />
        {t('nav_home')}
      </NavLink>
      <NavLink to="/movies" style={linkStyle}>
        <i className="bi bi-film sidebar-nav__icon" aria-hidden />
        {t('nav_movies')}
      </NavLink>
      <NavLink to="/tv" style={linkStyle}>
        <i className="bi bi-tv sidebar-nav__icon" aria-hidden />
        {t('nav_tv')}
      </NavLink>
      <NavLink to="/my-list" style={linkStyle}>
        <i className="bi bi-plus-lg sidebar-nav__icon" aria-hidden />
        {t('nav_myList')}
      </NavLink>
      <NavLink to="/profile" style={linkStyle}>
        <i className="bi bi-person-fill sidebar-nav__icon" aria-hidden />
        {t('nav_profile')}
      </NavLink>
      {showAdmin && (
        <NavLink to="/admin" style={linkStyle}>
          <i className="bi bi-shield-lock sidebar-nav__icon" aria-hidden />
          {t('nav_admin')}
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
        {t('nav_signOut')}
      </button>
    </nav>
  )
}
