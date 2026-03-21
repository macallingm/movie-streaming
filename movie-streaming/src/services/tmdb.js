const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

export function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY ?? ''
}

export function posterUrl(path, size = 'w500') {
  if (!path) return null
  return `${IMG}/${size}${path}`
}

/**
 * Fetch trending movies for home carousels. Returns [] if no key or error.
 */
export async function fetchTrendingMovies() {
  const key = getApiKey()
  if (!key) return []
  try {
    const res = await fetch(
      `${TMDB_BASE}/trending/movie/week?api_key=${encodeURIComponent(key)}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.results ?? []
  } catch {
    return []
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
