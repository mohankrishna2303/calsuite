export function computeSip({ monthlyInvestment, annualRate, tenureMonths, investAtStart = true }) {
  const P = Number(monthlyInvestment)
  const r = Number(annualRate) / 12 / 100
  const n = Number(tenureMonths)
  if (!P || P <= 0 || !n || n <= 0) return { futureValue: 0, invested: 0, gains: 0 }
  if (!r || r === 0) {
    const fv = P * n
    return { futureValue: fv, invested: P * n, gains: fv - P * n }
  }
  // If investAtStart, multiply by (1+r), else at end leave as is
  const factor = ((Math.pow(1 + r, n) - 1) / r) * (investAtStart ? (1 + r) : 1)
  const futureValue = P * factor
  const invested = P * n
  const gains = futureValue - invested
  return { futureValue, invested, gains }
}
