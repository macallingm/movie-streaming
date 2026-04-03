import { useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { apiPost } from '../../services/api'

const emptyMovie = () => ({
  titleId: `T${Date.now()}`,
  titleName: 'New title',
  type: 'Movie',
  description: '',
  releaseYear: new Date().getFullYear(),
  maturityRating: 'PG',
  moviePosterUrl: 'https://picsum.photos/seed/new/400/600',
  genres: ['Drama'],
  videoUrl:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  durationMinutes: 90,
  regionAllow: ['CA', 'US'],
})

export function AdminLibrary() {
  const { titles, upsertTitle, deleteTitle, refreshTitles } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const startEdit = (t) => {
    setEditingId(t.titleId)
    setEditName(t.titleName)
  }

  const saveEdit = async () => {
    const t = titles.find((x) => x.titleId === editingId)
    if (!t) {
      setEditingId(null)
      return
    }
    setErr('')
    setBusy(true)
    try {
      await upsertTitle({ ...t, titleName: editName })
      setEditingId(null)
    } catch (e) {
      setErr(e.message || 'Save failed (need content_manager role?)')
    } finally {
      setBusy(false)
    }
  }

  const addMovie = async () => {
    setErr('')
    setBusy(true)
    try {
      const t = emptyMovie()
      await upsertTitle(t)
      setEditingId(t.titleId)
      setEditName(t.titleName)
    } catch (e) {
      setErr(e.message || 'Create failed (need content_manager role?)')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (t) => {
    if (!confirm(`Delete "${t.titleName}"?`)) return
    setErr('')
    setBusy(true)
    try {
      await deleteTitle(t.titleId)
      if (editingId === t.titleId) setEditingId(null)
    } catch (e) {
      setErr(e.message || 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const importTmdb = async (feed) => {
    setErr('')
    setBusy(true)
    try {
      await apiPost('/api/admin/import/tmdb', { feed, limit: 20 })
      await refreshTitles()
    } catch (e) {
      setErr(
        e.message ||
          'Import failed. Add TMDB_API_KEY to server .env and use a content_manager account.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h2>Library (CRUD)</h2>
      <p className="muted">
        Changes call the API (<code>POST/PATCH/DELETE /api/titles</code>).
        Requires a user with <code>content_manager</code> role.
      </p>
      <p className="muted small">
        <strong>Real movies in your database:</strong> import metadata (title,
        poster, overview, year, genres) from TMDb. Streaming uses a legal
        sample video for every title — TMDb does not provide Hollywood films.
      </p>
      <div className="admin-import-row">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => importTmdb('trending')}
        >
          Import TMDb trending (20)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => importTmdb('now_playing')}
        >
          Import TMDb now playing (20)
        </button>
      </div>
      {err && (
        <p className="auth-error" role="alert">
          {err}
        </p>
      )}
      <button
        type="button"
        className="btn btn-primary"
        disabled={busy}
        onClick={addMovie}
      >
        Add movie
      </button>
      <table className="data-table admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Year</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {titles.map((t) => (
            <tr key={t.titleId}>
              <td>{t.titleId}</td>
              <td>
                {editingId === t.titleId ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={busy}
                  />
                ) : (
                  t.titleName
                )}
              </td>
              <td>{t.type}</td>
              <td>{t.releaseYear}</td>
              <td className="actions">
                {editingId === t.titleId ? (
                  <button
                    type="button"
                    className="btn-text"
                    disabled={busy}
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-text"
                    disabled={busy}
                    onClick={() => startEdit(t)}
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  className="btn-text danger"
                  disabled={busy}
                  onClick={() => remove(t)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
