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

export function RentVsBuyCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [rent, setRent] = useState('45000')
  const [propertyPrice, setPropertyPrice] = useState('8000000')
  const [downPayment, setDownPayment] = useState('2000000')
  const [mortgageRate, setMortgageRate] = useState('12')
  const [years, setYears] = useState('10')
  const [rentError, setRentError] = useState('')
  const [propertyPriceError, setPropertyPriceError] = useState('')
  const [downPaymentError, setDownPaymentError] = useState('')
  const [mortgageRateError, setMortgageRateError] = useState('')
  const [yearsError, setYearsError] = useState('')

  const r = Number(rent)
  const p = Number(propertyPrice)
  const dp = Number(downPayment)
  const rate = Number(mortgageRate) / 100 / 12
  const y = Number(years)
  const loan = p - dp
  const months = y * 12

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

  const handleRentChange = (value: string) => { setRent(value); validateField(value, setRentError) }
  const handlePropertyPriceChange = (value: string) => { setPropertyPrice(value); validateField(value, setPropertyPriceError) }
  const handleDownPaymentChange = (value: string) => { setDownPayment(value); validateField(value, setDownPaymentError) }
  const handleMortgageRateChange = (value: string) => { setMortgageRate(value); validateField(value, setMortgageRateError) }
  const handleYearsChange = (value: string) => { setYears(value); validateField(value, setYearsError) }

  // Автоматический расчёт
  const result = useMemo(() => {
    const mortgageMonthly = rate > 0 
      ? (loan * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      : loan / months

    const rentTotal = r * 12 * y
    const buyTotal = mortgageMonthly * months + dp
    const diff = rentTotal - buyTotal

    const recommendation = diff > 0 
      ? (language === 'ru' ? 'Выгоднее покупать' : 'Buying is better')
      : (language === 'ru' ? 'Выгоднее аренда' : 'Renting is better')

    return { rentTotal, buyTotal, mortgageMonthly, diff, recommendation }
  }, [r, p, dp, rate, y, loan, months, language])

  // Сравнение
  const comparisonData = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Аренда' : 'Rent', value: Math.round(result.rentTotal), color: '#ef4444' },
      { label: language === 'ru' ? 'Покупка' : 'Buy', value: Math.round(result.buyTotal), color: '#22c55e' },
    ]
  }, [result, language])

  // По годам
  const yearByYear = useMemo(() => {
    const yearsList = [1, 3, 5, 10, 15, 20]
    
    return yearsList.map(yVal => ({
      name: `${yVal} ${language === 'ru' ? 'лет' : 'years'}`,
      [language === 'ru' ? 'Аренда' : 'Rent']: Math.round(r * 12 * yVal),
      [language === 'ru' ? 'Покупка' : 'Buy']: result ? Math.round(result.mortgageMonthly * 12 * yVal + dp) : 0,
    }))
  }, [r, result, dp, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Аренда за период' : 'Rent Total', value: formatCurrency(Math.round(result.rentTotal), language) },
      { label: language === 'ru' ? 'Покупка за период' : 'Buy Total', value: formatCurrency(Math.round(result.buyTotal), language) },
      { label: language === 'ru' ? 'Разница' : 'Difference', value: formatCurrency(Math.round(Math.abs(result.diff)), language) },
      { label: language === 'ru' ? 'Рекомендация' : 'Recommendation', value: result.recommendation },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Аренда (₽/мес)' : 'Rent (₽/mo)'}
          </label>
          <input type="number" className="input w-full" value={rent} onChange={(e) => handleRentChange(e.target.value)} />
          {rentError && <p className="text-xs text-red-500 mt-1">{rentError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Стоимость жилья (₽)' : 'Property Price (₽)'}
          </label>
          <input type="number" className="input w-full" value={propertyPrice} onChange={(e) => handlePropertyPriceChange(e.target.value)} />
          {propertyPriceError && <p className="text-xs text-red-500 mt-1">{propertyPriceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Первоначальный взнос (₽)' : 'Down Payment (₽)'}
          </label>
          <input type="number" className="input w-full" value={downPayment} onChange={(e) => handleDownPaymentChange(e.target.value)} />
          {downPaymentError && <p className="text-xs text-red-500 mt-1">{downPaymentError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ставка (%)' : 'Rate (%)'}
          </label>
          <input type="number" className="input w-full" value={mortgageRate} onChange={(e) => handleMortgageRateChange(e.target.value)} />
          {mortgageRateError && <p className="text-xs text-red-500 mt-1">{mortgageRateError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Сравнить за (лет)' : 'Compare for (years)'}
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
                {language === 'ru' ? 'Сравнение за период' : 'Period Comparison'}
              </h3>
              <DonutChartWidget 
                data={comparisonData} 
                height={250}
                centerLabel={language === 'ru' ? 'Разница' : 'Diff'}
                centerValue={`${Math.round(Math.abs(result.diff) / 1000)}K`}
              />
            </div>

            {/* По годам */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'По годам' : 'Year by Year'}
              </h3>
              <BarChartWidget 
                data={yearByYear}
                dataKeys={[
                  { key: language === 'ru' ? 'Аренда' : 'Rent', color: '#ef4444' },
                  { key: language === 'ru' ? 'Покупка' : 'Buy', color: '#22c55e' },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Аренда vs Покупка' : 'Rent vs Buy'}
            </h3>
            <HorizontalBarWidget data={comparisonData} />
          </div>

          {/* Рекомендация */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
            </h3>
            <p className="text-2xl font-bold text-primary">{result.recommendation}</p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
