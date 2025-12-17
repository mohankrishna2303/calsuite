import React, { useMemo, useState } from 'react'
import './styles.css'

// Ohm's law relationships:
// P = V * I
// V = I * R
// P = I^2 * R
// P = V^2 / R
// Given any two, the rest are determined.
function solveOhms({ P, V, I, R }) {
  const vals = {
    P: Number(P),
    V: Number(V),
    I: Number(I),
    R: Number(R),
  }
  const has = (k) => Number.isFinite(vals[k]) && vals[k] > 0

  let p = has('P') ? vals.P : undefined
  let v = has('V') ? vals.V : undefined
  let i = has('I') ? vals.I : undefined
  let r = has('R') ? vals.R : undefined

  const count = [p, v, i, r].filter(x => typeof x === 'number').length
  if (count < 2) return { P: p || 0, V: v || 0, I: i || 0, R: r || 0 }

  // Prefer using direct pairs first
  // If V and I known
  if (typeof v === 'number' && typeof i === 'number') {
    p = v * i
    r = v / i
  }
  // If V and R known
  else if (typeof v === 'number' && typeof r === 'number') {
    i = v / r
    p = v * i
  }
  // If I and R known
  else if (typeof i === 'number' && typeof r === 'number') {
    v = i * r
    p = v * i
  }
  // If P and V known
  else if (typeof p === 'number' && typeof v === 'number') {
    i = p / v
    r = v / i
  }
  // If P and I known
  else if (typeof p === 'number' && typeof i === 'number') {
    v = p / i
    r = v / i
  }
  // If P and R known
  else if (typeof p === 'number' && typeof r === 'number') {
    i = Math.sqrt(p / r)
    v = i * r
  }

  return {
    P: Number.isFinite(p) ? p : 0,
    V: Number.isFinite(v) ? v : 0,
    I: Number.isFinite(i) ? i : 0,
    R: Number.isFinite(r) ? r : 0,
  }
}

export default function PowerCalculator() {
  const [p, setP] = useState('') // watts
  const [v, setV] = useState('') // volts
  const [i, setI] = useState('') // amps
  const [r, setR] = useState('') // ohms

  const solved = useMemo(() => solveOhms({ P: p || 0, V: v || 0, I: i || 0, R: r || 0 }), [p, v, i, r])

  const clear = () => { setP(''); setV(''); setI(''); setR('') }

  return (
    <div className="power-calculator">
      <div className="card">
        <div className="card-header">
          <h2>Power (Ohm's Law)</h2>
          <div className="subtext">Enter any two values to compute the others. Units: P (W), V (V), I (A), R (Ω).</div>
        </div>
        <div className="form-grid four">
          <div className="field">
            <label>Power (W)</label>
            <input type="number" inputMode="decimal" placeholder="e.g. 60" value={p} onChange={(e) => setP(e.target.value)} />
          </div>
          <div className="field">
            <label>Voltage (V)</label>
            <input type="number" inputMode="decimal" placeholder="e.g. 230" value={v} onChange={(e) => setV(e.target.value)} />
          </div>
          <div className="field">
            <label>Current (A)</label>
            <input type="number" inputMode="decimal" placeholder="e.g. 0.26" value={i} onChange={(e) => setI(e.target.value)} />
          </div>
          <div className="field">
            <label>Resistance (Ω)</label>
            <input type="number" inputMode="decimal" placeholder="e.g. 880" value={r} onChange={(e) => setR(e.target.value)} />
          </div>
        </div>
        <div className="actions-row">
          <button type="button" className="btn clear" onClick={clear}>Clear</button>
        </div>
      </div>

      <div className="results pro">
        <div className="result">
          <div className="result-label">P (W)</div>
          <div className="result-value highlight">{Number.isFinite(solved.P) && solved.P > 0 ? solved.P.toFixed(3) : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">V (V)</div>
          <div className="result-value">{Number.isFinite(solved.V) && solved.V > 0 ? solved.V.toFixed(3) : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">I (A)</div>
          <div className="result-value">{Number.isFinite(solved.I) && solved.I > 0 ? solved.I.toFixed(6) : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">R (Ω)</div>
          <div className="result-value">{Number.isFinite(solved.R) && solved.R > 0 ? solved.R.toFixed(3) : '-'}</div>
        </div>
      </div>
    </div>
  )
}
