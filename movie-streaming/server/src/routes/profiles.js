import { Router } from 'express'
import { Profile } from '../models/Profile.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const list = await Profile.find({ userId: req.userId }).sort({ createdAt: 1 })
  res.json(list)
})

router.post('/', async (req, res) => {
  const { profileName, maturityLevel, languagePref } = req.body
  if (!profileName?.trim()) {
    return res.status(400).json({ error: 'profileName is required' })
  }
  const p = await Profile.create({
    userId: req.userId,
    profileName: profileName.trim(),
    maturityLevel: maturityLevel === 'kids' ? 'kids' : 'adult',
    languagePref: languagePref || 'en',
  })
  res.status(201).json(p)
})

router.patch('/:id', async (req, res) => {
  const p = await Profile.findOne({ _id: req.params.id, userId: req.userId })
  if (!p) return res.status(404).json({ error: 'Profile not found' })
  const { profileName, maturityLevel, languagePref } = req.body
  if (profileName != null) p.profileName = String(profileName).trim()
  if (maturityLevel === 'kids' || maturityLevel === 'adult') {
    p.maturityLevel = maturityLevel
  }
  if (languagePref != null) p.languagePref = languagePref
  await p.save()
  res.json(p)
})

router.delete('/:id', async (req, res) => {
  const p = await Profile.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  })
  if (!p) return res.status(404).json({ error: 'Profile not found' })
  res.status(204).send()
})

export default router
