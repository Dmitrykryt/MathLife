import { loanPayment } from '@/lib/math/finance'

describe('finance utils', () => {
 it('loan payment is finite', () => {
 expect(Number.isFinite(loanPayment(100000,12,120))).toBe(true)
 })
})
