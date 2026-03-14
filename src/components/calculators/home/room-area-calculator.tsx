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
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function RoomAreaCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.7')
  const [lengthError, setLengthError] = useState('')
  const [widthError, setWidthError] = useState('')
  const [heightError, setHeightError] = useState('')

  const l = Number(length)
  const w = Number(width)
  const h = Number(height)

  // Обработчики для валидации
  const handleLengthChange = (value: string) => {
    setLength(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setLengthError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setLengthError('')
      }
    } else {
      setLengthError('')
    }
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setWidthError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setWidthError('')
      }
    } else {
      setWidthError('')
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

  // Автоматический расчёт
  const result = useMemo(() => {
    const floor = l * w
    const ceiling = l * w
    const perimeter = 2 * (l + w)
    const walls = perimeter * h
    return { floor, ceiling, walls, perimeter }
  }, [l, w, h])

  // Сравнение площадей
  const areaComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Пол' : 'Floor', value: result.floor, color: '#6366f1' },
      { label: language === 'ru' ? 'Потолок' : 'Ceiling', value: result.ceiling, color: '#8b5cf6' },
      { label: language === 'ru' ? 'Стены' : 'Walls', value: result.walls, color: '#22c55e' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Пол' : 'Floor', value: `${result.floor} м²` },
      { label: language === 'ru' ? 'Потолок' : 'Ceiling', value: `${result.ceiling} м²` },
      { label: language === 'ru' ? 'Стены' : 'Walls', value: `${result.walls.toFixed(1)} м²` },
      { label: language === 'ru' ? 'Периметр' : 'Perimeter', value: `${result.perimeter} м` },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Длина (м)' : 'Length (m)'}
          </label>
          <input type="number" className="input w-full" value={length} onChange={(e) => handleLengthChange(e.target.value)} />
          {lengthError && <p className="text-xs text-red-500 mt-1">{lengthError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ширина (м)' : 'Width (m)'}
          </label>
          <input type="number" className="input w-full" value={width} onChange={(e) => handleWidthChange(e.target.value)} />
          {widthError && <p className="text-xs text-red-500 mt-1">{widthError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Высота (м)' : 'Height (m)'}
          </label>
          <input type="number" className="input w-full" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
          {heightError && <p className="text-xs text-red-500 mt-1">{heightError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Площади поверхностей' : 'Surface Areas'}
              </h3>
              <DonutChartWidget 
                data={areaComparison}
                height={250}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={`${(result.floor + result.ceiling + result.walls).toFixed(0)} м²`}
              />
            </div>

            {/* Сравнение */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение площадей' : 'Areas Comparison'}
              </h3>
              <BarChartWidget 
                data={[
                  { name: language === 'ru' ? 'Пол' : 'Floor', value: result.floor },
                  { name: language === 'ru' ? 'Потолок' : 'Ceiling', value: result.ceiling },
                  { name: language === 'ru' ? 'Стены' : 'Walls', value: Math.round(result.walls) },
                ]}
                dataKeys={[{ key: 'value', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Площади поверхностей' : 'Surface Areas'}
            </h3>
            <HorizontalBarWidget data={areaComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
