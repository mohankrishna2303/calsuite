import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { computeSip } from './logic.js'
import { addHistory, takePrefill } from '../../utils/history.js'

function formatCurrency(value) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
}

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [tenureType, setTenureType] = useState('years')
  const [tenureInput, setTenureInput] = useState('')
  const [investAtStart, setInvestAtStart] = useState(true)

  const tenureMonths = useMemo(() => {
    const v = Number(tenureInput) || 0
    return tenureType === 'years' ? v * 12 : v
  }, [tenureType, tenureInput])

  const { futureValue, invested, gains } = useMemo(() => {
    const mi = Number(monthlyInvestment || 0)
    const r = Number(annualRate || 0)
    return computeSip({ monthlyInvestment: mi, annualRate: r, tenureMonths, investAtStart })
  }, [monthlyInvestment, annualRate, tenureMonths, investAtStart])

  useEffect(() => {
    const pre = takePrefill()
    if (pre && pre.key === 'sip') {
      const inp = pre.inputs || {}
      if (inp.monthlyInvestment != null) setMonthlyInvestment(String(inp.monthlyInvestment))
      if (inp.annualRate != null) setAnnualRate(String(inp.annualRate))
      if (inp.tenureMonths != null) { setTenureType('months'); setTenureInput(String(inp.tenureMonths)) }
      if (typeof inp.investAtStart === 'boolean') setInvestAtStart(!!inp.investAtStart)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const mi = Number(monthlyInvestment || 0)
    const r = Number(annualRate || 0)
    if (mi > 0 && r > 0 && tenureMonths > 0 && Number.isFinite(futureValue) && futureValue > 0) {
      addHistory({ key: 'sip', title: 'SIP Calculator', inputs: { monthlyInvestment: mi, annualRate: r, tenureMonths, investAtStart } })
    }
  }, [monthlyInvestment, annualRate, tenureMonths, investAtStart, futureValue])

  return (
    <div className="sip-calculator">
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Monthly Investment</label>
            <div className="input-group">
              <span>₹</span>
              <input type="number" min="0" step="500" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Expected Annual Return (%)</label>
            <input type="number" min="0" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
          </div>
          <div className="field">
            <label>Tenure</label>
            <div className="row">
              <input style={{width:"75px"}} className ="tenure-input" type="number" min="0" step="1" value={tenureInput} onChange={(e) => setTenureInput(e.target.value)} />
              <select value={tenureType} onChange={(e) => setTenureType(e.target.value)}>
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Invest at start of month</label>
            <select value={investAtStart ? 'yes' : 'no'} onChange={(e) => setInvestAtStart(e.target.value === 'yes')}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div className="results">
          <div className="result">
            <div className="result-label">Future Value</div>
            <div className="result-value highlight">{formatCurrency(futureValue)}</div>
          </div>
          <div className="result">
            <div className="result-label">Total Invested</div>
            <div className="result-value">{formatCurrency(invested)}</div>
          </div>
          <div className="result">
            <div className="result-label">Estimated Gains</div>
            <div className="result-value">{formatCurrency(gains)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
