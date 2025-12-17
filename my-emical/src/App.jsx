import React, { useEffect, useState } from 'react'
import EMICalculator from './calculators/emi/index.jsx'
import SIPCalculator from './calculators/sip/index.jsx'
import SimpleInterestCalculator from './calculators/simple-interest/index.jsx'
import CompoundInterestCalculator from './calculators/compound-interest/index.jsx'
import BMICalculator from './calculators/bmi/index.jsx'
import AgeCalculator from './calculators/age/index.jsx'
import TaxCalculator from './calculators/tax/index.jsx'
import HomePage from './calculators/home/index.jsx'
import BasicCalculator from './calculators/basic/index.jsx'
import ScientificCalculator from './calculators/scientific/index.jsx'
import LengthConverter from './calculators/length/index.jsx'
import BMRTDEECalculator from './calculators/bmr-tdee/index.jsx'
import MacroPlanner from './calculators/macro-planner/index.jsx'
import UnitConverters from './calculators/unit-converters/index.jsx'
import CurrencyConverter from './calculators/currency/index.jsx'
import PowerCalculator from './calculators/power/index.jsx'
import CalcShell from './components/calc-shell/index.jsx'
// auth screens removed per request

const TABS = [
  { key: 'home', label: '🏠 Home', component: <HomePage /> },
  { key: 'emi', label: '💳 EMI', component: <EMICalculator /> },
  { key: 'sip', label: '📈 SIP', component: <SIPCalculator /> },
  { key: 'si', label: '➕ Simple Interest', component: <SimpleInterestCalculator /> },
  { key: 'ci', label: '✳️ Compound Interest', component: <CompoundInterestCalculator /> },
  { key: 'tax', label: '🧾 Tax', component: <TaxCalculator /> },
  { key: 'basic', label: '🖩 Calculator', component: <BasicCalculator /> },
  { key: 'scientific', label: '🧪 Scientific', component: <ScientificCalculator /> },
  { key: 'length', label: '📏 Length (km/m/cm)', component: <LengthConverter /> },
  { key: 'bmr', label: '🔥 BMR & TDEE', component: <BMRTDEECalculator /> },
  { key: 'macros', label: '🍽️ Macro Planner', component: <MacroPlanner /> },
  { key: 'units', label: '🧮 Unit Converters', component: <UnitConverters /> },
  { key: 'currency', label: '💱 Currency', component: <CurrencyConverter /> },
  { key: 'power', label: '⚡ Power (Ohm\'s Law)', component: <PowerCalculator /> },
  { key: 'bmi', label: '⚖️ BMI', component: <BMICalculator /> },
  { key: 'age', label: '📅 Age', component: <AgeCalculator /> },
]

export default function App() {
  const [active, setActive] = useState('home')
  const current = TABS.find(t => t.key === active) || TABS[0]
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  // removed auth-related global events

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="brand" onClick={() => setActive('home')}>CalcSuite</div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </header>

      <main>
        {active === 'home' ? (
          <HomePage onNavigate={setActive} />
        ) : (
          <div className="inner-page">
            <CalcShell title={current.label} onBack={() => setActive('home')}>
              {current.component}
            </CalcShell>
          </div>
        )}
      </main>
    </div>
  )
}
