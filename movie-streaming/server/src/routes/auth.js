import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import twilio from 'twilio'
import { User } from '../models/User.js'
import { Profile } from '../models/Profile.js'
import { requireAuth } from '../middleware/auth.js'
import {
  createDeviceCode,
  redeemDeviceCode,
} from '../deviceCodes.js'
import { issueOtp, verifyOtp } from '../otpCodes.js'

const router = Router()

function normalizePhone(input) {
  return String(input || '').replace(/[^\d+]/g, '')
}

function maskEmail(email) {
  const [local, domain] = String(email || '').split('@')
  if (!local || !domain) return 'email'
  const prefix = local.slice(0, 2)
  return `${prefix}***@${domain}`
}

function maskPhone(phone) {
  const raw = String(phone || '')
  if (raw.length < 4) return 'phone'
  return `***${raw.slice(-4)}`
}

function canSendSms() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      (process.env.TWILIO_AUTH_TOKEN ||
        (process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET)) &&
      (process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.TWILIO_FROM_NUMBER)
  )
}

async function sendSmsCode(phoneE164, code) {
  const client = process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : twilio(
        process.env.TWILIO_API_KEY_SID,
        process.env.TWILIO_API_KEY_SECRET,
        { accountSid: process.env.TWILIO_ACCOUNT_SID }
      )
  const payload = {
    body: `Your StreamLab sign-in code is ${code}. It expires in 10 minutes.`,
    to: phoneE164,
  }
  if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
    payload.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID
  } else {
    payload.from = process.env.TWILIO_FROM_NUMBER
  }
  await client.messages.create(payload)
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

router.post('/register', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server missing JWT_SECRET' })
    }
    const { email, password, firstName, lastName, name, phone } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const displayName =
      name ||
      [firstName, lastName].filter(Boolean).join(' ') ||
      email.split('@')[0]
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      name: displayName,
      phone: phone ? normalizePhone(phone) : undefined,
    })
    await Profile.create({
      userId: user._id,
      profileName: displayName || 'Profile 1',
      maturityLevel: 'adult',
      languagePref: 'en',
    })
    const token = signToken(user)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server missing JWT_SECRET' })
    }
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    user.lastLoginAt = new Date()
    await user.save()
    const token = signToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load user' })
  }
})

/** Create a 6-digit code (signed-in user) — redeem on another browser via POST /device-code/redeem */
router.post('/device-code', requireAuth, (req, res) => {
  try {
    const code = createDeviceCode(req.userId)
    res.json({ code, expiresInSeconds: 600 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not create code' })
  }
})

router.post('/device-code/redeem', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server missing JWT_SECRET' })
    }
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ error: 'code is required' })
    }
    const userId = redeemDeviceCode(code)
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    user.lastLoginAt = new Date()
    await user.save()
    const token = signToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not redeem code' })
  }
})

router.post('/otp/request', async (req, res) => {
  try {
    const identifierRaw = String(req.body?.identifier || '').trim()
    if (!identifierRaw) {
      return res.status(400).json({ error: 'identifier is required' })
    }
    const isEmail = identifierRaw.includes('@')
    const email = isEmail ? identifierRaw.toLowerCase() : null
    const phone = isEmail ? null : normalizePhone(identifierRaw)
    const user = await User.findOne(
      isEmail
        ? { email }
        : {
            $or: [
              { phone: identifierRaw },
              { phone },
            ],
          }
    )

    // Always return success-looking response to reduce account enumeration risk.
    if (!user) {
      return res.json({
        ok: true,
        channel: isEmail ? 'email' : 'phone',
        message: 'If the account exists, a sign-in code was sent.',
      })
    }

    const otpIdentifier = isEmail ? email : phone
    const otp = issueOtp(otpIdentifier, user._id)
    if (!otp) {
      return res.status(400).json({ error: 'Could not generate OTP' })
    }

    const masked = isEmail ? maskEmail(email) : maskPhone(phone || identifierRaw)
    if (isEmail) {
      // Email provider not configured yet; keep dev log fallback.
      console.log(`[OTP] Email ${otp.code} to ${masked} (user ${user._id})`)
    } else if (canSendSms()) {
      try {
        await sendSmsCode(phone, otp.code)
      } catch (sendErr) {
        console.error(sendErr)
        return res.status(502).json({ error: 'Could not send SMS code' })
      }
    } else {
      // Fallback for local dev when Twilio env vars are missing.
      console.log(`[OTP] SMS ${otp.code} to ${masked} (user ${user._id})`)
    }

    const payload = {
      ok: true,
      channel: isEmail ? 'email' : 'phone',
      to: masked,
      expiresInSeconds: otp.expiresInSeconds,
      message: 'If the account exists, a sign-in code was sent.',
    }
    if (process.env.OTP_DEV_ECHO === 'true') {
      payload.devCode = otp.code
    }
    return res.json(payload)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not request sign-in code' })
  }
})

router.post('/otp/verify', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server missing JWT_SECRET' })
    }
    const identifier = String(req.body?.identifier || '').trim()
    const code = String(req.body?.code || '').replace(/\D/g, '')
    if (!identifier || code.length !== 6) {
      return res.status(400).json({ error: 'identifier and 6-digit code are required' })
    }
    const verifyIdentifier = identifier.includes('@')
      ? identifier.toLowerCase()
      : normalizePhone(identifier)
    const userId = verifyOtp(verifyIdentifier, code)
    if (!userId) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    user.lastLoginAt = new Date()
    await user.save()
    const token = signToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not verify sign-in code' })
  }
})

export default router
