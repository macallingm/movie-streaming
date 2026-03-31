/** In-memory short-lived codes for TV / second-device sign-in (redeem on auth pages). */
const store = new Map()
const TTL_MS = 10 * 60 * 1000

function randomSixDigits() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function createDeviceCode(userId) {
  const uid = String(userId)
  for (let i = 0; i < 20; i++) {
    const code = randomSixDigits()
    if (!store.has(code)) {
      store.set(code, { userId: uid, exp: Date.now() + TTL_MS })
      return code
    }
  }
  throw new Error('Could not generate code')
}

export function redeemDeviceCode(raw) {
  const code = String(raw ?? '').replace(/\D/g, '')
  if (code.length !== 6) return null
  const entry = store.get(code)
  if (!entry || Date.now() > entry.exp) {
    if (entry) store.delete(code)
    return null
  }
  store.delete(code)
  return entry.userId
}
