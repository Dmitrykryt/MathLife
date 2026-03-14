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

export function HeartRateCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [age, setAge] = useState('30')
  const [restingHr, setRestingHr] = useState('65')
  const [ageError, setAgeError] = useState('')
  const [restingHrError, setRestingHrError] = useState('')

  const a = Number(age)
  const resting = Number(restingHr)

  // Обработчики для валидации
  const handleAgeChange = (value: string) => {
    setAge(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setAgeError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setAgeError('')
      }
    } else {
      setAgeError('')
    }
  }

  const handleRestingHrChange = (value: string) => {
    setRestingHr(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setRestingHrError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setRestingHrError('')
      }
    } else {
      setRestingHrError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    // Максимальный пульс (формула Танака)
    const maxHr = 208 - 0.7 * a
    
    // Резерв пульса
    const hrReserve = maxHr - resting
    
    // Зоны пульса (метод Карвонена)
    const zones = [
      {
        name: language === 'ru' ? 'Восстановление' : 'Recovery',
        min: Math.round(resting + hrReserve * 0.5),
        max: Math.round(resting + hrReserve * 0.6),
        percent: 50,
        description: language === 'ru' ? 'Разминка, заминка' : 'Warm up, cool down'
      },
      {
        name: language === 'ru' ? 'Жиросжигание' : 'Fat Burn',
        min: Math.round(resting + hrReserve * 0.6),
        max: Math.round(resting + hrReserve * 0.7),
        percent: 60,
        description: language === 'ru' ? 'Базовая выносливость' : 'Base endurance'
      },
      {
        name: language === 'ru' ? 'Аэробная' : 'Aerobic',
        min: Math.round(resting + hrReserve * 0.7),
        max: Math.round(resting + hrReserve * 0.8),
        percent: 70,
        description: language === 'ru' ? 'Кардиотренировка' : 'Cardio training'
      },
      {
        name: language === 'ru' ? 'Анаэробная' : 'Anaerobic',
        min: Math.round(resting + hrReserve * 0.8),
        max: Math.round(resting + hrReserve * 0.9),
        percent: 80,
        description: language === 'ru' ? 'Интервалы, порог' : 'Intervals, threshold'
      },
      {
        name: language === 'ru' ? 'Максимум' : 'Maximum',
        min: Math.round(resting + hrReserve * 0.9),
        max: Math.round(maxHr),
        percent: 90,
        description: language === 'ru' ? 'Пиковая мощность' : 'Peak performance'
      },
    ]

    // Определение уровня фитнеса по пульсу покоя
    let fitnessLevel = ''
    if (resting < 50) fitnessLevel = language === 'ru' ? 'Профессиональный атлет' : 'Professional athlete'
    else if (resting < 60) fitnessLevel = language === 'ru' ? 'Отличный' : 'Excellent'
    else if (resting < 70) fitnessLevel = language === 'ru' ? 'Хороший' : 'Good'
    else if (resting < 80) fitnessLevel = language === 'ru' ? 'Средний' : 'Average'
    else fitnessLevel = language === 'ru' ? 'Ниже среднего' : 'Below average'

    return { maxHr: Math.round(maxHr), zones, hrReserve: Math.round(hrReserve), fitnessLevel }
  }, [a, resting, language])

  // Данные для диаграммы зон
  const zoneData = useMemo(() => {
    return result.zones.map(z => ({
      name: z.name,
      [language === 'ru' ? 'Средний пульс' : 'Avg HR']: Math.round((z.min + z.max) / 2),
    }))
  }, [result, language])

  // Распределение зон
  const zoneDistribution = useMemo(() => {
    return result.zones.map(z => ({
      name: z.name,
      value: z.percent,
      color: z.percent < 60 ? '#22c55e' : z.percent < 70 ? '#84cc16' : z.percent < 80 ? '#f59e0b' : z.percent < 90 ? '#ef4444' : '#dc2626'
    }))
  }, [result])

  // Сравнение с нормой по возрасту
  const ageComparison = useMemo(() => {
    const ages = [20, 25, 30, 35, 40, 45, 50, 55, 60]
    
    return ages.map(a => ({
      name: `${a} ${language === 'ru' ? 'лет' : 'yrs'}`,
      [language === 'ru' ? 'Макс. пульс' : 'Max HR']: Math.round(208 - 0.7 * a),
    }))
  }, [language])

  // Статистика
  const stats = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Макс. пульс' : 'Max HR', value: `${result.maxHr} bpm` },
      { label: language === 'ru' ? 'Пульс покоя' : 'Resting HR', value: `${resting} bpm` },
      { label: language === 'ru' ? 'Резерв пульса' : 'HR Reserve', value: `${result.hrReserve} bpm` },
      { label: language === 'ru' ? 'Уровень фитнеса' : 'Fitness Level', value: result.fitnessLevel },
    ]
  }, [result, resting, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Возраст (лет)' : 'Age (years)'}
          </label>
          <input type="number" className="input w-full" value={age} onChange={(e) => handleAgeChange(e.target.value)} />
          {ageError && <p className="text-xs text-red-500 mt-1">{ageError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Пульс покоя (уд/мин)' : 'Resting HR (bpm)'}
          </label>
          <input type="number" className="input w-full" value={restingHr} onChange={(e) => handleRestingHrChange(e.target.value)} />
          {restingHrError && <p className="text-xs text-red-500 mt-1">{restingHrError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Зоны пульса */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Тренировочные зоны пульса' : 'Heart Rate Training Zones'}
            </h3>
            <div className="space-y-3">
              {result.zones.map((zone, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: zone.percent < 60 ? '#22c55e' : zone.percent < 70 ? '#84cc16' : zone.percent < 80 ? '#f59e0b' : zone.percent < 90 ? '#ef4444' : '#dc2626' }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{zone.name}</span>
                      <span className="text-primary font-bold">{zone.min} - {zone.max} bpm</span>
                    </div>
                    <p className="text-sm text-muted">{zone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Зоны пульса */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Зоны пульса' : 'Heart Rate Zones'}
              </h3>
              <BarChartWidget 
                data={zoneData}
                dataKeys={[{ key: language === 'ru' ? 'Средний пульс' : 'Avg HR', color: '#6366f1' }]}
                height={250}
              />
            </div>

            {/* Распределение зон */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Интенсивность зон' : 'Zone Intensity'}
              </h3>
              <DonutChartWidget 
                data={zoneDistribution}
                height={250}
                centerLabel={language === 'ru' ? 'Макс' : 'Max'}
                centerValue={`${result.maxHr}`}
              />
            </div>
          </div>

          {/* Макс пульс по возрасту */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Макс. пульс по возрасту' : 'Max HR by Age'}
            </h3>
            <BarChartWidget 
              data={ageComparison}
              dataKeys={[{ key: language === 'ru' ? 'Макс. пульс' : 'Max HR', color: '#ef4444' }]}
              height={250}
            />
          </div>

          {/* Пульс покоя */}
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Пульс покоя' : 'Resting Heart Rate'}
            </h3>
            <CircularProgressWidget 
              value={Number(restingHr)} 
              maxValue={100} 
              label={`${restingHr} bpm`}
              color={Number(restingHr) < 60 ? '#22c55e' : Number(restingHr) < 70 ? '#84cc16' : Number(restingHr) < 80 ? '#f59e0b' : '#ef4444'}
              size={160}
            />
            <p className="text-sm text-muted mt-2">{result.fitnessLevel}</p>
          </div>

          {/* Советы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендации по тренировкам' : 'Training Recommendations'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? '80% тренировок в зонах 1-3' : '80% of training in zones 1-3'}</li>
              <li>• {language === 'ru' ? '20% тренировок в зонах 4-5' : '20% of training in zones 4-5'}</li>
              <li>• {language === 'ru' ? 'Измеряйте пульс покоя утром' : 'Measure resting HR in the morning'}</li>
              <li>• {language === 'ru' ? 'Низкий пульс покоя = хорошая тренированность' : 'Low resting HR = good fitness'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
