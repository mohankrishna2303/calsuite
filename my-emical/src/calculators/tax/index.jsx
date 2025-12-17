import React, { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { computeProgressiveTax } from './logic.js'
import { addHistory, takePrefill } from '../../utils/history.js'

function formatCurrency(value) {
  if (!Number.isFinite(value)) return '-'
  return value.toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
}

export default function TaxCalculator() {
  const [income, setIncome] = useState('')
  const [deductions, setDeductions] = useState('')

  const { tax, taxable, effectiveRate, baseTax, surcharge, surchargeRate, cess, breakdown } = useMemo(() => {
    const inc = Number(income || 0)
    const ded = Number(deductions || 0)
    return computeProgressiveTax({ income: inc, deductions: ded })
  }, [income, deductions])

  useEffect(() => {
    const pre = takePrefill()
    if (pre && pre.key === 'tax') {
      const inp = pre.inputs || {}
      if (inp.income != null) setIncome(String(inp.income))
      if (inp.deductions != null) setDeductions(String(inp.deductions))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const inc = Number(income || 0)
    if (inc > 0 && Number.isFinite(tax) && tax >= 0) {
      addHistory({ key: 'tax', title: 'Tax', inputs: { income: inc, deductions: Number(deductions || 0) } })
    }
  }, [income, deductions, tax])

  return (
    <div className="tax-calculator">
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Annual Income (₹)</label>
            <div className="input-group">
              <span>₹</span>
              <input   style={{width:"400px"}}type="number" min="0" step="1000" value={income} onChange={(e) => setIncome(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Total Deductions (₹)</label>
            <div className="input-group">
              <span>₹</span>
              <input type="number" min="0" step="500" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
            </div>
          </div>
        </div>
        
      </div>

      <div className="results">
        <div className="result">
          <div className="result-label">Taxable Income</div>
          <div className="result-value">{formatCurrency(taxable)}</div>
        </div>
        <div className="result">
          <div className="result-label">Estimated Tax</div>
          <div className="result-value highlight">{formatCurrency(tax)}</div>
        </div>
        <div className="result">
          <div className="result-label">Effective Rate</div>
          <div className="result-value">{Number.isFinite(effectiveRate) ? (effectiveRate * 100).toFixed(2) + '%' : '-'}</div>
        </div>
      </div>

      <div className="card">
        <h3>Tax Breakdown</h3>
        <div className="form-grid">
          <div className="field">
            <label>Base Tax</label>
            <div>{formatCurrency(baseTax)}</div>
          </div>
          <div className="field">
            <label>Surcharge {Number.isFinite(surchargeRate) && surchargeRate > 0 ? `(${(surchargeRate * 100).toFixed(0)}%)` : ''}</label>
            <div>{formatCurrency(surcharge)}</div>
          </div>
          <div className="field">
            <label>Cess (4%)</label>
            <div>{formatCurrency(cess)}</div>
          </div>
        </div>

        {Array.isArray(breakdown) && breakdown.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <table className="breakdown">
              <thead>
                <tr>
                  <th>Slab</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((b, i) => (
                  <tr key={i}>
                    <td>{formatCurrency(b.from)} – {isFinite(b.to) ? formatCurrency(b.to) : '∞'}</td>
                    <td>{(b.rate * 100).toFixed(0)}%</td>
                    <td>{formatCurrency(b.amount)}</td>
                    <td>{formatCurrency(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
