import { Router } from 'express'
import mongoose from 'mongoose'
import { Title } from '../models/Title.js'
import { requireAuth, requireContentManager } from '../middleware/auth.js'

const router = Router()

export async function findTitleByIdParam(param) {
  if (mongoose.Types.ObjectId.isValid(param)) {
    const byId = await Title.findById(param)
    if (byId) return byId
  }
  return Title.findOne({ legacyKey: param })
}

function titleResponse(doc) {
  if (!doc) return null
  const o = doc.toObject ? doc.toObject() : doc
  return {
    ...o,
    titleId: o.legacyKey || o._id.toString(),
  }
}

router.get('/', async (req, res) => {
  const { genre, year, type, q } = req.query
  const filter = {}
  if (genre) filter.genres = genre
  if (year) filter.releaseYear = Number(year)
  if (type === 'Movie' || type === 'Show') filter.type = type
  if (q) {
    filter.$text = { $search: q }
  }
  const titles = await Title.find(filter).sort({ createdAt: -1 }).limit(200)
  res.json(titles.map(titleResponse))
})

router.get('/:id', async (req, res) => {
  const t = await findTitleByIdParam(req.params.id)
  if (!t) return res.status(404).json({ error: 'Title not found' })
  res.json(titleResponse(t))
})

router.post('/', requireAuth, requireContentManager, async (req, res) => {
  try {
    const t = await Title.create(req.body)
    res.status(201).json(titleResponse(t))
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/:id', requireAuth, requireContentManager, async (req, res) => {
  const t = await findTitleByIdParam(req.params.id)
  if (!t) return res.status(404).json({ error: 'Title not found' })
  Object.assign(t, req.body)
  await t.save()
  res.json(titleResponse(t))
})

router.delete('/:id', requireAuth, requireContentManager, async (req, res) => {
  const t = await findTitleByIdParam(req.params.id)
  if (!t) return res.status(404).json({ error: 'Title not found' })
  await t.deleteOne()
  res.status(204).send()
})

export default router
