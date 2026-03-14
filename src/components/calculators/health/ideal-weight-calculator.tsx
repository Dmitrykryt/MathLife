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

export function IdealWeightCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [height, setHeight] = useState('175')
  const [gender, setGender] = useState('male')
  const [currentWeight, setCurrentWeight] = useState('80')
  const [heightError, setHeightError] = useState('')
  const [currentWeightError, setCurrentWeightError] = useState('')

  const h = Number(height) / 2.54 // в дюймах
  const cw = Number(currentWeight)

  // Обработчики для валидации
  const handleHeightChange = (value: string) => {
    setHeight(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setHeightError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setHeightError('')
      }
    } else {
      setHeightError('')
    }
  }

  const handleCurrentWeightChange = (value: string) => {
    setCurrentWeight(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setCurrentWeightError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setCurrentWeightError('')
      }
    } else {
      setCurrentWeightError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    // Формулы для идеального веса
    const devine = gender === 'male' 
      ? 50 + 2.3 * (h - 60)
      : 45.5 + 2.3 * (h - 60)

    const robinson = gender === 'male'
      ? 52 + 1.9 * (h - 60)
      : 49 + 1.7 * (h - 60)

    const miller = gender === 'male'
      ? 56.2 + 1.41 * (h - 60)
      : 53.1 + 1.36 * (h - 60)

    const hamwi = gender === 'male'
      ? 48 + 2.7 * (h - 60)
      : 45.5 + 2.2 * (h - 60)

    const average = (devine + robinson + miller + hamwi) / 4
    const diff = cw - average

    return { devine, robinson, miller, hamwi, average, diff }
  }, [h, cw, gender])

  // Данные для сравнения формул
  const formulaComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: 'Devine', value: result.devine, color: '#6366f1' },
      { label: 'Robinson', value: result.robinson, color: '#8b5cf6' },
      { label: 'Miller', value: result.miller, color: '#22c55e' },
      { label: 'Hamwi', value: result.hamwi, color: '#f59e0b' },
    ]
  }, [result])

  // Сравнение с текущим весом
  const weightComparison = useMemo(() => {
    return [
      { label: language === 'ru' ? 'Текущий' : 'Current', value: cw, color: '#ef4444' },
      { label: language === 'ru' ? 'Идеальный' : 'Ideal', value: result.average, color: '#22c55e' },
    ]
  }, [result, cw, language])

  // Статистика
  const stats = useMemo(() => {
    const diffText = result.diff > 0 
      ? `+${Math.round(result.diff)} kg` 
      : `${Math.round(result.diff)} kg`

    return [
      { label: language === 'ru' ? 'Средний идеальный' : 'Average Ideal', value: `${Math.round(result.average)} kg` },
      { label: language === 'ru' ? 'Devine' : 'Devine', value: `${Math.round(result.devine)} kg` },
      { label: language === 'ru' ? 'Robinson' : 'Robinson', value: `${Math.round(result.robinson)} kg` },
      { label: language === 'ru' ? 'Разница' : 'Difference', value: diffText },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Рост (см)' : 'Height (cm)'}
          </label>
          <input type="number" className="input w-full" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
          {heightError && <p className="text-xs text-red-500 mt-1">{heightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Пол' : 'Gender'}
          </label>
          <select className="input w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">{language === 'ru' ? 'Мужской' : 'Male'}</option>
            <option value="female">{language === 'ru' ? 'Женский' : 'Female'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Текущий вес (кг)' : 'Current Weight (kg)'}
          </label>
          <input type="number" className="input w-full" value={currentWeight} onChange={(e) => handleCurrentWeightChange(e.target.value)} />
          {currentWeightError && <p className="text-xs text-red-500 mt-1">{currentWeightError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Сравнение формул */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение формул' : 'Formula Comparison'}
              </h3>
              <BarChartWidget 
                data={formulaComparison.map(d => ({ name: d.label, [language === 'ru' ? 'Вес' : 'Weight']: Math.round(d.value) }))}
                dataKeys={[{ key: language === 'ru' ? 'Вес' : 'Weight', color: '#6366f1' }]}
                height={250}
              />
            </div>

            {/* Текущий vs Идеальный */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Текущий vs Идеальный' : 'Current vs Ideal'}
              </h3>
              <DonutChartWidget 
                data={weightComparison}
                height={250}
                centerLabel={language === 'ru' ? 'Разница' : 'Diff'}
                centerValue={`${Math.round(Math.abs(result.diff))} kg`}
              />
            </div>
          </div>

          {/* Сравнение формул */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Идеальный вес по формулам' : 'Ideal Weight by Formula'}
            </h3>
            <HorizontalBarWidget data={formulaComparison} />
          </div>

          {/* Сравнение весов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение с текущим весом' : 'Comparison with Current Weight'}
            </h3>
            <HorizontalBarWidget data={weightComparison} />
          </div>

          {/* Рекомендация */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
            </h3>
            <p className="text-3xl font-bold text-primary">{Math.round(result.average)} kg</p>
            <p className="text-sm text-muted mt-2">
              {result.diff > 0 
                ? (language === 'ru' ? `Рекомендуется сбросить ${Math.round(result.diff)} kg` : `Recommended to lose ${Math.round(result.diff)} kg`)
                : (language === 'ru' ? `Рекомендуется набрать ${Math.round(Math.abs(result.diff))} kg` : `Recommended to gain ${Math.round(Math.abs(result.diff))} kg`)}
            </p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
