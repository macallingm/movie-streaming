import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiPost } from '../services/api'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() || '', [searchParams])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      await apiPost('/api/auth/reset-password', {
        token,
        newPassword: password,
      })
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not reset password')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Reset password</h1>
          <p className="muted small">
            This link is missing a token. Open the link from your email, or
            request a new reset from Sign in.
          </p>
          <p className="auth-footer" style={{ marginTop: '1.25rem' }}>
            <Link to="/forgot-password">Forgot password</Link>
            {' · '}
            <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Choose a new password</h1>
        {done ? (
          <>
            <p className="muted small">
              Your password was updated. You can sign in with the new one.
            </p>
            <p className="auth-footer" style={{ marginTop: '1.25rem' }}>
              <Link to="/signin" className="btn btn-primary">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="muted small">Use at least 8 characters.</p>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                />
              </label>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Update password'}
              </button>
            </form>
            <p className="auth-footer">
              <Link to="/signin">Back to Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
