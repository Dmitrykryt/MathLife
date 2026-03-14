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

export function ParkingFeeCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [hours, setHours] = useState('3')
  const [rate, setRate] = useState('80')
  const [dailyMax, setDailyMax] = useState('800')
  const [hoursError, setHoursError] = useState('')
  const [rateError, setRateError] = useState('')
  const [dailyMaxError, setDailyMaxError] = useState('')

  const h = Number(hours)
  const r = Number(rate)
  const dm = Number(dailyMax)

  // Обработчики для валидации
  const handleHoursChange = (value: string) => {
    setHours(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setHoursError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setHoursError('')
      }
    } else {
      setHoursError('')
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

  const handleDailyMaxChange = (value: string) => {
    setDailyMax(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDailyMaxError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDailyMaxError('')
      }
    } else {
      setDailyMaxError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const hourly = Math.min(h * r, dm)
    const daily = dm
    const weekly = dm * 7
    const monthly = dm * 30
    const savedByDaily = Math.max(0, h * r - dm)
    return { hourly, daily, weekly, monthly, savedByDaily }
  }, [h, r, dm])

  // Сравнение периодов
  const periodComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Разово' : 'One-time', value: Math.round(result.hourly), color: '#6366f1' },
      { label: language === 'ru' ? 'День' : 'Day', value: Math.round(result.daily), color: '#8b5cf6' },
      { label: language === 'ru' ? 'Неделя' : 'Week', value: Math.round(result.weekly), color: '#22c55e' },
      { label: language === 'ru' ? 'Месяц' : 'Month', value: Math.round(result.monthly), color: '#f59e0b' },
    ]
  }, [result, language])

  // Почасовая стоимость
  const hourlyData = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 8, 10].map(h => ({
      name: `${h}h`,
      [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(Math.min(h * r, dm)),
    }))
  }, [r, dm, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'За период' : 'For Period', value: formatCurrency(Math.round(result.hourly), language) },
      { label: language === 'ru' ? 'Дневной максимум' : 'Daily Max', value: formatCurrency(Math.round(result.daily), language) },
      { label: language === 'ru' ? 'В неделю' : 'Weekly', value: formatCurrency(Math.round(result.weekly), language) },
      { label: language === 'ru' ? 'Экономия' : 'Saved', value: formatCurrency(Math.round(result.savedByDaily), language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Часы' : 'Hours'}
          </label>
          <input type="number" className="input w-full" value={hours} onChange={(e) => handleHoursChange(e.target.value)} />
          {hoursError && <p className="text-xs text-red-500 mt-1">{hoursError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Тариф (₽/час)' : 'Rate (₽/hour)'}
          </label>
          <input type="number" className="input w-full" value={rate} onChange={(e) => handleRateChange(e.target.value)} />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Дневной максимум (₽)' : 'Daily Max (₽)'}
          </label>
          <input type="number" className="input w-full" value={dailyMax} onChange={(e) => handleDailyMaxChange(e.target.value)} />
          {dailyMaxError && <p className="text-xs text-red-500 mt-1">{dailyMaxError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Почасовая стоимость */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Стоимость по часам' : 'Cost by Hours'}
              </h3>
              <BarChartWidget 
                data={hourlyData}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#6366f1' }]}
                height={250}
              />
            </div>

            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Распределение' : 'Distribution'}
              </h3>
              <DonutChartWidget 
                data={[
                  { name: language === 'ru' ? 'Оплачено' : 'Paid', value: Math.round(result.hourly) },
                  { name: language === 'ru' ? 'Экономия' : 'Saved', value: Math.round(result.savedByDaily) },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={formatCurrency(Math.round(result.hourly), language)}
              />
            </div>
          </div>

          {/* Сравнение периодов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение по периодам' : 'Period Comparison'}
            </h3>
            <HorizontalBarWidget data={periodComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
