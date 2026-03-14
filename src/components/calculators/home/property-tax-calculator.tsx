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
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function PropertyTaxCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [value, setValue] = useState('6000000')
  const [rate, setRate] = useState('0.3')
  const [deduction, setDeduction] = useState('20')
  const [valueError, setValueError] = useState('')
  const [rateError, setRateError] = useState('')
  const [deductionError, setDeductionError] = useState('')

  const v = Number(value)
  const r = Number(rate) / 100
  const d = Number(deduction)

  // Обработчики для валидации
  const handleValueChange = (val: string) => {
    setValue(val)
    const num = Number(val)
    if (!isNaN(num) && val !== '') {
      if (num < 0) {
        setValueError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setValueError('')
      }
    } else {
      setValueError('')
    }
  }

  const handleRateChange = (val: string) => {
    setRate(val)
    const num = Number(val)
    if (!isNaN(num) && val !== '') {
      if (num < 0) {
        setRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setRateError('')
      }
    } else {
      setRateError('')
    }
  }

  const handleDeductionChange = (val: string) => {
    setDeduction(val)
    const num = Number(val)
    if (!isNaN(num) && val !== '') {
      if (num < 0) {
        setDeductionError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDeductionError('')
      }
    } else {
      setDeductionError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const deductionAmount = v * d / 100
    const taxableValue = v - deductionAmount
    const tax = taxableValue * r
    return { tax, taxableValue, deduction: deductionAmount }
  }, [v, r, d])

  // Сравнение
  const comparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Налог' : 'Tax', value: Math.round(result.tax), color: '#ef4444' },
      { label: language === 'ru' ? 'Вычет' : 'Deduction', value: Math.round(result.deduction), color: '#22c55e' },
    ]
  }, [result, language])

  // Сравнение ставок
  const rateComparison = useMemo(() => {
    const rates = [0.1, 0.2, 0.3, 0.5, 1.0, 2.0]
    
    return rates.map(rateVal => ({
      name: `${rateVal}%`,
      [language === 'ru' ? 'Налог' : 'Tax']: Math.round(v * rateVal / 100),
    }))
  }, [v, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Налог' : 'Tax', value: formatCurrency(Math.round(result.tax), language) },
      { label: language === 'ru' ? 'Налог. база' : 'Taxable Value', value: formatCurrency(Math.round(result.taxableValue), language) },
      { label: language === 'ru' ? 'Вычет' : 'Deduction', value: formatCurrency(Math.round(result.deduction), language) },
      { label: language === 'ru' ? 'Ставка' : 'Rate', value: formatPercent(Number(rate)) },
    ]
  }, [result, rate, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Стоимость (₽)' : 'Value (₽)'}
          </label>
          <input type="number" className="input w-full" value={value} onChange={(e) => handleValueChange(e.target.value)} />
          {valueError && <p className="text-xs text-red-500 mt-1">{valueError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ставка (%)' : 'Rate (%)'}
          </label>
          <input type="number" className="input w-full" value={rate} onChange={(e) => handleRateChange(e.target.value)} />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Вычет (%)' : 'Deduction (%)'}
          </label>
          <input type="number" className="input w-full" value={deduction} onChange={(e) => handleDeductionChange(e.target.value)} />
          {deductionError && <p className="text-xs text-red-500 mt-1">{deductionError}</p>}
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
                {language === 'ru' ? 'Структура' : 'Structure'}
              </h3>
              <DonutChartWidget 
                data={[
                  { name: language === 'ru' ? 'Налог' : 'Tax', value: Math.round(result.tax) },
                  { name: language === 'ru' ? 'Вычет' : 'Deduction', value: Math.round(result.deduction) },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'Налог' : 'Tax'}
                centerValue={`${Math.round(result.tax / 1000)}K`}
              />
            </div>

            {/* Сравнение ставок */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Налог по ставкам' : 'Tax by Rate'}
              </h3>
              <BarChartWidget 
                data={rateComparison}
                dataKeys={[{ key: language === 'ru' ? 'Налог' : 'Tax', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение' : 'Comparison'}
            </h3>
            <HorizontalBarWidget data={comparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
