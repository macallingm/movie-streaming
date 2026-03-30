import { Outlet } from 'react-router-dom'
import { SidebarNav } from './SidebarNav'
import { useApp } from '../hooks/useApp'

export function MainLayout() {
  const { apiError, titlesLoading } = useApp()

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <SidebarNav />
      </aside>
      <main className="app-main">
        {apiError && (
          <div className="api-banner api-banner--error" role="alert">
            {apiError}
          </div>
        )}
        {titlesLoading && !apiError && (
          <div className="api-banner api-banner--info">Loading catalog…</div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
