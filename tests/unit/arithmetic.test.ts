import { add, divide } from '@/lib/math/arithmetic'

describe('arithmetic utils', () => {
 it('add works', () => expect(add(2,3)).toBe(5))
 it('divide works', () => expect(divide(10,2)).toBe(5))
})
