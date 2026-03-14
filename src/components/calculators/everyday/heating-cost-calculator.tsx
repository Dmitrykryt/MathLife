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

export function HeatingCostCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [area, setArea] = useState('50')
  const [rate, setRate] = useState('45')
  const [months, setMonths] = useState('7')
  const [areaError, setAreaError] = useState('')
  const [rateError, setRateError] = useState('')
  const [monthsError, setMonthsError] = useState('')

  const a = Number(area)
  const r = Number(rate)
  const m = Number(months)

  // Обработчики для валидации
  const handleAreaChange = (value: string) => {
    setArea(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setAreaError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setAreaError('')
      }
    } else {
      setAreaError('')
    }
  }

  const handleRateChange = (value: string) => {
    setRate(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setRateError('')
      }
    } else {
      setRateError('')
    }
  }

  const handleMonthsChange = (value: string) => {
    setMonths(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setMonthsError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setMonthsError('')
      }
    } else {
      setMonthsError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const monthly = a * r
    const seasonal = monthly * m
    const perSqm = r
    return { monthly, seasonal, perSqm }
  }, [a, r, m])

  // Данные по месяцам (детерминированные коэффициенты)
  const monthlyData = useMemo(() => {
    if (!result) return []
    
    // Коэффициенты для отопительных месяцев (зимой больше)
    const heatingCoeffs = [0.9, 1.1, 1.2, 1.3, 1.2, 1.0, 0.8]
    
    const heatingMonths = language === 'ru'
      ? ['Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр']
      : ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
    
    return heatingMonths.map((month, i) => ({
      name: month,
      [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(result.monthly * heatingCoeffs[i]),
    }))
  }, [result, language])

  // Сравнение площадей
  const areaComparison = useMemo(() => {
    const areas = [30, 40, 50, 60, 70, 80, 100]
    
    return areas.map(areaVal => ({
      name: `${areaVal} м²`,
      [language === 'ru' ? 'В месяц' : 'Monthly']: areaVal * r,
    }))
  }, [r, language])

  // Распределение сезонных расходов
  const seasonalBreakdown = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'За сезон' : 'Seasonal', value: Math.round(result.seasonal), color: '#ef4444' },
      { label: language === 'ru' ? 'В месяц' : 'Monthly', value: Math.round(result.monthly), color: '#f59e0b' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'В месяц' : 'Monthly', value: formatCurrency(Math.round(result.monthly), language) },
      { label: language === 'ru' ? 'За сезон' : 'Seasonal', value: formatCurrency(Math.round(result.seasonal), language) },
      { label: language === 'ru' ? 'За м²' : 'Per m²', value: formatCurrency(r, language) },
      { label: language === 'ru' ? 'Площадь' : 'Area', value: `${a} м²` },
    ]
  }, [result, a, r, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Площадь квартиры (м²)' : 'Apartment Area (m²)'}
          </label>
          <input type="number" className="input w-full" value={area} onChange={(e) => handleAreaChange(e.target.value)} />
          {areaError && <p className="text-xs text-red-500 mt-1">{areaError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Тариф (₽/м²)' : 'Rate (₽/m²)'}
          </label>
          <input type="number" className="input w-full" value={rate} onChange={(e) => handleRateChange(e.target.value)} />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Месяцев отопления' : 'Heating Months'}
          </label>
          <input type="number" className="input w-full" value={months} onChange={(e) => handleMonthsChange(e.target.value)} />
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
                {language === 'ru' ? 'Сезонные расходы' : 'Seasonal Costs'}
              </h3>
              <DonutChartWidget 
                data={[
                  { name: language === 'ru' ? 'Отопление' : 'Heating', value: Math.round(result.seasonal) },
                  { name: language === 'ru' ? 'Другие расходы' : 'Other', value: Math.round(result.seasonal * 0.3) },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'За сезон' : 'Season'}
                centerValue={formatCurrency(Math.round(result.seasonal), language)}
              />
            </div>

            {/* По месяцам */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Расходы по месяцам' : 'Monthly Costs'}
              </h3>
              <BarChartWidget 
                data={monthlyData}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#ef4444' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение площадей */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение по площади' : 'Comparison by Area'}
            </h3>
            <HorizontalBarWidget data={seasonalBreakdown} />
          </div>

          {/* Сравнение площадей */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Стоимость для разных площадей' : 'Cost for Different Areas'}
            </h3>
            <BarChartWidget 
              data={areaComparison}
              dataKeys={[{ key: language === 'ru' ? 'В месяц' : 'Monthly', color: '#f59e0b' }]}
              height={250}
            />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
