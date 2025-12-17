// Lightweight calculation history & prefill utilities
// Stores in localStorage under keys:
// - calc_history: array of { key, title, inputs, when }
// - calc_prefill: { key, inputs }

const HISTORY_KEY = 'calc_history'
const PREFILL_KEY = 'calc_prefill'

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addHistory(entry) {
  // entry: { key, title, inputs }
  try {
    const now = new Date().toISOString()
    const prev = getHistory()
    // Deduplicate by same key+inputs (stringified)
    const sig = JSON.stringify({ key: entry.key, inputs: entry.inputs })
    const filtered = prev.filter(e => JSON.stringify({ key: e.key, inputs: e.inputs }) !== sig)
    const next = [{ ...entry, when: now }, ...filtered].slice(0, 20)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {}
}

export function clearHistory() {
  try { localStorage.removeItem(HISTORY_KEY) } catch {}
}

export function setPrefill(payload) {
  // payload: { key, inputs }
  try { localStorage.setItem(PREFILL_KEY, JSON.stringify(payload)) } catch {}
}

export function takePrefill() {
  try {
    const raw = localStorage.getItem(PREFILL_KEY)
    if (!raw) return null
    localStorage.removeItem(PREFILL_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}
