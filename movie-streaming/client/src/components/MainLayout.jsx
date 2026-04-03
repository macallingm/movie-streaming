import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarNav } from './SidebarNav'
import { useApp } from '../hooks/useApp'
import { useUiStrings } from '../hooks/useUiStrings'

export function MainLayout() {
  const { apiError, titlesLoading } = useApp()
  const { t, locale } = useUiStrings()

  useEffect(() => {
    document.documentElement.lang = locale || 'en'
  }, [locale])

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
          <div className="api-banner api-banner--info">
            {t('layout_loadingCatalog')}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
