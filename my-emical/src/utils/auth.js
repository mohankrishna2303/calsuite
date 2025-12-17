// Simple localStorage-based auth (demo only)
const USERS_KEY = 'app_users'
const SESSION_KEY = 'app_session_user'

export function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
export function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch {}
}
export function getSessionUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null }
}
export function setSessionUser(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)) } catch {}
}
export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

export function signup({ name, email, password }) {
  const users = loadUsers()
  if (!name || !email || !password) throw new Error('All fields are required')
  if (users.find(u => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw new Error('Email already registered')
  }
  const user = { id: crypto?.randomUUID?.() || String(Date.now()), name, email, password }
  users.push(user)
  saveUsers(users)
  setSessionUser({ id: user.id, name: user.name, email: user.email })
  return { id: user.id, name: user.name, email: user.email }
}

export function login({ email, password }) {
  const users = loadUsers()
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  setSessionUser({ id: user.id, name: user.name, email: user.email })
  return { id: user.id, name: user.name, email: user.email }
}

export function logout() {
  clearSession()
}
