import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileName: { type: String, required: true, trim: true },
    maturityLevel: {
      type: String,
      enum: ['kids', 'adult'],
      default: 'adult',
    },
    languagePref: { type: String, default: 'en' },
  },
  { timestamps: true }
)

export const Profile = mongoose.model('Profile', profileSchema)
