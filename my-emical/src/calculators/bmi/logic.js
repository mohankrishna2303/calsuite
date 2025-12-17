export function computeBmi({ weightKg, heightCm }) {
  const w = Number(weightKg)
  const h = Number(heightCm) / 100
  if (!w || w <= 0 || !h || h <= 0) return { bmi: 0, category: '-' }
  const bmi = w / (h * h)
  let category = '-'
  if (bmi < 18.5) category = 'Underweight'
  else if (bmi < 25) category = 'Normal'
  else if (bmi < 30) category = 'Overweight'
  else if (bmi < 35) category = 'Obese (Class I)'
  else if (bmi < 40) category = 'Obese (Class II)'
  else category = 'Obese (Class III)'
  return { bmi, category }
}
