'use client'

import { Suspense } from 'react'
import { Calculator } from '@/types'
import { getCalculatorComponent } from '../realLifeCalculatorRegistry'

interface Props {
  calculator: Calculator
}

function LoadingFallback() {
  return (
    <div className="glass-card text-center py-12">
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4 mx-auto mb-4"></div>
        <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  )
}

export function CalculatorRenderer({ calculator }: Props) {
  const Component = getCalculatorComponent(calculator.slug)

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component calculator={calculator} />
    </Suspense>
  )
}
