import bcrypt from 'bcryptjs'
import { User } from './models/User.js'
import { Profile } from './models/Profile.js'

export async function ensureGroupAdminAccount() {
  const email = String(
    process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@streamlab.ca'
  ).toLowerCase()
  const password = String(
    process.env.ADMIN_BOOTSTRAP_PASSWORD || 'change-me-in-env'
  )
  const name = String(
    process.env.ADMIN_BOOTSTRAP_NAME || 'StreamLab Admin'
  )
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.findOneAndUpdate(
    { email },
    {
      email,
      name,
      firstName: 'StreamLab',
      lastName: 'Admin',
      role: 'content_manager',
      status: 'active',
      passwordHash,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  const existingProfile = await Profile.findOne({ userId: user._id })
  if (!existingProfile) {
    await Profile.create({
      userId: user._id,
      profileName: 'Admin',
      maturityLevel: 'adult',
      languagePref: 'en',
    })
  }
}
