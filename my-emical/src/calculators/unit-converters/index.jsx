import React, { useEffect, useState } from 'react'
import './styles.css'

export default function UnitConverters() {
  // Weight converter
  const [kg, setKg] = useState('')
  const [lb, setLb] = useState('')
  const [activeW, setActiveW] = useState('kg')

  useEffect(() => {
    if (activeW !== 'kg') return
    const v = Number(kg)
    if (!Number.isFinite(v)) return
    setLb(v === 0 ? '0' : (v * 2.2046226218).toFixed(3))
  }, [kg, activeW])
  useEffect(() => {
    if (activeW !== 'lb') return
    const v = Number(lb)
    if (!Number.isFinite(v)) return
    setKg(v === 0 ? '0' : (v / 2.2046226218).toFixed(3))
  }, [lb, activeW])

  // Temperature converter
  const [c, setC] = useState('')
  const [f, setF] = useState('')
  const [k, setK] = useState('')
  const [activeT, setActiveT] = useState('C')

  useEffect(() => {
    if (activeT !== 'C') return
    const v = Number(c)
    if (!Number.isFinite(v)) return
    setF(((v * 9) / 5 + 32).toFixed(2))
    setK((v + 273.15).toFixed(2))
  }, [c, activeT])
  useEffect(() => {
    if (activeT !== 'F') return
    const v = Number(f)
    if (!Number.isFinite(v)) return
    setC((((v - 32) * 5) / 9).toFixed(2))
    setK((((v - 32) * 5) / 9 + 273.15).toFixed(2))
  }, [f, activeT])
  useEffect(() => {
    if (activeT !== 'K') return
    const v = Number(k)
    if (!Number.isFinite(v)) return
    setC((v - 273.15).toFixed(2))
    setF((((v - 273.15) * 9) / 5 + 32).toFixed(2))
  }, [k, activeT])

  return (
    <div className="unit-converters">
      <div className="card">
        <div className="card-header">
          <h2>Unit Converters</h2>
          <div className="subtext">Quickly convert between common units for weight and temperature.</div>
        </div>

        <div className="section">
          <h3>Weight</h3>
          <div className="form-grid two">
            <div className="field">
              <label>Kilograms (kg)</label>
              <input type="number" inputMode="decimal" value={kg} onFocus={() => setActiveW('kg')} onChange={(e) => { setActiveW('kg'); setKg(e.target.value) }} />
            </div>
            <div className="field">
              <label>Pounds (lb)</label>
              <input type="number" inputMode="decimal" value={lb} onFocus={() => setActiveW('lb')} onChange={(e) => { setActiveW('lb'); setLb(e.target.value) }} />
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Temperature</h3>
          <div className="form-grid three">
            <div className="field">
              <label>°C</label>
              <input type="number" inputMode="decimal" value={c} onFocus={() => setActiveT('C')} onChange={(e) => { setActiveT('C'); setC(e.target.value) }} />
            </div>
            <div className="field">
              <label>°F</label>
              <input type="number" inputMode="decimal" value={f} onFocus={() => setActiveT('F')} onChange={(e) => { setActiveT('F'); setF(e.target.value) }} />
            </div>
            <div className="field">
              <label>K</label>
              <input type="number" inputMode="decimal" value={k} onFocus={() => setActiveT('K')} onChange={(e) => { setActiveT('K'); setK(e.target.value) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
