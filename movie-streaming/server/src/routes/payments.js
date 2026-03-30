import { Router } from 'express'
import { Payment } from '../models/Payment.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/me', async (req, res) => {
  const list = await Payment.find({ userId: req.userId }).sort({ paidAt: -1 })
  res.json(list)
})

export default router
