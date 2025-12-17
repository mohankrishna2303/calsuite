export function computeEmi({ principal, annualRate, tenureMonths }) {
  const P = Number(principal)
  const r = Number(annualRate) / 12 / 100
  const n = Number(tenureMonths)
  if (!P || P <= 0 || !n || n <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 }
  }
  if (!r || r === 0) {
    const emi = P / n
    return { emi, totalPayment: emi * n, totalInterest: emi * n - P }
  }
  const pow = Math.pow(1 + r, n)
  const emi = (P * r * pow) / (pow - 1)
  const totalPayment = emi * n
  const totalInterest = totalPayment - P
  return { emi, totalPayment, totalInterest }
}
