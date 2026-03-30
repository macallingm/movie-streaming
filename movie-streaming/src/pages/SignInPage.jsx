import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export function SignInPage() {
  const { signIn, signedIn } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('macallingm@mymacewan.ca')
  const [password, setPassword] = useState('password123')
  const [_remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (signedIn) navigate(from, { replace: true })
  }, [signedIn, from, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Sign in failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="muted small">
          Use your account from the API (e.g. seed demo user). Default demo
          password after seed is <code>password123</code> unless you changed
          it.
        </p>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email or phone
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label className="filter-check">
            <input
              type="checkbox"
              checked={_remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <button type="button" className="btn btn-secondary btn-block">
            Use a sign-in code
          </button>
        </form>
        <p className="auth-footer">
          <Link to="/subscribe">Start a subscription</Link>
        </p>
      </div>
    </div>
  )
}
