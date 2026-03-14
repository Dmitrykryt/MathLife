'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { 
  RadialBarWidget, 
  BarChartWidget, 
  ProgressBarsWidget, 
  StatsCardsWidget,
  CircularProgressWidget,
  HorizontalBarWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function BMICalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')
  const [heightError, setHeightError] = useState('')
  const [weightError, setWeightError] = useState('')

  const h = Number(height) / 100
  const w = Number(weight)

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

  const getColor = (bmi: number) => {
    if (bmi < 18.5) return '#3b82f6'
    if (bmi < 25) return '#22c55e'
    if (bmi < 30) return '#f59e0b'
    return '#ef4444'
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (h > 0 && w > 0) {
      const bmi = w / (h * h)
      let category: string
      if (bmi < 18.5) {
        category = language === 'ru' ? 'Дефицит веса' : 'Underweight'
      } else if (bmi < 25) {
        category = language === 'ru' ? 'Нормальный вес' : 'Normal weight'
      } else if (bmi < 30) {
        category = language === 'ru' ? 'Избыточный вес' : 'Overweight'
      } else {
        category = language === 'ru' ? 'Ожирение' : 'Obesity'
      }
      return { bmi, category }
    }
    return null
  }, [h, w, language])

  // Данные для шкалы BMI
  const bmiScaleData = useMemo(() => {
    if (!result) return []
    return [
      { 
        label: language === 'ru' ? 'Дефицит' : 'Underweight', 
        value: 18.5, 
        color: '#3b82f6' 
      },
      { 
        label: language === 'ru' ? 'Норма' : 'Normal', 
        value: 24.9, 
        color: '#22c55e' 
      },
      { 
        label: language === 'ru' ? 'Избыток' : 'Overweight', 
        value: 29.9, 
        color: '#f59e0b' 
      },
      { 
        label: language === 'ru' ? 'Ожирение' : 'Obesity', 
        value: 35, 
        color: '#ef4444' 
      },
    ]
  }, [result, language])

  // Диапазоны веса для данного роста
  const weightRanges = useMemo(() => {
    if (h <= 0) return []
    
    const minNormal = 18.5 * h * h
    const maxNormal = 24.9 * h * h
    
    return [
      { 
        label: language === 'ru' ? 'Вы' : 'You', 
        value: w, 
        color: getColor(result?.bmi || 25) 
      },
      { 
        label: language === 'ru' ? 'Норма (мин)' : 'Normal (min)', 
        value: Math.round(minNormal), 
        color: '#22c55e' 
      },
      { 
        label: language === 'ru' ? 'Норма (макс)' : 'Normal (max)', 
        value: Math.round(maxNormal), 
        color: '#22c55e' 
      },
    ]
  }, [h, w, result, language])

  // Идеальный вес
  const idealWeight = useMemo(() => {
    const heightCm = Number(height)
    if (heightCm <= 0) return null
    
    // Формула Девайна
    const idealMale = 50 + 2.3 * ((heightCm / 2.54) - 60)
    const idealFemale = 45.5 + 2.3 * ((heightCm / 2.54) - 60)
    
    // Формула Брока
    const brock = heightCm - 100
    
    return {
      devine: {
        male: Math.round(idealMale),
        female: Math.round(idealFemale)
      },
      brock: Math.round(brock)
    }
  }, [height])

  // Разница до нормы
  const weightDiff = useMemo(() => {
    if (!result || !idealWeight) return null
    
    const targetWeight = idealWeight.brock
    const diff = w - targetWeight
    
    return {
      diff: Math.round(diff),
      direction: diff > 0 
        ? (language === 'ru' ? 'лишний' : 'excess') 
        : diff < 0 
          ? (language === 'ru' ? 'недостаток' : 'deficit')
          : (language === 'ru' ? 'норма' : 'normal')
    }
  }, [result, idealWeight, w, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result || !idealWeight) return []
    return [
      { 
        label: 'BMI', 
        value: result.bmi.toFixed(1) 
      },
      { 
        label: language === 'ru' ? 'Категория' : 'Category', 
        value: result.category 
      },
      { 
        label: language === 'ru' ? 'Идеальный вес' : 'Ideal Weight', 
        value: `${idealWeight.brock} кг` 
      },
      { 
        label: language === 'ru' ? 'Разница' : 'Difference', 
        value: weightDiff ? `${weightDiff.diff > 0 ? '+' : ''}${weightDiff.diff} кг` : '-' 
      },
    ]
  }, [result, idealWeight, weightDiff, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Рост (см)' : 'Height (cm)'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
          />
          {heightError && <p className="text-xs text-red-500 mt-1">{heightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Вес (кг)' : 'Weight (kg)'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
          />
          {weightError && <p className="text-xs text-red-500 mt-1">{weightError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговой прогресс */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Ваш ИМТ' : 'Your BMI'}
              </h3>
              <CircularProgressWidget 
                value={Math.min(result.bmi, 40)} 
                maxValue={40} 
                label={result.category}
                color={getColor(result.bmi)}
                size={180}
              />
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold" style={{ color: getColor(result.bmi) }}>
                  {result.bmi.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Шкала BMI */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Шкала ИМТ' : 'BMI Scale'}
              </h3>
              <HorizontalBarWidget data={bmiScaleData} maxValue={40} />
              <div className="mt-4 text-center">
                <span className="text-sm text-muted">
                  {language === 'ru' ? 'Ваш ИМТ: ' : 'Your BMI: '}
                  <span className="font-bold" style={{ color: getColor(result.bmi) }}>
                    {result.bmi.toFixed(1)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Сравнение веса */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение веса' : 'Weight Comparison'}
            </h3>
            <HorizontalBarWidget data={weightRanges} />
          </div>

          {/* Информация о категориях */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Категории ИМТ' : 'BMI Categories'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${result.bmi < 18.5 ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="text-blue-500 font-semibold">&lt; 18.5</div>
                <div className="text-sm text-muted">
                  {language === 'ru' ? 'Дефицит веса' : 'Underweight'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${result.bmi >= 18.5 && result.bmi < 25 ? 'ring-2 ring-green-500' : ''}`}>
                <div className="text-green-500 font-semibold">18.5 – 24.9</div>
                <div className="text-sm text-muted">
                  {language === 'ru' ? 'Норма' : 'Normal'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${result.bmi >= 25 && result.bmi < 30 ? 'ring-2 ring-yellow-500' : ''}`}>
                <div className="text-yellow-500 font-semibold">25 – 29.9</div>
                <div className="text-sm text-muted">
                  {language === 'ru' ? 'Избыточный вес' : 'Overweight'}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${result.bmi >= 30 ? 'ring-2 ring-red-500' : ''}`}>
                <div className="text-red-500 font-semibold">≥ 30</div>
                <div className="text-sm text-muted">
                  {language === 'ru' ? 'Ожирение' : 'Obesity'}
                </div>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          {weightDiff && weightDiff.diff !== 0 && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
              </h3>
              <p className="text-muted">
                {weightDiff.diff > 0 
                  ? language === 'ru' 
                    ? `Для достижения идеального веса рекомендуется сбросить ${Math.abs(weightDiff.diff)} кг`
                    : `To reach ideal weight, it's recommended to lose ${Math.abs(weightDiff.diff)} kg`
                  : language === 'ru'
                    ? `Для достижения идеального веса рекомендуется набрать ${Math.abs(weightDiff.diff)} кг`
                    : `To reach ideal weight, it's recommended to gain ${Math.abs(weightDiff.diff)} kg`
                }
              </p>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  )
}
