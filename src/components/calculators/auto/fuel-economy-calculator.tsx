'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
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

export function FuelEconomyCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [liters, setLiters] = useState('45')
  const [distance, setDistance] = useState('500')
  const [fuelPrice, setFuelPrice] = useState('55')
  const [litersError, setLitersError] = useState('')
  const [distanceError, setDistanceError] = useState('')
  const [fuelPriceError, setFuelPriceError] = useState('')

  const l = Number(liters)
  const d = Number(distance)
  const fp = Number(fuelPrice)

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
    const consumption = (l / d) * 100
    const costPer100km = consumption * fp
    const range = (l / consumption) * 100
    return { consumption, costPer100km, range: Math.round(range) }
  }, [l, d, fp])

  // Сравнение с эталонами
  const comparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Ваш авто' : 'Your Car', value: result.consumption, color: '#6366f1' },
      { label: language === 'ru' ? 'Экономный' : 'Economical', value: 6, color: '#22c55e' },
      { label: language === 'ru' ? 'Средний' : 'Average', value: 9, color: '#f59e0b' },
      { label: language === 'ru' ? 'Внедорожник' : 'SUV', value: 12, color: '#ef4444' },
    ]
  }, [result, language])

  // Стоимость на разных расстояниях
  const distanceCost = useMemo(() => {
    if (!result) return []
    const distances = [100, 250, 500, 1000, 2000]
    
    return distances.map(d => ({
      name: `${d} km`,
      [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(d / 100 * result.costPer100km),
    }))
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Расход' : 'Consumption', value: `${result.consumption.toFixed(1)} л/100км` },
      { label: language === 'ru' ? 'Стоимость 100км' : 'Cost per 100km', value: `${Math.round(result.costPer100km)} ₽` },
      { label: language === 'ru' ? 'Запас хода' : 'Range', value: `${result.range} км` },
      { label: language === 'ru' ? 'Топлива' : 'Fuel', value: `${l} л` },
    ]
  }, [result, l, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Заправлено (л)' : 'Fuel Added (l)'}
          </label>
          <input type="number" className="input w-full" value={liters} onChange={(e) => { const v = e.target.value; setLiters(v); validateField(v, setLitersError); }} />
          {litersError && <p className="text-xs text-red-500 mt-1">{litersError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Пройдено (км)' : 'Distance (km)'}
          </label>
          <input type="number" className="input w-full" value={distance} onChange={(e) => { const v = e.target.value; setDistance(v); validateField(v, setDistanceError); }} />
          {distanceError && <p className="text-xs text-red-500 mt-1">{distanceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена топлива (₽/л)' : 'Fuel Price (₽/l)'}
          </label>
          <input type="number" className="input w-full" value={fuelPrice} onChange={(e) => { const v = e.target.value; setFuelPrice(v); validateField(v, setFuelPriceError); }} />
          {fuelPriceError && <p className="text-xs text-red-500 mt-1">{fuelPriceError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Сравнение */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение расхода' : 'Consumption Comparison'}
              </h3>
              <BarChartWidget 
                data={comparison.map(d => ({ name: d.label, [language === 'ru' ? 'Расход' : 'Consumption']: d.value }))}
                dataKeys={[{ key: language === 'ru' ? 'Расход' : 'Consumption', color: '#6366f1' }]}
                height={250}
              />
            </div>

            {/* Стоимость на разных расстояниях */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Стоимость поездок' : 'Trip Costs'}
              </h3>
              <BarChartWidget 
                data={distanceCost}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#22c55e' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение с другими авто' : 'Comparison with Other Cars'}
            </h3>
            <HorizontalBarWidget data={comparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
