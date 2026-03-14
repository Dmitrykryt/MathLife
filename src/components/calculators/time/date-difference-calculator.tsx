'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { 
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

export function DateDifferenceCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [date1, setDate1] = useState('2024-01-01')
  const [date2, setDate2] = useState('2024-12-31')

  // Автоматический расчёт
  const result = useMemo(() => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    
    const diff = Math.abs(d2.getTime() - d1.getTime())
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30.44)
    const years = Math.floor(days / 365.25)

    return { days, weeks, months, years }
  }, [date1, date2])

  // Данные для визуализации времени
  const timeBreakdownData = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Дни' : 'Days', value: result.days, color: '#6366f1' },
      { label: language === 'ru' ? 'Недели' : 'Weeks', value: result.weeks, color: '#8b5cf6' },
      { label: language === 'ru' ? 'Месяцы' : 'Months', value: result.months, color: '#22c55e' },
      { label: language === 'ru' ? 'Годы' : 'Years', value: result.years, color: '#f59e0b' },
    ]
  }, [result, language])

  // Данные для круговой диаграммы (разбивка года)
  const yearBreakdownData = useMemo(() => {
    if (!result) return []
    
    const totalDays = result.days
    const years = Math.floor(totalDays / 365)
    const remainingDays = totalDays % 365
    const months = Math.floor(remainingDays / 30)
    const days = remainingDays % 30
    
    return [
      { name: language === 'ru' ? 'Годы' : 'Years', value: years * 365 },
      { name: language === 'ru' ? 'Месяцы' : 'Months', value: months * 30 },
      { name: language === 'ru' ? 'Дни' : 'Days', value: days },
    ]
  }, [result, language])

  // Данные для столбчатой диаграммы
  const comparisonData = useMemo(() => {
    if (!result) return []
    
    const totalDays = result.days
    
    return [
      { 
        name: language === 'ru' ? 'Дни' : 'Days', 
        [language === 'ru' ? 'Значение' : 'Value']: totalDays 
      },
      { 
        name: language === 'ru' ? 'Недели' : 'Weeks', 
        [language === 'ru' ? 'Значение' : 'Value']: result.weeks 
      },
      { 
        name: language === 'ru' ? 'Месяцы' : 'Months', 
        [language === 'ru' ? 'Значение' : 'Value']: result.months 
      },
      { 
        name: language === 'ru' ? 'Годы' : 'Years', 
        [language === 'ru' ? 'Значение' : 'Value']: result.years 
      },
    ]
  }, [result, language])

  // Прогресс года
  const yearProgress = useMemo(() => {
    if (!result) return 0
    return (result.days % 365) / 365 * 100
  }, [result])

  // Дополнительные вычисления
  const additionalData = useMemo(() => {
    if (!result) return null
    
    const hours = result.days * 24
    const minutes = hours * 60
    const seconds = minutes * 60
    const workDays = Math.floor(result.days * 5 / 7)
    const weekends = result.days - workDays
    
    return {
      hours,
      minutes,
      seconds,
      workDays,
      weekends
    }
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result || !additionalData) return []
    
    return [
      { label: language === 'ru' ? 'Дней' : 'Days', value: result.days.toLocaleString() },
      { label: language === 'ru' ? 'Недель' : 'Weeks', value: result.weeks.toLocaleString() },
      { label: language === 'ru' ? 'Месяцев' : 'Months', value: result.months.toLocaleString() },
      { label: language === 'ru' ? 'Лет' : 'Years', value: result.years.toLocaleString() },
    ]
  }, [result, additionalData, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Дата начала' : 'Start Date'}</label>
          <input type="date" className="input w-full" value={date1} onChange={(e) => setDate1(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Дата окончания' : 'End Date'}</label>
          <input type="date" className="input w-full" value={date2} onChange={(e) => setDate2(e.target.value)} />
        </div>
      </div>

      {result && additionalData && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Разбивка периода' : 'Period Breakdown'}
              </h3>
              <DonutChartWidget 
                data={yearBreakdownData} 
                height={250}
                centerLabel={language === 'ru' ? 'Всего дней' : 'Total Days'}
                centerValue={result.days.toString()}
              />
            </div>

            {/* Сравнение единиц */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение единиц времени' : 'Time Units Comparison'}
              </h3>
              <BarChartWidget 
                data={comparisonData}
                dataKeys={[{ key: language === 'ru' ? 'Значение' : 'Value', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Временная шкала */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Временная шкала' : 'Timeline'}
            </h3>
            <HorizontalBarWidget data={timeBreakdownData} />
          </div>

          {/* Дополнительные данные */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalData.hours.toLocaleString()}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Часов' : 'Hours'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(additionalData.minutes / 1000)}K</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Минут' : 'Minutes'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalData.workDays.toLocaleString()}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Рабочих дней' : 'Work Days'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalData.weekends.toLocaleString()}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Выходных' : 'Weekends'}</div>
            </div>
          </div>

          {/* Прогресс года */}
          {result.years > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Прогресс текущего года' : 'Current Year Progress'}
              </h3>
              <div className="flex flex-col items-center">
                <CircularProgressWidget 
                  value={yearProgress} 
                  maxValue={100} 
                  label={`${Math.round(yearProgress)}%`}
                  color="#6366f1"
                  size={120}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  )
}
