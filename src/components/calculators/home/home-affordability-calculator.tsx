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

export function HomeAffordabilityCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [income, setIncome] = useState('150000')
  const [debts, setDebts] = useState('20000')
  const [downPayment, setDownPayment] = useState('1000000')
  const [rate, setRate] = useState('12')
  const [incomeError, setIncomeError] = useState('')
  const [debtsError, setDebtsError] = useState('')
  const [downPaymentError, setDownPaymentError] = useState('')
  const [rateError, setRateError] = useState('')

  const inc = Number(income)
  const d = Number(debts)
  const dp = Number(downPayment)
  const r = Number(rate) / 100 / 12

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

  const handleDebtsChange = (value: string) => {
    setDebts(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDebtsError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDebtsError('')
      }
    } else {
      setDebtsError('')
    }
  }

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDownPaymentError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDownPaymentError('')
      }
    } else {
      setDownPaymentError('')
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

  // Автоматический расчёт
  const result = useMemo(() => {
    const maxPayment = (inc * 0.4) - d
    const dti = (d / inc) * 100

    const coeff = r > 0 
      ? (r * Math.pow(1 + r, 240)) / (Math.pow(1 + r, 240) - 1)
      : 1/240

    const maxLoan = coeff > 0 ? maxPayment / coeff : 0
    const maxHome = maxLoan + dp

    return { maxPayment, maxHome, dti }
  }, [inc, d, dp, r])

  // Сравнение
  const comparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Макс. платёж' : 'Max Payment', value: Math.round(result.maxPayment), color: '#6366f1' },
      { label: language === 'ru' ? 'Текущие долги' : 'Current Debts', value: Math.round(d), color: '#ef4444' },
    ]
  }, [result, d, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Макс. платёж' : 'Max Payment', value: formatCurrency(Math.round(result.maxPayment), language) },
      { label: language === 'ru' ? 'Макс. жильё' : 'Max Home', value: formatCurrency(Math.round(result.maxHome), language) },
      { label: language === 'ru' ? 'DTI' : 'DTI', value: formatPercent(result.dti) },
      { label: language === 'ru' ? 'Перв. взнос' : 'Down Payment', value: formatCurrency(Math.round(dp), language) },
    ]
  }, [result, dp, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Доход/мес (₽)' : 'Income/month (₽)'}
          </label>
          <input type="number" className="input w-full" value={income} onChange={(e) => handleIncomeChange(e.target.value)} />
          {incomeError && <p className="text-xs text-red-500 mt-1">{incomeError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Долги/мес (₽)' : 'Debts/month (₽)'}
          </label>
          <input type="number" className="input w-full" value={debts} onChange={(e) => handleDebtsChange(e.target.value)} />
          {debtsError && <p className="text-xs text-red-500 mt-1">{debtsError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Перв. взнос (₽)' : 'Down Payment (₽)'}
          </label>
          <input type="number" className="input w-full" value={downPayment} onChange={(e) => handleDownPaymentChange(e.target.value)} />
          {downPaymentError && <p className="text-xs text-red-500 mt-1">{downPaymentError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ставка (%)' : 'Rate (%)'}
          </label>
          <input type="number" className="input w-full" value={rate} onChange={(e) => handleRateChange(e.target.value)} />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
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
                  { name: language === 'ru' ? 'Макс. платёж' : 'Max Payment', value: Math.round(result.maxPayment) },
                  { name: language === 'ru' ? 'Долги' : 'Debts', value: Math.round(Number(debts)) },
                  { name: language === 'ru' ? 'Остаток' : 'Remaining', value: Math.round(Number(income) - result.maxPayment - Number(debts)) },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'Доход' : 'Income'}
                centerValue={`${Math.round(Number(income) / 1000)}K`}
              />
            </div>

            {/* Сравнение */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Платёж vs Долги' : 'Payment vs Debts'}
              </h3>
              <BarChartWidget 
                data={comparison.map(d => ({ name: d.label, value: Math.round(d.value) }))}
                dataKeys={[{ key: 'value', color: '#6366f1' }]}
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
