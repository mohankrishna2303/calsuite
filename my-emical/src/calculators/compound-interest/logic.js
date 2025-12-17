export function computeCompoundInterest({ principal, annualRate, years = 0, months = 0, days = 0, monthsPerYear = 12, compoundsPerYear = 12 }) {
  const P = Number(principal)
  const r = Number(annualRate) / 100
  const y = Number(years) || 0
  const mths = Number(months) || 0
  const dys = Number(days) || 0
  const mpY = Number(monthsPerYear) || 12
  const t = y + mths / mpY + dys / 365
  const m = Number(compoundsPerYear)
  if (!P || P <= 0 || !t || t <= 0 || !m || m <= 0) return { amount: 0, interest: 0 }
  const amount = P * Math.pow(1 + r / m, m * t)
  const interest = amount - P
  return { amount, interest }
}
