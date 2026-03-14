'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Calculator } from '@/types'
import { useSettingsStore } from '@/store/settingsStore'
import { useHistoryStore } from '@/store/historyStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { t, getCalculatorName, getCalculatorDescription } from '@/i18n'
import { realLifeCategoryLabels } from '@/constants/realLifeCalculators'

interface Props {
  calculator: Calculator
  children: React.ReactNode
}

export function CalculatorShell({ calculator, children }: Props) {
  const language = useSettingsStore((s) => s.language)
  const favorites = useFavoritesStore((s) => s.favorites)
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const addHistoryItem = useHistoryStore((s) => s.addHistoryItem)

  const isFavorite = favorites.includes(calculator.id)
  const translatedName = getCalculatorName(language, calculator.id)
  const translatedDescription = getCalculatorDescription(language, calculator.id)

  const categoryLabel = realLifeCategoryLabels[calculator.category as keyof typeof realLifeCategoryLabels]
  const categoryName = categoryLabel ? (language === 'ru' ? categoryLabel.ru : categoryLabel.en) : calculator.category

  // Save to history when calculator is opened
  useEffect(() => {
    addHistoryItem({
      calculatorId: calculator.id,
      inputs: {},
      result: null,
      expression: translatedName,
    })
  }, [calculator.id, translatedName, addHistoryItem])

  const handleSaveToHistory = useCallback((result: unknown) => {
    addHistoryItem({
      calculatorId: calculator.id,
      inputs: {},
      result,
      expression: translatedName,
    })
  }, [calculator.id, translatedName, addHistoryItem])

  return (
    <section className="space-y-4">
      <div className="glass-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/categories/${calculator.category}`}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {categoryName}
              </Link>
            </div>
            <p className="text-xs uppercase tracking-wide text-muted mb-1">
              {t(language, 'calculator.title')}
            </p>
            <h1 className="text-2xl font-bold">{translatedName}</h1>
            <p className="text-sm text-muted mt-1">{translatedDescription}</p>
          </div>
          <button
            onClick={() => toggleFavorite(calculator.id)}
            className={`p-2 rounded-lg border transition ${
              isFavorite
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                : 'border-border hover:border-yellow-500'
            }`}
            title={t(language, 'calculator.addToFavorites')}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>
      {children}
    </section>
  )
}

