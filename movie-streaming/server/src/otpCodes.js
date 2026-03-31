const otpStore = new Map()
const TTL_MS = 10 * 60 * 1000

function keyForIdentifier(identifier) {
  return String(identifier || '').trim().toLowerCase()
}

function randomSixDigits() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function issueOtp(identifier, userId) {
  const key = keyForIdentifier(identifier)
  if (!key) return null
  const code = randomSixDigits()
  otpStore.set(key, {
    userId: String(userId),
    code,
    exp: Date.now() + TTL_MS,
    attempts: 0,
  })
  return { code, expiresInSeconds: Math.floor(TTL_MS / 1000) }
}

export function verifyOtp(identifier, candidateCode) {
  const key = keyForIdentifier(identifier)
  const entry = otpStore.get(key)
  if (!entry) return null
  if (Date.now() > entry.exp) {
    otpStore.delete(key)
    return null
  }
  entry.attempts += 1
  if (entry.attempts > 6) {
    otpStore.delete(key)
    return null
  }
  if (String(candidateCode || '').trim() !== entry.code) {
    return null
  }
  otpStore.delete(key)
  return entry.userId
}
