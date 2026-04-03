/** Canonical string id for routes and UI (legacyKey or Mongo _id). */
export function titleSlug(raw) {
  if (!raw) return ''
  if (raw.legacyKey) return raw.legacyKey
  if (raw._id) return String(raw._id)
  if (raw.titleId) return String(raw.titleId)
  return ''
}

export function normalizeTitle(raw) {
  if (!raw) return null
  const titleId = titleSlug(raw)
  return {
    ...raw,
    titleId,
    _id: raw._id,
  }
}

export function normalizeProfile(p) {
  if (!p) return null
  return {
    ...p,
    profileId: p._id?.toString() ?? p.profileId,
    userId: p.userId?._id?.toString() ?? p.userId?.toString() ?? p.userId,
  }
}

export function normalizeUser(u) {
  if (!u) return null
  return {
    ...u,
    userId: u._id?.toString() ?? u.userId,
  }
}

function refId(ref) {
  if (ref == null) return null
  if (typeof ref === 'string') return ref
  if (ref._id) return String(ref._id)
  return String(ref)
}

export function normalizeMyListEntry(entry) {
  const titleRef = entry.titleId
  const titleId =
    titleRef?.legacyKey ||
    (titleRef?._id ? String(titleRef._id) : null) ||
    refId(titleRef)
  return {
    myListId: entry._id?.toString() ?? entry.myListId,
    profileId: refId(entry.profileId),
    titleId,
    addedAt: entry.createdAt ?? entry.addedAt,
    _raw: entry,
  }
}

export function normalizeWatchRow(w) {
  const titleRef = w.titleId
  const titleId =
    titleRef?.legacyKey ||
    (titleRef?._id ? String(titleRef._id) : null) ||
    refId(titleRef)
  return {
    progressId: w._id?.toString() ?? w.progressId,
    profileId: refId(w.profileId),
    titleId,
    seasonNumber: w.seasonNumber ?? null,
    episodeNumber: w.episodeNumber ?? null,
    progressSeconds: w.progressSeconds ?? 0,
    completed: w.completed ?? false,
    updatedAt: w.updatedAt,
  }
}

export function planFromApi(p) {
  return {
    planId: p.planCode,
    planCode: p.planCode,
    planName: p.planName,
    monthlyPrice: p.monthlyPrice,
    maxStreams: p.maxStreams,
    maxResolution: p.maxResolution,
    isActive: p.isActive,
    _id: p._id,
  }
}
