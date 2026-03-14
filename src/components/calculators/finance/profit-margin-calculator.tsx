'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { 
  PieChartWidget, 
  BarChartWidget, 
  ProgressBarsWidget, 
  StatsCardsWidget,
  CircularProgressWidget,
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function ProfitMarginCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [price, setPrice] = useState('1500')
  const [cost, setCost] = useState('1000')
  const [priceError, setPriceError] = useState('')
  const [costError, setCostError] = useState('')

  const p = Number(price)
  const c = Number(cost)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(priceError || costError)
  const hasEmptyValues = !price || !cost

  // Обработчики для валидации
  const handlePriceChange = (value: string) => {
    setPrice(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setPriceError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setPriceError('')
      }
    } else {
      setPriceError('')
    }
  }

  const handleCostChange = (value: string) => {
    setCost(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setCostError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setCostError('')
      }
    } else {
      setCostError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (hasErrors || hasEmptyValues) return null
    if (p > 0 && c > 0) {
      const profit = p - c
      const margin = (profit / p) * 100
      const markup = (profit / c) * 100
      return { margin, markup, profit }
    }
    return null
  }, [p, c, hasErrors, hasEmptyValues])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Себестоимость' : 'Cost', value: Math.round(c) },
      { name: language === 'ru' ? 'Прибыль' : 'Profit', value: Math.round(result.profit) },
    ]
  }, [result, c, language])

  // Сравнение маржи и наценки
  const marginVsMarkup = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Маржа' : 'Margin', value: Math.round(result.margin * 10) / 10, color: '#22c55e' },
      { label: language === 'ru' ? 'Наценка' : 'Markup', value: Math.round(result.markup * 10) / 10, color: '#6366f1' },
    ]
  }, [result, language])

  // Сравнение цен
  const priceComparison = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Цена продажи' : 'Selling Price', value: Math.round(p), color: '#6366f1' },
      { label: language === 'ru' ? 'Себестоимость' : 'Cost', value: Math.round(c), color: '#ef4444' },
      { label: language === 'ru' ? 'Прибыль' : 'Profit', value: Math.round(result.profit), color: '#22c55e' },
    ]
  }, [result, p, c, language])

  // Сравнение разных цен
  const priceVariants = useMemo(() => {
    const markups = [20, 30, 50, 75, 100, 150]
    
    return markups.map(m => ({
      name: `+${m}%`,
      [language === 'ru' ? 'Цена' : 'Price']: Math.round(c * (1 + m / 100)),
      [language === 'ru' ? 'Прибыль' : 'Profit']: Math.round(c * m / 100),
    }))
  }, [c, language])

  // Сценарии маржи
  const marginScenarios = useMemo(() => {
    const margins = [10, 20, 30, 40, 50]
    
    return margins.map(m => ({
      name: `${m}%`,
      [language === 'ru' ? 'Требуемая цена' : 'Required Price']: Math.round(c / (1 - m / 100)),
    }))
  }, [c, language])

  // Рентабельность
  const profitability = useMemo(() => {
    if (!result) return 0
    return result.margin
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Маржа' : 'Margin', value: formatPercent(result.margin) },
      { label: language === 'ru' ? 'Наценка' : 'Markup', value: formatPercent(result.markup) },
      { label: language === 'ru' ? 'Прибыль' : 'Profit', value: formatCurrency(result.profit, language) },
      { label: language === 'ru' ? 'ROI' : 'ROI', value: formatPercent(result.markup) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена продажи' : 'Selling Price'}
          </label>
          <input type="number" className="input w-full" value={price} onChange={(e) => handlePriceChange(e.target.value)} />
          {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Себестоимость' : 'Cost Price'}
          </label>
          <input type="number" className="input w-full" value={cost} onChange={(e) => handleCostChange(e.target.value)} />
          {costError && <p className="text-xs text-red-500 mt-1">{costError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Структура цены' : 'Price Structure'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Цена' : 'Price'}
                centerValue={formatCurrency(p, language)}
              />
            </div>

            {/* Рентабельность */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Рентабельность' : 'Profitability'}
              </h3>
              <CircularProgressWidget 
                value={profitability} 
                maxValue={100} 
                label={formatPercent(profitability)}
                color={profitability >= 30 ? '#22c55e' : profitability >= 15 ? '#f59e0b' : '#ef4444'}
                size={160}
              />
            </div>
          </div>

          {/* Маржа vs Наценка */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Маржа vs Наценка' : 'Margin vs Markup'}
            </h3>
            <HorizontalBarWidget data={marginVsMarkup} maxValue={Math.max(result.margin, result.markup) * 1.2} />
            <p className="text-xs text-muted mt-4 text-center">
              {language === 'ru' 
                ? 'Маржа = Прибыль / Цена продажи, Наценка = Прибыль / Себестоимость'
                : 'Margin = Profit / Selling Price, Markup = Profit / Cost'}
            </p>
          </div>

          {/* Сравнение цен */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение цен' : 'Price Comparison'}
            </h3>
            <ProgressBarsWidget data={priceComparison} maxValue={p * 1.2} />
          </div>

          {/* Варианты цен */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Варианты цен при разных наценках' : 'Price Variants at Different Markups'}
            </h3>
            <BarChartWidget 
              data={priceVariants}
              dataKeys={[
                { key: language === 'ru' ? 'Цена' : 'Price', color: '#6366f1' },
                { key: language === 'ru' ? 'Прибыль' : 'Profit', color: '#22c55e' },
              ]}
              height={250}
            />
          </div>

          {/* Сценарии маржи */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Требуемая цена для заданной маржи' : 'Required Price for Target Margin'}
            </h3>
            <BarChartWidget 
              data={marginScenarios}
              dataKeys={[{ key: language === 'ru' ? 'Требуемая цена' : 'Required Price', color: '#8b5cf6' }]}
              height={250}
            />
          </div>

          {/* Формулы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Формулы расчёта' : 'Calculation Formulas'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted/20 rounded">
                <div className="text-muted mb-1">{language === 'ru' ? 'Маржа:' : 'Margin:'}</div>
                <code>(Цена - Себестоимость) / Цена × 100%</code>
              </div>
              <div className="p-3 bg-muted/20 rounded">
                <div className="text-muted mb-1">{language === 'ru' ? 'Наценка:' : 'Markup:'}</div>
                <code>(Цена - Себестоимость) / Себестоимость × 100%</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
