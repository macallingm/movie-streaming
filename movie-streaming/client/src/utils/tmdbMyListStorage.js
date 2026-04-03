const PREFIX = 'streamlab_tmdb_mylist_'

export function readTmdbMyListForProfile(profileId) {
  if (!profileId) return []
  try {
    const raw = localStorage.getItem(PREFIX + profileId)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeTmdbMyListForProfile(profileId, list) {
  if (!profileId) return
  localStorage.setItem(PREFIX + profileId, JSON.stringify(list))
}
