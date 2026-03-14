import { smartSearch } from '@/lib/search/smartSearch'
import { realLifeCalculators } from '@/constants/realLifeCalculators'

const searchCalculators = smartSearch

describe('Search Calculators', () => {
  // Test slug search
  it('should find by exact slug', () => {
    const results = searchCalculators('loan-calculator')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe('loan-calculator')
  })

  // Test keyword search
  it('should find by keyword', () => {
    const results = searchCalculators('loan')
    expect(results.length).toBeGreaterThan(0)
  })

  // Test category search
  it('should find by category', () => {
    const results = searchCalculators('finance')
    expect(results.length).toBeGreaterThan(0)
  })

  // Test partial match
  it('should find by partial name', () => {
    const results = searchCalculators('кредит')
    expect(results.length).toBeGreaterThan(0)
  })

  // Test case insensitive
  it('should be case insensitive', () => {
    const results1 = searchCalculators('LOAN')
    const results2 = searchCalculators('loan')
    
    expect(results1.length).toBeGreaterThan(0)
    expect(results2.length).toBeGreaterThan(0)
  })

  // Test empty query
  it('should return empty for empty query', () => {
    const results = searchCalculators('')
    expect(results).toEqual([])
  })

  // Test non-existent query
  it('should return empty for non-existent query', () => {
    const results = searchCalculators('xyz123nonexistent')
    expect(results).toEqual([])
  })

  // Test priority - slug should be first
  it('should prioritize slug matches', () => {
    const results = searchCalculators('loan-calculator')
    expect(results[0].slug).toBe('loan-calculator')
  })

  // Test total calculators count
  it('should have 50+ calculators', () => {
    expect(realLifeCalculators.length).toBeGreaterThanOrEqual(50)
  })

  // Test each calculator individually
  it('should find each calculator by slug', () => {
    console.log('\n=== Testing each calculator ===')
    let found = 0
    let notFound = 0
    
    for (const calc of realLifeCalculators) {
      const results = searchCalculators(calc.slug)
      const isFound = results.some(r => r.slug === calc.slug)
      
      if (isFound) {
        found++
      } else {
        notFound++
        console.log(`❌ ${calc.slug}`)
      }
    }
    
    console.log(`\n✅ Found: ${found}/${realLifeCalculators.length}`)
    if (notFound > 0) {
      console.log(`❌ Not found: ${notFound}`)
    }
    
    expect(found).toBe(realLifeCalculators.length)
  })
})

