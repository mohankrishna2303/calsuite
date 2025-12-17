export function computeAge({ birthDate }) {
  const dob = new Date(birthDate)
  if (!(dob instanceof Date) || isNaN(dob)) return { years: 0, months: 0, days: 0 }
  const now = new Date()
  let years = now.getFullYear() - dob.getFullYear()
  let months = now.getMonth() - dob.getMonth()
  let days = now.getDate() - dob.getDate()

  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
    months -= 1
  }
  if (months < 0) {
    months += 12
    years -= 1
  }
  return { years, months, days }
}
