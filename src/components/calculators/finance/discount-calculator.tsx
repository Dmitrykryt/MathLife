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

export function DiscountCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [price, setPrice] = useState('5000')
  const [discount1, setDiscount1] = useState('20')
  const [discount2, setDiscount2] = useState('10')
  const [coupon, setCoupon] = useState('500')
  const [priceError, setPriceError] = useState('')
  const [discount1Error, setDiscount1Error] = useState('')
  const [discount2Error, setDiscount2Error] = useState('')
  const [couponError, setCouponError] = useState('')

  const p = Number(price)
  const d1 = Number(discount1) / 100
  const d2 = Number(discount2) / 100
  const c = Number(coupon)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(priceError || discount1Error || discount2Error || couponError)
  const hasEmptyValues = !price

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

  const handleDiscount1Change = (value: string) => {
    setDiscount1(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDiscount1Error(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDiscount1Error('')
      }
    } else {
      setDiscount1Error('')
    }
  }

  const handleDiscount2Change = (value: string) => {
    setDiscount2(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDiscount2Error(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDiscount2Error('')
      }
    } else {
      setDiscount2Error('')
    }
  }

  const handleCouponChange = (value: string) => {
    setCoupon(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setCouponError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setCouponError('')
      }
    } else {
      setCouponError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (hasErrors || hasEmptyValues) return null
    const afterDiscount1 = p * (1 - d1)
    const afterDiscount2 = afterDiscount1 * (1 - d2)
    const final = Math.max(0, afterDiscount2 - c)
    const totalSaved = p - final
    const effectiveDiscount = p > 0 ? (totalSaved / p) * 100 : 0
    return { afterDiscount1, afterDiscount2, final, totalSaved, effectiveDiscount }
  }, [p, d1, d2, c, hasErrors, hasEmptyValues])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Итоговая цена' : 'Final Price', value: Math.round(result.final) },
      { name: language === 'ru' ? 'Сэкономлено' : 'Saved', value: Math.round(result.totalSaved) },
    ]
  }, [result, language])

  // Поэтапное применение скидок
  const stepData = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Исходная цена' : 'Original', value: Math.round(p), color: '#6366f1' },
      { label: language === 'ru' ? `После ${discount1}%` : `After ${discount1}%`, value: Math.round(result.afterDiscount1), color: '#8b5cf6' },
      { label: language === 'ru' ? `После ${discount2}%` : `After ${discount2}%`, value: Math.round(result.afterDiscount2), color: '#a855f7' },
      { label: language === 'ru' ? 'Финальная' : 'Final', value: Math.round(result.final), color: '#22c55e' },
    ]
  }, [result, p, discount1, discount2, language])

  // Сравнение скидок
  const discountComparison = useMemo(() => {
    const discounts = [5, 10, 15, 20, 25, 30, 40, 50]
    
    return discounts.map(d => ({
      name: `${d}%`,
      [language === 'ru' ? 'Цена' : 'Price']: Math.round(p * (1 - d / 100)),
      [language === 'ru' ? 'Экономия' : 'Saved']: Math.round(p * d / 100),
    }))
  }, [p, language])

  // Накопительные скидки
  const cumulativeDiscounts = useMemo(() => {
    if (!result) return []
    
    const single = p * Number(discount1) / 100
    
    return [
      { label: language === 'ru' ? 'Одна скидка' : 'Single Discount', value: Math.round(single), color: '#6366f1' },
      { label: language === 'ru' ? 'Комбо скидок' : 'Combo Discounts', value: Math.round(result.totalSaved), color: '#22c55e' },
    ]
  }, [result, p, discount1, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Исходная цена' : 'Original Price', value: formatCurrency(p, language) },
      { label: language === 'ru' ? 'Итоговая цена' : 'Final Price', value: formatCurrency(Math.round(result.final), language) },
      { label: language === 'ru' ? 'Сэкономлено' : 'Saved', value: formatCurrency(Math.round(result.totalSaved), language) },
      { label: language === 'ru' ? 'Эффективная скидка' : 'Effective Discount', value: formatPercent(result.effectiveDiscount) },
    ]
  }, [result, p, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Исходная цена' : 'Original Price'}
          </label>
          <input type="number" className="input w-full" value={price} onChange={(e) => handlePriceChange(e.target.value)} />
          {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Первая скидка (%)' : 'First Discount (%)'}
          </label>
          <input type="number" className="input w-full" value={discount1} onChange={(e) => handleDiscount1Change(e.target.value)} />
          {discount1Error && <p className="text-xs text-red-500 mt-1">{discount1Error}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Вторая скидка (%)' : 'Second Discount (%)'}
          </label>
          <input type="number" className="input w-full" value={discount2} onChange={(e) => handleDiscount2Change(e.target.value)} />
          {discount2Error && <p className="text-xs text-red-500 mt-1">{discount2Error}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Купон (₽)' : 'Coupon (₽)'}
          </label>
          <input type="number" className="input w-full" value={coupon} onChange={(e) => handleCouponChange(e.target.value)} />
          {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
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
                {language === 'ru' ? 'Распределение цены' : 'Price Distribution'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Скидка' : 'Discount'}
                centerValue={formatPercent(result.effectiveDiscount)}
              />
            </div>

            {/* Эффективная скидка */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Эффективная скидка' : 'Effective Discount'}
              </h3>
              <CircularProgressWidget 
                value={result.effectiveDiscount} 
                maxValue={100} 
                label={formatPercent(result.effectiveDiscount)}
                color="#22c55e"
                size={160}
              />
            </div>
          </div>

          {/* Поэтапное применение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Поэтапное применение скидок' : 'Step-by-Step Discount Application'}
            </h3>
            <HorizontalBarWidget data={stepData} maxValue={p * 1.1} />
          </div>

          {/* Сравнение скидок */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение скидок' : 'Discount Comparison'}
            </h3>
            <BarChartWidget 
              data={discountComparison}
              dataKeys={[
                { key: language === 'ru' ? 'Цена' : 'Price', color: '#6366f1' },
                { key: language === 'ru' ? 'Экономия' : 'Saved', color: '#22c55e' },
              ]}
              height={250}
            />
          </div>

          {/* Накопительные скидки */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Одна скидка vs Комбо' : 'Single vs Combo Discounts'}
            </h3>
            <ProgressBarsWidget data={cumulativeDiscounts} />
          </div>

          {/* Совет */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Совет' : 'Tip'}
            </h3>
            <p className="text-sm text-muted">
              {language === 'ru' 
                ? 'Накопительные скидки дают большую выгоду, чем одна большая скидка. Комбинируйте промокоды и распродажи!'
                : 'Stacked discounts often give more savings than a single large discount. Combine promo codes with sales!'}
            </p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
