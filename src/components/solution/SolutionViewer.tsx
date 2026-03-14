'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

interface SolutionStep {
  number: number
  title: string
  description: string
  formula?: string
  result?: string | number
}

interface Props {
  steps: SolutionStep[]
  isVisible: boolean
}

export function SolutionViewer({ steps, isVisible }: Props) {
  const language = useSettingsStore((s) => s.language)
  
  if (!isVisible || steps.length === 0) return null

  return (
    <div className="mt-4 p-4 rounded-lg border border-border bg-muted/10">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-primary">📋</span>
        {language === 'ru' ? 'Пошаговое решение' : 'Step-by-step Solution'}
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {step.number}
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">{step.title}</h4>
              <p className="text-sm text-muted mb-2">{step.description}</p>
              {step.formula && (
                <div className="p-2 rounded bg-surface border border-border font-mono text-sm">
                  {step.formula}
                </div>
              )}
              {step.result !== undefined && (
                <div className="mt-2 p-2 rounded bg-primary/10 border border-primary/30">
                  <span className="text-sm text-muted">
                    {language === 'ru' ? 'Результат:' : 'Result:'}
                  </span>
                  <span className="ml-2 font-bold text-primary">{step.result}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper hook for solution visibility
export function useSolutionVisibility() {
  const [showSolution, setShowSolution] = useState(false)
  
  const toggleSolution = () => setShowSolution(prev => !prev)
  
  return { showSolution, toggleSolution }
}
