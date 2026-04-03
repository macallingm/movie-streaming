/** Kids profiles only see G / PG (prototype rule). */
export function titleAllowedForProfile(profile, title) {
  if (!profile || !title) return true
  if (profile.maturityLevel === 'kids') {
    return ['G', 'PG'].includes(title.maturityRating)
  }
  return true
}
