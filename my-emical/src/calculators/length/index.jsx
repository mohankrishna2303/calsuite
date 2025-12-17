import React, { useEffect, useState } from 'react'
import './styles.css'

export default function LengthConverter() {
  const [km, setKm] = useState('')
  const [m, setM] = useState('')
  const [cm, setCm] = useState('')
  const [active, setActive] = useState('km')

  // Sync values when one changes
  useEffect(() => {
    const k = Number(km)
    if (active !== 'km') return
    if (!Number.isFinite(k)) return
    setM(k * 1000 + '')
    setCm(k * 100000 + '')
  }, [km, active])

  useEffect(() => {
    const mv = Number(m)
    if (active !== 'm') return
    if (!Number.isFinite(mv)) return
    setKm(mv / 1000 + '')
    setCm(mv * 100 + '')
  }, [m, active])

  useEffect(() => {
    const c = Number(cm)
    if (active !== 'cm') return
    if (!Number.isFinite(c)) return
    setM(c / 100 + '')
    setKm(c / 100000 + '')
  }, [cm, active])

  return (
    <div className="length-converter">
      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Kilometers (km)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={km}
              onFocus={() => setActive('km')}
              onChange={(e) => { setActive('km'); setKm(e.target.value) }}
            />
          </div>
          <div className="field">
            <label>Meters (m)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={m}
              onFocus={() => setActive('m')}
              onChange={(e) => { setActive('m'); setM(e.target.value) }}
            />
          </div>
          <div className="field">
            <label>Centimeters (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={cm}
              onFocus={() => setActive('cm')}
              onChange={(e) => { setActive('cm'); setCm(e.target.value) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
