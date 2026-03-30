import { Title } from '../models/Title.js'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

/** Prototype playback — TMDb does not provide full films; use a legal sample clip. */
export const SAMPLE_STREAM_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const TMDB_GENRES = {
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
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

function posterFull(path) {
  if (!path) return ''
  return `${IMG}/w500${path}`
}

function mapGenres(ids) {
  if (!Array.isArray(ids)) return []
  return ids.map((id) => TMDB_GENRES[id]).filter(Boolean)
}

function mapMovieToTitleDoc(m) {
  const year = m.release_date
    ? parseInt(String(m.release_date).slice(0, 4), 10)
    : undefined
  return {
    legacyKey: `TMDB-${m.id}`,
    titleName: m.title || 'Untitled',
    type: 'Movie',
    description: m.overview || '',
    releaseYear: Number.isFinite(year) ? year : undefined,
    maturityRating: m.adult ? '18+' : 'PG',
    moviePosterUrl: posterFull(m.poster_path),
    genres: mapGenres(m.genre_ids),
    regionAllow: ['CA', 'US'],
    videoUrl: SAMPLE_STREAM_URL,
    durationMinutes: 120,
    seasons: [],
  }
}

async function tmdbFetch(path, apiKey) {
  const url = `${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`TMDb ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

/**
 * @param {'trending' | 'now_playing'} feed
 * @param {number} limit max titles
 * @returns {Promise<{ created: number, updated: number, legacyKeys: string[] }>}
 */
export async function importTmdbMovies(apiKey, feed, limit = 20) {
  if (!apiKey) throw new Error('Missing TMDB API key')
  const max = Math.min(Math.max(1, limit), 50)
  let path
  if (feed === 'trending') {
    path = '/trending/movie/week?language=en-US'
  } else if (feed === 'now_playing') {
    path = '/movie/now_playing?language=en-US&page=1'
  } else {
    throw new Error('feed must be trending or now_playing')
  }
  const data = await tmdbFetch(path, apiKey)
  const results = (data.results || []).slice(0, max)
  let created = 0
  let updated = 0
  const legacyKeys = []

  for (const m of results) {
    const doc = mapMovieToTitleDoc(m)
    const existing = await Title.findOne({ legacyKey: doc.legacyKey })
    await Title.findOneAndUpdate(
      { legacyKey: doc.legacyKey },
      { $set: doc },
      { upsert: true, new: true }
    )
    legacyKeys.push(doc.legacyKey)
    if (existing) updated += 1
    else created += 1
  }

  return { created, updated, legacyKeys, total: results.length }
}
