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

export function MortgageAffordabilityCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [income, setIncome] = useState('180000')
  const [rate, setRate] = useState('12')
  const [years, setYears] = useState('25')
  const [incomeError, setIncomeError] = useState('')
  const [rateError, setRateError] = useState('')
  const [yearsError, setYearsError] = useState('')

  const inc = Number(income)
  const r = Number(rate) / 100 / 12
  const y = Number(years)
  const months = y * 12

  // Обработчики для валидации
  const handleIncomeChange = (value: string) => {
    setIncome(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setIncomeError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setIncomeError('')
      }
    } else {
      setIncomeError('')
    }
  }

  const handleRateChange = (value: string) => {
    setRate(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setRateError('')
      }
    } else {
      setRateError('')
    }
  }

  const handleYearsChange = (value: string) => {
    setYears(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setYearsError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setYearsError('')
      }
    } else {
      setYearsError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const maxPayment = inc * 0.4

    const coeff = r > 0 
      ? (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
      : 1/months

    const maxMortgage = coeff > 0 ? maxPayment / coeff : 0
    const totalPayment = maxPayment * months

    return { maxPayment, maxMortgage, totalPayment }
  }, [inc, r, months])

  // Сравнение по срокам
  const termComparison = useMemo(() => {
    const terms = [10, 15, 20, 25, 30]
    
    return terms.map(term => {
      const termMonths = term * 12
      const payment = inc * 0.4
      const coeff = r > 0 
        ? (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
        : 1/termMonths
      const mortgage = coeff > 0 ? payment / coeff : 0
      
      return {
        name: `${term} ${language === 'ru' ? 'лет' : 'years'}`,
        [language === 'ru' ? 'Ипотека' : 'Mortgage']: Math.round(mortgage / 1000000),
      }
    })
  }, [inc, r, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Макс. платёж' : 'Max Payment', value: formatCurrency(Math.round(result.maxPayment), language) },
      { label: language === 'ru' ? 'Макс. ипотека' : 'Max Mortgage', value: formatCurrency(Math.round(result.maxMortgage), language) },
      { label: language === 'ru' ? 'Итого выплат' : 'Total Payment', value: formatCurrency(Math.round(result.totalPayment), language) },
      { label: language === 'ru' ? 'Срок' : 'Term', value: `${y} ${language === 'ru' ? 'лет' : 'years'}` },
    ]
  }, [result, y, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Доход/мес (₽)' : 'Income/month (₽)'}
          </label>
          <input type="number" className="input w-full" value={income} onChange={(e) => handleIncomeChange(e.target.value)} />
          {incomeError && <p className="text-xs text-red-500 mt-1">{incomeError}</p>}
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
            {language === 'ru' ? 'Срок (лет)' : 'Term (years)'}
          </label>
          <input type="number" className="input w-full" value={years} onChange={(e) => handleYearsChange(e.target.value)} />
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
                {language === 'ru' ? 'Распределение дохода' : 'Income Distribution'}
              </h3>
              <DonutChartWidget 
                data={[
                  { name: language === 'ru' ? 'Ипотека' : 'Mortgage', value: Math.round(result.maxPayment) },
                  { name: language === 'ru' ? 'Остаток' : 'Remaining', value: Math.round(Number(income) - result.maxPayment) },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'Доход' : 'Income'}
                centerValue={`${Math.round(Number(income) / 1000)}K`}
              />
            </div>

            {/* Сравнение по срокам */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Ипотека по срокам' : 'Mortgage by Term'}
              </h3>
              <BarChartWidget 
                data={termComparison}
                dataKeys={[{ key: language === 'ru' ? 'Ипотека' : 'Mortgage', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Результат */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Максимальная сумма ипотеки' : 'Maximum Mortgage Amount'}
            </h3>
            <p className="text-3xl font-bold text-primary">{Math.round(result.maxMortgage / 1000000).toFixed(1)}M ₽</p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
