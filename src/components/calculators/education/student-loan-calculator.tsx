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

export function StudentLoanCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [amount, setAmount] = useState('500000')
  const [rate, setRate] = useState('9')
  const [months, setMonths] = useState('120')
  const [amountError, setAmountError] = useState('')
  const [rateError, setRateError] = useState('')
  const [monthsError, setMonthsError] = useState('')

  const a = Number(amount)
  const r = Number(rate) / 100 / 12
  const m = Number(months)

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
    const monthlyPayment = r > 0 
      ? (a * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1)
      : a / m

    const totalPayment = monthlyPayment * m
    const overpayment = totalPayment - a

    return { monthlyPayment, totalPayment, overpayment }
  }, [a, r, m])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Основной долг' : 'Principal', value: Math.round(a) },
      { name: language === 'ru' ? 'Проценты' : 'Interest', value: Math.round(result.overpayment) },
    ]
  }, [result, a, language])

  // Сравнение по срокам
  const termComparison = useMemo(() => {
    const terms = [60, 84, 120, 144, 180]
    
    return terms.map(term => {
      const payment = r > 0 
        ? (a * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1)
        : a / term
      return {
        name: `${term} ${language === 'ru' ? 'мес' : 'mo'}`,
        [language === 'ru' ? 'Платёж' : 'Payment']: Math.round(payment),
      }
    })
  }, [a, r, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Платёж/мес' : 'Monthly Payment', value: formatCurrency(Math.round(result.monthlyPayment), language) },
      { label: language === 'ru' ? 'Итого' : 'Total', value: formatCurrency(Math.round(result.totalPayment), language) },
      { label: language === 'ru' ? 'Проценты' : 'Interest', value: formatCurrency(Math.round(result.overpayment), language) },
      { label: language === 'ru' ? 'Срок' : 'Term', value: `${Math.round(m / 12)} ${language === 'ru' ? 'лет' : 'years'}` },
    ]
  }, [result, m, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Сумма кредита (₽)' : 'Loan Amount (₽)'}
          </label>
          <input type="number" className="input w-full" value={amount} onChange={(e) => { const v = e.target.value; setAmount(v); validateField(v, setAmountError); }} />
          {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ставка (%)' : 'Rate (%)'}
          </label>
          <input type="number" className="input w-full" value={rate} onChange={(e) => { const v = e.target.value; setRate(v); validateField(v, setRateError); }} />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Срок (мес)' : 'Term (months)'}
          </label>
          <input type="number" className="input w-full" value={months} onChange={(e) => { const v = e.target.value; setMonths(v); validateField(v, setMonthsError); }} />
          {monthsError && <p className="text-xs text-red-500 mt-1">{monthsError}</p>}
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
                {language === 'ru' ? 'Структура выплат' : 'Payment Structure'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={`${Math.round(result.totalPayment / 1000)}K`}
              />
            </div>

            {/* Сравнение по срокам */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Платёж по срокам' : 'Payment by Term'}
              </h3>
              <BarChartWidget 
                data={termComparison}
                dataKeys={[{ key: language === 'ru' ? 'Платёж' : 'Payment', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Долг vs Проценты' : 'Principal vs Interest'}
            </h3>
            <HorizontalBarWidget data={[
              { label: language === 'ru' ? 'Долг' : 'Principal', value: Math.round(Number(amount)), color: '#6366f1' },
              { label: language === 'ru' ? 'Проценты' : 'Interest', value: Math.round(result.overpayment), color: '#ef4444' },
            ]} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
