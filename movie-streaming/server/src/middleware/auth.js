import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  const token = header.slice(7)
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ error: 'Server missing JWT_SECRET' })
    }
    const payload = jwt.verify(token, secret)
    req.userId = payload.sub
    req.userRole = payload.role ?? 'subscriber'
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireContentManager(req, res, next) {
  if (req.userRole !== 'content_manager') {
    return res.status(403).json({ error: 'Content manager role required' })
  }
  next()
}
