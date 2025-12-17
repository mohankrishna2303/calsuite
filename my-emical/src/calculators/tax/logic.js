export function computeProgressiveTax({ income, deductions = 0 }) {
  const slabs = [
    { upTo: 400000, rate: 0.00 },
    { upTo: 800000, rate: 0.05 },
    { upTo: 1200000, rate: 0.10 },
    { upTo: 1600000, rate: 0.15 },
    { upTo: 2000000, rate: 0.20 },
    { upTo: 2400000, rate: 0.25 },
    { upTo: Infinity, rate: 0.30 },
  ]

  const gross = Number(income) || 0
  const ded = Number(deductions) || 0
  const taxable = Math.max(gross - ded, 0)

  let remaining = taxable
  let prevCap = 0
  let baseTax = 0
  const slabBreakdown = []

  for (const slab of slabs) {
    const cap = slab.upTo
    const chunk = Math.max(Math.min(remaining, cap - prevCap), 0)
    if (chunk > 0) {
      const part = chunk * slab.rate
      baseTax += part
      slabBreakdown.push({ from: prevCap, to: cap, amount: chunk, rate: slab.rate, tax: part })
    }
    remaining -= chunk
    prevCap = cap
    if (remaining <= 0) break
  }

  // Surcharge tiers (confirming common Indian slabs). Applies on base tax; marginal relief applied per tier.
  const surchargeTiers = [
    { threshold: 5000000, rate: 0.10 },
    { threshold: 10000000, rate: 0.15 },
    { threshold: 20000000, rate: 0.25 },
    { threshold: 50000000, rate: 0.37 },
  ]

  function taxAtIncome(inc) {
    // helper: compute base tax at given taxable income using same slabs
    let rem = Math.max(inc - ded, 0)
    let prev = 0
    let t = 0
    for (const s of slabs) {
      const ch = Math.max(Math.min(rem, s.upTo - prev), 0)
      if (ch > 0) t += ch * s.rate
      rem -= ch
      prev = s.upTo
      if (rem <= 0) break
    }
    return t
  }

  // Compute surcharge and marginal relief
  let surchargeRate = 0
  for (const tier of surchargeTiers) {
    if (gross > tier.threshold) surchargeRate = tier.rate
  }
  let surcharge = baseTax * surchargeRate

  // Marginal relief: ensure total tax (base + surcharge) does not exceed
  // tax at threshold plus income over threshold
  if (surchargeRate > 0) {
    // Find active tier
    const active = surchargeTiers.filter(t => gross > t.threshold).slice(-1)[0]
    if (active) {
      const taxAtThreshold = taxAtIncome(active.threshold)
      const excessIncome = gross - active.threshold
      const maxTotalTax = taxAtThreshold + excessIncome
      const totalBeforeRelief = baseTax + surcharge
      if (totalBeforeRelief > maxTotalTax) {
        surcharge = Math.max(0, maxTotalTax - baseTax)
      }
    }
  }

  // 4% Health & Education Cess on (baseTax + surcharge)
  const preCess = baseTax + surcharge
  const cess = preCess * 0.04
  const totalTax = preCess + cess

  const effectiveRate = taxable > 0 ? (totalTax / taxable) : 0
  return {
    gross,
    deductions: ded,
    taxable,
    baseTax,
    surchargeRate,
    surcharge,
    cessRate: 0.04,
    cess,
    tax: totalTax,
    effectiveRate,
    breakdown: slabBreakdown,
  }
}
