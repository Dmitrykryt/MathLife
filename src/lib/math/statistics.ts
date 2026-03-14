export function mean(values: number[]) {
  if (!values.length) return 0
  return values.reduce((s, v) => s + v, 0) / values.length
}

export function variance(values: number[]) {
  if (!values.length) return 0
  const m = mean(values)
  return mean(values.map((v) => (v - m) ** 2))
}

export function standardDeviation(values: number[]) {
  return Math.sqrt(variance(values))
}
