import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDb } from './db.js'
import { SubscriptionPlan } from './models/SubscriptionPlan.js'
import { Title } from './models/Title.js'
import { User } from './models/User.js'
import { Profile } from './models/Profile.js'
import { Subscription } from './models/Subscription.js'
import { MyList } from './models/MyList.js'
import { WatchProgress } from './models/WatchProgress.js'

const sampleVideo =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const PLANS = [
  {
    planCode: 'PLAN_BASIC',
    planName: 'Basic',
    monthlyPrice: 9.99,
    maxStreams: 1,
    maxResolution: 'SD',
    isActive: true,
  },
  {
    planCode: 'PLAN_STD',
    planName: 'Standard',
    monthlyPrice: 16.99,
    maxStreams: 2,
    maxResolution: '1080p',
    isActive: true,
  },
  {
    planCode: 'PLAN_PREM',
    planName: 'Premium',
    monthlyPrice: 24.99,
    maxStreams: 4,
    maxResolution: '4K',
    isActive: true,
  },
]

const TITLES = [
  {
    legacyKey: 'T5001',
    titleName: 'The Great Adventure',
    type: 'Movie',
    description:
      'An epic journey across unknown lands where heroes face impossible odds and discover what truly matters.',
    releaseYear: 2023,
    maturityRating: 'PG',
    moviePosterUrl: 'https://picsum.photos/seed/t5001/400/600',
    genres: ['Action', 'Adventure'],
    videoUrl: sampleVideo,
    durationMinutes: 120,
    regionAllow: ['CA', 'US'],
  },
  {
    legacyKey: 'T5002',
    titleName: 'Neon Nights',
    type: 'Movie',
    description:
      'A detective uncovers a conspiracy in a rain-soaked cyberpunk metropolis.',
    releaseYear: 2024,
    maturityRating: '14A',
    moviePosterUrl: 'https://picsum.photos/seed/t5002/400/600',
    genres: ['Sci-Fi', 'Thriller'],
    videoUrl: sampleVideo,
    durationMinutes: 98,
    regionAllow: ['CA', 'US', 'UK'],
  },
  {
    legacyKey: 'T5003',
    titleName: 'Harbor Lights',
    type: 'Movie',
    description: 'A quiet drama about family, loss, and a small coastal town.',
    releaseYear: 2022,
    maturityRating: 'PG',
    moviePosterUrl: 'https://picsum.photos/seed/t5003/400/600',
    genres: ['Drama'],
    videoUrl: sampleVideo,
    durationMinutes: 112,
    regionAllow: ['CA'],
  },
  {
    legacyKey: 'T5004',
    titleName: 'Laugh Track',
    type: 'Movie',
    description:
      'An awkward stand-up comedian gets one last shot at the big time.',
    releaseYear: 2025,
    maturityRating: 'PG',
    moviePosterUrl: 'https://picsum.photos/seed/t5004/400/600',
    genres: ['Comedy'],
    videoUrl: sampleVideo,
    durationMinutes: 95,
    regionAllow: ['US'],
  },
  {
    legacyKey: 'T5005',
    titleName: 'The Heist Chronicles',
    type: 'Show',
    description:
      'A crew of specialists plans impossible robberies while hiding fractured loyalties.',
    releaseYear: 2021,
    maturityRating: '18+',
    moviePosterUrl: 'https://picsum.photos/seed/t5005/400/600',
    genres: ['Action', 'Crime'],
    regionAllow: ['CA', 'US'],
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            episodeTitle: 'The Plan',
            durationMinutes: 52,
            videoUrl: sampleVideo,
          },
          {
            episodeNumber: 2,
            episodeTitle: 'Inside Job',
            durationMinutes: 49,
            videoUrl: sampleVideo,
          },
        ],
      },
      {
        seasonNumber: 2,
        episodes: [
          {
            episodeNumber: 1,
            episodeTitle: 'New Marks',
            durationMinutes: 51,
            videoUrl: sampleVideo,
          },
        ],
      },
    ],
  },
  {
    legacyKey: 'T5006',
    titleName: 'Little Explorers',
    type: 'Movie',
    description:
      'Friendly animals teach letters and numbers on a colorful road trip.',
    releaseYear: 2024,
    maturityRating: 'G',
    moviePosterUrl: 'https://picsum.photos/seed/t5006/400/600',
    genres: ['Family', 'Kids'],
    videoUrl: sampleVideo,
    durationMinutes: 72,
    regionAllow: ['CA', 'US'],
  },
]

async function seedPlans() {
  for (const p of PLANS) {
    await SubscriptionPlan.findOneAndUpdate(
      { planCode: p.planCode },
      { $set: p },
      { upsert: true, new: true }
    )
  }
  console.log('Seeded subscription plans.')
}

async function seedTitles() {
  const n = await Title.countDocuments()
  if (n > 0) {
    console.log('Titles already present, skipping title seed.')
    return
  }
  await Title.insertMany(TITLES)
  console.log(`Inserted ${TITLES.length} titles.`)
}

async function seedDemoUser() {
  const email = process.env.SEED_DEMO_EMAIL || 'macallingm@mymacewan.ca'
  const password = process.env.SEED_DEMO_PASSWORD || 'password123'
  let user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10)
    user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      firstName: 'Mahar',
      lastName: 'Macalling',
      name: 'Mahar Macalling',
      phone: '+1-780-555-0100',
      status: 'active',
    })
    console.log(`Created demo user ${email} / ${password}`)
  } else {
    console.log(`Demo user ${email} already exists.`)
  }

  let profile = await Profile.findOne({ userId: user._id })
  if (!profile) {
    profile = await Profile.create({
      userId: user._id,
      profileName: 'Mahar',
      maturityLevel: 'adult',
      languagePref: 'en',
    })
    console.log('Created default profile.')
  }

  const prem = await SubscriptionPlan.findOne({ planCode: 'PLAN_PREM' })
  if (prem) {
    const existing = await Subscription.findOne({
      userId: user._id,
      status: 'Active',
    })
    if (!existing) {
      const next = new Date()
      next.setMonth(next.getMonth() + 1)
      await Subscription.create({
        userId: user._id,
        planId: prem._id,
        status: 'Active',
        startDate: new Date(),
        nextBillingDate: next,
        paymentProvider: 'PayPal',
      })
      console.log('Attached Premium subscription to demo user.')
    }
  }

  const t1 = await Title.findOne({ legacyKey: 'T5001' })
  if (t1 && profile) {
    await MyList.findOneAndUpdate(
      { profileId: profile._id, titleId: t1._id },
      { profileId: profile._id, titleId: t1._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    await WatchProgress.findOneAndUpdate(
      {
        profileId: profile._id,
        titleId: t1._id,
        seasonNumber: null,
        episodeNumber: null,
      },
      {
        $set: {
          progressSeconds: 3600,
          completed: false,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    )
    console.log('Seeded MyList + WatchProgress for T5001.')
  }
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) return
  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.log('Admin user already exists:', email)
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)
  await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name: 'Content Manager',
    role: 'content_manager',
    status: 'active',
  })
  console.log(`Created content_manager ${email}`)
}

async function main() {
  await connectDb()
  await seedPlans()
  await seedTitles()
  await seedAdminUser()
  if (process.env.SEED_DEMO_USER === 'true') {
    await seedDemoUser()
  }
  await mongoose.disconnect()
  console.log('Seed complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
