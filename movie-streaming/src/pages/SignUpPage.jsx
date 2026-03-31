import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { SignInCodeModal } from '../components/SignInCodeModal'

export function SignUpPage() {
  const {
    signUp,
    requestEmailPhoneSignInCode,
    signInWithEmailPhoneCode,
    signedIn,
  } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [codeSubmitting, setCodeSubmitting] = useState(false)
  const [codeRequestSubmitting, setCodeRequestSubmitting] = useState(false)
  const [codeInfo, setCodeInfo] = useState('')
  const [codeDev, setCodeDev] = useState('')

  useEffect(() => {
    if (signedIn) navigate(from, { replace: true })
  }, [signedIn, from, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setSubmitting(true)
    const result = await signUp(email, password, {
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
    })
    setSubmitting(false)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Sign up failed')
    }
  }

  const handleCodeRequest = async (identifier) => {
    setCodeError('')
    setCodeInfo('')
    setCodeDev('')
    if (!identifier) {
      setCodeError('Email or phone is required')
      return
    }
    setCodeRequestSubmitting(true)
    try {
      const data = await requestEmailPhoneSignInCode(identifier)
      setCodeInfo(data?.message || 'If the account exists, a sign-in code was sent.')
      if (data?.devCode) setCodeDev(data.devCode)
    } catch (e) {
      setCodeError(e.message || 'Could not request sign-in code')
    } finally {
      setCodeRequestSubmitting(false)
    }
  }

  const handleCodeSubmit = async (identifier, code) => {
    setCodeError('')
    setCodeInfo('')
    setCodeSubmitting(true)
    const result = await signInWithEmailPhoneCode(identifier, code)
    setCodeSubmitting(false)
    if (result.ok) {
      setCodeOpen(false)
      navigate(from, { replace: true })
    } else {
      setCodeError(result.error || 'Invalid code')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign up</h1>
        <p className="muted small">
          Create a subscriber account. You get your own profiles, watchlist, and
          progress. Admin tools are only for content managers.
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
          <label>
            Phone number
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 587 000 0000"
              required
            />
          </label>
          <label>
            Display name (optional)
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            Password
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
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={() => {
              setCodeError('')
              setCodeInfo('')
              setCodeDev('')
              setCodeOpen(true)
            }}
          >
            Use a sign-in code
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
        <p className="auth-footer">
          <Link to="/subscribe">Start a subscription</Link>
        </p>
      </div>
      <SignInCodeModal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        onRequestCode={handleCodeRequest}
        onSubmitCode={handleCodeSubmit}
        submitting={codeSubmitting}
        requestSubmitting={codeRequestSubmitting}
        error={codeError}
        info={codeInfo}
        devCode={codeDev}
      />
    </div>
  )
}
