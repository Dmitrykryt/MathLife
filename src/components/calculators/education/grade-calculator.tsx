'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatPercent } from '@/utils/format'
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

export function GradeCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [grades, setGrades] = useState('5,4,4,5,3')

  // Автоматический расчёт
  const result = useMemo(() => {
    const arr = grades.split(',').map(g => Number(g.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 5)
    if (arr.length > 0) {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length
      return { average: avg, grades: arr }
    }
    return null
  }, [grades])

  // Распределение оценок
  const gradeDistribution = useMemo(() => {
    if (!result) return []
    
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0 }
    result.grades.forEach(g => {
      if (counts[g] !== undefined) counts[g]++
    })
    
    return [
      { name: '5', value: counts[5], color: '#22c55e' },
      { name: '4', value: counts[4], color: '#6366f1' },
      { name: '3', value: counts[3], color: '#f59e0b' },
      { name: '2', value: counts[2], color: '#ef4444' },
    ].filter(d => d.value > 0)
  }, [result])

  // Прогресс к отличной оценке
  const progressToExcellent = useMemo(() => {
    if (!result) return 0
    // 5 = 100%, 4 = 80%, 3 = 60%, 2 = 40%
    return (result.average / 5) * 100
  }, [result])

  // Качество знаний (процент 4 и 5)
  const qualityPercentage = useMemo(() => {
    if (!result) return 0
    const goodGrades = result.grades.filter(g => g >= 4).length
    return (goodGrades / result.grades.length) * 100
  }, [result])

  // Успеваемость (процент без двоек)
  const successRate = useMemo(() => {
    if (!result) return 0
    const passingGrades = result.grades.filter(g => g >= 3).length
    return (passingGrades / result.grades.length) * 100
  }, [result])

  // История оценок
  const gradesHistory = useMemo(() => {
    if (!result) return []
    
    return result.grades.map((grade, i) => ({
      name: `#${i + 1}`,
      [language === 'ru' ? 'Оценка' : 'Grade']: grade,
    }))
  }, [result, language])

  // Сравнение с эталонами
  const comparisonData = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Отлично (5.0)' : 'Excellent (5.0)', value: 5, color: '#22c55e' },
      { label: language === 'ru' ? 'Хорошо (4.0)' : 'Good (4.0)', value: 4, color: '#6366f1' },
      { label: language === 'ru' ? 'Удовлетворительно (3.0)' : 'Satisfactory (3.0)', value: 3, color: '#f59e0b' },
      { label: language === 'ru' ? 'Ваш средний балл' : 'Your Average', value: result.average, color: '#8b5cf6' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    const fives = result.grades.filter(g => g === 5).length
    const fours = result.grades.filter(g => g === 4).length
    const threes = result.grades.filter(g => g === 3).length
    const twos = result.grades.filter(g => g === 2).length
    
    return [
      { label: language === 'ru' ? 'Средний балл' : 'Average', value: result.average.toFixed(2) },
      { label: language === 'ru' ? 'Всего оценок' : 'Total Grades', value: result.grades.length.toString() },
      { label: language === 'ru' ? 'Качество знаний' : 'Quality', value: formatPercent(qualityPercentage) },
      { label: language === 'ru' ? 'Успеваемость' : 'Success Rate', value: formatPercent(successRate) },
    ]
  }, [result, qualityPercentage, successRate, language])

  // Определение итоговой оценки
  const getFinalGrade = (avg: number): { grade: number; label: string } => {
    if (avg >= 4.5) return { grade: 5, label: language === 'ru' ? 'Отлично' : 'Excellent' }
    if (avg >= 3.5) return { grade: 4, label: language === 'ru' ? 'Хорошо' : 'Good' }
    if (avg >= 2.5) return { grade: 3, label: language === 'ru' ? 'Удовлетворительно' : 'Satisfactory' }
    return { grade: 2, label: language === 'ru' ? 'Неудовлетворительно' : 'Unsatisfactory' }
  }

  return (
    <CalculatorShell calculator={calculator}>
      <div>
        <label className="block text-sm text-muted mb-1">
          {language === 'ru' ? 'Оценки (через запятую)' : 'Grades (comma separated)'}
        </label>
        <input
          type="text"
          className="input w-full"
          value={grades}
          onChange={(e) => setGrades(e.target.value)}
          placeholder="5,4,4,5,3"
        />
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Распределение оценок */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Распределение оценок' : 'Grade Distribution'}
              </h3>
              <DonutChartWidget 
                data={gradeDistribution} 
                height={250}
                centerLabel={language === 'ru' ? 'Средний' : 'Average'}
                centerValue={result.average.toFixed(2)}
              />
            </div>

            {/* Прогресс к отличной оценке */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Прогресс к отличной оценке' : 'Progress to Excellent'}
              </h3>
              <CircularProgressWidget 
                value={progressToExcellent} 
                maxValue={100} 
                label={getFinalGrade(result.average).label}
                color={result.average >= 4.5 ? '#22c55e' : result.average >= 3.5 ? '#6366f1' : result.average >= 2.5 ? '#f59e0b' : '#ef4444'}
                size={160}
              />
            </div>
          </div>

          {/* История оценок */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'История оценок' : 'Grades History'}
            </h3>
            <BarChartWidget 
              data={gradesHistory}
              dataKeys={[{ key: language === 'ru' ? 'Оценка' : 'Grade', color: '#6366f1' }]}
              height={200}
            />
          </div>

          {/* Сравнение с эталонами */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение с эталонами' : 'Comparison with Standards'}
            </h3>
            <HorizontalBarWidget data={comparisonData} maxValue={5} />
          </div>

          {/* Качество и успеваемость */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 text-center">
              <h4 className="text-sm text-muted mb-2">{language === 'ru' ? 'Качество знаний' : 'Knowledge Quality'}</h4>
              <div className="text-3xl font-bold text-primary">{formatPercent(qualityPercentage)}</div>
              <p className="text-xs text-muted mt-1">
                {language === 'ru' ? 'Доля 4 и 5' : 'Share of 4s and 5s'}
              </p>
            </div>
            <div className="glass-card p-4 text-center">
              <h4 className="text-sm text-muted mb-2">{language === 'ru' ? 'Успеваемость' : 'Success Rate'}</h4>
              <div className="text-3xl font-bold text-green-500">{formatPercent(successRate)}</div>
              <p className="text-xs text-muted mt-1">
                {language === 'ru' ? 'Без двоек' : 'Without 2s'}
              </p>
            </div>
          </div>

          {/* Итоговая оценка */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Итоговая оценка' : 'Final Grade'}
            </h3>
            <div className="text-5xl font-bold" style={{ 
              color: result.average >= 4.5 ? '#22c55e' : result.average >= 3.5 ? '#6366f1' : result.average >= 2.5 ? '#f59e0b' : '#ef4444' 
            }}>
              {getFinalGrade(result.average).grade}
            </div>
            <p className="text-lg text-muted mt-2">{getFinalGrade(result.average).label}</p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
