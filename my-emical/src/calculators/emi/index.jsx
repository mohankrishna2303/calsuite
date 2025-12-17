import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { computeEmi } from './logic.js'
import { addHistory, takePrefill } from '../../utils/history.js'

function formatCurrency(value) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [tenureType, setTenureType] = useState('years')
  const [tenureInput, setTenureInput] = useState('')

  const tenureMonths = useMemo(() => {
    const v = Number(tenureInput) || 0
    return tenureType === 'years' ? v * 12 : v
  }, [tenureType, tenureInput])

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const p = Number(principal || 0)
    const r = Number(annualRate || 0)
    return computeEmi({ principal: p, annualRate: r, tenureMonths })
  }, [principal, annualRate, tenureMonths])

  useEffect(() => {
    const pre = takePrefill()
    if (pre && pre.key === 'emi') {
      const inp = pre.inputs || {}
      if (inp.principal != null) setPrincipal(String(inp.principal))
      if (inp.annualRate != null) setAnnualRate(String(inp.annualRate))
      if (inp.tenureMonths != null) { setTenureType('months'); setTenureInput(String(inp.tenureMonths)) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const p = Number(principal || 0)
    const r = Number(annualRate || 0)
    if (p > 0 && r > 0 && tenureMonths > 0 && Number.isFinite(emi) && emi > 0) {
      addHistory({ key: 'emi', title: 'EMI Calculator', inputs: { principal: p, annualRate: r, tenureMonths } })
    }
  }, [principal, annualRate, tenureMonths, emi])

  return (
    <div className="emi-calculator">
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Loan Amount</label>
            <div className="input-group">
              <span>₹</span>
              <input type="number" inputMode="decimal" min="0" step="1000" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Enter amount" />
            </div>
          </div>

          <div className="field">
            <label>Interest Rate (%)</label>
            <input type="number" inputMode="decimal" min="0" step="0.05" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} placeholder="e.g. 8.5" />
          </div>

          <div className="field">
            <label>Loan Tenure</label>
            <div className="row">
              <input className="tenure-input" type="number" inputMode="numeric" min="0" value={tenureInput} onChange={(e) => setTenureInput(e.target.value)} placeholder="Duration" />
              <select value={tenureType} onChange={(e) => setTenureType(e.target.value)}>
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>
        
      </div>

      <div className="results">
        <div className="result">
          <div className="result-label">Monthly EMI</div>
          <div className="result-value highlight">{formatCurrency(emi)}</div>
        </div>
        <div className="result">
          <div className="result-label">Total Interest</div>
          <div className="result-value">{formatCurrency(totalInterest)}</div>
        </div>
        <div className="result">
          <div className="result-label">Total Payment</div>
          <div className="result-value">{formatCurrency(totalPayment)}</div>
        </div>
      </div>
    </div>
  )
}
