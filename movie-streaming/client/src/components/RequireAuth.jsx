import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function RequireAuth() {
  const { signedIn } = useApp()
  const location = useLocation()
  if (!signedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  return <Outlet />
}
