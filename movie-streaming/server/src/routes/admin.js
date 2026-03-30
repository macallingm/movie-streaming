import { Router } from 'express'
import { User } from '../models/User.js'
import { WatchProgress } from '../models/WatchProgress.js'
import { requireAuth, requireContentManager } from '../middleware/auth.js'
import { importTmdbMovies } from '../services/tmdbImport.js'

const router = Router()

router.use(requireAuth, requireContentManager)

router.get('/users', async (req, res) => {
  const users = await User.find()
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .limit(500)
  res.json(users)
})

router.patch('/users/:id/status', async (req, res) => {
  const { status } = req.body
  if (status !== 'active' && status !== 'suspended') {
    return res.status(400).json({ error: 'status must be active or suspended' })
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select('-passwordHash')
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

/** Rough "most watched by genre" from summed progress seconds. */
router.get('/analytics/genres', async (req, res) => {
  const rows = await WatchProgress.aggregate([
    {
      $lookup: {
        from: 'titles',
        localField: 'titleId',
        foreignField: '_id',
        as: 'title',
      },
    },
    { $unwind: '$title' },
    { $unwind: '$title.genres' },
    {
      $group: {
        _id: '$title.genres',
        watchSeconds: { $sum: '$progressSeconds' },
        entries: { $sum: 1 },
      },
    },
    { $sort: { watchSeconds: -1 } },
    {
      $project: {
        genre: '$_id',
        watchSeconds: 1,
        entries: 1,
        _id: 0,
      },
    },
  ])
  res.json(rows)
})

/**
 * Import real movie metadata from TMDb into MongoDB (catalog + posters).
 * Playback uses a legal sample MP4 (same as class prototype); TMDb does not stream films.
 */
router.post('/import/tmdb', async (req, res) => {
  try {
    const key = process.env.TMDB_API_KEY
    if (!key) {
      return res.status(400).json({
        error:
          'Set TMDB_API_KEY in server .env (same key as frontend VITE_TMDB_API_KEY is fine).',
      })
    }
    const feed = req.body?.feed === 'now_playing' ? 'now_playing' : 'trending'
    const limit = Number(req.body?.limit) || 20
    const result = await importTmdbMovies(key, feed, limit)
    res.status(201).json(result)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message || 'TMDb import failed' })
  }
})

export default router
