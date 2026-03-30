import { Router } from 'express'
import { Subscription } from '../models/Subscription.js'
import { SubscriptionPlan } from '../models/SubscriptionPlan.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

/** At most one Active subscription per user (business rule). */
router.get('/me', async (req, res) => {
  const sub = await Subscription.findOne({
    userId: req.userId,
    status: 'Active',
  }).populate('planId')
  res.json(sub)
})

router.post('/me', async (req, res) => {
  const { planCode, paymentProvider } = req.body
  if (!planCode) {
    return res.status(400).json({ error: 'planCode is required (e.g. PLAN_PREM)' })
  }
  const plan = await SubscriptionPlan.findOne({ planCode, isActive: true })
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' })
  }
  await Subscription.updateMany(
    { userId: req.userId, status: 'Active' },
    { status: 'Cancelled', cancelAt: new Date() }
  )
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const sub = await Subscription.create({
    userId: req.userId,
    planId: plan._id,
    status: 'Active',
    startDate: new Date(),
    nextBillingDate: nextMonth,
    cancelAt: null,
    paymentProvider: paymentProvider || 'PayPal',
  })
  const populated = await Subscription.findById(sub._id).populate('planId')
  res.status(201).json(populated)
})

router.patch('/me/cancel', async (req, res) => {
  const sub = await Subscription.findOne({
    userId: req.userId,
    status: 'Active',
  })
  if (!sub) return res.status(404).json({ error: 'No active subscription' })
  sub.status = 'Cancelled'
  sub.cancelAt = new Date()
  await sub.save()
  res.json(sub)
})

export default router
