import { Router } from 'express'
import mongoose from 'mongoose'
import { WatchProgress } from '../models/WatchProgress.js'
import { Profile } from '../models/Profile.js'
import { Title } from '../models/Title.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

async function assertProfileOwner(profileId, userId) {
  if (!mongoose.Types.ObjectId.isValid(profileId)) return null
  return Profile.findOne({ _id: profileId, userId })
}

router.get('/', async (req, res) => {
  const { profileId } = req.query
  if (!profileId) {
    return res.status(400).json({ error: 'profileId query required' })
  }
  const profile = await assertProfileOwner(profileId, req.userId)
  if (!profile) return res.status(404).json({ error: 'Profile not found' })
  const list = await WatchProgress.find({ profileId }).populate('titleId')
  res.json(list)
})

/** Upsert progress (resume playback). */
router.put('/', async (req, res) => {
  const {
    profileId,
    titleId,
    seasonNumber,
    episodeNumber,
    progressSeconds,
    completed,
  } = req.body
  if (!profileId || !titleId) {
    return res.status(400).json({ error: 'profileId and titleId required' })
  }
  const profile = await assertProfileOwner(profileId, req.userId)
  if (!profile) return res.status(404).json({ error: 'Profile not found' })
  const title = await Title.findById(titleId)
  if (!title) return res.status(404).json({ error: 'Title not found' })

  const sn = title.type === 'Movie' ? null : seasonNumber ?? null
  const en = title.type === 'Movie' ? null : episodeNumber ?? null

  const doc = await WatchProgress.findOneAndUpdate(
    { profileId, titleId, seasonNumber: sn, episodeNumber: en },
    {
      progressSeconds: progressSeconds ?? 0,
      completed: completed ?? false,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate('titleId')

  res.json(doc)
})

export default router
