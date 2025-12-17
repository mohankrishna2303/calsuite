import React, { useMemo, useState } from 'react'
import './styles.css'
import { computeAge } from './logic.js'

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')

  const { years, months, days } = useMemo(() => computeAge({ birthDate }), [birthDate])

  return (
    <div className="age-calculator">
      <div className="card">
        <div className="card-header">
          <h2>Age Calculator</h2>
          <div className="subtext">Enter your date of birth to see your exact age in years, months, and days.</div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Date of Birth</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="results pro">
        <div className="result">
          <div className="result-label">Exact Age</div>
          <div className="result-value highlight">{years}y {months}m {days}d</div>
        </div>
      </div>
    </div>
  )
}
