import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiPost } from '../services/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await apiPost('/api/auth/forgot-password', { email: email.trim() })
      setDone(true)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot password</h1>
        {done ? (
          <>
            <p className="muted small">
              If an account exists for that email, we sent a message with a
              link to reset your password. The link expires in one hour.
            </p>
            <p className="auth-footer" style={{ marginTop: '1.25rem' }}>
              <Link to="/signin">Back to Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <p className="muted small">
              Enter the <strong>email</strong> for your StreamLab account. We
              will send a reset link if an account exists.
            </p>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Send reset link'}
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
