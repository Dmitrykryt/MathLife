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

export function ExamScoreCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [currentGrade, setCurrentGrade] = useState('75')
  const [targetGrade, setTargetGrade] = useState('85')
  const [examWeight, setExamWeight] = useState('40')
  const [currentGradeError, setCurrentGradeError] = useState('')
  const [targetGradeError, setTargetGradeError] = useState('')
  const [examWeightError, setExamWeightError] = useState('')

  const current = Number(currentGrade)
  const target = Number(targetGrade)
  const weight = Number(examWeight) / 100

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
    const requiredScore = (target - current * (1 - weight)) / weight
    const maxPossible = current * (1 - weight) + 100 * weight
    const possible = requiredScore <= 100 && requiredScore >= 0
    return { requiredScore, possible, maxPossible }
  }, [current, target, weight])

  // Сравнение оценок
  const gradeComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Текущая' : 'Current', value: current, color: '#6366f1' },
      { label: language === 'ru' ? 'Цель' : 'Target', value: target, color: '#22c55e' },
      { label: language === 'ru' ? 'Максимум' : 'Max', value: result.maxPossible, color: '#f59e0b' },
    ]
  }, [result, current, target, language])

  // Сценарии экзамена
  const examScenarios = useMemo(() => {
    return [50, 60, 70, 80, 90, 100].map(examScore => ({
      name: `${examScore}%`,
      [language === 'ru' ? 'Итоговая' : 'Final']: Math.round(current * (1 - weight) + examScore * weight),
    }))
  }, [current, weight, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Текущая оценка' : 'Current Grade', value: `${current}%` },
      { label: language === 'ru' ? 'Целевая' : 'Target', value: `${target}%` },
      { label: language === 'ru' ? 'Нужно на экзамене' : 'Required on Exam', value: result.possible ? `${Math.round(result.requiredScore)}%` : (language === 'ru' ? 'Невозможно' : 'Impossible') },
      { label: language === 'ru' ? 'Макс. возможная' : 'Max Possible', value: `${Math.round(result.maxPossible)}%` },
    ]
  }, [result, current, target, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Текущая оценка (%)' : 'Current Grade (%)'}
          </label>
          <input type="number" className="input w-full" value={currentGrade} onChange={(e) => { const v = e.target.value; setCurrentGrade(v); validateField(v, setCurrentGradeError); }} />
          {currentGradeError && <p className="text-xs text-red-500 mt-1">{currentGradeError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Целевая оценка (%)' : 'Target Grade (%)'}
          </label>
          <input type="number" className="input w-full" value={targetGrade} onChange={(e) => { const v = e.target.value; setTargetGrade(v); validateField(v, setTargetGradeError); }} />
          {targetGradeError && <p className="text-xs text-red-500 mt-1">{targetGradeError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Вес экзамена (%)' : 'Exam Weight (%)'}
          </label>
          <input type="number" className="input w-full" value={examWeight} onChange={(e) => { const v = e.target.value; setExamWeight(v); validateField(v, setExamWeightError); }} />
          {examWeightError && <p className="text-xs text-red-500 mt-1">{examWeightError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Нужный балл */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Нужно на экзамене' : 'Required on Exam'}
              </h3>
              <CircularProgressWidget 
                value={Math.min(result.requiredScore, 100)} 
                maxValue={100} 
                label={result.possible ? `${Math.round(result.requiredScore)}%` : 'N/A'}
                color={result.possible ? '#22c55e' : '#ef4444'}
                size={160}
              />
            </div>

            {/* Сценарии */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Итоговая оценка по сценариям' : 'Final Grade Scenarios'}
              </h3>
              <BarChartWidget 
                data={examScenarios}
                dataKeys={[{ key: language === 'ru' ? 'Итоговая' : 'Final', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение оценок' : 'Grade Comparison'}
            </h3>
            <HorizontalBarWidget data={gradeComparison} />
          </div>

          {/* Рекомендация */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
            </h3>
            {result.possible ? (
              <>
                <p className="text-3xl font-bold text-primary">{Math.round(result.requiredScore)}%</p>
                <p className="text-sm text-muted mt-2">
                  {language === 'ru' ? 'минимальный балл на экзамене' : 'minimum score on exam'}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-red-500">
                {language === 'ru' ? 'Цель недостижима' : 'Target is unachievable'}
              </p>
            )}
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
