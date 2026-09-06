import React, { useMemo, useState } from 'react'

const tools = [
  { id: 'emi', name: 'EMI planner', category: 'Borrow', description: 'Plan monthly loan payments and total interest.', icon: '01' },
  { id: 'sip', name: 'SIP calculator', category: 'Invest', description: 'Estimate wealth created through monthly investing.', icon: '02' },
  { id: 'compound', name: 'Compound interest', category: 'Invest', description: 'See how time and returns grow your money.', icon: '03' },
  { id: 'cagr', name: 'CAGR calculator', category: 'Invest', description: 'Measure annualized growth across an investment.', icon: '04' },
  { id: 'budget', name: 'Budget planner', category: 'Plan', description: 'Build a clear monthly plan for every rupee.', icon: '05' },
  { id: 'savings', name: 'Savings goal', category: 'Plan', description: 'Find the monthly amount needed for your goal.', icon: '06' },
  { id: 'retirement', name: 'Retirement planner', category: 'Plan', description: 'Create a practical path to financial independence.', icon: '07' },
  { id: 'inflation', name: 'Inflation calculator', category: 'Understand', description: 'Understand what your money may be worth later.', icon: '08' },
  { id: 'tax', name: 'Tax estimator', category: 'Understand', description: 'Get a simple estimate of your annual tax.', icon: '09' },
  { id: 'debt', name: 'Debt payoff', category: 'Borrow', description: 'Compare strategies to become debt-free faster.', icon: '10' },
]

const money = (value) => `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}`
const pct = (value) => `${(Number(value) || 0).toFixed(1)}%`

function Field({ label, value, onChange, prefix, suffix, min = 0, max }) {
  return <label className="finance-field"><span>{label}</span><div className="finance-input">{prefix && <b>{prefix}</b>}<input type="number" value={value} min={min} max={max} onChange={(event) => onChange(event.target.value)} />{suffix && <b>{suffix}</b>}</div></label>
}

function Result({ label, value, accent = false }) {
  return <div className="finance-result"><span>{label}</span><strong className={accent ? 'accent' : ''}>{value}</strong></div>
}

function ToolCalculator({ tool }) {
  const [values, setValues] = useState({ principal: 2500000, rate: 8.5, years: 20, monthly: 15000, returnRate: 12, target: 1000000, income: 85000, expenses: 48000, current: 200000, future: 5000000, inflation: 6, salary: 1200000, taxRate: 20, debt: 500000, payment: 18000 })
  const set = (key) => (value) => setValues((current) => ({ ...current, [key]: value }))
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value) || 0]))
  const monthlyRate = v.rate / 1200
  const months = v.years * 12
  const emi = monthlyRate ? v.principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1) : v.principal / months
  const sipFuture = v.monthly * (((1 + v.returnRate / 1200) ** (v.years * 12) - 1) / (v.returnRate / 1200)) * (1 + v.returnRate / 1200)
  const compound = v.principal * (1 + v.returnRate / 100) ** v.years
  const cagr = v.current ? ((v.future / v.current) ** (1 / v.years) - 1) * 100 : 0
  const savingsMonthly = v.years ? v.target / (v.years * 12) : v.target
  const retirement = v.monthly * 12 * 25
  const futureValue = v.current * (1 + v.inflation / 100) ** v.years
  const balance = v.income - v.expenses
  const debtMonths = v.payment ? Math.ceil(v.debt / v.payment) : 0
  const configs = {
    emi: { title: 'EMI planner', intro: 'Know your monthly commitment before you borrow.', fields: [['principal', 'Loan amount', '₹'], ['rate', 'Interest rate', '%'], ['years', 'Loan tenure', 'years']], results: [['Monthly EMI', money(emi), true], ['Total interest', money(emi * months - v.principal)], ['Total repayment', money(emi * months)]], advice: 'Keep your EMI under 35% of take-home pay to preserve breathing room.' },
    sip: { title: 'SIP calculator', intro: 'Turn small monthly habits into a long-term wealth plan.', fields: [['monthly', 'Monthly investment', '₹'], ['returnRate', 'Expected return', '%'], ['years', 'Investment horizon', 'years']], results: [['Future value', money(sipFuture), true], ['Invested amount', money(v.monthly * v.years * 12)], ['Estimated gains', money(sipFuture - v.monthly * v.years * 12)]], advice: 'Consistency matters more than timing. Increase your SIP when your income grows.' },
    compound: { title: 'Compound interest', intro: 'Visualize the quiet power of compounding.', fields: [['principal', 'Starting amount', '₹'], ['returnRate', 'Annual return', '%'], ['years', 'Time invested', 'years']], results: [['Future value', money(compound), true], ['Growth earned', money(compound - v.principal)], ['Growth multiple', `${(compound / v.principal || 0).toFixed(1)}x`]], advice: 'The most valuable input is time. Starting earlier can matter more than investing more.' },
    cagr: { title: 'CAGR calculator', intro: 'Compare investment performance on a like-for-like basis.', fields: [['current', 'Starting value', '₹'], ['future', 'Ending value', '₹'], ['years', 'Holding period', 'years']], results: [['CAGR', pct(cagr), true], ['Absolute gain', money(v.future - v.current)], ['Ending value', money(v.future)]], advice: 'Compare CAGR with the risk you took and the benchmark you could have chosen.' },
    budget: { title: 'Budget planner', intro: 'Give every rupee a job before the month begins.', fields: [['income', 'Monthly income', '₹'], ['expenses', 'Monthly expenses', '₹'], ['monthly', 'Monthly investing', '₹']], results: [['Available balance', money(balance - v.monthly), true], ['Savings rate', pct(v.income ? (v.monthly / v.income) * 100 : 0)], ['Monthly expenses', money(v.expenses)]], advice: 'Start with a simple 50/30/20 split, then adapt it to your real priorities.' },
    savings: { title: 'Savings goal', intro: 'Make your next milestone feel measurable and achievable.', fields: [['target', 'Target amount', '₹'], ['years', 'Time to goal', 'years'], ['current', 'Already saved', '₹']], results: [['Monthly saving needed', money(Math.max(0, savingsMonthly - v.current / (v.years * 12 || 1))), true], ['Remaining goal', money(Math.max(0, v.target - v.current))], ['Progress', pct(v.target ? (v.current / v.target) * 100 : 0)]], advice: 'Automate this amount just after payday so progress does not depend on willpower.' },
    retirement: { title: 'Retirement planner', intro: 'Translate your desired lifestyle into a target number.', fields: [['monthly', 'Current monthly spend', '₹'], ['inflation', 'Inflation', '%'], ['years', 'Years to retirement', 'years']], results: [['Retirement corpus', money(retirement), true], ['Annual spend today', money(v.monthly * 12)], ['Planning horizon', `${v.years} years`]], advice: 'Review your corpus target annually and keep a separate emergency fund.' },
    inflation: { title: 'Inflation calculator', intro: 'See the future purchasing power of today’s money.', fields: [['current', 'Amount today', '₹'], ['inflation', 'Inflation rate', '%'], ['years', 'Years ahead', 'years']], results: [['Future cost', money(futureValue), true], ['Inflation impact', money(futureValue - v.current)], ['Cost multiple', `${(futureValue / v.current || 0).toFixed(1)}x`]], advice: 'Long-term plans should use an inflation-aware return assumption, not just headline returns.' },
    tax: { title: 'Tax estimator', intro: 'Create a quick first-pass view of your annual tax.', fields: [['salary', 'Annual income', '₹'], ['taxRate', 'Estimated tax rate', '%'], ['current', 'Deductions', '₹']], results: [['Estimated tax', money(Math.max(0, (v.salary - v.current) * v.taxRate / 100)), true], ['Taxable income', money(Math.max(0, v.salary - v.current))], ['Monthly tax set-aside', money(Math.max(0, (v.salary - v.current) * v.taxRate / 1200))]], advice: 'Use this as a planning estimate, then verify against the latest rules or a qualified tax professional.' },
    debt: { title: 'Debt payoff', intro: 'Turn a balance into a visible, manageable finish line.', fields: [['debt', 'Outstanding balance', '₹'], ['payment', 'Monthly payment', '₹'], ['rate', 'Interest rate', '%']], results: [['Payoff time', `${debtMonths} months`, true], ['Current payment', money(v.payment)], ['Extra payment impact', money(v.debt / Math.max(1, debtMonths - 6))]], advice: 'Prioritize high-interest debt first while protecting a small cash buffer.' },
  }
  const config = configs[tool.id] || configs.sip
  return <section className="tool-workspace"><div className="workspace-copy"><span className="eyebrow">Calculator / {tool.category}</span><h1>{config.title}</h1><p>{config.intro}</p></div><div className="calculator-layout"><div className="calculator-card"><div className="field-grid">{config.fields.map(([key, label, unit]) => <Field key={key} label={label} value={values[key]} onChange={set(key)} prefix={unit === '₹' ? unit : undefined} suffix={unit !== '₹' ? unit : undefined} />)}</div><div className="tip"><span>Planning note</span><p>{config.advice}</p></div></div><div className="results-card"><span className="eyebrow">Your estimate</span><div className="result-list">{config.results.map(([label, value, accent]) => <Result key={label} label={label} value={value} accent={accent} />)}</div><p className="disclaimer">Estimates are illustrative and should not be treated as financial advice.</p></div></div></section>
}

export default function FinanceHome({ onOpenTool }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const filtered = useMemo(() => tools.filter((tool) => (filter === 'All' || tool.category === filter) && `${tool.name} ${tool.description}`.toLowerCase().includes(query.toLowerCase())), [filter, query])
  if (selected) return <ToolCalculator tool={selected} />
  return <div className="finance-home"><section className="hero"><div className="hero-copy"><span className="eyebrow">CALCSUITE / PERSONAL FINANCE</span><h1>Make clearer money decisions.</h1><p>A considered toolkit for borrowing, investing, budgeting, and building your next chapter with confidence.</p><div className="hero-actions"><button className="btn primary" onClick={() => setSelected(tools[1])}>Start with investing</button><button className="text-button" onClick={() => document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth' })}>Explore the toolkit →</button></div></div><div className="hero-panel"><div className="panel-label">Your financial snapshot</div><div className="snapshot-line"><span>Monthly surplus</span><strong>₹37,000</strong></div><div className="snapshot-line"><span>Suggested invest rate</span><strong>44%</strong></div><div className="snapshot-bar"><i style={{ width: '44%' }} /></div><small>Start with a number. Leave with a plan.</small></div></section><section className="insight-strip"><div><strong>12</strong><span>finance tools</span></div><div><strong>4</strong><span>planning areas</span></div><div><strong>100%</strong><span>private in your browser</span></div><div className="insight-copy">No accounts. No noise. Just useful clarity.</div></section><section id="toolkit" className="toolkit"><div className="section-heading"><div><span className="eyebrow">THE TOOLKIT</span><h2>Everything you need to get financially organized.</h2></div><input className="search-input" placeholder="Search calculators" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="filters">{['All', 'Invest', 'Plan', 'Borrow', 'Understand'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="tool-grid">{filtered.map((tool) => <button className="tool-card" key={tool.id} onClick={() => { setSelected(tool); onOpenTool?.(tool.id) }}><span className="tool-number">{tool.icon}</span><span className="tool-category">{tool.category}</span><h3>{tool.name}</h3><p>{tool.description}</p><span className="tool-link">Open calculator →</span></button>)}</div></section><section className="advice-section"><div><span className="eyebrow">MONEY NOTES</span><h2>Advice worth returning to.</h2><p>Simple, practical guidance for the decisions that shape your financial life.</p></div><div className="advice-grid"><article><span>01 / FOUNDATION</span><h3>Build your first emergency fund</h3><p>Start with one month of essential expenses, then work toward three to six.</p><button className="text-button">Read note →</button></article><article><span>02 / INVESTING</span><h3>Let time do more of the work</h3><p>Automate a sustainable amount and increase it gradually as your income grows.</p><button className="text-button">Read note →</button></article><article><span>03 / HABITS</span><h3>Make your plan visible</h3><p>A monthly review turns vague intentions into small, repeatable decisions.</p><button className="text-button">Read note →</button></article></div></section></div>
}

export { ToolCalculator, tools }
