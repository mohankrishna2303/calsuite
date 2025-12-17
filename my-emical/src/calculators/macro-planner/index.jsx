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

const GOALS = [
  { key: 'lose', label: 'Lose Weight (~-15%)', factor: 0.85 },
  { key: 'maintain', label: 'Maintain (0%)', factor: 1.0 },
  { key: 'gain', label: 'Gain Muscle (~+15%)', factor: 1.15 },
]

export default function MacroPlanner() {
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [goal, setGoal] = useState('maintain')

  const data = useMemo(() => {
    const bmr = mifflinStJeor({ sex, weightKg, heightCm, age })
    const af = ACTIVITY.find(a => a.key === activity)?.factor || 1.2
    const tdee = bmr * af
    const gf = GOALS.find(g => g.key === goal)?.factor || 1.0
    const target = tdee * gf

    const w = Number(weightKg) || 0
    const proteinG = Math.max(1.6, Math.min(2.2, 1.8)) * w // default 1.8 g/kg
    const proteinCal = proteinG * 4
    const fatCal = target * 0.25 // 25% of calories
    const fatG = fatCal / 9
    const carbsCal = Math.max(target - (proteinCal + fatCal), 0)
    const carbsG = carbsCal / 4

    return { bmr, tdee, target, proteinG, fatG, carbsG }
  }, [sex, age, heightCm, weightKg, activity, goal])

  return (
    <div className="macro-planner">
      <div className="card">
        <div className="card-header">
          <h2>Calorie & Macro Planner</h2>
          <div className="subtext">Target calories and macros by goal using Mifflin-St Jeor and activity level.</div>
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
          <div className="field">
            <label>Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              {GOALS.map(g => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="results pro">
        <div className="result">
          <div className="result-label">Target Calories</div>
          <div className="result-value highlight">{Number.isFinite(data.target) && data.target > 0 ? Math.round(data.target) + ' kcal/day' : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">Protein</div>
          <div className="result-value">{Number.isFinite(data.proteinG) && data.proteinG > 0 ? Math.round(data.proteinG) + ' g' : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">Fat</div>
          <div className="result-value">{Number.isFinite(data.fatG) && data.fatG > 0 ? Math.round(data.fatG) + ' g' : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">Carbs</div>
          <div className="result-value">{Number.isFinite(data.carbsG) && data.carbsG > 0 ? Math.round(data.carbsG) + ' g' : '-'}</div>
        </div>
      </div>
    </div>
  )
}
