import { useState } from 'react'

export function SignInCodeModal({
  open,
  onClose,
  onRequestCode,
  onSubmitCode,
  submitting,
  requestSubmitting,
  error,
  info,
  devCode,
}) {
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')

  if (!open) return null

  const handleVerifySubmit = async (e) => {
    e.preventDefault()
    await onSubmitCode(identifier.trim(), code.replace(/\D/g, ''))
  }

  const handleRequestCode = async () => {
    await onRequestCode(identifier.trim())
  }

  return (
    <div
      className="auth-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="auth-modal"
        role="dialog"
        aria-labelledby="signin-code-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="signin-code-title">Use a sign-in code</h2>
        <p className="muted small">
          Enter your account email or phone to request a 6-digit sign-in code.
        </p>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {info && <p className="muted small">{info}</p>}
        {devCode && (
          <p className="muted small">
            Dev code: <code>{devCode}</code>
          </p>
        )}
        <form onSubmit={handleVerifySubmit} className="auth-form">
          <label>
            Email or phone
            <input
              type="text"
              autoComplete="username"
              placeholder="you@example.com or +1..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            disabled={requestSubmitting || !identifier.trim()}
            onClick={handleRequestCode}
          >
            {requestSubmitting ? 'Sending code…' : 'Send sign-in code'}
          </button>
          <label>
            Code
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={
              submitting ||
              !identifier.trim() ||
              code.replace(/\D/g, '').length !== 6
            }
          >
            {submitting ? 'Signing in…' : 'Continue'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={onClose}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  )
}
