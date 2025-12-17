import React, { useState } from 'react'
import './styles.css'
import { signup } from '../../utils/auth.js'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function onSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    try {
      const user = signup({ name, email, password })
      setSuccess(`Account created! Welcome, ${user.name}`)
    } catch (err) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div className="auth-page glass">
      <div className="card auth-card">
        <div className="card-header">
          <h2>Sign up</h2>
          <div className="subtext">Create an account to store preferences locally in your browser.</div>
        </div>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button className="btn primary" type="submit">Create account</button>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
        <div className="switch-link">
          Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav:set', { detail: 'login' })) }}>Login</a>
        </div>
      </div>
    </div>
  )
}
