import mongoose from 'mongoose'

const watchProgressSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    titleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Title',
      required: true,
      index: true,
    },
    seasonNumber: { type: Number, default: null },
    episodeNumber: { type: Number, default: null },
    progressSeconds: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

watchProgressSchema.index(
  { profileId: 1, titleId: 1, seasonNumber: 1, episodeNumber: 1 },
  { unique: true }
)

export const WatchProgress = mongoose.model('WatchProgress', watchProgressSchema)
