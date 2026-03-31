import bcrypt from 'bcryptjs'
import { User } from './models/User.js'
import { Profile } from './models/Profile.js'

const GROUP_ADMIN = {
  email: 'admin@streamlab.ca',
  password: 'Admin#123123',
  name: 'StreamLab Admin',
}

export async function ensureGroupAdminAccount() {
  const email = GROUP_ADMIN.email.toLowerCase()
  const passwordHash = await bcrypt.hash(GROUP_ADMIN.password, 10)
  const user = await User.findOneAndUpdate(
    { email },
    {
      email,
      name: GROUP_ADMIN.name,
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
