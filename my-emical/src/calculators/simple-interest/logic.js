export function computeSimpleInterest({ principal, annualRate, years = 0, months = 0, days = 0, monthsPerYear = 12 }) {
  const P = Number(principal)
  const r = Number(annualRate) / 100
  const y = Number(years) || 0
  const m = Number(months) || 0
  const d = Number(days) || 0
  const mpY = Number(monthsPerYear) || 12
  const t = y + m / mpY + d / 365
  if (!P || P <= 0 || !t || t <= 0) return { si: 0, total: 0 }
  const si = P * r * t
  const total = P + si
  return { si, total }
}
