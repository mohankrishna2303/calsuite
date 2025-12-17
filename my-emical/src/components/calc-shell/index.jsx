import React from 'react'
import './styles.css'

export default function CalcShell({ title, subtitle, children, onBack }) {
  return (
    <div className="calc-shell">
      <div className="calc-shell-header">
        <div className="left">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Back">←</button>
          )}
          <div className="titles">
            <h1 className="calc-title">{title}</h1>
            {subtitle && <div className="calc-subtitle">{subtitle}</div>}
          </div>
        </div>
        <div className="right">
          {/* reserved for future actions */}
        </div>
      </div>
      <div className="calc-shell-body">
        {children}
      </div>
    </div>
  )
}
