import React, { useEffect, useState } from 'react'
import FinanceHome, { ToolCalculator, tools } from './calculators/finance/index.jsx'

export default function App() {
  const [theme, setTheme] = useState('light')
  const [activeTool, setActiveTool] = useState(null)
  const currentTool = tools.find((tool) => tool.id === activeTool)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return <div className="app"><header className="app-header"><button className="brand" onClick={() => setActiveTool(null)}><span className="brand-mark">C</span><span>CalcSuite</span></button><nav className="top-nav"><button onClick={() => setActiveTool(null)}>Toolkit</button><button onClick={() => document.getElementById('advice')?.scrollIntoView({ behavior: 'smooth' })}>Money notes</button></nav><button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button></header><main>{currentTool ? <div className="inner-page"><button className="back-btn" onClick={() => setActiveTool(null)}>← Back to toolkit</button><ToolCalculator tool={currentTool} /></div> : <FinanceHome onOpenTool={setActiveTool} />}</main><footer className="site-footer"><span>CalcSuite</span><span>Private by design. Educational by nature.</span><span>© 2026</span></footer></div>
}
