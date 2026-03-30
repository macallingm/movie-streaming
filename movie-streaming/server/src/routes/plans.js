import { Router } from 'express'
import { SubscriptionPlan } from '../models/SubscriptionPlan.js'

const router = Router()

router.get('/', async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true }).sort({
    monthlyPrice: 1,
  })
  res.json(plans)
})

export default router
