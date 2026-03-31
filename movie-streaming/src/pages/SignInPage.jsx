import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { SignInCodeModal } from '../components/SignInCodeModal'

export function SignInPage() {
  const {
    signIn,
    requestEmailPhoneSignInCode,
    signInWithEmailPhoneCode,
    signInWithCode,
    signedIn,
  } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [_remember, setRemember] = useState(true)
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
    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Sign in failed')
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
    const result = identifier
      ? await signInWithEmailPhoneCode(identifier, code)
      : await signInWithCode(code)
    setCodeSubmitting(false)
    if (result.ok) {
      setCodeOpen(false)
      navigate(from, { replace: true })
    } else {
      setCodeError(
        result.error ||
          'Invalid code. For profile-generated device codes, leave Email or phone blank.'
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="muted small">
          Use the email and password for your account. New users can{' '}
          <Link to="/signup">create an account</Link>. Seed demo (if used):{' '}
          <code>password123</code>.
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
          New to StreamLab? <Link to="/signup">Sign up now</Link>
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
