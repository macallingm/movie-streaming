/**
 * Latest non-completed progress row for a title (by updatedAt).
 */
export function latestProgressForTitle(watchProgress, profileId, titleId) {
  if (!watchProgress?.length || !titleId) return null
  const pid = String(profileId || '')
  const tid = String(titleId)
  const rows = watchProgress.filter(
    (w) =>
      String(w.profileId) === pid &&
      String(w.titleId) === tid &&
      !w.completed &&
      (w.progressSeconds || 0) > 0
  )
  if (!rows.length) return null
  return rows.reduce((best, w) => {
    const bt = new Date(best.updatedAt || 0).getTime()
    const wt = new Date(w.updatedAt || 0).getTime()
    return wt >= bt ? w : best
  })
}

/**
 * 0–100 for a thin progress bar under a poster.
 * @param {object|null} progressRow - normalized watch row
 * @param {object|null} title - title object (may include seasons/episodes, durationMinutes)
 */
export function progressBarPercent(progressRow, title) {
  if (!progressRow || progressRow.completed) return 0
  const sec = progressRow.progressSeconds || 0
  if (sec <= 0) return 0
  let totalSec = 0
  if (
    title?.type === 'Show' &&
    title.seasons?.length &&
    progressRow.seasonNumber != null &&
    progressRow.episodeNumber != null
  ) {
    const season = title.seasons.find(
      (s) => s.seasonNumber === progressRow.seasonNumber
    )
    const ep = season?.episodes?.find(
      (e) => e.episodeNumber === progressRow.episodeNumber
    )
    totalSec = (ep?.durationMinutes ?? 45) * 60
  } else {
    totalSec = (title?.durationMinutes ?? 120) * 60
  }
  if (totalSec <= 0) return Math.min(95, (sec / 3600) * 100)
  return Math.min(100, Math.max(0, (sec / totalSec) * 100))
}

export function shouldShowResume(progressRow) {
  return Boolean(
    progressRow &&
      !progressRow.completed &&
      (progressRow.progressSeconds || 0) > 0
  )
}
