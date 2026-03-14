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

export function TireSizeCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [width, setWidth] = useState('225')
  const [aspect, setAspect] = useState('45')
  const [rim, setRim] = useState('17')
  const [widthError, setWidthError] = useState('')
  const [aspectError, setAspectError] = useState('')
  const [rimError, setRimError] = useState('')

  const w = Number(width)
  const a = Number(aspect)
  const r = Number(rim)

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
    const sidewall = w * a / 100 / 25.4 // в дюймах
    const diameter = r + 2 * sidewall
    const circumference = Math.PI * diameter * 25.4 // в мм
    const revsPerKm = 1000000 / circumference

    return { 
      diameter: Math.round(diameter * 25.4), // в мм
      circumference: Math.round(circumference),
      sidewall: Math.round(sidewall * 25.4),
      revsPerKm: Math.round(revsPerKm)
    }
  }, [w, a, r])

  // Сравнение размеров
  const sizeComparison = useMemo(() => {
    const sizes = [
      { label: '195/65 R15', diameter: 635 },
      { label: '205/55 R16', diameter: 632 },
      { label: '225/45 R17', diameter: 634 },
      { label: '235/40 R18', diameter: 645 },
      { label: '255/35 R19', diameter: 661 },
    ]
    
    return sizes.map(s => ({
      name: s.label,
      [language === 'ru' ? 'Диаметр' : 'Diameter']: s.diameter,
    }))
  }, [language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Диаметр' : 'Diameter', value: `${result.diameter} мм` },
      { label: language === 'ru' ? 'Окружность' : 'Circumference', value: `${result.circumference} мм` },
      { label: language === 'ru' ? 'Боковина' : 'Sidewall', value: `${result.sidewall} мм` },
      { label: language === 'ru' ? 'Оборотов/км' : 'Revs/km', value: result.revsPerKm.toString() },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ширина (мм)' : 'Width (mm)'}
          </label>
          <input type="number" className="input w-full" value={width} onChange={(e) => { const v = e.target.value; setWidth(v); validateField(v, setWidthError); }} />
          {widthError && <p className="text-xs text-red-500 mt-1">{widthError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Профиль (%)' : 'Aspect (%)'}
          </label>
          <input type="number" className="input w-full" value={aspect} onChange={(e) => { const v = e.target.value; setAspect(v); validateField(v, setAspectError); }} />
          {aspectError && <p className="text-xs text-red-500 mt-1">{aspectError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Диск (дюймы)' : 'Rim (inches)'}
          </label>
          <input type="number" className="input w-full" value={rim} onChange={(e) => { const v = e.target.value; setRim(v); validateField(v, setRimError); }} />
          {rimError && <p className="text-xs text-red-500 mt-1">{rimError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Размеры шины */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Размеры шины' : 'Tire Dimensions'}
              </h3>
              <DonutChartWidget 
                data={[
                  { name: language === 'ru' ? 'Диск' : 'Rim', value: Number(rim) * 25.4 },
                  { name: language === 'ru' ? 'Боковина' : 'Sidewall', value: result.sidewall },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'Диаметр' : 'Diameter'}
                centerValue={`${result.diameter} мм`}
              />
            </div>

            {/* Сравнение размеров */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение размеров' : 'Size Comparison'}
              </h3>
              <BarChartWidget 
                data={sizeComparison}
                dataKeys={[{ key: language === 'ru' ? 'Диаметр' : 'Diameter', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Размер шины */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Размер шины' : 'Tire Size'}
            </h3>
            <p className="text-3xl font-bold text-primary">{width}/{aspect} R{rim}</p>
            <p className="text-sm text-muted mt-2">
              {language === 'ru' ? `Диаметр: ${result.diameter} мм` : `Diameter: ${result.diameter} mm`}
            </p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
