import mongoose from 'mongoose'

const episodeSchema = new mongoose.Schema(
  {
    episodeNumber: { type: Number, required: true },
    episodeTitle: { type: String, default: '' },
    durationMinutes: { type: Number },
    videoUrl: { type: String, default: '' },
  },
  { _id: false }
)

const seasonSchema = new mongoose.Schema(
  {
    seasonNumber: { type: Number, required: true },
    episodes: { type: [episodeSchema], default: [] },
  },
  { _id: false }
)

const titleSchema = new mongoose.Schema(
  {
    /** Optional stable id for URLs / migration from mock data (e.g. T5001). */
    legacyKey: { type: String, sparse: true, unique: true, trim: true },
    titleName: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Movie', 'Show'], required: true },
    description: { type: String, default: '' },
    releaseYear: { type: Number },
    maturityRating: { type: String, default: 'PG' },
    moviePosterUrl: { type: String, default: '' },
    genres: { type: [String], default: [] },
    regionAllow: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    durationMinutes: { type: Number },
    seasons: { type: [seasonSchema], default: [] },
  },
  { timestamps: true }
)

titleSchema.index({ titleName: 'text', description: 'text' })

export const Title = mongoose.model('Title', titleSchema)
