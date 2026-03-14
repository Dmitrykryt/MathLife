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

export function SleepCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake')
  const [time, setTime] = useState('07:00')

  // Автоматический расчёт
  const result = useMemo(() => {
    const [h, m] = time.split(':').map(Number)
    const inputMinutes = h * 60 + m

    const times = []
    
    if (mode === 'wake') {
      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepTime = (inputMinutes - cycles * 90 - 15 + 1440) % 1440
        const hours = Math.floor(sleepTime / 60)
        const minutes = sleepTime % 60
        times.push({
          cycles,
          time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
          duration: `${Math.floor(cycles * 90 / 60)}ч ${cycles * 90 % 60}м`
        })
      }
    } else {
      for (let cycles = 3; cycles <= 6; cycles++) {
        const wakeTime = (inputMinutes + cycles * 90 + 15) % 1440
        const hours = Math.floor(wakeTime / 60)
        const minutes = wakeTime % 60
        times.push({
          cycles,
          time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
          duration: `${Math.floor(cycles * 90 / 60)}ч ${cycles * 90 % 60}м`
        })
      }
    }

    const recommendedSleep = times.find(t => t.cycles === 5)?.time || times[1].time
    const totalSleep = 5 * 90

    return { times, recommendedSleep, totalSleep }
  }, [time, mode])

  // Данные для диаграммы циклов сна
  const cycleData = useMemo(() => {
    return result.times.map(t => ({
      name: `${t.cycles} ${language === 'ru' ? 'циклов' : 'cycles'}`,
      [language === 'ru' ? 'Длительность (мин)' : 'Duration (min)']: t.cycles * 90,
    }))
  }, [result, language])

  // Распределение фаз сна
  const sleepPhases = useMemo(() => {
    return [
      { name: language === 'ru' ? 'Глубокий сон' : 'Deep Sleep', value: 20, color: '#1e3a5f' },
      { name: language === 'ru' ? 'Лёгкий сон' : 'Light Sleep', value: 50, color: '#3b82f6' },
      { name: language === 'ru' ? 'REM-сон' : 'REM Sleep', value: 25, color: '#8b5cf6' },
      { name: language === 'ru' ? 'Пробуждение' : 'Awake', value: 5, color: '#22c55e' },
    ]
  }, [language])

  // Сравнение продолжительности сна
  const sleepComparison = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Недосып (<6ч)' : 'Lack of sleep (<6h)', value: 5.5 * 60, color: '#ef4444' },
      { label: language === 'ru' ? 'Норма (7-8ч)' : 'Normal (7-8h)', value: 7.5 * 60, color: '#22c55e' },
      { label: language === 'ru' ? 'Избыток (>9ч)' : 'Excess (>9h)', value: 9.5 * 60, color: '#f59e0b' },
    ]
  }, [language])

  // Статистика
  const stats = useMemo(() => {
    const optimal = result.times.find(t => t.cycles === 5)
    
    return [
      { label: language === 'ru' ? 'Оптимально' : 'Optimal', value: optimal?.time || '' },
      { label: language === 'ru' ? 'Длительность' : 'Duration', value: optimal?.duration || '' },
      { label: language === 'ru' ? 'Циклов' : 'Cycles', value: '5' },
      { label: language === 'ru' ? 'Качество' : 'Quality', value: language === 'ru' ? 'Отличное' : 'Excellent' },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Режим расчёта' : 'Calculation Mode'}
          </label>
          <select 
            className="input w-full" 
            value={mode} 
            onChange={(e) => setMode(e.target.value as 'wake' | 'sleep')}
          >
            <option value="wake">{language === 'ru' ? 'Во сколько проснуться' : 'Wake up at'}</option>
            <option value="sleep">{language === 'ru' ? 'Во сколько лечь спать' : 'Go to sleep at'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {mode === 'wake' 
              ? (language === 'ru' ? 'Время пробуждения' : 'Wake up time')
              : (language === 'ru' ? 'Время отхода ко сну' : 'Bedtime')}
          </label>
          <input 
            type="time" 
            className="input w-full" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
          />
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Варианты времени */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {mode === 'wake' 
                ? (language === 'ru' ? 'Ложиться спать в:' : 'Go to bed at:')
                : (language === 'ru' ? 'Просыпаться в:' : 'Wake up at:')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.times.map((t, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg text-center ${t.cycles === 5 ? 'bg-primary/20 border border-primary' : 'bg-white/5'}`}
                >
                  <p className="text-2xl font-bold">{t.time}</p>
                  <p className="text-sm text-muted">{t.duration}</p>
                  <p className="text-xs text-muted mt-1">{t.cycles} {language === 'ru' ? 'циклов' : 'cycles'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Циклы сна */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Продолжительность по циклам' : 'Duration by Cycles'}
              </h3>
              <BarChartWidget 
                data={cycleData}
                dataKeys={[{ key: language === 'ru' ? 'Длительность (мин)' : 'Duration (min)', color: '#6366f1' }]}
                height={250}
              />
            </div>

            {/* Фазы сна */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Фазы сна' : 'Sleep Phases'}
              </h3>
              <DonutChartWidget 
                data={sleepPhases}
                height={250}
                centerLabel={language === 'ru' ? 'Ночь' : 'Night'}
                centerValue="7.5ч"
              />
            </div>
          </div>

          {/* Качество сна */}
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Рекомендуемая длительность' : 'Recommended Duration'}
            </h3>
            <CircularProgressWidget 
              value={7.5} 
              maxValue={10} 
              label="7.5 ч"
              color="#8b5cf6"
              size={160}
            />
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение режимов сна' : 'Sleep Duration Comparison'}
            </h3>
            <HorizontalBarWidget data={sleepComparison} />
          </div>

          {/* Советы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Советы для качественного сна' : 'Tips for Quality Sleep'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Ложитесь спать в одно и то же время' : 'Go to bed at the same time'}</li>
              <li>• {language === 'ru' ? 'Избегайте экранов за 1 час до сна' : 'Avoid screens 1 hour before bed'}</li>
              <li>• {language === 'ru' ? 'Оптимальная температура: 18-20°C' : 'Optimal temperature: 18-20°C'}</li>
              <li>• {language === 'ru' ? 'Каждый цикл сна длится ~90 минут' : 'Each sleep cycle lasts ~90 minutes'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
