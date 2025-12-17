import React, { useEffect, useMemo, useState } from 'react'
import { getHistory, setPrefill, clearHistory } from '../../utils/history.js'
import { computeEmi } from '../emi/logic.js'
import { computeSip } from '../sip/logic.js'
import { computeProgressiveTax } from '../tax/logic.js'
import { computeBmi } from '../bmi/logic.js'
import './styles.css'

export default function HomePage({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [recent, setRecent] = useState([])
  const [history, setHistory] = useState([])
  const [computed, setComputed] = useState({})

  const cards = useMemo(() => ([
    { key: 'emi', title: '💳 EMI Calculator', desc: 'Estimate monthly loan repayments, total interest, and total payment for a loan over a tenure.', category: 'finance' },
    { key: 'sip', title: '📈 SIP Calculator', desc: 'Project future value of monthly investments at an expected annual return, with invest-at-start toggle.', category: 'finance' },
    { key: 'si', title: '➕ Simple Interest', desc: 'Compute simple interest and total amount using months/days with a configurable months-per-year basis.', category: 'finance' },
    { key: 'ci', title: '✳️ Compound Interest', desc: 'Calculate maturity amount and interest using compounding frequency, months/days and custom months-per-year.', category: 'finance' },
    { key: 'tax', title: '🧾 Tax', desc: 'Estimate income tax using the configured progressive slabs with optional deductions.', category: 'finance' },
    { key: 'bmi', title: '⚖️ BMI', desc: 'Check your Body Mass Index and category from your weight and height.', category: 'health' },
    { key: 'age', title: '📅 Age', desc: 'Find your exact age in years, months, and days from your date of birth.', category: 'utilities' },
    { key: 'basic', title: '🖩 Calculator', desc: 'Quick math with a clean keypad and live result preview.', category: 'utilities' },
    { key: 'scientific', title: '🧪 Scientific Calculator', desc: 'Advanced math with sin, cos, tan, log, ln, sqrt, power, π, e.', category: 'utilities' },
    { key: 'length', title: '📏 Length Converter (km/m/cm)', desc: 'Convert between kilometers, meters, and centimeters instantly.', category: 'utilities' },
    { key: 'bmr', title: '🔥 BMR & TDEE', desc: 'Estimate daily calorie needs from age, sex, height, weight, and activity.', category: 'health' },
    { key: 'macros', title: '🍽️ Calorie & Macro Planner', desc: 'Target calories and protein/fat/carbs for lose/maintain/gain.', category: 'health' },
    { key: 'units', title: '🧮 Unit Converters', desc: 'Convert weight (kg↔lb) and temperature (°C↔°F↔K) instantly.', category: 'utilities' },
    { key: 'currency', title: '💱 Currency Converter', desc: 'Convert amounts across world currencies with live exchange rates.', category: 'utilities' },
    { key: 'power', title: "⚡ Power (Ohm's Law)", desc: 'Compute P, V, I, R by entering any two values.', category: 'utilities' },
  ]), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const byQuery = !q ? cards : cards.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
    if (filter === 'all') return byQuery
    return byQuery.filter(c => c.category === filter)
  }, [cards, query, filter])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('calc_recent')
      if (raw) setRecent(JSON.parse(raw))
    } catch {}
    setHistory(getHistory())
  }, [])

  function pushRecent(item) {
    try {
      const now = new Date().toISOString()
      const next = [{ ...item, when: now }, ...recent.filter(r => r.key !== item.key)]
        .slice(0, 8)
      setRecent(next)
      localStorage.setItem('calc_recent', JSON.stringify(next))
    } catch {}
  }

  useEffect(() => {
    if (history && history.length) {
      history.forEach((h, idx) => computeInline(h, idx))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history])

  function fmtCurrency(v) {
    const n = Number(v)
    if (!Number.isFinite(n)) return '-'
    try { return n.toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }) } catch { return String(n) }
  }
  function fmtNumber(v, d = 2) {
    const n = Number(v)
    if (!Number.isFinite(n)) return '-'
    return n.toLocaleString(undefined, { maximumFractionDigits: d })
  }

  function computeInline(h, idx) {
    try {
      let res = null
      if (h.key === 'emi') {
        const { principal = 0, annualRate = 0, tenureMonths = 0 } = h.inputs || {}
        res = computeEmi({ principal: Number(principal)||0, annualRate: Number(annualRate)||0, tenureMonths: Number(tenureMonths)||0 })
      } else if (h.key === 'sip') {
        const { monthlyInvestment = 0, annualRate = 0, tenureMonths = 0, investAtStart = true } = h.inputs || {}
        res = computeSip({ monthlyInvestment: Number(monthlyInvestment)||0, annualRate: Number(annualRate)||0, tenureMonths: Number(tenureMonths)||0, investAtStart: !!investAtStart })
      } else if (h.key === 'tax') {
        const { income = 0, deductions = 0 } = h.inputs || {}
        res = computeProgressiveTax({ income: Number(income)||0, deductions: Number(deductions)||0 })
      } else if (h.key === 'bmi') {
        const { weightKg = 0, heightCm = 0 } = h.inputs || {}
        res = computeBmi({ weightKg: Number(weightKg)||0, heightCm: Number(heightCm)||0 })
      }
      if (res) setComputed(prev => ({ ...prev, [idx]: res }))
    } catch {}
  }

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1>Finance & Utility Calculators</h1>
          <p className="subtitle">Fast, accurate, and delightful tools to plan your money and wellness.</p>
          <div className="cta-row">
            <button className="cta" onClick={() => onNavigate && onNavigate('emi')}>Start with EMI</button>
            <button className="cta secondary" onClick={() => onNavigate && onNavigate('tax')}>Check Tax</button>
          </div>
          <div className="search-row">
            <input
              className="search-input"
              type="search"
              placeholder="Search calculators (e.g., tax, emi, sip)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-row">
            <button 
              className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-chip ${filter === 'finance' ? 'active' : ''}`}
              onClick={() => setFilter('finance')}
            >
              💳 Finance
            </button>
            <button 
              className={`filter-chip ${filter === 'health' ? 'active' : ''}`}
              onClick={() => setFilter('health')}
            >
              ⚖️ Health
            </button>
            <button 
              className={`filter-chip ${filter === 'utilities' ? 'active' : ''}`}
              onClick={() => setFilter('utilities')}
            >
              🛠️ Utilities
            </button>
          </div>
        </div>
      </div>

      <div className="grid">
        {filtered.map(card => (
          <button
            key={card.key}
            className="card card-click"
            onClick={() => { pushRecent({ key: card.key, title: card.title }); onNavigate && onNavigate(card.key) }}
            aria-label={`Open ${card.title}`}
          >
            <div className="card-head">
              <div className={`badge ${card.category}`}>{card.category}</div>
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </button>
        ))}
      </div>

      {recent && recent.length > 0 && (
        <div className="card" style={{ marginTop: 32 }}>
          <h3>📋 Recent Calculators</h3>
          <div className="recent-row">
            {recent.map(r => (
              <button key={r.key} className="chip" onClick={() => onNavigate && onNavigate(r.key)} title={r.when}>
                {r.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {history && history.length > 0 && (
        <div className="card" style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>📊 Calculation History</h3>
            <button className="chip" onClick={() => { clearHistory(); setHistory([]) }}>Clear All</button>
          </div>
          <div className="history-list">
            {history.map((h, idx) => (
              <div key={idx} className="history-item" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                <div>
                  <div className="muted" style={{ fontSize: 12 }}>{new Date(h.when).toLocaleString?.() || h.when}</div>
                  <div><strong>{h.title}</strong></div>
                  <div className="muted" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis' }}>{JSON.stringify(h.inputs)}</div>
                  {computed[idx] && (
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {h.key === 'emi' && (
                        <>
                          <span>EMI: {fmtCurrency(computed[idx].emi)}</span>{' '}
                          <span>Interest: {fmtCurrency(computed[idx].totalInterest)}</span>{' '}
                          <span>Total: {fmtCurrency(computed[idx].totalPayment)}</span>
                        </>
                      )}
                      {h.key === 'sip' && (
                        <>
                          <span>Future: {fmtCurrency(computed[idx].futureValue)}</span>{' '}
                          <span>Invested: {fmtCurrency(computed[idx].invested)}</span>{' '}
                          <span>Gains: {fmtCurrency(computed[idx].gains)}</span>
                        </>
                      )}
                      {h.key === 'tax' && (
                        <>
                          <span>Tax: {fmtCurrency(computed[idx].tax)}</span>{' '}
                          <span>Eff: {Number.isFinite(computed[idx].effectiveRate) ? (computed[idx].effectiveRate * 100).toFixed(2) + '%' : '-'}</span>
                        </>
                      )}
                      {h.key === 'bmi' && (
                        <>
                          <span>BMI: {Number.isFinite(computed[idx].bmi) ? computed[idx].bmi.toFixed(1) : '-'}</span>{' '}
                          <span>{computed[idx].category}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <button className="btn" onClick={() => { setPrefill({ key: h.key, inputs: h.inputs }); onNavigate && onNavigate(h.key) }}>Use</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card tips">
        <h3>💡 Pro Tips</h3>
        <ul>
          <li>Use the theme toggle in the header to switch between Light and Dark modes for better viewing experience.</li>
          <li>Most inputs accept decimal values; leave fields blank if you're unsure about the exact values.</li>
          <li>Months-per-year basis can be adjusted in Simple and Compound Interest calculators for more accurate calculations.</li>
          <li>Use the filter chips above to quickly find calculators by category (Finance, Health, Utilities).</li>
          <li>Your recent calculations are automatically saved and can be accessed from the Recent section.</li>
        </ul>
      </div>

      <footer className="home-footer muted">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>⚡ Built with React</span>
          <span>•</span>
          <span>📊 Values are estimates only</span>
          <span>•</span>
          <span>✅ Verify before making decisions</span>
        </div>
      </footer>
    </div>
  )
}
