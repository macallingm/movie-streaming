import mongoose from 'mongoose'

const myListSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
)

myListSchema.index({ profileId: 1, titleId: 1 }, { unique: true })

export const MyList = mongoose.model('MyList', myListSchema)
