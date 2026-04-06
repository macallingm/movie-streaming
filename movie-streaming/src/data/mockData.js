
export const subscriptionPlans = [
  {
    planId: 'PLAN_BASIC',
    planName: 'Basic',
    monthlyPrice: 9.99,
    maxStreams: 1,
    maxResolution: 'SD',
    isActive: true,
  },
  {
    planId: 'PLAN_STD',
    planName: 'Standard',
    monthlyPrice: 16.99,
    maxStreams: 2,
    maxResolution: '1080p',
    isActive: true,
  },
  {
    planId: 'PLAN_PREM',
    planName: 'Premium',
    monthlyPrice: 24.99,
    maxStreams: 4,
    maxResolution: '4K',
    isActive: true,
  },
]

export const users = [
  {
    userId: 100,
    email: 'macallingm@mymacewan.ca',
    name: 'Mahar Macalling',
    firstName: 'Mahar',
    lastName: 'Macalling',
    phone: '+1-780-555-0100',
    status: 'active',
    lastLoginAt: '2026-03-15T12:00:00Z',
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    userId: 101,
    email: 'jordan.nguyen@example.com',
    name: 'Jordan Nguyen',
    firstName: 'Jordan',
    lastName: 'Nguyen',
    phone: '+1-780-555-0101',
    status: 'active',
    lastLoginAt: '2026-03-14T09:30:00Z',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    userId: 102,
    email: 'suspended@example.com',
    name: 'Suspended User',
    firstName: 'Test',
    lastName: 'Suspended',
    phone: '+1-780-555-0199',
    status: 'suspended',
    lastLoginAt: '2026-01-01T00:00:00Z',
    createdAt: '2025-06-01T00:00:00Z',
  },
]

export const profiles = [
  {
    profileId: 100,
    userId: 100,
    profileName: 'Mahar',
    maturityLevel: 'adult',
    languagePref: 'en',
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    profileId: 101,
    userId: 100,
    profileName: 'Kids',
    maturityLevel: 'kids',
    languagePref: 'en',
    createdAt: '2026-02-11T00:00:00Z',
  },
]

const sampleVideo =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export const titles = [
  {
    titleId: 'T5001',
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
    titleId: 'T5002',
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
    titleId: 'T5003',
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
    titleId: 'T5004',
    titleName: 'Laugh Track',
    type: 'Movie',
    description: 'An awkward stand-up comedian gets one last shot at the big time.',
    releaseYear: 2025,
    maturityRating: 'PG',
    moviePosterUrl: 'https://picsum.photos/seed/t5004/400/600',
    genres: ['Comedy'],
    videoUrl: sampleVideo,
    durationMinutes: 95,
    regionAllow: ['US'],
  },
  {
    titleId: 'T5005',
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
    titleId: 'T5006',
    titleName: 'Little Explorers',
    type: 'Movie',
    description: 'Friendly animals teach letters and numbers on a colorful road trip.',
    releaseYear: 2024,
    maturityRating: 'G',
    moviePosterUrl: 'https://picsum.photos/seed/t5006/400/600',
    genres: ['Family', 'Kids'],
    videoUrl: sampleVideo,
    durationMinutes: 72,
    regionAllow: ['CA', 'US'],
  },
]

export const subscriptions = [
  {
    subscriptionId: 100,
    userId: 100,
    planId: 'PLAN_PREM',
    status: 'Active',
    startDate: '2026-02-01',
    nextBillingDate: '2026-03-01',
    cancelAt: null,
    paymentProvider: 'PayPal',
  },
]

export const invoices = [
  {
    id: 'INV-2026-02',
    userId: 100,
    date: '2026-02-01',
    amount: 24.99,
    status: 'Paid',
    description: 'Premium — monthly',
  },
  {
    id: 'INV-2026-01',
    userId: 100,
    date: '2026-01-01',
    amount: 24.99,
    status: 'Paid',
    description: 'Premium — monthly',
  },
]

/** Initial MyList — ProfileID aligned with example (using profile 100) */
export const initialMyList = [
  {
    myListId: 'ML6001',
    profileId: 100,
    titleId: 'T5001',
    addedAt: '2026-01-10T15:30:00Z',
  },
]

export const initialWatchProgress = [
  {
    progressId: 'WP7001',
    profileId: 100,
    titleId: 'T5001',
    seasonNumber: null,
    episodeNumber: null,
    progressSeconds: 3600,
    completed: false,
    updatedAt: '2026-02-27T10:30:00Z',
  },
]

export function getTitleById(id) {
  return titles.find((t) => t.titleId === id)
}

export function getVideoUrlForTitle(title, seasonNumber, episodeNumber) {
  if (!title) return null
  if (title.type === 'Movie') return title.videoUrl
  const season = title.seasons?.find((s) => s.seasonNumber === seasonNumber)
  const ep = season?.episodes?.find((e) => e.episodeNumber === episodeNumber)
  return ep?.videoUrl ?? title.seasons?.[0]?.episodes?.[0]?.videoUrl ?? null
}

export const adminAnalytics = [
  { genre: 'Action', watchHours: 12400, titlesCount: 12 },
  { genre: 'Drama', watchHours: 9800, titlesCount: 18 },
  { genre: 'Comedy', watchHours: 7600, titlesCount: 9 },
  { genre: 'Sci-Fi', watchHours: 6400, titlesCount: 7 },
]
