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

export function EvChargingCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [batteryCapacity, setBatteryCapacity] = useState('70')
  const [currentCharge, setCurrentCharge] = useState('20')
  const [targetCharge, setTargetCharge] = useState('80')
  const [electricityPrice, setElectricityPrice] = useState('5')
  const [batteryCapacityError, setBatteryCapacityError] = useState('')
  const [currentChargeError, setCurrentChargeError] = useState('')
  const [targetChargeError, setTargetChargeError] = useState('')
  const [electricityPriceError, setElectricityPriceError] = useState('')

  const bc = Number(batteryCapacity)
  const cc = Number(currentCharge)
  const tc = Number(targetCharge)
  const ep = Number(electricityPrice)

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
    const energyNeeded = bc * (tc - cc) / 100
    const cost = energyNeeded * ep
    const range = bc * 5 // примерно 5 км на кВт⋅ч
    const costPerKm = ep / 5
    return { energyNeeded, cost, range: Math.round(range), costPerKm }
  }, [bc, cc, tc, ep])

  // Сравнение с бензином
  const fuelComparison = useMemo(() => {
    if (!result) return []
    const gasCostPerKm = 55 / 10 // 55 ₽/л, 10 л/100км
    return [
      { label: language === 'ru' ? 'Электро' : 'Electric', value: Math.round(result.costPerKm * 100) / 100, color: '#22c55e' },
      { label: language === 'ru' ? 'Бензин' : 'Gas', value: Math.round(gasCostPerKm * 100) / 100, color: '#ef4444' },
    ]
  }, [result, language])

  // Стоимость зарядки по уровням
  const chargeLevels = useMemo(() => {
    const levels = [20, 40, 60, 80, 100]
    
    return levels.map(level => ({
      name: `${level}%`,
      [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(bc * level / 100 * ep),
    }))
  }, [bc, ep, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Энергия' : 'Energy', value: `${result.energyNeeded.toFixed(1)} кВт⋅ч` },
      { label: language === 'ru' ? 'Стоимость' : 'Cost', value: formatCurrency(Math.round(result.cost), language) },
      { label: language === 'ru' ? 'Запас хода' : 'Range', value: `${result.range} км` },
      { label: language === 'ru' ? 'Цена за км' : 'Cost per km', value: formatCurrency(Math.round(result.costPerKm * 100) / 100, language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Батарея (кВт⋅ч)' : 'Battery (kWh)'}
          </label>
          <input type="number" className="input w-full" value={batteryCapacity} onChange={(e) => { const v = e.target.value; setBatteryCapacity(v); validateField(v, setBatteryCapacityError); }} />
          {batteryCapacityError && <p className="text-xs text-red-500 mt-1">{batteryCapacityError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Текущий заряд (%)' : 'Current Charge (%)'}
          </label>
          <input type="number" className="input w-full" value={currentCharge} onChange={(e) => { const v = e.target.value; setCurrentCharge(v); validateField(v, setCurrentChargeError); }} />
          {currentChargeError && <p className="text-xs text-red-500 mt-1">{currentChargeError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Зарядить до (%)' : 'Charge to (%)'}
          </label>
          <input type="number" className="input w-full" value={targetCharge} onChange={(e) => { const v = e.target.value; setTargetCharge(v); validateField(v, setTargetChargeError); }} />
          {targetChargeError && <p className="text-xs text-red-500 mt-1">{targetChargeError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена электричества (₽/кВт⋅ч)' : 'Electricity Price (₽/kWh)'}
          </label>
          <input type="number" className="input w-full" value={electricityPrice} onChange={(e) => { const v = e.target.value; setElectricityPrice(v); validateField(v, setElectricityPriceError); }} />
          {electricityPriceError && <p className="text-xs text-red-500 mt-1">{electricityPriceError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Сравнение с бензином */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Электро vs Бензин (₽/км)' : 'Electric vs Gas (₽/km)'}
              </h3>
              <DonutChartWidget 
                data={fuelComparison}
                height={250}
                centerLabel={language === 'ru' ? 'Экономия' : 'Savings'}
                centerValue={formatPercent((55/10 - result.costPerKm) * 100)}
              />
            </div>

            {/* Стоимость зарядки */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Полная зарядка' : 'Full Charge Cost'}
              </h3>
              <BarChartWidget 
                data={chargeLevels}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#22c55e' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Стоимость за км' : 'Cost per km'}
            </h3>
            <HorizontalBarWidget data={fuelComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
