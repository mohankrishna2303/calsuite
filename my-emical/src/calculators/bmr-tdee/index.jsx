import React, { useMemo, useState } from 'react'
import './styles.css'

function mifflinStJeor({ sex, weightKg, heightCm, age }) {
  const w = Number(weightKg) || 0
  const h = Number(heightCm) || 0
  const a = Number(age) || 0
  if (!w || !h || !a) return 0
  const s = sex === 'female' ? -161 : 5
  return (10 * w) + (6.25 * h) - (5 * a) + s
}

const ACTIVITY = [
  { key: 'sedentary', label: 'Sedentary (little or no exercise)', factor: 1.2 },
  { key: 'light', label: 'Light (1–3 days/week)', factor: 1.375 },
  { key: 'moderate', label: 'Moderate (3–5 days/week)', factor: 1.55 },
  { key: 'active', label: 'Active (6–7 days/week)', factor: 1.725 },
  { key: 'very', label: 'Very Active (hard exercise/physical job)', factor: 1.9 },
]

export default function BMRTDEECalculator() {
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [activity, setActivity] = useState('sedentary')

  const { bmr, tdee } = useMemo(() => {
    const b = mifflinStJeor({ sex, weightKg, heightCm, age })
    const f = ACTIVITY.find(a => a.key === activity)?.factor || 1.2
    return { bmr: b, tdee: b * f }
  }, [sex, age, heightCm, weightKg, activity])

  return (
    <div className="bmr-tdee">
      <div className="card">
        <div className="card-header">
          <h2>BMR & TDEE</h2>
          <div className="subtext">Estimate daily calorie needs based on Mifflin-St Jeor and activity.</div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Sex</label>
            <select value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="field">
            <label>Age (years)</label>
            <input type="number" min="0" step="1" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="field">
            <label>Height (cm)</label>
            <input type="number" min="0" step="0.5" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </div>
          <div className="field">
            <label>Weight (kg)</label>
            <input type="number" min="0" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </div>
          <div className="field">
            <label>Activity</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)}>
              {ACTIVITY.map(a => (
                <option key={a.key} value={a.key}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="results pro">
        <div className="result">
          <div className="result-label">BMR</div>
          <div className="result-value highlight">{Number.isFinite(bmr) && bmr > 0 ? Math.round(bmr) + ' kcal/day' : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">TDEE</div>
          <div className="result-value">{Number.isFinite(tdee) && tdee > 0 ? Math.round(tdee) + ' kcal/day' : '-'}</div>
        </div>
      </div>
    </div>
  )
}
