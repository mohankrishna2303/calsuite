import React, { useMemo, useState } from 'react'
import './styles.css'
import { computeSimpleInterest } from './logic.js'

function formatCurrency(value) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
}

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [months, setMonths] = useState('')
  const [days, setDays] = useState('')
  const [monthsPerYear, setMonthsPerYear] = useState(24)
  

  const { si, total } = useMemo(() => {
    const p = Number(principal || 0)
    const r = Number(annualRate || 0)
    const m = Number(months || 0)
    const d = Number(days || 0)
    return computeSimpleInterest({ principal: p, annualRate: r, years: 0, months: m, days: d, monthsPerYear })
  }, [principal, annualRate, months, days, monthsPerYear])

  

  return (
    <div className="si-calculator">
      <div className="card">
        <div className="card-header">
          <h2>Simple Interest</h2>
          <div className="subtext">Compute simple interest and total amount using months/days with a custom months-per-year basis.</div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Principal</label>
            <div className="input-group">
              <span>₹</span>
              <input  style={{width:"100px"}} type="number" min="0" step="1000" placeholder="Enter principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Annual Rate (%)</label>
            <input type="number" min="0" step="0.1" placeholder="e.g. 10" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
          </div>
          <div className="field">
            <label>Additional Months</label>
            <input type="number" min="0" step="1" placeholder="0" value={months} onChange={(e) => setMonths(e.target.value)} />
          </div>
          <div className="field">
            <label>Additional Days</label>
            <input type="number" min="0" step="1" placeholder="0" value={days} onChange={(e) => setDays(e.target.value)} />
          </div>
          <div className="field">
            <label>Months per Year (basis)</label>
            <input type="number" min="1" step="1" placeholder="10" value={monthsPerYear} onChange={(e) => setMonthsPerYear(Number(e.target.value || 12))} />
          </div>
        </div>
        
      </div>

      <div className="results pro">
        <div className="result">
          <div className="result-label">Simple Interest</div>
          <div className="result-value highlight">{formatCurrency(si)}</div>
        </div>
        <div className="result">
          <div className="result-label">Total Amount</div>
          <div className="result-value">{formatCurrency(total)}</div>
        </div>
      </div>

      
    </div>
  )
}
