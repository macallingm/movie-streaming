import { adminAnalytics } from '../../data/mockData'

export function AdminAnalytics() {
  const max = Math.max(...adminAnalytics.map((a) => a.watchHours), 1)

  return (
    <div>
      <h2>Analytics</h2>
      <p className="muted">
        Most-watched hours by genre (mock report for the MVP).
      </p>
      <ul className="analytics-list">
        {adminAnalytics.map((row) => (
          <li key={row.genre}>
            <span className="analytics-genre">{row.genre}</span>
            <div className="analytics-bar-wrap">
              <div
                className="analytics-bar"
                style={{ width: `${(row.watchHours / max) * 100}%` }}
              />
            </div>
            <span className="analytics-val">
              {row.watchHours.toLocaleString()} h · {row.titlesCount} titles
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
