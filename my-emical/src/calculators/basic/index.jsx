import React, { useMemo, useState } from 'react'
import './styles.css'

function safeEval(expr) {
  const allowed = /^[0-9+\-*/%.()\s]+$/
  const cleaned = String(expr || '').trim()
  if (!cleaned || !allowed.test(cleaned)) return NaN
  try {
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${cleaned})`)()
    return typeof val === 'number' && Number.isFinite(val) ? val : NaN
  } catch {
    return NaN
  }
}

export default function BasicCalculator() {
  const [expr, setExpr] = useState('')

  const result = useMemo(() => safeEval(expr), [expr])

  const press = (ch) => setExpr((e) => (e + ch))
  const clear = () => setExpr('')
  const back = () => setExpr((e) => e.slice(0, -1))
  const equals = () => {
    const val = safeEval(expr)
    if (Number.isFinite(val)) setExpr(String(val))
  }

  return (
    <div className="basic-calculator">
      <div className="card">
        <div className="calc-display">
          <input
            className="expr"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="0"
            inputMode="decimal"
          />
          <div className={`preview ${Number.isFinite(result) ? '' : 'invalid'}`}>
            {Number.isFinite(result) ? result : '—'}
          </div>
        </div>
        <div className="keypad">
          <button onClick={clear} className="accent">C</button>
          <button onClick={back}>⌫</button>
          <button onClick={() => press('%')}>%</button>
          <button onClick={() => press('/')} className="accent">÷</button>

          <button onClick={() => press('7')}>7</button>
          <button onClick={() => press('8')}>8</button>
          <button onClick={() => press('9')}>9</button>
          <button onClick={() => press('*')} className="accent">×</button>

          <button onClick={() => press('4')}>4</button>
          <button onClick={() => press('5')}>5</button>
          <button onClick={() => press('6')}>6</button>
          <button onClick={() => press('-')} className="accent">−</button>

          <button onClick={() => press('1')}>1</button>
          <button onClick={() => press('2')}>2</button>
          <button onClick={() => press('3')}>3</button>
          <button onClick={() => press('+')} className="accent">+</button>

          <button onClick={() => press('0')} className="span-2">0</button>
          <button onClick={() => press('.')}>.</button>
          <button onClick={equals} className="accent">=</button>
        </div>
      </div>
    </div>
  )
}
