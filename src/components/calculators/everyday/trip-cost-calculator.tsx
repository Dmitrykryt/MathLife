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

export function TripCostCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [distance, setDistance] = useState('500')
  const [consumption, setConsumption] = useState('8')
  const [fuelPrice, setFuelPrice] = useState('55')
  const [hotels, setHotels] = useState('2')
  const [hotelPrice, setHotelPrice] = useState('4000')
  const [food, setFood] = useState('3000')
  const [tolls, setTolls] = useState('1500')
  const [distanceError, setDistanceError] = useState('')
  const [consumptionError, setConsumptionError] = useState('')
  const [fuelPriceError, setFuelPriceError] = useState('')
  const [hotelsError, setHotelsError] = useState('')
  const [hotelPriceError, setHotelPriceError] = useState('')
  const [foodError, setFoodError] = useState('')
  const [tollsError, setTollsError] = useState('')

  const d = Number(distance)
  const c = Number(consumption)
  const fp = Number(fuelPrice)
  const h = Number(hotels)
  const hp = Number(hotelPrice)
  const f = Number(food)
  const t = Number(tolls)

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
    const fuelCost = (d / 100) * c * fp
    const hotelCost = h * hp
    const foodCost = f
    const tollsCost = t
    const total = fuelCost + hotelCost + foodCost + tollsCost
    return { fuelCost, hotelCost, foodCost, tollsCost, total }
  }, [d, c, fp, h, hp, f, t])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Топливо' : 'Fuel', value: Math.round(result.fuelCost) },
      { name: language === 'ru' ? 'Отели' : 'Hotels', value: Math.round(result.hotelCost) },
      { name: language === 'ru' ? 'Еда' : 'Food', value: Math.round(result.foodCost) },
      { name: language === 'ru' ? 'Платные дороги' : 'Tolls', value: Math.round(result.tollsCost) },
    ]
  }, [result, language])

  // Сравнение расходов
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Топливо' : 'Fuel', value: Math.round(result.fuelCost), color: '#6366f1' },
      { label: language === 'ru' ? 'Отели' : 'Hotels', value: Math.round(result.hotelCost), color: '#8b5cf6' },
      { label: language === 'ru' ? 'Еда' : 'Food', value: Math.round(result.foodCost), color: '#22c55e' },
      { label: language === 'ru' ? 'Дороги' : 'Tolls', value: Math.round(result.tollsCost), color: '#f59e0b' },
    ]
  }, [result, language])

  // Сравнение с другими расстояниями
  const distanceComparison = useMemo(() => {
    const distances = [100, 250, 500, 1000, 2000]
    
    return distances.map(d => ({
      name: `${d} km`,
      [language === 'ru' ? 'Топливо' : 'Fuel']: Math.round((d / 100) * c * fp),
    }))
  }, [c, fp, language])

  // Бюджет на человека
  const perPerson = useMemo(() => {
    if (!result) return null
    return Math.round(result.total / 2)
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Топливо' : 'Fuel', value: formatCurrency(Math.round(result.fuelCost), language) },
      { label: language === 'ru' ? 'Отели' : 'Hotels', value: formatCurrency(Math.round(result.hotelCost), language) },
      { label: language === 'ru' ? 'Еда и прочее' : 'Food & Other', value: formatCurrency(Math.round(result.foodCost + result.tollsCost), language) },
      { label: language === 'ru' ? 'Итого' : 'Total', value: formatCurrency(Math.round(result.total), language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Расстояние (км)' : 'Distance (km)'}
          </label>
          <input type="number" className="input w-full" value={distance} onChange={(e) => { const v = e.target.value; setDistance(v); validateField(v, setDistanceError); }} />
          {distanceError && <p className="text-xs text-red-500 mt-1">{distanceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Расход (л/100км)' : 'Consumption (l/100km)'}
          </label>
          <input type="number" className="input w-full" value={consumption} onChange={(e) => { const v = e.target.value; setConsumption(v); validateField(v, setConsumptionError); }} />
          {consumptionError && <p className="text-xs text-red-500 mt-1">{consumptionError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена топлива (₽/л)' : 'Fuel Price (₽/l)'}
          </label>
          <input type="number" className="input w-full" value={fuelPrice} onChange={(e) => { const v = e.target.value; setFuelPrice(v); validateField(v, setFuelPriceError); }} />
          {fuelPriceError && <p className="text-xs text-red-500 mt-1">{fuelPriceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ночей в отеле' : 'Hotel Nights'}
          </label>
          <input type="number" className="input w-full" value={hotels} onChange={(e) => { const v = e.target.value; setHotels(v); validateField(v, setHotelsError); }} />
          {hotelsError && <p className="text-xs text-red-500 mt-1">{hotelsError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена отеля/ночь (₽)' : 'Hotel Price/Night (₽)'}
          </label>
          <input type="number" className="input w-full" value={hotelPrice} onChange={(e) => { const v = e.target.value; setHotelPrice(v); validateField(v, setHotelPriceError); }} />
          {hotelPriceError && <p className="text-xs text-red-500 mt-1">{hotelPriceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Еда (₽)' : 'Food (₽)'}
          </label>
          <input type="number" className="input w-full" value={food} onChange={(e) => { const v = e.target.value; setFood(v); validateField(v, setFoodError); }} />
          {foodError && <p className="text-xs text-red-500 mt-1">{foodError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Платные дороги (₽)' : 'Tolls (₽)'}
          </label>
          <input type="number" className="input w-full" value={tolls} onChange={(e) => { const v = e.target.value; setTolls(v); validateField(v, setTollsError); }} />
          {tollsError && <p className="text-xs text-red-500 mt-1">{tollsError}</p>}
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
                {language === 'ru' ? 'Распределение расходов' : 'Cost Distribution'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={formatCurrency(Math.round(result.total), language)}
              />
            </div>

            {/* Топливо в процентах */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Доля топлива' : 'Fuel Share'}
              </h3>
              <CircularProgressWidget 
                value={(result.fuelCost / result.total) * 100} 
                maxValue={100} 
                label={formatPercent((result.fuelCost / result.total) * 100)}
                color="#6366f1"
                size={160}
              />
            </div>
          </div>

          {/* Сравнение расходов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение расходов' : 'Cost Comparison'}
            </h3>
            <HorizontalBarWidget data={costComparison} />
          </div>

          {/* Сравнение расстояний */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Стоимость топлива на разных расстояниях' : 'Fuel Cost for Different Distances'}
            </h3>
            <BarChartWidget 
              data={distanceComparison}
              dataKeys={[{ key: language === 'ru' ? 'Топливо' : 'Fuel', color: '#6366f1' }]}
              height={250}
            />
          </div>

          {/* На человека */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'На 2 человек' : 'Per 2 People'}
            </h3>
            <p className="text-3xl font-bold text-primary">{formatCurrency(perPerson ?? 0, language)}</p>
            <p className="text-sm text-muted">{language === 'ru' ? 'с каждого' : 'each'}</p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
