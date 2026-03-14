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

export function WarrantyValueCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [price, setPrice] = useState('50000')
  const [depreciation, setDepreciation] = useState('15')
  const [years, setYears] = useState('2')
  const [priceError, setPriceError] = useState('')
  const [depreciationError, setDepreciationError] = useState('')
  const [yearsError, setYearsError] = useState('')

  const p = Number(price)
  const d = Number(depreciation) / 100
  const y = Number(years)

  // Обработчики для валидации
  const validateField = (value: string, setError: (msg: string) => void) => {
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setError('')
      }
    } else {
      setError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const monthlyBreakdown = []
    let currentValue = p
    const monthlyDepreciation = d / 12
    
    for (let i = 1; i <= y * 12; i++) {
      currentValue = currentValue * (1 - monthlyDepreciation)
      monthlyBreakdown.push({ month: i, value: currentValue })
    }

    const depreciationAmount = p - currentValue
    const depreciationPercent = (depreciationAmount / p) * 100

    return { currentValue, depreciationAmount, depreciationPercent, monthlyBreakdown }
  }, [p, d, y])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Текущая стоимость' : 'Current Value', value: Math.round(result.currentValue) },
      { name: language === 'ru' ? 'Износ' : 'Depreciation', value: Math.round(result.depreciationAmount) },
    ]
  }, [result, language])

  // По месяцам (максимум 24 точки)
  const monthlyData = useMemo(() => {
    if (!result) return []
    const totalMonths = result.monthlyBreakdown.length
    const step = totalMonths <= 36 ? 1 : Math.ceil(totalMonths / 24)
    
    // Определяем какие месяцы показывать
    const monthsToShow: number[] = []
    for (let m = step; m <= totalMonths; m += step) {
      monthsToShow.push(m)
    }
    // Всегда добавляем последний месяц, если его нет
    if (monthsToShow[monthsToShow.length - 1] !== totalMonths) {
      monthsToShow.push(totalMonths)
    }
    
    return monthsToShow.map(month => {
      const d = result.monthlyBreakdown[month - 1]
      return {
        name: `${month}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Стоимость' : 'Value']: Math.round(d.value),
      }
    })
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Исходная цена' : 'Original Price', value: formatCurrency(p, language) },
      { label: language === 'ru' ? 'Текущая стоимость' : 'Current Value', value: formatCurrency(Math.round(result.currentValue), language) },
      { label: language === 'ru' ? 'Износ' : 'Depreciation', value: formatCurrency(Math.round(result.depreciationAmount), language) },
      { label: language === 'ru' ? 'Процент износа' : 'Depreciation %', value: formatPercent(result.depreciationPercent) },
    ]
  }, [result, p, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Исходная цена (₽)' : 'Original Price (₽)'}
          </label>
          <input type="number" className="input w-full" value={price} onChange={(e) => { const v = e.target.value; setPrice(v); validateField(v, setPriceError); }} />
          {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Износ (%/год)' : 'Depreciation (%/year)'}
          </label>
          <input type="number" className="input w-full" value={depreciation} onChange={(e) => { const v = e.target.value; setDepreciation(v); validateField(v, setDepreciationError); }} />
          {depreciationError && <p className="text-xs text-red-500 mt-1">{depreciationError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Лет использования' : 'Years Used'}
          </label>
          <input type="number" className="input w-full" value={years} onChange={(e) => { const v = e.target.value; setYears(v); validateField(v, setYearsError); }} />
          {yearsError && <p className="text-xs text-red-500 mt-1">{yearsError}</p>}
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
                {language === 'ru' ? 'Стоимость vs Износ' : 'Value vs Depreciation'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Износ' : 'Depreciation'}
                centerValue={formatPercent(result.depreciationPercent)}
              />
            </div>

            {/* Процент износа */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Остаточная стоимость' : 'Residual Value'}
              </h3>
              <CircularProgressWidget 
                value={100 - result.depreciationPercent} 
                maxValue={100} 
                label={formatPercent(100 - result.depreciationPercent)}
                color="#22c55e"
                size={160}
              />
            </div>
          </div>

          {/* По месяцам */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Динамика стоимости по месяцам' : 'Value Over Months'}
            </h3>
            <BarChartWidget 
              data={monthlyData}
              dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Value', color: '#6366f1' }]}
              height={250}
            />
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение' : 'Comparison'}
            </h3>
            <HorizontalBarWidget data={[
              { label: language === 'ru' ? 'Исходная' : 'Original', value: Math.round(Number(price)), color: '#6366f1' },
              { label: language === 'ru' ? 'Текущая' : 'Current', value: Math.round(result.currentValue), color: '#22c55e' },
            ]} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
