import { useEffect, useState } from 'react'
import { apiGet } from '../../services/api'

export function AdminAnalytics() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setErr('')
      try {
        const data = await apiGet('/api/admin/analytics/genres')
        if (!cancelled) setRows(data || [])
      } catch (e) {
        if (!cancelled) {
          setErr(
            e.message ||
              'Could not load analytics (sign in as a content_manager account).'
          )
          setRows([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const max = Math.max(...rows.map((a) => a.watchSeconds || 0), 1)

  return (
    <div>
      <h2>Analytics</h2>
      <p className="muted">
        Watch time by genre from <code>GET /api/admin/analytics/genres</code>{' '}
        (summed progress seconds).
      </p>
      {err && (
        <p className="auth-error" role="alert">
          {err}
        </p>
      )}
      <ul className="analytics-list">
        {rows.map((row) => {
          const hours = ((row.watchSeconds || 0) / 3600).toFixed(1)
          return (
            <li key={row.genre}>
              <span className="analytics-genre">{row.genre}</span>
              <div className="analytics-bar-wrap">
                <div
                  className="analytics-bar"
                  style={{
                    width: `${((row.watchSeconds || 0) / max) * 100}%`,
                  }}
                />
              </div>
              <span className="analytics-val">
                ~{hours} h · {row.entries} entr
                {row.entries === 1 ? 'y' : 'ies'}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
