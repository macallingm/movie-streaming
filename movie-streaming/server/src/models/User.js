import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    name: { type: String, default: '' },
    phone: { type: String, sparse: true, unique: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    role: {
      type: String,
      enum: ['subscriber', 'content_manager'],
      default: 'subscriber',
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
