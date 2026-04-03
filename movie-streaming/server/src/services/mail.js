import nodemailer from 'nodemailer'

function looksLikePlaceholderSmtp() {
  const user = (process.env.SMTP_USER || '').trim().toLowerCase()
  const pass = (process.env.SMTP_PASS || '').trim().toLowerCase()
  if (!user || !pass) return true
  if (user.includes('your-smtp-user') || user.endsWith('@example.com')) return true
  if (
    pass.includes('your-smtp-password') ||
    pass.includes('your-app-password') ||
    pass === 'changeme'
  ) {
    return true
  }
  return false
}

/**
 * Resolves nodemailer `from` (string or { name, address }).
 * - If EMAIL_FROM is set, it wins (full "Name <addr>" string).
 * - Else: EMAIL_FROM_NAME (default StreamLab) + EMAIL_FROM_ADDRESS, or SMTP_USER as address.
 */
export function getMailFrom() {
  const full = (process.env.EMAIL_FROM || '').trim()
  if (full) return full
  const name = (process.env.EMAIL_FROM_NAME || 'StreamLab').trim() || 'StreamLab'
  const address = (
    process.env.EMAIL_FROM_ADDRESS ||
    process.env.SMTP_USER ||
    ''
  ).trim()
  if (!address) return null
  return { name, address }
}

/**
 * True when SMTP is set with real-looking credentials (not template placeholders).
 */
export function isEmailTransportConfigured() {
  const host = (process.env.SMTP_HOST || '').trim()
  if (!host || looksLikePlaceholderSmtp()) return false
  return Boolean(getMailFrom())
}

let transporter = null

function getTransporter() {
  if (!isEmailTransportConfigured()) return null
  if (transporter) return transporter
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || '',
    },
  })
  return transporter
}

/**
 * Send 6-digit sign-in code to the user's email.
 * @param {string} to - recipient email
 * @param {string} code
 */
export async function sendSignInCodeEmail(to, code) {
  const t = getTransporter()
  if (!t) {
    throw new Error('Email transport not configured')
  }
  const from = getMailFrom()
  await t.sendMail({
    from,
    to,
    subject: 'Your StreamLab sign-in code',
    text: `Your StreamLab sign-in code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your StreamLab sign-in code is <strong style="font-size:1.25em;letter-spacing:0.08em">${code}</strong>.</p><p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
  })
}

/**
 * @param {string} to - recipient email
 * @param {string} resetUrl - full URL with token query param
 */
export async function sendPasswordResetEmail(to, resetUrl) {
  const t = getTransporter()
  if (!t) {
    throw new Error('Email transport not configured')
  }
  const from = getMailFrom()
  await t.sendMail({
    from,
    to,
    subject: 'Reset your StreamLab password',
    text: `Reset your password by opening this link (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Reset your StreamLab password using the button below. This link expires in <strong>1 hour</strong>.</p><p><a href="${resetUrl}" style="display:inline-block;padding:0.65rem 1.2rem;background:#e50914;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Reset password</a></p><p style="word-break:break-all;font-size:0.85rem;color:#666">Or copy: ${resetUrl}</p><p>If you did not request this, you can ignore this email.</p>`,
  })
}
