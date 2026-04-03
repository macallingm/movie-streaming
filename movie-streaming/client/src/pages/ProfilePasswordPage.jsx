import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function ProfilePasswordPage() {
  const { user, updatePassword } = useApp()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(currentPassword, newPassword)
      setSuccess('Your password was updated.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Could not update password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="profile-section">
      <header className="page-header profile-section__header">
        <h1>Update password</h1>
        <p className="muted">
          Change the password for <strong>{user?.email}</strong>. Use a strong
          password you do not reuse elsewhere.
        </p>
      </header>

      <section className="panel profile-password-panel">
        <form className="auth-form profile-password-form" onSubmit={handleSubmit}>
          <label>
            Current password
            <input
              type="password"
              name="currentPassword"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            New password
            <input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="api-banner api-banner--info">{success}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}
