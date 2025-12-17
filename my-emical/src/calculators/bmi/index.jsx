import React, { useEffect, useMemo, useState } from 'react'
import { computeBmi } from './logic.js'
import { addHistory, takePrefill } from '../../utils/history.js'

export default function BMICalculator() {
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')

  const { bmi, category } = useMemo(() => {
    const w = Number(weightKg || 0)
    const h = Number(heightCm || 0)
    return computeBmi({ weightKg: w, heightCm: h })
  }, [weightKg, heightCm])

  useEffect(() => {
    const pre = takePrefill()
    if (pre && pre.key === 'bmi') {
      const inp = pre.inputs || {}
      if (inp.weightKg != null) setWeightKg(String(inp.weightKg))
      if (inp.heightCm != null) setHeightCm(String(inp.heightCm))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const w = Number(weightKg || 0)
    const h = Number(heightCm || 0)
    if (w > 0 && h > 0 && Number.isFinite(bmi) && bmi > 0) {
      addHistory({ key: 'bmi', title: 'BMI', inputs: { weightKg: w, heightCm: h } })
    }
  }, [weightKg, heightCm, bmi])

  return (
    <div>
      <div className="card">
        <div className="field">
          <label>Weight (kg)</label>
          <input  style={{width:"200px"}} type="number" min="0" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </div>
        <div className="field">
          <label>Height (cm)</label>
          <input  style={{width:"200px"}}type="number" min="0" step="0.5" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </div>
      </div>

      <div className="results">
        <div className="result">
          <div className="result-label">BMI</div>
          <div className="result-value highlight">{Number.isFinite(bmi) ? bmi.toFixed(1) : '-'}</div>
        </div>
        <div className="result">
          <div className="result-label">Category</div>
          <div className="result-value">{category}</div>
        </div>
      </div>

      <div className="card">
        <h3>Guidance</h3>
        {category === 'Underweight' && (
          <div>
            <p className="muted">Potential issues: low energy, weakened immunity, nutrient deficiencies.</p>
            <ul>
              <li>Increase calories with balanced protein, whole grains, and healthy fats.</li>
              <li>Add 1–2 nutrient-dense snacks daily (nuts, yogurt, smoothies).</li>
              <li>Strength training 3x/week to build lean mass.</li>
            </ul>
          </div>
        )}
        {(category === 'Normal' || category === 'Healthy') && (
          <div>
            <p className="muted">You are in the healthy range. Maintain habits.</p>
            <ul>
              <li>Balanced diet with adequate protein and fiber.</li>
              <li>150+ minutes/week of moderate activity.</li>
              <li>Regular sleep schedule and hydration.</li>
            </ul>
          </div>
        )}
        {category === 'Overweight' && (
          <div>
            <p className="muted">Potential issues: elevated risk of metabolic and joint problems.</p>
            <ul>
              <li>Create a small calorie deficit (200–400 kcal/day).</li>
              <li>Prioritize protein and fiber; limit ultra-processed foods.</li>
              <li>Mix cardio with resistance training 4–5x/week.</li>
            </ul>
          </div>
        )}
        {(category === 'Obese' || category === 'Obesity') && (
          <div>
            <p className="muted">Higher risk of cardiovascular, metabolic, and orthopedic issues.</p>
            <ul>
              <li>Target a steady loss of 0.25–0.5 kg/week with a supervised plan.</li>
              <li>Focus on whole foods; manage portions and sugary drinks.</li>
              <li>Start with low-impact activity; increase duration gradually.</li>
            </ul>
          </div>
        )}
        {!category && (
          <p className="muted">Enter weight and height to see tailored guidance.</p>
        )}
      </div>
    </div>
  )
}
