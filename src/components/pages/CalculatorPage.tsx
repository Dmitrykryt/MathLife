'use client'

import { Calculator } from '@/types'
import { CalculatorRenderer } from '@/components/calculators/shared/CalculatorRenderer'

export function CalculatorPage({ calculator }: { calculator: Calculator }) {
  return (
    <main className="container-page">
      <CalculatorRenderer calculator={calculator} />
    </main>
  )
}

