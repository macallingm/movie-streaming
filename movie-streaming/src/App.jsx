import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { AdminLayout } from './components/AdminLayout'
import { RequireAuth } from './components/RequireAuth'
import { HomePage } from './pages/HomePage'
import { MoviesPage } from './pages/MoviesPage'
import { TvShowsPage } from './pages/TvShowsPage'
import { WatchPage } from './pages/WatchPage'
import { ProfilePage } from './pages/ProfilePage'
import { BillingPage } from './pages/BillingPage'
import { SignInPage } from './pages/SignInPage'
import { SubscribePage } from './pages/SubscribePage'
import { SearchPage } from './pages/SearchPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminLibrary } from './pages/admin/AdminLibrary'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminAnalytics } from './pages/admin/AdminAnalytics'
import { TmdbBrowsePage } from './pages/TmdbBrowsePage'
import { TmdbTvBrowsePage } from './pages/TmdbTvBrowsePage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TvShowsPage />} />
          <Route path="/watch/:movieid" element={<WatchPage />} />
          <Route path="/browse/movie/:tmdbId" element={<TmdbBrowsePage />} />
          <Route path="/browse/tv/:tmdbId" element={<TmdbTvBrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/billing" element={<BillingPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="library" element={<AdminLibrary />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
