import { Router } from 'express'
import mongoose from 'mongoose'
import { MyList } from '../models/MyList.js'
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
  const list = await MyList.find({ profileId }).populate('titleId').sort({
    createdAt: -1,
  })
  res.json(list)
})

router.post('/', async (req, res) => {
  const { profileId, titleId } = req.body
  if (!profileId || !titleId) {
    return res.status(400).json({ error: 'profileId and titleId required' })
  }
  const profile = await assertProfileOwner(profileId, req.userId)
  if (!profile) return res.status(404).json({ error: 'Profile not found' })
  const title = await Title.findById(titleId)
  if (!title) return res.status(404).json({ error: 'Title not found' })
  try {
    const row = await MyList.create({ profileId, titleId })
    const populated = await MyList.findById(row._id).populate('titleId')
    res.status(201).json(populated)
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: 'Title already in list for this profile' })
    }
    throw e
  }
})

router.delete('/:id', async (req, res) => {
  const row = await MyList.findById(req.params.id)
  if (!row) return res.status(404).json({ error: 'Entry not found' })
  const profile = await Profile.findOne({
    _id: row.profileId,
    userId: req.userId,
  })
  if (!profile) return res.status(404).json({ error: 'Entry not found' })
  await row.deleteOne()
  res.status(204).send()
})

export default router
