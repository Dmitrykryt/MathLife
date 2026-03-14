export function loanPayment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100
  if (r === 0) return principal / months
  const factor = Math.pow(1 + r, months)
  return (principal * r * factor) / (factor - 1)
}

export function compoundInterest(principal: number, annualRate: number, years: number, compoundsPerYear = 12) {
  const r = annualRate / 100
  return principal * Math.pow(1 + r / compoundsPerYear, compoundsPerYear * years)
}
