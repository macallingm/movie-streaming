import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './appContext'
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
  getStoredToken,
  setStoredToken,
} from '../services/api'
import {
  normalizeMyListEntry,
  normalizeProfile,
  normalizeTitle,
  normalizeUser,
  normalizeWatchRow,
  planFromApi,
} from '../utils/apiNormalize'
import { getTitleById as mockGetTitleById } from '../data/mockData'
import { SubscriptionRequiredModal } from '../components/SubscriptionRequiredModal'
import {
  readTmdbMyListForProfile,
  writeTmdbMyListForProfile,
} from '../utils/tmdbMyListStorage'

function subscriptionDTO(sub) {
  if (!sub) return null
  const plan = sub.planId && typeof sub.planId === 'object' ? sub.planId : null
  const next =
    sub.nextBillingDate instanceof Date
      ? sub.nextBillingDate.toISOString().slice(0, 10)
      : sub.nextBillingDate
        ? String(sub.nextBillingDate).slice(0, 10)
        : ''
  const start =
    sub.startDate instanceof Date
      ? sub.startDate.toISOString().slice(0, 10)
      : sub.startDate
        ? String(sub.startDate).slice(0, 10)
        : ''
  return {
    subscriptionId: sub._id,
    _id: sub._id,
    userId: sub.userId,
    planId: plan?.planCode || sub.planId,
    status: sub.status,
    startDate: start,
    nextBillingDate: next,
    paymentProvider: sub.paymentProvider,
    cancelAt: sub.cancelAt,
  }
}

function currentPlanFromSub(sub) {
  const plan = sub?.planId
  if (!plan || typeof plan !== 'object') return null
  return planFromApi(plan)
}

function paymentsToInvoices(payments) {
  if (!Array.isArray(payments)) return []
  return payments.map((p) => ({
    id: p._id,
    userId: p.userId,
    date:
      p.paidAt instanceof Date
        ? p.paidAt.toISOString().slice(0, 10)
        : String(p.paidAt || '').slice(0, 10),
    amount: p.amount,
    status: p.status,
    description: p.description || '',
  }))
}

function titleToApiBody(t) {
  const slug = t.titleId != null ? String(t.titleId) : ''
  return {
    legacyKey:
      slug.startsWith('T') ? slug : t.legacyKey || undefined,
    titleName: t.titleName,
    type: t.type,
    description: t.description ?? '',
    releaseYear: t.releaseYear,
    maturityRating: t.maturityRating,
    moviePosterUrl: t.moviePosterUrl,
    genres: t.genres ?? [],
    regionAllow: t.regionAllow ?? [],
    videoUrl: t.videoUrl ?? '',
    durationMinutes: t.durationMinutes,
    seasons: t.seasons ?? [],
  }
}

export function AppProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false)
  const [titlesLoading, setTitlesLoading] = useState(true)
  const [apiError, setApiError] = useState(null)
  const [user, setUser] = useState(null)
  const [userProfiles, setUserProfiles] = useState([])
  const [activeProfileId, setActiveProfileId] = useState('')
  const [libraryTitles, setLibraryTitles] = useState([])
  const [subscriptionPlans, setSubscriptionPlans] = useState([])
  const [selectedPlanId, setSelectedPlanId] = useState('PLAN_STD')
  const [subscriptionRaw, setSubscriptionRaw] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [myListEntries, setMyListEntries] = useState([])
  const [watchProgress, setWatchProgress] = useState([])
  const [subscriptionGateOpen, setSubscriptionGateOpen] = useState(false)
  const [tmdbMyListTitles, setTmdbMyListTitles] = useState([])

  const refreshTitles = useCallback(async () => {
    const data = await apiGet('/api/titles')
    setLibraryTitles((data || []).map(normalizeTitle))
  }, [])

  const refreshSubscriptionAndBilling = useCallback(async () => {
    try {
      const sub = await apiGet('/api/subscriptions/me')
      setSubscriptionRaw(sub)
    } catch {
      setSubscriptionRaw(null)
    }
    try {
      const pays = await apiGet('/api/payments/me')
      setInvoices(paymentsToInvoices(pays))
    } catch {
      setInvoices([])
    }
  }, [])

  const refreshMyListAndProgress = useCallback(async (profileId) => {
    if (!profileId) {
      setMyListEntries([])
      setWatchProgress([])
      return
    }
    try {
      const list = await apiGet(
        `/api/my-list?profileId=${encodeURIComponent(profileId)}`
      )
      setMyListEntries((list || []).map(normalizeMyListEntry))
    } catch {
      setMyListEntries([])
    }
    try {
      const prog = await apiGet(
        `/api/watch-progress?profileId=${encodeURIComponent(profileId)}`
      )
      setWatchProgress((prog || []).map(normalizeWatchRow))
    } catch {
      setWatchProgress([])
    }
  }, [])

  const loadUserSession = useCallback(async () => {
    const me = await apiGet('/api/auth/me')
    setUser(normalizeUser(me))
    const profs = (await apiGet('/api/profiles')).map(normalizeProfile)
    setUserProfiles(profs)
    if (profs[0]) setActiveProfileId(profs[0].profileId)
    else setActiveProfileId('')
    await refreshSubscriptionAndBilling()
    setSignedIn(true)
  }, [refreshSubscriptionAndBilling])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setApiError(null)
      setTitlesLoading(true)
      try {
        const [titlesData, plansData] = await Promise.all([
          apiGet('/api/titles'),
          apiGet('/api/plans'),
        ])
        if (cancelled) return
        setLibraryTitles((titlesData || []).map(normalizeTitle))
        const plans = (plansData || []).map(planFromApi)
        setSubscriptionPlans(plans)
        if (plans.some((p) => p.planId === 'PLAN_STD')) {
          setSelectedPlanId('PLAN_STD')
        } else if (plans[0]) {
          setSelectedPlanId(plans[0].planId)
        }
      } catch (e) {
        if (!cancelled) {
          setApiError(
            e.message || 'Could not reach the API. Is the server running?'
          )
          setLibraryTitles([])
        }
      } finally {
        if (!cancelled) setTitlesLoading(false)
      }
      if (cancelled) return
      const token = getStoredToken()
      if (token) {
        try {
          await loadUserSession()
        } catch {
          setStoredToken(null)
          setSignedIn(false)
          setUser(null)
          setUserProfiles([])
          setActiveProfileId('')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadUserSession])

  useEffect(() => {
    if (!signedIn || !activeProfileId) return
    refreshMyListAndProgress(activeProfileId)
  }, [signedIn, activeProfileId, refreshMyListAndProgress])

  const activeProfile = useMemo(() => {
    return (
      userProfiles.find((p) => p.profileId === activeProfileId) ??
      userProfiles[0] ??
      null
    )
  }, [userProfiles, activeProfileId])

  const subscription = useMemo(
    () => subscriptionDTO(subscriptionRaw),
    [subscriptionRaw]
  )

  const currentPlan = useMemo(
    () => currentPlanFromSub(subscriptionRaw),
    [subscriptionRaw]
  )

  const hasActiveSubscription = subscription?.status === 'Active'

  const openSubscriptionGate = useCallback(() => {
    setSubscriptionGateOpen(true)
  }, [])

  const closeSubscriptionGate = useCallback(() => {
    setSubscriptionGateOpen(false)
  }, [])

  /** Call from Play / watch links: returns false and opens modal when not subscribed. */
  const guardPlayNavigation = useCallback(
    (e) => {
      if (hasActiveSubscription) return true
      e?.preventDefault?.()
      openSubscriptionGate()
      return false
    },
    [hasActiveSubscription, openSubscriptionGate]
  )

  useEffect(() => {
    if (!signedIn) {
      setSubscriptionGateOpen(false)
      setTmdbMyListTitles([])
      return
    }
    if (!activeProfileId) {
      setTmdbMyListTitles([])
      return
    }
    setTmdbMyListTitles(readTmdbMyListForProfile(activeProfileId))
  }, [signedIn, activeProfileId])

  const myListTitleIds = useMemo(() => {
    return new Set(
      myListEntries
        .filter((e) => e.profileId === activeProfileId)
        .map((e) => String(e.titleId))
    )
  }, [myListEntries, activeProfileId])

  const resolveMongoTitleId = useCallback(
    (slug) => {
      const t = libraryTitles.find(
        (x) =>
          String(x.titleId) === String(slug) || String(x._id) === String(slug)
      )
      return t?._id
    },
    [libraryTitles]
  )

  const signIn = useCallback(
    async (email, password) => {
      try {
        if (!password) {
          return { ok: false, error: 'Password is required' }
        }
        const data = await apiPost('/api/auth/login', { email, password })
        if (!data?.token) {
          return { ok: false, error: 'Invalid server response' }
        }
        setStoredToken(data.token)
        await loadUserSession()
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message || 'Login failed' }
      }
    },
    [loadUserSession]
  )

  const signUp = useCallback(
    async (email, password, extras = {}) => {
      try {
        if (!email?.trim() || !password) {
          return { ok: false, error: 'Email and password are required' }
        }
        const data = await apiPost('/api/auth/register', {
          email: email.trim(),
          password,
          ...extras,
        })
        if (!data?.token) {
          return { ok: false, error: 'Invalid server response' }
        }
        setStoredToken(data.token)
        await loadUserSession()
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message || 'Sign up failed' }
      }
    },
    [loadUserSession]
  )

  const signInWithCode = useCallback(
    async (code) => {
      try {
        const data = await apiPost('/api/auth/device-code/redeem', { code })
        if (!data?.token) {
          return { ok: false, error: 'Invalid server response' }
        }
        setStoredToken(data.token)
        await loadUserSession()
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message || 'Invalid or expired code' }
      }
    },
    [loadUserSession]
  )

  const requestEmailPhoneSignInCode = useCallback(async (identifier) => {
    const data = await apiPost('/api/auth/otp/request', { identifier })
    return data
  }, [])

  const signInWithEmailPhoneCode = useCallback(
    async (identifier, code) => {
      try {
        const data = await apiPost('/api/auth/otp/verify', { identifier, code })
        if (!data?.token) {
          return { ok: false, error: 'Invalid server response' }
        }
        setStoredToken(data.token)
        await loadUserSession()
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message || 'Invalid or expired code' }
      }
    },
    [loadUserSession]
  )

  const requestDeviceSignInCode = useCallback(async () => {
    const data = await apiPost('/api/auth/device-code', {})
    return data
  }, [])

  const signOut = useCallback(() => {
    setStoredToken(null)
    setSignedIn(false)
    setUser(null)
    setUserProfiles([])
    setActiveProfileId('')
    setSubscriptionRaw(null)
    setInvoices([])
    setMyListEntries([])
    setWatchProgress([])
  }, [])

  const patchProfile = useCallback(async (profileId, body) => {
    const raw = await apiPatch(
      `/api/profiles/${encodeURIComponent(profileId)}`,
      body
    )
    const normalized = normalizeProfile(raw)
    if (!normalized) return null
    const id = String(profileId)
    setUserProfiles((prev) =>
      prev.map((p) =>
        String(p.profileId) === id ? { ...p, ...normalized } : p
      )
    )
    return normalized
  }, [])

  const updatePassword = useCallback(
    async (currentPassword, newPassword) => {
      await apiPatch('/api/auth/password', {
        currentPassword,
        newPassword,
      })
    },
    []
  )

  const toggleTmdbMyList = useCallback(
    (title) => {
      if (!activeProfileId || !title?.titleId) return
      setTmdbMyListTitles((prev) => {
        const exists = prev.some((x) => x.titleId === title.titleId)
        const next = exists
          ? prev.filter((x) => x.titleId !== title.titleId)
          : [...prev, title]
        writeTmdbMyListForProfile(activeProfileId, next)
        return next
      })
    },
    [activeProfileId]
  )

  const isTmdbInMyList = useCallback(
    (titleId) => tmdbMyListTitles.some((x) => x.titleId === titleId),
    [tmdbMyListTitles]
  )

  const toggleMyList = useCallback(
    async (titleSlug) => {
      if (!activeProfileId) return
      const mongoTitleId = resolveMongoTitleId(titleSlug)
      if (!mongoTitleId) return
      const existing = myListEntries.find(
        (e) =>
          e.profileId === activeProfileId && String(e.titleId) === String(titleSlug)
      )
      try {
        if (existing) {
          await apiDelete(`/api/my-list/${existing.myListId}`)
        } else {
          await apiPost('/api/my-list', {
            profileId: activeProfileId,
            titleId: mongoTitleId,
          })
        }
        await refreshMyListAndProgress(activeProfileId)
      } catch (e) {
        console.error(e)
      }
    },
    [
      activeProfileId,
      myListEntries,
      resolveMongoTitleId,
      refreshMyListAndProgress,
    ]
  )

  const updateWatchProgress = useCallback(
    async (
      titleSlug,
      { progressSeconds, seasonNumber, episodeNumber, completed }
    ) => {
      if (!activeProfileId) return
      const mongoTitleId = resolveMongoTitleId(titleSlug)
      if (!mongoTitleId) return
      try {
        await apiPut('/api/watch-progress', {
          profileId: activeProfileId,
          titleId: mongoTitleId,
          seasonNumber,
          episodeNumber,
          progressSeconds,
          completed,
        })
        await refreshMyListAndProgress(activeProfileId)
      } catch (e) {
        console.error(e)
      }
    },
    [activeProfileId, resolveMongoTitleId, refreshMyListAndProgress]
  )

  const getProgressForTitle = useCallback(
    (titleSlug, seasonNumber, episodeNumber) => {
      return watchProgress.find(
        (w) =>
          w.profileId === activeProfileId &&
          String(w.titleId) === String(titleSlug) &&
          w.seasonNumber === (seasonNumber ?? null) &&
          w.episodeNumber === (episodeNumber ?? null)
      )
    },
    [watchProgress, activeProfileId]
  )

  const getTitleById = useCallback(
    (id) =>
      libraryTitles.find(
        (t) => String(t.titleId) === String(id) || String(t._id) === String(id)
      ) ?? mockGetTitleById(id),
    [libraryTitles]
  )

  const upsertTitle = useCallback(
    async (title) => {
      const body = titleToApiBody(title)
      try {
        if (title._id) {
          const id = title.titleId || title.legacyKey || title._id
          await apiPatch(
            `/api/titles/${encodeURIComponent(id)}`,
            body
          )
        } else {
          await apiPost('/api/titles', body)
        }
        await refreshTitles()
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    [refreshTitles]
  )

  const deleteTitle = useCallback(
    async (titleSlug) => {
      try {
        await apiDelete(`/api/titles/${encodeURIComponent(titleSlug)}`)
        await refreshTitles()
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    [refreshTitles]
  )

  const activateSubscription = useCallback(
    async (planCode, paymentProvider = 'PayPal') => {
      await apiPost('/api/subscriptions/me', { planCode, paymentProvider })
      await refreshSubscriptionAndBilling()
    },
    [refreshSubscriptionAndBilling]
  )

  const value = useMemo(
    () => ({
      signedIn,
      titlesLoading,
      apiError,
      user,
      activeProfile,
      activeProfileId,
      setActiveProfileId,
      userProfiles,
      subscription,
      hasActiveSubscription,
      guardPlayNavigation,
      openSubscriptionGate,
      closeSubscriptionGate,
      currentPlan,
      subscriptionPlans,
      selectedPlanId,
      setSelectedPlanId,
      invoices,
      titles: libraryTitles,
      getTitleById,
      myListTitleIds,
      toggleMyList,
      tmdbMyListTitles,
      toggleTmdbMyList,
      isTmdbInMyList,
      patchProfile,
      updatePassword,
      watchProgress,
      updateWatchProgress,
      getProgressForTitle,
      signIn,
      signUp,
      signInWithCode,
      requestEmailPhoneSignInCode,
      signInWithEmailPhoneCode,
      requestDeviceSignInCode,
      signOut,
      upsertTitle,
      deleteTitle,
      refreshTitles,
      activateSubscription,
    }),
    [
      signedIn,
      titlesLoading,
      apiError,
      user,
      activeProfile,
      activeProfileId,
      userProfiles,
      subscription,
      hasActiveSubscription,
      guardPlayNavigation,
      openSubscriptionGate,
      closeSubscriptionGate,
      currentPlan,
      subscriptionPlans,
      selectedPlanId,
      invoices,
      libraryTitles,
      getTitleById,
      myListTitleIds,
      toggleMyList,
      tmdbMyListTitles,
      toggleTmdbMyList,
      isTmdbInMyList,
      patchProfile,
      updatePassword,
      watchProgress,
      updateWatchProgress,
      getProgressForTitle,
      signIn,
      signUp,
      signInWithCode,
      requestEmailPhoneSignInCode,
      signInWithEmailPhoneCode,
      requestDeviceSignInCode,
      signOut,
      upsertTitle,
      deleteTitle,
      refreshTitles,
      activateSubscription,
    ]
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <SubscriptionRequiredModal
        open={subscriptionGateOpen}
        onClose={closeSubscriptionGate}
      />
    </AppContext.Provider>
  )
}
