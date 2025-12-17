import React, { useState } from 'react'
import './styles.css'
import { login, getSessionUser } from '../../utils/auth.js'

export default function Login() {
  const existing = getSessionUser()
  const [email, setEmail] = useState(existing?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [show, setShow] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      const user = login({ email, password })
      setSuccess(`Welcome back, ${user.name}`)
      window.dispatchEvent(new Event('session:updated'))
      window.dispatchEvent(new CustomEvent('nav:set', { detail: 'home' }))
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="auth-page glass">
      <div className="card auth-card">
        <div className="card-header">
          <h2>Login</h2>
          <div className="subtext">Access your saved preferences and history across sessions (local browser).</div>
        </div>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-group">
              <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="chip" onClick={() => setShow(s => !s)} aria-label="Toggle password visibility">{show ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn primary" type="submit">Login</button>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
        <div className="switch-link">
          Don&apos;t have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav:set', { detail: 'signup' })) }}>Sign up</a>
        </div>
      </div>
    </div>
  )
}
