export function solveQuadratic(a: number, b: number, c: number) {
  if (a === 0) throw new Error('a cannot be 0')
  const d = b * b - 4 * a * c
  if (d < 0) return { roots: [] as number[], discriminant: d }
  if (d === 0) return { roots: [-b / (2 * a)], discriminant: d }
  const sqrtD = Math.sqrt(d)
  return {
    roots: [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)],
    discriminant: d,
  }
}
