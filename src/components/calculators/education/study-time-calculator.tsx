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
  CircularProgressWidget,
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function StudyTimeCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [topics, setTopics] = useState('20')
  const [hoursPerTopic, setHoursPerTopic] = useState('2')
  const [daysAvailable, setDaysAvailable] = useState('14')
  const [topicsError, setTopicsError] = useState('')
  const [hoursPerTopicError, setHoursPerTopicError] = useState('')
  const [daysAvailableError, setDaysAvailableError] = useState('')

  const t = Number(topics)
  const hpt = Number(hoursPerTopic)
  const da = Number(daysAvailable)

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
    const totalHours = t * hpt
    const hoursPerDay = totalHours / da
    const completionPercent = Math.min(100, (da * 4 / totalHours) * 100)
    return { totalHours, hoursPerDay, completionPercent }
  }, [t, hpt, da])

  // Данные по дням
  const dailyPlan = useMemo(() => {
    if (!result) return []
    
    return Array.from({ length: Math.min(da, 14) }, (_, i) => ({
      name: `${language === 'ru' ? 'День' : 'Day'} ${i + 1}`,
      [language === 'ru' ? 'Часы' : 'Hours']: Math.round(result.hoursPerDay * 10) / 10,
    }))
  }, [result, da, language])

  // Сравнение интенсивности
  const intensityComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Лёгкий (1ч/д)' : 'Light (1h/d)', value: da * 1, color: '#22c55e' },
      { label: language === 'ru' ? 'Средний (2ч/д)' : 'Medium (2h/d)', value: da * 2, color: '#f59e0b' },
      { label: language === 'ru' ? 'Интенсив (4ч/д)' : 'Intensive (4h/d)', value: da * 4, color: '#ef4444' },
    ]
  }, [result, da, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Всего часов' : 'Total Hours', value: `${result.totalHours}h` },
      { label: language === 'ru' ? 'Часов в день' : 'Hours/Day', value: `${result.hoursPerDay.toFixed(1)}h` },
      { label: language === 'ru' ? 'Дней' : 'Days', value: da.toString() },
      { label: language === 'ru' ? 'Тем' : 'Topics', value: t.toString() },
    ]
  }, [result, da, t, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Количество тем' : 'Number of Topics'}
          </label>
          <input type="number" className="input w-full" value={topics} onChange={(e) => { const v = e.target.value; setTopics(v); validateField(v, setTopicsError); }} />
          {topicsError && <p className="text-xs text-red-500 mt-1">{topicsError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Часов на тему' : 'Hours per Topic'}
          </label>
          <input type="number" className="input w-full" value={hoursPerTopic} onChange={(e) => { const v = e.target.value; setHoursPerTopic(v); validateField(v, setHoursPerTopicError); }} />
          {hoursPerTopicError && <p className="text-xs text-red-500 mt-1">{hoursPerTopicError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Дней до экзамена' : 'Days Until Exam'}
          </label>
          <input type="number" className="input w-full" value={daysAvailable} onChange={(e) => { const v = e.target.value; setDaysAvailable(v); validateField(v, setDaysAvailableError); }} />
          {daysAvailableError && <p className="text-xs text-red-500 mt-1">{daysAvailableError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Прогресс */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Часов в день' : 'Hours per Day'}
              </h3>
              <CircularProgressWidget 
                value={result.hoursPerDay} 
                maxValue={8} 
                label={`${result.hoursPerDay.toFixed(1)}h`}
                color="#6366f1"
                size={160}
              />
            </div>

            {/* План по дням */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'План по дням' : 'Daily Plan'}
              </h3>
              <BarChartWidget 
                data={dailyPlan}
                dataKeys={[{ key: language === 'ru' ? 'Часы' : 'Hours', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Интенсивность */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Варианты интенсивности' : 'Intensity Options'}
            </h3>
            <HorizontalBarWidget data={intensityComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
