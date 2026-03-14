'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { 
  PieChartWidget, 
  BarChartWidget, 
  LineChartWidget,
  ProgressBarsWidget, 
  StatsCardsWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function CalorieCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')
  const [activity, setActivity] = useState('1.2')
  const [ageError, setAgeError] = useState('')
  const [heightError, setHeightError] = useState('')
  const [weightError, setWeightError] = useState('')

  const a = Number(age)
  const h = Number(height)
  const w = Number(weight)
  const act = Number(activity)

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

  const activityLevels = [
    { value: '1.2', ru: 'Минимальная (сидячий образ жизни)', en: 'Sedentary (little or no exercise)' },
    { value: '1.375', ru: 'Лёгкая (1-3 дня в неделю)', en: 'Light (exercise 1-3 days/week)' },
    { value: '1.55', ru: 'Умеренная (3-5 дней в неделю)', en: 'Moderate (exercise 3-5 days/week)' },
    { value: '1.725', ru: 'Активная (6-7 дней в неделю)', en: 'Active (exercise 6-7 days/week)' },
    { value: '1.9', ru: 'Очень активная (интенсивные тренировки)', en: 'Very active (hard exercise daily)' },
  ]

  // Автоматический расчёт
  const result = useMemo(() => {
    if (a > 0 && h > 0 && w > 0) {
      let bmr: number
      if (gender === 'male') {
        bmr = 10 * w + 6.25 * h - 5 * a + 5
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161
      }
      const daily = Math.round(bmr * act)
      return { bmr: Math.round(bmr), daily }
    }
    return null
  }, [a, h, w, act, gender])

  // Расчёт БЖУ (белки, жиры, углеводы)
  const macrosData = useMemo(() => {
    if (!result) return []
    
    // Расчёт калорий из БЖУ
    const proteinGrams = Math.round((result.daily * 0.25) / 4) // 25% калорий из белков (4 ккал/г)
    const fatGrams = Math.round((result.daily * 0.30) / 9) // 30% калорий из жиров (9 ккал/г)
    const carbsGrams = Math.round((result.daily * 0.45) / 4) // 45% калорий из углеводов (4 ккал/г)
    
    return [
      { name: language === 'ru' ? 'Белки' : 'Protein', value: proteinGrams * 4, grams: proteinGrams },
      { name: language === 'ru' ? 'Жиры' : 'Fat', value: fatGrams * 9, grams: fatGrams },
      { name: language === 'ru' ? 'Углеводы' : 'Carbs', value: carbsGrams * 4, grams: carbsGrams },
    ]
  }, [result, language])

  // Цели по калориям
  const goalsData = useMemo(() => {
    if (!result) return []
    
    return [
      { 
        name: language === 'ru' ? 'Похудение' : 'Weight Loss', 
        calories: Math.round(result.daily * 0.8),
        color: '#ef4444'
      },
      { 
        name: language === 'ru' ? 'Поддержание' : 'Maintenance', 
        calories: result.daily,
        color: '#22c55e'
      },
      { 
        name: language === 'ru' ? 'Набор массы' : 'Bulking', 
        calories: Math.round(result.daily * 1.15),
        color: '#6366f1'
      },
    ]
  }, [result, language])

  // Прогноз веса
  const weightProjectionData = useMemo(() => {
    if (!result) return []
    
    const data = []
    for (let week = 0; week <= 12; week++) {
      data.push({
        name: language === 'ru' ? `${week} нед` : `${week} wk`,
        [language === 'ru' ? 'Похудение' : 'Loss']: Math.round((w - week * 0.5) * 10) / 10,
        [language === 'ru' ? 'Поддержание' : 'Maintain']: w,
        [language === 'ru' ? 'Набор' : 'Gain']: Math.round((w + week * 0.3) * 10) / 10,
      })
    }
    return data
  }, [result, w, language])

  // Распределение калорий по приёмам пищи
  const mealDistribution = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Завтрак' : 'Breakfast', value: Math.round(result.daily * 0.25), color: '#f59e0b' },
      { label: language === 'ru' ? 'Обед' : 'Lunch', value: Math.round(result.daily * 0.35), color: '#22c55e' },
      { label: language === 'ru' ? 'Ужин' : 'Dinner', value: Math.round(result.daily * 0.25), color: '#6366f1' },
      { label: language === 'ru' ? 'Перекусы' : 'Snacks', value: Math.round(result.daily * 0.15), color: '#8b5cf6' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    const bmi = w / ((h / 100) ** 2)
    
    return [
      { 
        label: language === 'ru' ? 'Базовый метаболизм' : 'BMR', 
        value: `${result.bmr} kcal` 
      },
      { 
        label: language === 'ru' ? 'Суточная норма' : 'Daily Need', 
        value: `${result.daily} kcal` 
      },
      { 
        label: 'BMI', 
        value: bmi.toFixed(1) 
      },
      { 
        label: language === 'ru' ? 'Для похудения' : 'For Weight Loss', 
        value: `${Math.round(result.daily * 0.8)} kcal` 
      },
    ]
  }, [result, h, w, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => setGender('male')}
          className={`p-2 rounded border ${gender === 'male' ? 'bg-primary text-white border-primary' : 'border-border'}`}
        >
          {language === 'ru' ? 'Мужской' : 'Male'}
        </button>
        <button
          onClick={() => setGender('female')}
          className={`p-2 rounded border ${gender === 'female' ? 'bg-primary text-white border-primary' : 'border-border'}`}
        >
          {language === 'ru' ? 'Женский' : 'Female'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Возраст' : 'Age'}</label>
          <input type="number" className="input w-full" value={age} onChange={(e) => handleAgeChange(e.target.value)} />
          {ageError && <p className="text-xs text-red-500 mt-1">{ageError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Рост (см)' : 'Height (cm)'}</label>
          <input type="number" className="input w-full" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
          {heightError && <p className="text-xs text-red-500 mt-1">{heightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Вес (кг)' : 'Weight (kg)'}</label>
          <input type="number" className="input w-full" value={weight} onChange={(e) => handleWeightChange(e.target.value)} />
          {weightError && <p className="text-xs text-red-500 mt-1">{weightError}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Уровень активности' : 'Activity Level'}</label>
        <select className="input w-full" value={activity} onChange={(e) => setActivity(e.target.value)}>
          {activityLevels.map((l) => (
            <option key={l.value} value={l.value}>
              {language === 'ru' ? l.ru : l.en}
            </option>
          ))}
        </select>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма БЖУ */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Баланс БЖУ (калории)' : 'Macros Balance (calories)'}
              </h3>
              <PieChartWidget data={macrosData} height={250} />
            </div>

            {/* Цели по калориям */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Калории по целям' : 'Calories by Goal'}
              </h3>
              <BarChartWidget 
                data={goalsData}
                dataKeys={[{ key: 'calories', name: 'kcal' }]}
                xKey="name"
                height={250}
              />
            </div>
          </div>

          {/* Прогноз веса */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Прогноз веса на 12 недель' : 'Weight Projection (12 weeks)'}
            </h3>
            <LineChartWidget 
              data={weightProjectionData}
              dataKeys={[
                { key: language === 'ru' ? 'Похудение' : 'Loss', color: '#ef4444' },
                { key: language === 'ru' ? 'Поддержание' : 'Maintain', color: '#22c55e' },
                { key: language === 'ru' ? 'Набор' : 'Gain', color: '#6366f1' },
              ]}
              height={280}
            />
          </div>

          {/* Распределение по приёмам пищи */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение по приёмам пищи' : 'Meal Distribution'}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonutChartWidget 
                data={mealDistribution} 
                height={220}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={`${result.daily} kcal`}
              />
              <ProgressBarsWidget data={mealDistribution} />
            </div>
          </div>

          {/* Таблица БЖУ */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Рекомендуемое БЖУ в граммах' : 'Recommended Macros (grams)'}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {macrosData.map((macro, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold" style={{ color: ['#6366f1', '#f59e0b', '#22c55e'][index] }}>
                    {macro.grams}г
                  </div>
                  <div className="text-sm text-muted">{macro.name}</div>
                  <div className="text-xs text-muted">{macro.value} kcal</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
