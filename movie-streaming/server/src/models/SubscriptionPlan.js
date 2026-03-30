import mongoose from 'mongoose'

const subscriptionPlanSchema = new mongoose.Schema(
  {
    planCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    planName: { type: String, required: true },
    monthlyPrice: { type: Number, required: true },
    maxStreams: { type: Number, required: true },
    maxResolution: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const SubscriptionPlan = mongoose.model(
  'SubscriptionPlan',
  subscriptionPlanSchema
)
