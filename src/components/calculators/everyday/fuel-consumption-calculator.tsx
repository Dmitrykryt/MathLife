'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { 
  BarChartWidget, 
  LineChartWidget,
  ProgressBarsWidget, 
  StatsCardsWidget,
  HorizontalBarWidget,
  CircularProgressWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function FuelConsumptionCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [distance, setDistance] = useState('500')
  const [fuelUsed, setFuelUsed] = useState('40')
  const [fuelPrice, setFuelPrice] = useState('50')
  const [distanceError, setDistanceError] = useState('')
  const [fuelUsedError, setFuelUsedError] = useState('')
  const [fuelPriceError, setFuelPriceError] = useState('')

  const d = Number(distance)
  const f = Number(fuelUsed)
  const p = Number(fuelPrice)

  // Обработчики для валидации
  const handleDistanceChange = (value: string) => {
    setDistance(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDistanceError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDistanceError('')
      }
    } else {
      setDistanceError('')
    }
  }

  const handleFuelUsedChange = (value: string) => {
    setFuelUsed(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setFuelUsedError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setFuelUsedError('')
      }
    } else {
      setFuelUsedError('')
    }
  }

  const handleFuelPriceChange = (value: string) => {
    setFuelPrice(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setFuelPriceError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setFuelPriceError('')
      }
    } else {
      setFuelPriceError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (d > 0 && f > 0) {
      const consumption = (f / d) * 100
      const cost = (f * p)
      return { consumption, cost }
    }
    return null
  }, [d, f, p])

  // Сравнение с эталонными значениями
  const comparisonData = useMemo(() => {
    if (!result) return []
    
    return [
      { 
        label: language === 'ru' ? 'Ваш авто' : 'Your Car', 
        value: result.consumption, 
        color: '#6366f1' 
      },
      { 
        label: language === 'ru' ? 'Экономный авто' : 'Economy Car', 
        value: 6, 
        color: '#22c55e' 
      },
      { 
        label: language === 'ru' ? 'Средний авто' : 'Average Car', 
        value: 8, 
        color: '#f59e0b' 
      },
      { 
        label: language === 'ru' ? 'Внедорожник' : 'SUV', 
        value: 12, 
        color: '#ef4444' 
      },
    ]
  }, [result, language])

  // Стоимость на разных расстояниях
  const distanceCostData = useMemo(() => {
    if (!result) return []
    
    const pricePerKm = (f * p) / d
    
    return [
      { name: '100 km', [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(pricePerKm * 100) },
      { name: '250 km', [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(pricePerKm * 250) },
      { name: '500 km', [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(pricePerKm * 500) },
      { name: '1000 km', [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(pricePerKm * 1000) },
      { name: '2000 km', [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(pricePerKm * 2000) },
    ]
  }, [result, d, f, p, language])

  // Годовые расходы
  const yearlyCostData = useMemo(() => {
    if (!result) return []
    
    const pricePerKm = (f * p) / d
    
    return [
      { label: language === 'ru' ? '5 000 км/год' : '5,000 km/year', value: Math.round(pricePerKm * 5000), color: '#22c55e' },
      { label: language === 'ru' ? '10 000 км/год' : '10,000 km/year', value: Math.round(pricePerKm * 10000), color: '#6366f1' },
      { label: language === 'ru' ? '20 000 км/год' : '20,000 km/year', value: Math.round(pricePerKm * 20000), color: '#f59e0b' },
      { label: language === 'ru' ? '30 000 км/год' : '30,000 km/year', value: Math.round(pricePerKm * 30000), color: '#ef4444' },
    ]
  }, [result, d, f, p, language])

  // Оценка экономичности
  const efficiencyScore = useMemo(() => {
    if (!result) return 0
    const score = Math.max(0, Math.min(100, 100 - (result.consumption - 5) * 10))
    return score
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    const pricePerKm = (f * p) / d
    
    return [
      { 
        label: language === 'ru' ? 'Расход на 100 км' : 'Consumption per 100km', 
        value: `${result.consumption.toFixed(1)} л` 
      },
      { 
        label: language === 'ru' ? 'Стоимость поездки' : 'Trip Cost', 
        value: formatCurrency(Math.round(result.cost), language) 
      },
      { 
        label: language === 'ru' ? 'Цена за 1 км' : 'Cost per km', 
        value: formatCurrency(Math.round(pricePerKm * 100) / 100, language) 
      },
      { 
        label: language === 'ru' ? 'Оценка экономичности' : 'Efficiency Score', 
        value: formatPercent(efficiencyScore) 
      },
    ]
  }, [result, d, f, p, efficiencyScore, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Пройденное расстояние (км)' : 'Distance (km)'}
          </label>
          <input type="number" className="input w-full" value={distance} onChange={(e) => handleDistanceChange(e.target.value)} />
          {distanceError && <p className="text-xs text-red-500 mt-1">{distanceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Израсходовано топлива (л)' : 'Fuel Used (liters)'}
          </label>
          <input type="number" className="input w-full" value={fuelUsed} onChange={(e) => handleFuelUsedChange(e.target.value)} />
          {fuelUsedError && <p className="text-xs text-red-500 mt-1">{fuelUsedError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена топлива (₽/л)' : 'Fuel Price (₽/L)'}
          </label>
          <input type="number" className="input w-full" value={fuelPrice} onChange={(e) => handleFuelPriceChange(e.target.value)} />
          {fuelPriceError && <p className="text-xs text-red-500 mt-1">{fuelPriceError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Оценка экономичности */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Оценка экономичности' : 'Efficiency Score'}
              </h3>
              <CircularProgressWidget 
                value={efficiencyScore} 
                maxValue={100} 
                label={efficiencyScore >= 70 ? (language === 'ru' ? 'Отлично' : 'Excellent') : efficiencyScore >= 40 ? (language === 'ru' ? 'Средне' : 'Average') : (language === 'ru' ? 'Плохо' : 'Poor')}
                color={efficiencyScore >= 70 ? '#22c55e' : efficiencyScore >= 40 ? '#f59e0b' : '#ef4444'}
                size={160}
              />
            </div>

            {/* Сравнение с эталонами */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение расхода' : 'Consumption Comparison'}
              </h3>
              <HorizontalBarWidget data={comparisonData} maxValue={15} />
            </div>
          </div>

          {/* Стоимость на разных расстояниях */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Стоимость поездок разной длины' : 'Cost for Different Distances'}
            </h3>
            <BarChartWidget 
              data={distanceCostData}
              dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', name: '₽' }]}
              height={250}
            />
          </div>

          {/* Годовые расходы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Годовые расходы на топливо' : 'Yearly Fuel Expenses'}
            </h3>
            <ProgressBarsWidget data={yearlyCostData} />
          </div>

          {/* Рекомендации */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Советы по экономии' : 'Fuel Saving Tips'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Поддерживайте равномерную скорость движения' : 'Maintain a steady speed while driving'}</li>
              <li>• {language === 'ru' ? 'Регулярно проверяйте давление в шинах' : 'Regularly check tire pressure'}</li>
              <li>• {language === 'ru' ? 'Избегайте резких ускорений и торможений' : 'Avoid rapid acceleration and braking'}</li>
              <li>• {language === 'ru' ? 'Убирайте лишний груз из багажника' : 'Remove unnecessary weight from trunk'}</li>
              <li>• {language === 'ru' ? 'Используйте круиз-контроль на трассе' : 'Use cruise control on highways'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
