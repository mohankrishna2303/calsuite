import React, { useMemo, useState } from 'react'
import './styles.css'
import { computeCompoundInterest } from './logic.js'

function formatCurrency(value) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [months, setMonths] = useState('')
  const [days, setDays] = useState('')
  const [monthsPerYear, setMonthsPerYear] = useState(1)
  const [compoundsPerYear, setCompoundsPerYear] = useState('')

  const { amount, interest } = useMemo(() => {
    const p = Number(principal || 0)
    const r = Number(annualRate || 0)
    const m = Number(months || 0)
    const d = Number(days || 0)
    const cpy = Number(compoundsPerYear || 0)
    return computeCompoundInterest({ principal: p, annualRate: r, years: 0, months: m, days: d, monthsPerYear, compoundsPerYear: cpy })
  }, [principal, annualRate, months, days, monthsPerYear, compoundsPerYear])

  return (
    <div className="ci-calculator">
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Principal Amount</label>
            <div className="input-group">
              <span>₹</span>
              <input type="number" min="0" step="1000" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Enter amount" />
            </div>
          </div>
          <div className="field">
            <label>Annual Rate (%)</label>
            <input type="number" min="0" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} placeholder="e.g. 7.5" />
          </div>
          <div className="field">
            <label>Duration (Months)</label>
            <input type="number" min="0" step="1" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="Months" />
          </div>
          <div className="field">
            <label>Additional Days</label>
            <input type="number" min="0" step="1" value={days} onChange={(e) => setDays(e.target.value)} placeholder="Days" />
          </div>
          <div className="field">
            <label>Months/Year Basis</label>
            <input type="number" min="1" step="1" value={monthsPerYear} onChange={(e) => setMonthsPerYear(Number(e.target.value || 12))} placeholder="12 or 24" />
          </div>
          <div className="field">
            <label>Compounds/Year</label>
            <input type="number" min="1" step="1" value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(e.target.value)} placeholder="e.g. 12" />
          </div>
        </div>
      </div>

      <div className="results">
        <div className="result">
          <div className="result-label">Maturity Amount</div>
          <div className="result-value highlight">{formatCurrency(amount)}</div>
        </div>
        <div className="result">
          <div className="result-label">Total Interest</div>
          <div className="result-value">{formatCurrency(interest)}</div>
        </div>
      </div>
    </div>
  )
}
