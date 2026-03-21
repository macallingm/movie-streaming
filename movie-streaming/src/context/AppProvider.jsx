import { useCallback, useMemo, useState } from 'react'
import { AppContext } from './appContext'
import {
  getTitleById,
  initialMyList,
  initialWatchProgress,
  profiles as seedProfiles,
  subscriptionPlans,
  subscriptions,
  titles,
  users,
} from '../data/mockData'

export function AppProvider({ children }) {
  const [signedIn, setSignedIn] = useState(true)
  const [userId, setUserId] = useState(100)
  const [activeProfileId, setActiveProfileId] = useState(100)
  const [myListEntries, setMyListEntries] = useState(() => [...initialMyList])
  const [watchProgress, setWatchProgress] = useState(() =>
    initialWatchProgress.map((w) => ({ ...w }))
  )
  const [libraryTitles, setLibraryTitles] = useState(() => [...titles])
  const [selectedPlanId, setSelectedPlanId] = useState('PLAN_STD')

  const user = useMemo(
    () => users.find((u) => u.userId === userId) ?? users[0],
    [userId]
  )

  const activeProfile = useMemo(
    () =>
      seedProfiles.find((p) => p.profileId === activeProfileId) ??
      seedProfiles[0],
    [activeProfileId]
  )

  const userProfiles = useMemo(
    () => seedProfiles.filter((p) => p.userId === userId),
    [userId]
  )

  const subscription = useMemo(
    () => subscriptions.find((s) => s.userId === userId),
    [userId]
  )

  const currentPlan = useMemo(
    () =>
      subscriptionPlans.find((p) => p.planId === subscription?.planId) ??
      subscriptionPlans[0],
    [subscription]
  )

  const myListTitleIds = useMemo(() => {
    return new Set(
      myListEntries
        .filter((e) => e.profileId === activeProfileId)
        .map((e) => e.titleId)
    )
  }, [myListEntries, activeProfileId])

  const toggleMyList = useCallback(
    (titleId) => {
      setMyListEntries((prev) => {
        const exists = prev.some(
          (e) =>
            e.profileId === activeProfileId && e.titleId === titleId
        )
        if (exists) {
          return prev.filter(
            (e) =>
              !(e.profileId === activeProfileId && e.titleId === titleId)
          )
        }
        return [
          ...prev,
          {
            myListId: `ML${Date.now()}`,
            profileId: activeProfileId,
            titleId,
            addedAt: new Date().toISOString(),
          },
        ]
      })
    },
    [activeProfileId]
  )

  const updateWatchProgress = useCallback(
    (titleId, { progressSeconds, seasonNumber, episodeNumber, completed }) => {
      setWatchProgress((prev) => {
        const idx = prev.findIndex(
          (w) =>
            w.profileId === activeProfileId &&
            w.titleId === titleId &&
            w.seasonNumber === (seasonNumber ?? null) &&
            w.episodeNumber === (episodeNumber ?? null)
        )
        const row = {
          progressId:
            idx >= 0 ? prev[idx].progressId : `WP${Date.now()}`,
          profileId: activeProfileId,
          titleId,
          seasonNumber: seasonNumber ?? null,
          episodeNumber: episodeNumber ?? null,
          progressSeconds,
          completed: completed ?? false,
          updatedAt: new Date().toISOString(),
        }
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = row
          return next
        }
        return [...prev, row]
      })
    },
    [activeProfileId]
  )

  const getProgressForTitle = useCallback(
    (titleId, seasonNumber, episodeNumber) => {
      return watchProgress.find(
        (w) =>
          w.profileId === activeProfileId &&
          w.titleId === titleId &&
          w.seasonNumber === (seasonNumber ?? null) &&
          w.episodeNumber === (episodeNumber ?? null)
      )
    },
    [watchProgress, activeProfileId]
  )

  const signIn = useCallback((email) => {
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase())
    if (u) {
      setUserId(u.userId)
      setSignedIn(true)
      const firstProfile = seedProfiles.find((p) => p.userId === u.userId)
      if (firstProfile) setActiveProfileId(firstProfile.profileId)
      return { ok: true }
    }
    setUserId(100)
    setSignedIn(true)
    return { ok: true, demo: true }
  }, [])

  const signOut = useCallback(() => {
    setSignedIn(false)
  }, [])

  const upsertTitle = useCallback((title) => {
    setLibraryTitles((prev) => {
      const i = prev.findIndex((t) => t.titleId === title.titleId)
      if (i >= 0) {
        const next = [...prev]
        next[i] = title
        return next
      }
      return [...prev, title]
    })
  }, [])

  const deleteTitle = useCallback((titleId) => {
    setLibraryTitles((prev) => prev.filter((t) => t.titleId !== titleId))
  }, [])

  const value = useMemo(
    () => ({
      signedIn,
      user,
      activeProfile,
      activeProfileId,
      setActiveProfileId,
      userProfiles,
      subscription,
      currentPlan,
      subscriptionPlans,
      selectedPlanId,
      setSelectedPlanId,
      titles: libraryTitles,
      getTitleById: (id) =>
        libraryTitles.find((t) => t.titleId === id) ?? getTitleById(id),
      myListTitleIds,
      toggleMyList,
      watchProgress,
      updateWatchProgress,
      getProgressForTitle,
      signIn,
      signOut,
      upsertTitle,
      deleteTitle,
    }),
    [
      signedIn,
      user,
      activeProfile,
      activeProfileId,
      userProfiles,
      subscription,
      currentPlan,
      selectedPlanId,
      libraryTitles,
      myListTitleIds,
      toggleMyList,
      watchProgress,
      updateWatchProgress,
      getProgressForTitle,
      signIn,
      signOut,
      upsertTitle,
      deleteTitle,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
