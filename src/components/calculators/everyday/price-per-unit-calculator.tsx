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

export function PricePerUnitCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [product1, setProduct1] = useState({ price: '300', amount: '1', unit: 'kg', name: language === 'ru' ? 'Продукт 1' : 'Product 1' })
  const [product2, setProduct2] = useState({ price: '450', amount: '2', unit: 'kg', name: language === 'ru' ? 'Продукт 2' : 'Product 2' })
  const [product1PriceError, setProduct1PriceError] = useState('')
  const [product1AmountError, setProduct1AmountError] = useState('')
  const [product2PriceError, setProduct2PriceError] = useState('')
  const [product2AmountError, setProduct2AmountError] = useState('')

  const p1 = Number(product1.price)
  const a1 = Number(product1.amount)
  const p2 = Number(product2.price)
  const a2 = Number(product2.amount)

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
    const ppu1 = p1 / a1
    const ppu2 = p2 / a2
    
    const better = ppu1 < ppu2 ? product1.name : product2.name
    const savings = Math.abs(ppu1 - ppu2) * Math.max(a1, a2)

    return { pricePerUnit1: ppu1, pricePerUnit2: ppu2, better, savings }
  }, [p1, a1, p2, a2, product1.name, product2.name])

  // Данные для сравнения
  const comparisonData = useMemo(() => {
    if (!result) return []
    return [
      { label: product1.name, value: Math.round(result.pricePerUnit1 * 100) / 100, color: '#6366f1' },
      { label: product2.name, value: Math.round(result.pricePerUnit2 * 100) / 100, color: '#22c55e' },
    ]
  }, [result, product1.name, product2.name])

  // Сравнение цен
  const priceComparison = useMemo(() => {
    return [
      { name: language === 'ru' ? 'Полная цена' : 'Full Price', [product1.name]: Number(product1.price), [product2.name]: Number(product2.price) },
      { name: language === 'ru' ? 'За единицу' : 'Per Unit', [product1.name]: Math.round(result?.pricePerUnit1 || 0), [product2.name]: Math.round(result?.pricePerUnit2 || 0) },
    ]
  }, [product1, product2, result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: `${product1.name} - ${language === 'ru' ? 'за ед.' : 'per unit'}`, value: formatCurrency(Math.round(result.pricePerUnit1 * 100) / 100, language) },
      { label: `${product2.name} - ${language === 'ru' ? 'за ед.' : 'per unit'}`, value: formatCurrency(Math.round(result.pricePerUnit2 * 100) / 100, language) },
      { label: language === 'ru' ? 'Выгоднее' : 'Better Deal', value: result.better },
      { label: language === 'ru' ? 'Экономия' : 'Savings', value: formatCurrency(Math.round(result.savings), language) },
    ]
  }, [result, product1.name, product2.name, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Продукт 1 */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-4">{product1.name}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Цена (₽)' : 'Price (₽)'}</label>
              <input type="number" className="input w-full" value={product1.price} onChange={(e) => { const v = e.target.value; setProduct1({ ...product1, price: v }); validateField(v, setProduct1PriceError); }} />
              {product1PriceError && <p className="text-xs text-red-500 mt-1">{product1PriceError}</p>}
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Количество' : 'Amount'}</label>
              <input type="number" className="input w-full" value={product1.amount} onChange={(e) => { const v = e.target.value; setProduct1({ ...product1, amount: v }); validateField(v, setProduct1AmountError); }} />
              {product1AmountError && <p className="text-xs text-red-500 mt-1">{product1AmountError}</p>}
            </div>
          </div>
        </div>

        {/* Продукт 2 */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-4">{product2.name}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Цена (₽)' : 'Price (₽)'}</label>
              <input type="number" className="input w-full" value={product2.price} onChange={(e) => { const v = e.target.value; setProduct2({ ...product2, price: v }); validateField(v, setProduct2PriceError); }} />
              {product2PriceError && <p className="text-xs text-red-500 mt-1">{product2PriceError}</p>}
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Количество' : 'Amount'}</label>
              <input type="number" className="input w-full" value={product2.amount} onChange={(e) => { const v = e.target.value; setProduct2({ ...product2, amount: v }); validateField(v, setProduct2AmountError); }} />
              {product2AmountError && <p className="text-xs text-red-500 mt-1">{product2AmountError}</p>}
            </div>
          </div>
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
                {language === 'ru' ? 'Цена за единицу' : 'Price Per Unit'}
              </h3>
              <DonutChartWidget 
                data={comparisonData} 
                height={250}
                centerLabel={language === 'ru' ? 'Разница' : 'Diff'}
                centerValue={`${Math.round(Math.abs(result.pricePerUnit1 - result.pricePerUnit2))} ₽`}
              />
            </div>

            {/* Сравнение цен */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение' : 'Comparison'}
              </h3>
              <BarChartWidget 
                data={priceComparison}
                dataKeys={[
                  { key: product1.name, color: '#6366f1' },
                  { key: product2.name, color: '#22c55e' },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Цена за единицу' : 'Price Per Unit'}
            </h3>
            <HorizontalBarWidget data={comparisonData} />
          </div>

          {/* Рекомендация */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
            </h3>
            <p className="text-2xl font-bold text-primary">{result.better}</p>
            <p className="text-sm text-muted mt-2">
              {language === 'ru' ? 'выгоднее на' : 'is cheaper by'} {Math.round(result.savings)} ₽
            </p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
