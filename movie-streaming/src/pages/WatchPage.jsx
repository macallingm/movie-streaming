import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { getVideoUrlForTitle } from '../data/mockData'

function formatTime(sec) {
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function WatchPlayer({
  title,
  seasonNum,
  episodeNum,
  videoUrl,
  progress,
  user,
  activeProfile,
  onNextEpisode,
}) {
  const videoRef = useRef(null)
  const {
    updateWatchProgress,
  } = useApp()

  const [duration, setDuration] = useState(0)
  const [currentSec, setCurrentSec] = useState(
    () => progress?.progressSeconds ?? 0
  )

  const isShow = title.type === 'Show'
  const accountOk = user?.status === 'active'
  const maturityOk =
    activeProfile.maturityLevel === 'kids'
      ? ['G', 'PG'].includes(title.maturityRating)
      : true

  const persistProgress = useCallback(() => {
    const v = videoRef.current
    if (!v || !title || !accountOk || !maturityOk) return
    const sec = v.currentTime
    setCurrentSec(sec)
    updateWatchProgress(title.titleId, {
      progressSeconds: Math.floor(sec),
      seasonNumber: title.type === 'Show' ? seasonNum : null,
      episodeNumber: title.type === 'Show' ? episodeNum : null,
      completed: duration > 0 && sec > duration - 5,
    })
  }, [
    title,
    accountOk,
    maturityOk,
    updateWatchProgress,
    seasonNum,
    episodeNum,
    duration,
  ])

  const skip = (delta) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Math.max(
      0,
      Math.min(v.duration || Infinity, v.currentTime + delta)
    )
    persistProgress()
  }

  return (
    <div className="page-watch">
      <div className="watch-top">
        <Link to="/movies" className="watch-back" aria-label="Back">
          ← Back
        </Link>
        <h1 className="watch-title">{title.titleName}</h1>
        {isShow && (
          <p className="watch-sub">
            S{seasonNum} · E{episodeNum}
          </p>
        )}
      </div>
      <div className="watch-stage">
        <video
          ref={videoRef}
          key={videoUrl}
          className="watch-video"
          src={videoUrl}
          controls
          playsInline
          onLoadedMetadata={(e) => {
            const el = e.currentTarget
            setDuration(el.duration || 0)
            const t = progress?.progressSeconds ?? 0
            if (t > 0) el.currentTime = t
          }}
          onTimeUpdate={(e) => setCurrentSec(e.currentTarget.currentTime)}
          onPause={persistProgress}
          onEnded={persistProgress}
        />
        <div className="watch-extras">
          <div className="watch-controls">
            <button type="button" onClick={() => skip(-10)} aria-label="Rewind 10 seconds">
              ⟲ 10s
            </button>
            <button type="button" onClick={() => skip(10)} aria-label="Forward 10 seconds">
              10s ⟳
            </button>
            {isShow && (
              <button type="button" onClick={onNextEpisode}>
                Next episode
              </button>
            )}
          </div>
          <p className="watch-time">
            {formatTime(currentSec)}
            {duration > 0 ? ` / ${formatTime(duration)}` : ''}
          </p>
          <p className="watch-hint muted small">
            Progress updates on pause or end (maps to WatchProgress).
          </p>
        </div>
      </div>
    </div>
  )
}

export function WatchPage() {
  const { movieid } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    getTitleById,
    user,
    activeProfile,
    getProgressForTitle,
  } = useApp()
  const title = getTitleById(movieid)

  const isShow = title?.type === 'Show'
  const defaultSeason = title?.seasons?.[0]?.seasonNumber ?? 1
  const defaultEp = title?.seasons?.[0]?.episodes?.[0]?.episodeNumber ?? 1

  const seasonNum = isShow
    ? Number(searchParams.get('season') || defaultSeason)
    : null
  const episodeNum = isShow
    ? Number(searchParams.get('episode') || defaultEp)
    : null

  const videoUrl = useMemo(
    () =>
      title
        ? getVideoUrlForTitle(
            title,
            seasonNum ?? undefined,
            episodeNum ?? undefined
          )
        : null,
    [title, seasonNum, episodeNum]
  )

  const progress = useMemo(
    () =>
      title
        ? getProgressForTitle(title.titleId, seasonNum, episodeNum)
        : null,
    [title, seasonNum, episodeNum, getProgressForTitle]
  )

  const accountOk = user?.status === 'active'
  const maturityOk = title
    ? activeProfile.maturityLevel === 'kids'
      ? ['G', 'PG'].includes(title.maturityRating)
      : true
    : false

  const nextEpisode = () => {
    if (!title?.seasons || !isShow) return
    const season = title.seasons.find((s) => s.seasonNumber === seasonNum)
    const idx =
      season?.episodes?.findIndex((e) => e.episodeNumber === episodeNum) ?? -1
    const nextEp = season?.episodes?.[idx + 1]
    if (nextEp) {
      setSearchParams({
        season: String(seasonNum),
        episode: String(nextEp.episodeNumber),
      })
      return
    }
    const nextSeason = title.seasons.find((s) => s.seasonNumber === seasonNum + 1)
    const first = nextSeason?.episodes?.[0]
    if (first) {
      setSearchParams({
        season: String(nextSeason.seasonNumber),
        episode: String(first.episodeNumber),
      })
    }
  }

  if (!title) {
    return (
      <div className="page-watch page-watch--empty">
        <p>Title not found.</p>
        <Link to="/movies">Back to library</Link>
      </div>
    )
  }

  if (!accountOk) {
    return (
      <div className="page-watch page-watch--empty">
        <p>Your account must be active to play content.</p>
        <Link to="/billing">View billing</Link>
      </div>
    )
  }

  if (!maturityOk) {
    return (
      <div className="page-watch page-watch--empty">
        <p>This title does not match this profile&apos;s maturity level.</p>
        <Link to="/profile">Switch profile</Link>
      </div>
    )
  }

  return (
    <WatchPlayer
      key={`${movieid}-${seasonNum ?? 'm'}-${episodeNum ?? 'm'}`}
      title={title}
      seasonNum={seasonNum}
      episodeNum={episodeNum}
      videoUrl={videoUrl}
      progress={progress}
      user={user}
      activeProfile={activeProfile}
      onNextEpisode={nextEpisode}
    />
  )
}
