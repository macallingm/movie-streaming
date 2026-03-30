import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Cancelled'],
      default: 'Active',
    },
    startDate: { type: Date, default: Date.now },
    nextBillingDate: { type: Date },
    cancelAt: { type: Date, default: null },
    paymentProvider: { type: String, default: 'PayPal' },
  },
  { timestamps: true }
)

subscriptionSchema.index({ userId: 1, status: 1 })

export const Subscription = mongoose.model('Subscription', subscriptionSchema)
