import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function RequireContentManager() {
  const { signedIn, user } = useApp()
  const location = useLocation()

  if (!signedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  if (user?.role !== 'content_manager') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
