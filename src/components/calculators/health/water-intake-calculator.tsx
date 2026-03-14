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
  DonutChartWidget,
  PieChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function WaterIntakeCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [weight, setWeight] = useState('70')
  const [activity, setActivity] = useState('30')
  const [weightError, setWeightError] = useState('')
  const [activityError, setActivityError] = useState('')

  const w = Number(weight)
  const a = Number(activity)

  // Обработчики для валидации
  const handleWeightChange = (value: string) => {
    setWeight(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setWeightError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setWeightError('')
      }
    } else {
      setWeightError('')
    }
  }

  const handleActivityChange = (value: string) => {
    setActivity(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setActivityError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setActivityError('')
      }
    } else {
      setActivityError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    // Base: 30ml per kg + 500ml per 30 min activity
    return Math.round(w * 30 + (a / 30) * 500)
  }, [w, a])

  // Расчёт компонентов воды
  const waterComponents = useMemo(() => {
    const baseWater = w * 30
    const activityWater = result - baseWater
    
    return [
      { name: language === 'ru' ? 'Базовая потребность' : 'Base Need', value: baseWater },
      { name: language === 'ru' ? 'Для активности' : 'For Activity', value: activityWater },
    ]
  }, [result, w, language])

  // Распределение по часам
  const hourlyDistribution = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Утро (6-9)' : 'Morning (6-9)', value: Math.round(result * 0.15), color: '#f59e0b' },
      { label: language === 'ru' ? 'До обеда (9-12)' : 'Pre-noon (9-12)', value: Math.round(result * 0.20), color: '#22c55e' },
      { label: language === 'ru' ? 'Обед (12-15)' : 'Lunch (12-15)', value: Math.round(result * 0.20), color: '#6366f1' },
      { label: language === 'ru' ? 'После обеда (15-18)' : 'Afternoon (15-18)', value: Math.round(result * 0.20), color: '#8b5cf6' },
      { label: language === 'ru' ? 'Вечер (18-21)' : 'Evening (18-21)', value: Math.round(result * 0.15), color: '#3b82f6' },
      { label: language === 'ru' ? 'Перед сном (21-22)' : 'Before Bed (21-22)', value: Math.round(result * 0.10), color: '#1e40af' },
    ]
  }, [result, language])

  // Сравнение с нормой
  const comparisonData = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Ваша норма' : 'Your Need', value: result, color: '#6366f1' },
      { label: language === 'ru' ? 'Общая норма (2000 мл)' : 'General Norm (2000 ml)', value: 2000, color: '#22c55e' },
      { label: language === 'ru' ? 'Минимум (1500 мл)' : 'Minimum (1500 ml)', value: 1500, color: '#f59e0b' },
    ]
  }, [result, language])

  // Данные для столбчатой диаграммы по весу
  const weightComparison = useMemo(() => {
    const weights = [50, 60, 70, 80, 90, 100]
    
    return weights.map(wt => ({
      name: `${wt} ${language === 'ru' ? 'кг' : 'kg'}`,
      [language === 'ru' ? 'Вода (мл)' : 'Water (ml)']: wt * 30 + (a / 30) * 500,
    }))
  }, [a, language])

  // Количество стаканов и бутылок
  const containerData = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Стаканы (250 мл)' : 'Glasses (250 ml)', value: Math.round(result / 250), color: '#6366f1' },
      { label: language === 'ru' ? 'Бутылки (500 мл)' : 'Bottles (500 ml)', value: Math.round(result / 500 * 10) / 10, color: '#22c55e' },
      { label: language === 'ru' ? 'Литры' : 'Liters', value: Math.round(result / 1000 * 10) / 10, color: '#3b82f6' },
    ]
  }, [result, language])

  // Прогресс гидратации
  const hydrationProgress = useMemo(() => {
    // Норма 2000 мл = 100%
    return Math.min(100, (result / 2000) * 100)
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Норма воды' : 'Water Need', value: `${result} мл` },
      { label: language === 'ru' ? 'Стаканов' : 'Glasses', value: `${Math.round(result / 250)}` },
      { label: language === 'ru' ? 'Литров' : 'Liters', value: `${(result / 1000).toFixed(1)}` },
      { label: language === 'ru' ? 'Бутылок 0.5л' : '0.5L Bottles', value: `${Math.round(result / 500 * 10) / 10}` },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Вес (кг)' : 'Weight (kg)'}</label>
          <input type="number" className="input w-full" value={weight} onChange={(e) => handleWeightChange(e.target.value)} />
          {weightError && <p className="text-xs text-red-500 mt-1">{weightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Активность (мин/день)' : 'Activity (min/day)'}</label>
          <input type="number" className="input w-full" value={activity} onChange={(e) => handleActivityChange(e.target.value)} />
          {activityError && <p className="text-xs text-red-500 mt-1">{activityError}</p>}
        </div>
      </div>

      {result > 0 && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Состав нормы воды' : 'Water Need Composition'}
              </h3>
              <DonutChartWidget 
                data={waterComponents} 
                height={250}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={`${result} мл`}
              />
            </div>

            {/* Прогресс гидратации */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Ваша норма vs стандарт' : 'Your Need vs Standard'}
              </h3>
              <CircularProgressWidget 
                value={hydrationProgress} 
                maxValue={150} 
                label={`${Math.round(hydrationProgress)}%`}
                color="#3b82f6"
                size={160}
              />
            </div>
          </div>

          {/* Распределение по времени */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение по времени суток' : 'Distribution by Time of Day'}
            </h3>
            <ProgressBarsWidget data={hourlyDistribution} />
          </div>

          {/* Сравнение с нормой */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение с нормами' : 'Comparison with Standards'}
            </h3>
            <HorizontalBarWidget data={comparisonData} />
          </div>

          {/* Сравнение по весу */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Норма воды по весу' : 'Water Need by Weight'}
            </h3>
            <BarChartWidget 
              data={weightComparison}
              dataKeys={[{ key: language === 'ru' ? 'Вода (мл)' : 'Water (ml)', color: '#3b82f6' }]}
              height={250}
            />
          </div>

          {/* Контейнеры */}
          <div className="grid grid-cols-3 gap-4">
            {containerData.map((item, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</div>
                <div className="text-sm text-muted">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Советы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Советы по гидратации' : 'Hydration Tips'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Начните день со стакана воды натощак' : 'Start your day with a glass of water on an empty stomach'}</li>
              <li>• {language === 'ru' ? 'Пейте воду за 30 минут до еды' : 'Drink water 30 minutes before meals'}</li>
              <li>• {language === 'ru' ? 'Не пейте во время еды — это разбавляет желудочный сок' : 'Don\'t drink during meals — it dilutes stomach acid'}</li>
              <li>• {language === 'ru' ? 'Уменьшите потребление воды за 2 часа до сна' : 'Reduce water intake 2 hours before bedtime'}</li>
              <li>• {language === 'ru' ? 'При тренировках пейте каждые 15-20 минут' : 'During workouts, drink every 15-20 minutes'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
