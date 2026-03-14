'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { 
  PieChartWidget, 
  BarChartWidget,
  LineChartWidget,
  ProgressBarsWidget, 
  StatsCardsWidget,
  DonutChartWidget,
  HorizontalBarWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function ElectricityBillCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [day, setDay] = useState('120')
  const [night, setNight] = useState('80')
  const [dayRate, setDayRate] = useState('6.5')
  const [nightRate, setNightRate] = useState('3.5')
  const [dayError, setDayError] = useState('')
  const [nightError, setNightError] = useState('')
  const [dayRateError, setDayRateError] = useState('')
  const [nightRateError, setNightRateError] = useState('')

  const d = Number(day)
  const n = Number(night)
  const dr = Number(dayRate)
  const nr = Number(nightRate)

  // Обработчики для валидации
  const handleDayChange = (value: string) => {
    setDay(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDayError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDayError('')
      }
    } else {
      setDayError('')
    }
  }

  const handleNightChange = (value: string) => {
    setNight(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setNightError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setNightError('')
      }
    } else {
      setNightError('')
    }
  }

  const handleDayRateChange = (value: string) => {
    setDayRate(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDayRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDayRateError('')
      }
    } else {
      setDayRateError('')
    }
  }

  const handleNightRateChange = (value: string) => {
    setNightRate(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setNightRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setNightRateError('')
      }
    } else {
      setNightRateError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const dayCost = d * dr
    const nightCost = n * nr
    const total = dayCost + nightCost
    const totalKwh = d + n
    return { total, dayCost, nightCost, totalKwh }
  }, [d, n, dr, nr])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Дневное потребление' : 'Day Usage', value: Number(day) },
      { name: language === 'ru' ? 'Ночное потребление' : 'Night Usage', value: Number(night) },
    ]
  }, [result, day, night, language])

  // Данные для диаграммы стоимости
  const costPieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Дневная стоимость' : 'Day Cost', value: Math.round(result.dayCost) },
      { name: language === 'ru' ? 'Ночная стоимость' : 'Night Cost', value: Math.round(result.nightCost) },
    ]
  }, [result, language])

  // Данные для столбчатой диаграммы
  const barData = useMemo(() => {
    if (!result) return []
    return [
      { 
        name: language === 'ru' ? 'День' : 'Day', 
        [language === 'ru' ? 'Потребление (кВт·ч)' : 'Usage (kWh)']: d,
        [language === 'ru' ? 'Стоимость (₽)' : 'Cost (₽)']: Math.round(result.dayCost) 
      },
      { 
        name: language === 'ru' ? 'Ночь' : 'Night', 
        [language === 'ru' ? 'Потребление (кВт·ч)' : 'Usage (kWh)']: n,
        [language === 'ru' ? 'Стоимость (₽)' : 'Cost (₽)']: Math.round(result.nightCost) 
      },
    ]
  }, [result, d, n, language])

  // Прогноз годового потребления (детерминированные сезонные коэффициенты)
  const yearlyProjection = useMemo(() => {
    if (!result) return []
    
    // Сезонные коэффициенты для каждого месяца (зимой больше, летом меньше)
    const seasonalFactors = [1.3, 1.25, 1.1, 0.95, 0.85, 0.8, 0.8, 0.85, 0.9, 1.0, 1.15, 1.25]
    
    return Array.from({ length: 12 }, (_, i) => ({
      name: language === 'ru' 
        ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][i]
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      [language === 'ru' ? 'Потребление (кВт·ч)' : 'Usage (kWh)']: Math.round((d + n) * seasonalFactors[i]),
    }))
  }, [result, d, n, language])

  // Сравнение тарифов
  const tariffComparison = useMemo(() => {
    if (!result) return []
    
    const singleRate = 5.5
    const singleRateCost = result.totalKwh * singleRate
    
    return [
      { label: language === 'ru' ? 'Двухтарифный' : 'Two-rate', value: Math.round(result.total), color: '#22c55e' },
      { label: language === 'ru' ? 'Однотарифный' : 'Single-rate', value: Math.round(singleRateCost), color: '#6366f1' },
    ]
  }, [result, language])

  // Экономия
  const savings = useMemo(() => {
    if (!result) return null
    
    const singleRate = 5.5
    const singleRateCost = result.totalKwh * singleRate
    const saved = singleRateCost - result.total
    
    return {
      amount: saved,
      percent: ((saved / singleRateCost) * 100)
    }
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result || !savings) return []
    
    return [
      { 
        label: language === 'ru' ? 'К оплате' : 'Total Due', 
        value: formatCurrency(Math.round(result.total), language) 
      },
      { 
        label: language === 'ru' ? 'Всего кВт·ч' : 'Total kWh', 
        value: result.totalKwh 
      },
      { 
        label: language === 'ru' ? 'Дневная стоимость' : 'Day Cost', 
        value: formatCurrency(Math.round(result.dayCost), language) 
      },
      { 
        label: language === 'ru' ? 'Экономия' : 'Savings', 
        value: `${formatCurrency(Math.round(savings.amount), language)} (${formatPercent(savings.percent)})` 
      },
    ]
  }, [result, savings, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Дневные показания (кВт·ч)' : 'Day Reading (kWh)'}
          </label>
          <input type="number" className="input w-full" value={day} onChange={(e) => handleDayChange(e.target.value)} />
          {dayError && <p className="text-xs text-red-500 mt-1">{dayError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ночные показания (кВт·ч)' : 'Night Reading (kWh)'}
          </label>
          <input type="number" className="input w-full" value={night} onChange={(e) => handleNightChange(e.target.value)} />
          {nightError && <p className="text-xs text-red-500 mt-1">{nightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Дневной тариф (₽/кВт·ч)' : 'Day Rate (₽/kWh)'}
          </label>
          <input type="number" className="input w-full" value={dayRate} onChange={(e) => handleDayRateChange(e.target.value)} />
          {dayRateError && <p className="text-xs text-red-500 mt-1">{dayRateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ночной тариф (₽/кВт·ч)' : 'Night Rate (₽/kWh)'}
          </label>
          <input type="number" className="input w-full" value={nightRate} onChange={(e) => handleNightRateChange(e.target.value)} />
          {nightRateError && <p className="text-xs text-red-500 mt-1">{nightRateError}</p>}
        </div>
      </div>

      {result && savings && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Распределение потребления */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Распределение потребления' : 'Usage Distribution'}
              </h3>
              <PieChartWidget data={pieData} height={250} />
            </div>

            {/* Распределение стоимости */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Распределение стоимости' : 'Cost Distribution'}
              </h3>
              <DonutChartWidget 
                data={costPieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={formatCurrency(Math.round(result.total), language)}
              />
            </div>
          </div>

          {/* Сравнение тарифов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение тарифов' : 'Tariff Comparison'}
            </h3>
            <HorizontalBarWidget data={tariffComparison} />
            <p className="text-xs text-muted mt-4 text-center">
              * {language === 'ru' 
                ? 'При однотарифном учёте по ставке 5.5 ₽/кВт·ч' 
                : 'With single-rate metering at 5.5 ₽/kWh'}
            </p>
          </div>

          {/* Прогноз годового потребления */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Прогноз годового потребления' : 'Yearly Usage Forecast'}
            </h3>
            <LineChartWidget 
              data={yearlyProjection}
              dataKeys={[
                { key: language === 'ru' ? 'Потребление (кВт·ч)' : 'Usage (kWh)', color: '#6366f1' },
              ]}
              height={250}
            />
          </div>

          {/* Советы по экономии */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Советы по экономии' : 'Energy Saving Tips'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Используйте стиральную машину и посудомойку ночью' : 'Use washing machine and dishwasher at night'}</li>
              <li>• {language === 'ru' ? 'Замените лампочки на энергосберегающие LED' : 'Replace bulbs with energy-saving LEDs'}</li>
              <li>• {language === 'ru' ? 'Отключайте приборы из розетки, когда не используете' : 'Unplug appliances when not in use'}</li>
              <li>• {language === 'ru' ? 'Используйте терморегуляторы для отопления' : 'Use thermostats for heating'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
