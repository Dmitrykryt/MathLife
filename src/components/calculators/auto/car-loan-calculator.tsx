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

export function CarLoanCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [price, setPrice] = useState('2000000')
  const [downPayment, setDownPayment] = useState('400000')
  const [rate, setRate] = useState('14')
  const [months, setMonths] = useState('60')
  const [priceError, setPriceError] = useState('')
  const [downPaymentError, setDownPaymentError] = useState('')
  const [rateError, setRateError] = useState('')
  const [monthsError, setMonthsError] = useState('')

  const p = Number(price)
  const dp = Number(downPayment)
  const r = Number(rate) / 100 / 12
  const m = Number(months)
  const loan = p - dp

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
      ? (loan * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1)
      : loan / m

    const totalPayment = monthlyPayment * m
    const overpayment = totalPayment - loan

    return { loanAmount: loan, monthlyPayment, totalPayment, overpayment }
  }, [loan, r, m])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Тело кредита' : 'Principal', value: Math.round(result.loanAmount) },
      { name: language === 'ru' ? 'Переплата' : 'Overpayment', value: Math.round(result.overpayment) },
    ]
  }, [result, language])

  // Сравнение по срокам
  const termComparison = useMemo(() => {
    const terms = [12, 24, 36, 48, 60, 72, 84]
    
    return terms.map(term => {
      const payment = r > 0 
        ? (loan * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1)
        : loan / term
      return {
        name: `${term} ${language === 'ru' ? 'мес' : 'mo'}`,
        [language === 'ru' ? 'Платёж' : 'Payment']: Math.round(payment),
      }
    })
  }, [loan, r, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Сумма кредита' : 'Loan Amount', value: formatCurrency(Math.round(result.loanAmount), language) },
      { label: language === 'ru' ? 'Платёж/мес' : 'Monthly Payment', value: formatCurrency(Math.round(result.monthlyPayment), language) },
      { label: language === 'ru' ? 'Переплата' : 'Overpayment', value: formatCurrency(Math.round(result.overpayment), language) },
      { label: language === 'ru' ? 'Итого' : 'Total', value: formatCurrency(Math.round(result.totalPayment), language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Стоимость авто (₽)' : 'Car Price (₽)'}
          </label>
          <input type="number" className="input w-full" value={price} onChange={(e) => { const v = e.target.value; setPrice(v); validateField(v, setPriceError); }} />
          {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Первоначальный взнос (₽)' : 'Down Payment (₽)'}
          </label>
          <input type="number" className="input w-full" value={downPayment} onChange={(e) => { const v = e.target.value; setDownPayment(v); validateField(v, setDownPaymentError); }} />
          {downPaymentError && <p className="text-xs text-red-500 mt-1">{downPaymentError}</p>}
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
              {language === 'ru' ? 'Тело кредита vs Переплата' : 'Principal vs Overpayment'}
            </h3>
            <HorizontalBarWidget data={[
              { label: language === 'ru' ? 'Тело кредита' : 'Principal', value: Math.round(result.loanAmount), color: '#6366f1' },
              { label: language === 'ru' ? 'Переплата' : 'Overpayment', value: Math.round(result.overpayment), color: '#ef4444' },
            ]} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
