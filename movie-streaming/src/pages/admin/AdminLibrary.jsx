import { useState } from 'react'
import { useApp } from '../../hooks/useApp'

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
  const { titles, upsertTitle, deleteTitle } = useApp()
  const [editingId, setEditingId] = useState(null)

  return (
    <div>
      <h2>Library (CRUD)</h2>
      <p className="muted">
        Add, update, or delete movie metadata — frontend prototype only.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          const t = emptyMovie()
          upsertTitle(t)
          setEditingId(t.titleId)
        }}
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
                    value={t.titleName}
                    onChange={(e) =>
                      upsertTitle({ ...t, titleName: e.target.value })
                    }
                  />
                ) : (
                  t.titleName
                )}
              </td>
              <td>{t.type}</td>
              <td>{t.releaseYear}</td>
              <td className="actions">
                <button
                  type="button"
                  className="btn-text"
                  onClick={() =>
                    setEditingId(editingId === t.titleId ? null : t.titleId)
                  }
                >
                  {editingId === t.titleId ? 'Done' : 'Edit'}
                </button>
                <button
                  type="button"
                  className="btn-text danger"
                  onClick={() => {
                    deleteTitle(t.titleId)
                    if (editingId === t.titleId) setEditingId(null)
                  }}
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
