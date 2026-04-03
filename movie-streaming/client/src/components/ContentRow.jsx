import { useRef, useState, useCallback, useEffect } from 'react'
import { MovieCard } from './MovieCard'

function ChevronLeftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ContentRow({ label, titles, emptyHint }) {
  const hasItems = titles?.length > 0
  const trackRef = useRef(null)
  const [scrollMetrics, setScrollMetrics] = useState({
    left: 0,
    clientWidth: 1,
    scrollWidth: 1,
  })

  const updateScrollMetrics = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setScrollMetrics({
      left: el.scrollLeft,
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
    })
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateScrollMetrics()
    const ro = new ResizeObserver(updateScrollMetrics)
    ro.observe(el)
    return () => ro.disconnect()
  }, [titles, updateScrollMetrics])

  const { left, clientWidth: cw, scrollWidth: sw } = scrollMetrics
  const maxScroll = Math.max(0, sw - cw)
  const scrollable = sw > cw + 1
  const thumbPercent = scrollable ? Math.min(100, (cw / sw) * 100) : 100
  const thumbOffsetPercent =
    scrollable && maxScroll > 0
      ? (left / maxScroll) * (100 - thumbPercent)
      : 0

  const scrollByDir = (dir) => {
    const el = trackRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * 0.82)
    el.scrollBy({ left: dir * delta, behavior: 'smooth' })
  }

  const atStart = left <= 2
  const atEnd = left >= maxScroll - 2

  if (!hasItems && !emptyHint) return null

  return (
    <section className="content-row">
      <div className="content-row__head">
        <h3 className="content-row__title">{label}</h3>
        {hasItems && scrollable ? (
          <div
            className="content-row__progress"
            role="presentation"
            aria-hidden
          >
            <div className="content-row__progress-track">
              <div
                className="content-row__progress-thumb"
                style={{
                  width: `${thumbPercent}%`,
                  marginLeft: `${thumbOffsetPercent}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      {hasItems ? (
        <div className="content-row__viewport">
          <button
            type="button"
            className="content-row__arrow content-row__arrow--left"
            onClick={() => scrollByDir(-1)}
            disabled={atStart}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon />
          </button>
          <div
            ref={trackRef}
            className="content-row__track"
            role="list"
            onScroll={updateScrollMetrics}
          >
            {titles.map((t) => (
              <MovieCard key={`${t.titleId}-${t._resumeQuery || ''}`} title={t} />
            ))}
          </div>
          <button
            type="button"
            className="content-row__arrow content-row__arrow--right"
            onClick={() => scrollByDir(1)}
            disabled={atEnd}
            aria-label="Scroll right"
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : emptyHint ? (
        <p className="content-row__empty muted">{emptyHint}</p>
      ) : null}
    </section>
  )
}
