'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { realLifeCalculators, realLifeCategoryLabels } from '@/constants/realLifeCalculators'
import { useSettingsStore } from '@/store/settingsStore'
import { useHistoryStore } from '@/store/historyStore'
import { getCalculatorName, getCalculatorDescription } from '@/i18n'
import { evaluate } from 'mathjs'

interface SearchHistoryItem {
  query: string
  timestamp: number
}

const MAX_HISTORY = 10

export function SmartSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const language = useSettingsStore((s) => s.language)
  const calcHistory = useHistoryStore((s) => s.history)

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mathlife-search-history')
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
  }, [])

  // Save to search history
  const saveToHistory = useCallback((q: string) => {
    if (!q.trim()) return
    const newHistory = [
      { query: q.trim(), timestamp: Date.now() },
      ...searchHistory.filter((h) => h.query !== q.trim()),
    ].slice(0, MAX_HISTORY)
    setSearchHistory(newHistory)
    localStorage.setItem('mathlife-search-history', JSON.stringify(newHistory))
  }, [searchHistory])

  // Clear history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem('mathlife-search-history')
  }, [])

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Try to evaluate mathematical expression
  const evaluatedResult = useMemo(() => {
    if (!query.trim()) return null
    try {
      const result = evaluate(query)
      if (typeof result === 'number' && Number.isFinite(result)) {
        return result
      }
    } catch {
      // Not a valid expression
    }
    return null
  }, [query])

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase().trim()
    
    // Score each calculator
    const scored = realLifeCalculators.map((calc) => {
      let score = 0
      
      // Slug match (highest priority)
      if (calc.slug.toLowerCase().includes(lowerQuery)) {
        score += 100
        if (calc.slug.toLowerCase() === lowerQuery) score += 50
      }
      
      // Name match (high priority) - use translated name
      const translatedName = getCalculatorName(language, calc.id)
      if (translatedName.toLowerCase().includes(lowerQuery)) {
        score += 80
        if (translatedName.toLowerCase() === lowerQuery) score += 40
      }
      
      // Category match
      const catLabel = realLifeCategoryLabels[calc.category as keyof typeof realLifeCategoryLabels]
      const catName = language === 'ru' ? catLabel?.ru : catLabel?.en
      if (catName?.toLowerCase().includes(lowerQuery)) {
        score += 60
      }
      
      // Keywords match
      for (const kw of calc.keywords) {
        if (kw.toLowerCase() === lowerQuery) {
          score += 50
        } else if (kw.toLowerCase().includes(lowerQuery)) {
          score += 30
        }
      }
      
      // Tags match
      for (const tag of calc.tags) {
        if (tag.toLowerCase() === lowerQuery) {
          score += 40
        } else if (tag.toLowerCase().includes(lowerQuery)) {
          score += 20
        }
      }
      
      // Description match (lower priority) - use translated description
      const translatedDesc = getCalculatorDescription(language, calc.id)
      if (translatedDesc.toLowerCase().includes(lowerQuery)) {
        score += 10
      }
      
      return { calc, score }
    })
    
    // Filter and sort by score
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.calc)
      .slice(0, 8)
  }, [query, language])

  // Recent calculators from history
  const recentCalculators = useMemo(() => {
    if (query.trim()) return []
    const recentIds = [...new Set(calcHistory.map((h) => h.calculatorId))].slice(0, 5)
    return recentIds
      .map((id) => realLifeCalculators.find((c) => c.id === id))
      .filter(Boolean)
      .slice(0, 5)
  }, [calcHistory, query])

  // Total items for keyboard navigation
  const totalItems = results.length + (evaluatedResult !== null ? 1 : 0) + (query.trim() ? 0 : recentCalculators.length)

  // Handle navigation
  useEffect(() => {
    setSelectedIndex(0)
  }, [query, results.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, totalItems - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (evaluatedResult !== null && selectedIndex === 0) {
        saveToHistory(query)
        setQuery(String(evaluatedResult))
      } else {
        const adjustedIndex = evaluatedResult !== null ? selectedIndex - 1 : selectedIndex
        const item = results[adjustedIndex]
        if (item) {
          saveToHistory(query)
          router.push(`/calculator/${item.slug}`)
          setIsOpen(false)
          setQuery('')
        }
      }
    }
  }

  const handleSelect = (slug: string) => {
    saveToHistory(query)
    router.push(`/calculator/${slug}`)
    setIsOpen(false)
    setQuery('')
  }

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof results> = {}
    for (const item of results) {
      const cat = item.category
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    }
    return groups
  }, [results])

  return (
    <section className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          className="input pr-24 py-3"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === 'ru'
              ? 'Поиск калькулятора...'
              : 'Search calculator...'
          }
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-muted/30 rounded border border-border">Ctrl</kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-muted/30 rounded border border-border">K</kbd>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (query.trim() || recentCalculators.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Math expression result */}
          {evaluatedResult !== null && (
            <div
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/10 ${
                selectedIndex === 0 ? 'bg-muted/10' : ''
              }`}
              onClick={() => {
                saveToHistory(query)
                setQuery(String(evaluatedResult))
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-muted text-sm">{language === 'ru' ? 'Результат:' : 'Result:'}</span>
                  <span className="ml-2 font-mono">{query}</span>
                </div>
                <span className="text-2xl font-bold text-primary font-mono">
                  {evaluatedResult.toFixed(6).replace(/\.?0+$/, '')}
                </span>
              </div>
            </div>
          )}

          {/* Search results grouped by category */}
          {results.length > 0 && (
            <div className="max-h-[400px] overflow-y-auto">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-muted bg-muted/10 uppercase tracking-wide">
                    {language === 'ru'
                      ? realLifeCategoryLabels[category as keyof typeof realLifeCategoryLabels]?.ru
                      : realLifeCategoryLabels[category as keyof typeof realLifeCategoryLabels]?.en}
                  </div>
                  {items.map((item, idx) => {
                    const globalIndex = (evaluatedResult !== null ? 1 : 0) + results.indexOf(item)
                    return (
                      <button
                        key={item.id}
                        className={`w-full text-left px-4 py-3 hover:bg-muted/10 transition flex items-center gap-3 ${
                          selectedIndex === globalIndex ? 'bg-muted/10' : ''
                        }`}
                        onClick={() => handleSelect(item.slug)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{getCalculatorName(language, item.id)}</div>
                          <div className="text-sm text-muted truncate">{getCalculatorDescription(language, item.id)}</div>
                        </div>
                        <div className="text-xs text-muted bg-muted/20 px-2 py-1 rounded">
                          {language === 'ru'
                            ? realLifeCategoryLabels[item.category as keyof typeof realLifeCategoryLabels]?.ru
                            : realLifeCategoryLabels[item.category as keyof typeof realLifeCategoryLabels]?.en}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {query.trim() && results.length === 0 && evaluatedResult === null && (
            <div className="p-8 text-center text-muted">
              <p>{language === 'ru' ? 'Ничего не найдено' : 'No results found'}</p>
              <p className="text-sm mt-1">
                {language === 'ru' ? 'Попробуйте другие ключевые слова' : 'Try different keywords'}
              </p>
            </div>
          )}

          {/* Recent calculators */}
          {!query.trim() && recentCalculators.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-muted bg-muted/10 uppercase tracking-wide flex items-center justify-between">
                <span>{language === 'ru' ? 'Недавние' : 'Recent'}</span>
              </div>
              {recentCalculators.map((item, idx) =>
                item ? (
                  <button
                    key={item.id}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/10 transition ${
                      selectedIndex === idx ? 'bg-muted/10' : ''
                    }`}
                    onClick={() => handleSelect(item.slug)}
                  >
                    <div className="font-medium">{getCalculatorName(language, item.id)}</div>
                    <div className="text-sm text-muted">{getCalculatorDescription(language, item.id)}</div>
                  </button>
                ) : null
              )}
            </div>
          )}

          {/* Search history */}
          {searchHistory.length > 0 && !query.trim() && (
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted">
                  {language === 'ru' ? 'История поиска:' : 'Search history:'}
                </p>
                <button
                  className="text-xs text-muted hover:text-primary"
                  onClick={clearHistory}
                >
                  {language === 'ru' ? 'Очистить' : 'Clear'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((h) => (
                  <button
                    key={h.timestamp}
                    className="px-3 py-1 text-sm bg-muted/20 hover:bg-muted/30 rounded-full transition"
                    onClick={() => setQuery(h.query)}
                  >
                    {h.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
