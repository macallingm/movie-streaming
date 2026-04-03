const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'
const GENRE_NAMES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

export function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY ?? ''
}

export function posterUrl(path, size = 'w500') {
  if (!path) return null
  return `${IMG}/${size}${path}`
}

/**
 * Fetch trending movies for home carousels. Returns [] if no key or error.
 * @param {number} [page=1] TMDb results page (20 items per page).
 */
export async function fetchTrendingMovies(page = 1) {
  const key = getApiKey()
  if (!key) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/trending/movie/week?api_key=${encodeURIComponent(
        key
      )}&page=${encodeURIComponent(page)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

/**
 * @param {number} [page=1] TMDb results page (20 items per page).
 */
export async function fetchTrendingTv(page = 1) {
  const key = getApiKey()
  if (!key) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/trending/tv/week?api_key=${encodeURIComponent(
        key
      )}&page=${encodeURIComponent(page)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

/** In theatres / recent releases — good for a “New this week” style row. */
export async function fetchNowPlayingMovies(page = 1) {
  const key = getApiKey()
  if (!key) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/now_playing?api_key=${encodeURIComponent(
        key
      )}&language=en-US&page=${encodeURIComponent(page)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

/** Popular movies feed for larger browse catalogs. */
export async function fetchPopularMovies(page = 1) {
  const key = getApiKey()
  if (!key) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/popular?api_key=${encodeURIComponent(
        key
      )}&language=en-US&page=${encodeURIComponent(page)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

export async function fetchPopularTv(page = 1) {
  const key = getApiKey()
  if (!key) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/tv/popular?api_key=${encodeURIComponent(
        key
      )}&language=en-US&page=${encodeURIComponent(page)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

/** TMDb search for Search page. */
export async function searchTmdbMovies(query, page = 1) {
  const key = getApiKey()
  const q = String(query || '').trim()
  if (!key || !q) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(
        key
      )}&language=en-US&include_adult=false&page=${encodeURIComponent(
        page
      )}&query=${encodeURIComponent(q)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

export async function searchTmdbTv(query, page = 1) {
  const key = getApiKey()
  const q = String(query || '').trim()
  if (!key || !q) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/tv?api_key=${encodeURIComponent(
        key
      )}&language=en-US&include_adult=false&page=${encodeURIComponent(
        page
      )}&query=${encodeURIComponent(q)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
  }
}

export function mapTmdbMovieToTitle(m) {
  if (!m) return null
  const genreIds = Array.isArray(m.genre_ids) ? m.genre_ids : []
  const genres = genreIds.map((id) => GENRE_NAMES[id]).filter(Boolean)
  const vote = Number(m.vote_average || 0)
  const maturity =
    m.adult || vote >= 7.5 ? '18+' : vote >= 6 ? '14A' : vote >= 4 ? 'PG' : 'G'
  return {
    titleId: `tmdb-${m.id}`,
    tmdbId: m.id,
    tmdbType: 'movie',
    titleName: m.title,
    releaseYear: (m.release_date || '').slice(0, 4) || '—',
    moviePosterUrl: posterUrl(m.poster_path) || '',
    description: m.overview,
    type: 'Movie',
    maturityRating: maturity,
    genres,
  }
}

/** Map TMDb movie *detail* JSON to the same card shape as list results. */
export function mapTmdbMovieDetailToTitle(d) {
  if (!d?.id) return null
  const genreIds = Array.isArray(d.genres)
    ? d.genres.map((g) => g.id).filter(Boolean)
    : Array.isArray(d.genre_ids)
      ? d.genre_ids
      : []
  return mapTmdbMovieToTitle({
    id: d.id,
    title: d.title,
    overview: d.overview,
    poster_path: d.poster_path,
    release_date: d.release_date,
    adult: d.adult,
    vote_average: d.vote_average,
    genre_ids: genreIds,
  })
}

/** Map TMDb TV *detail* JSON to the same card shape as list results. */
export function mapTmdbTvDetailToTitle(d) {
  if (!d?.id) return null
  const genreIds = Array.isArray(d.genres)
    ? d.genres.map((g) => g.id).filter(Boolean)
    : Array.isArray(d.genre_ids)
      ? d.genre_ids
      : []
  return mapTmdbTvToTitle({
    id: d.id,
    name: d.name,
    overview: d.overview,
    poster_path: d.poster_path,
    first_air_date: d.first_air_date,
    adult: d.adult,
    vote_average: d.vote_average,
    genre_ids: genreIds,
  })
}

export function mapTmdbTvToTitle(t) {
  if (!t) return null
  const genreIds = Array.isArray(t.genre_ids) ? t.genre_ids : []
  const genres = genreIds.map((id) => GENRE_NAMES[id]).filter(Boolean)
  const vote = Number(t.vote_average || 0)
  const maturity =
    t.adult || vote >= 7.5 ? '18+' : vote >= 6 ? '14A' : vote >= 4 ? 'PG' : 'G'
  return {
    titleId: `tmdb-tv-${t.id}`,
    tmdbId: t.id,
    tmdbType: 'tv',
    titleName: t.name,
    releaseYear: (t.first_air_date || '').slice(0, 4) || '—',
    moviePosterUrl: posterUrl(t.poster_path) || '',
    description: t.overview,
    type: 'Show',
    maturityRating: maturity,
    genres,
  }
}

export async function fetchMovieDetails(movieId) {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/${movieId}?api_key=${encodeURIComponent(key)}`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/** Full detail + credits in one round trip (for browse / detail UI). */
export async function fetchMovieWithCredits(movieId) {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(
      `${TMDB_BASE}/movie/${encodeURIComponent(movieId)}?api_key=${encodeURIComponent(
        key
      )}&language=en-US&append_to_response=credits,videos`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchTvWithCredits(tvId) {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(
      `${TMDB_BASE}/tv/${encodeURIComponent(tvId)}?api_key=${encodeURIComponent(
        key
      )}&language=en-US&append_to_response=credits,videos`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchTvSeason(tvId, seasonNumber) {
  const key = getApiKey()
  if (!key) return null
  try {
    const res = await fetch(
      `${TMDB_BASE}/tv/${encodeURIComponent(tvId)}/season/${encodeURIComponent(
        seasonNumber
      )}?api_key=${encodeURIComponent(key)}&language=en-US`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export function pickTmdbTrailer(videos) {
  const rows = Array.isArray(videos?.results) ? videos.results : []
  const youtube = rows.filter((v) => v?.site === 'YouTube' && v?.key)
  const preferred =
    youtube.find((v) => v.type === 'Trailer' && v.official) ||
    youtube.find((v) => v.type === 'Trailer') ||
    youtube.find((v) => v.type === 'Teaser') ||
    youtube[0]
  return preferred ? `https://www.youtube.com/embed/${preferred.key}?autoplay=1` : null
}

/** Legal sample stream (same as backend seed) — TMDb does not provide films. */
export const TMDB_SAMPLE_STREAM_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

/** Build a minimal title shape for /watch when only TMDb id is known. */
export function syntheticTitleFromTmdbDetail(d) {
  if (!d?.id) return null
  const trailerUrl = pickTmdbTrailer(d.videos)
  return {
    titleId: `tmdb-${d.id}`,
    tmdbId: d.id,
    titleName: d.title || 'Untitled',
    type: 'Movie',
    description: d.overview || '',
    releaseYear: d.release_date
      ? parseInt(String(d.release_date).slice(0, 4), 10)
      : undefined,
    maturityRating: d.adult ? '18+' : 'PG',
    moviePosterUrl: posterUrl(d.poster_path) || '',
    genres: Array.isArray(d.genres) ? d.genres.map((g) => g.name) : [],
    videoUrl: trailerUrl || TMDB_SAMPLE_STREAM_URL,
    trailerUrl,
    durationMinutes: d.runtime || 120,
    seasons: [],
  }
}

export async function syntheticTitleFromTmdbTvDetail(d, seasonNumber = 1) {
  if (!d?.id) return null
  const season = await fetchTvSeason(d.id, seasonNumber)
  const episodes = Array.isArray(season?.episodes)
    ? season.episodes.map((ep) => ({
        episodeNumber: ep.episode_number,
        episodeTitle: ep.name || `Episode ${ep.episode_number}`,
        durationMinutes: ep.runtime || 45,
        videoUrl: TMDB_SAMPLE_STREAM_URL,
      }))
    : []
  const trailerUrl = pickTmdbTrailer(d.videos)
  return {
    titleId: `tmdb-tv-${d.id}`,
    tmdbId: d.id,
    tmdbType: 'tv',
    titleName: d.name || 'Untitled Show',
    type: 'Show',
    description: d.overview || '',
    releaseYear: d.first_air_date
      ? parseInt(String(d.first_air_date).slice(0, 4), 10)
      : undefined,
    maturityRating: d.adult ? '18+' : 'PG',
    moviePosterUrl: posterUrl(d.poster_path) || '',
    genres: Array.isArray(d.genres) ? d.genres.map((g) => g.name) : [],
    videoUrl: trailerUrl || TMDB_SAMPLE_STREAM_URL,
    trailerUrl,
    seasons: [
      {
        seasonNumber,
        episodes,
      },
    ],
  }
}

export function formatRuntimeMinutes(mins) {
  if (!mins || mins < 1) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h <= 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
