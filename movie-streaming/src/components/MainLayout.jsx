import { Outlet } from 'react-router-dom'
import { SidebarNav } from './SidebarNav'

export function MainLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <SidebarNav />
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
