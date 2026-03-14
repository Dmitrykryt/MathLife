'use client'

import { Calculator } from '@/types'
import { CalculatorGrid } from '@/components/calculators/shared/CalculatorGrid'
import { useSettingsStore } from '@/store/settingsStore'

interface Props {
  label: { ru: string; en: string }
  calculators: Calculator[]
}

export function CategoryPageContent({ label, calculators }: Props) {
  const language = useSettingsStore((s) => s.language)
  const categoryName = language === 'ru' ? label.ru : label.en

  const countText =
    language === 'ru'
      ? `${calculators.length} ${calculators.length === 1 ? 'калькулятор' : calculators.length < 5 ? 'калькулятора' : 'калькуляторов'}`
      : `${calculators.length} ${calculators.length === 1 ? 'calculator' : 'calculators'}`

  return (
    <main className="container-page">
      <header className="mb-8">
        <p className="text-sm text-muted uppercase tracking-wide mb-2">
          {language === 'ru' ? 'Категория' : 'Category'}
        </p>
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="text-muted mt-2">{countText}</p>
      </header>
      <CalculatorGrid calculators={calculators} />
    </main>
  )
}
