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

export function HvacCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [area, setArea] = useState('25')
  const [ceilingHeight, setCeilingHeight] = useState('2.7')
  const [insulation, setInsulation] = useState('average')
  const [windows, setWindows] = useState('2')
  const [areaError, setAreaError] = useState('')
  const [ceilingHeightError, setCeilingHeightError] = useState('')
  const [windowsError, setWindowsError] = useState('')

  const a = Number(area)
  const h = Number(ceilingHeight)
  const w = Number(windows)

  // Обработчики для валидации
  const handleAreaChange = (value: string) => {
    setArea(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setAreaError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setAreaError('')
      }
    } else {
      setAreaError('')
    }
  }

  const handleCeilingHeightChange = (value: string) => {
    setCeilingHeight(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setCeilingHeightError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setCeilingHeightError('')
      }
    } else {
      setCeilingHeightError('')
    }
  }

  const handleWindowsChange = (value: string) => {
    setWindows(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setWindowsError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setWindowsError('')
      }
    } else {
      setWindowsError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    // Базовая мощность: 100 Вт на м²
    let watts = a * 100
    
    // Корректировка на высоту потолка
    if (h > 2.7) watts *= 1 + (h - 2.7) * 0.1
    
    // Корректировка на теплоизоляцию
    if (insulation === 'good') watts *= 0.8
    else if (insulation === 'poor') watts *= 1.2
    
    // Корректировка на окна
    watts += w * 100
    
    const btu = watts * 3.412
    
    let recommendedModel = ''
    if (watts < 2500) recommendedModel = '7000 BTU'
    else if (watts < 3500) recommendedModel = '9000 BTU'
    else if (watts < 5000) recommendedModel = '12000 BTU'
    else if (watts < 7000) recommendedModel = '18000 BTU'
    else recommendedModel = '24000 BTU'

    return { watts: Math.round(watts), btu: Math.round(btu), recommendedModel }
  }, [a, h, w, insulation])

  // Сравнение площадей
  const areaComparison = useMemo(() => {
    const areas = [15, 20, 25, 30, 40, 50]
    
    return areas.map(a => ({
      name: `${a} м²`,
      [language === 'ru' ? 'Мощность (Вт)' : 'Power (W)']: a * 100,
      [language === 'ru' ? 'BTU' : 'BTU']: Math.round(a * 100 * 3.412),
    }))
  }, [language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Мощность' : 'Power', value: `${result.watts} Вт` },
      { label: language === 'ru' ? 'BTU' : 'BTU', value: result.btu.toLocaleString() },
      { label: language === 'ru' ? 'Рекомендуемая модель' : 'Recommended Model', value: result.recommendedModel },
      { label: language === 'ru' ? 'Площадь' : 'Area', value: `${a} м²` },
    ]
  }, [result, a, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Площадь комнаты (м²)' : 'Room Area (m²)'}
          </label>
          <input type="number" className="input w-full" value={area} onChange={(e) => handleAreaChange(e.target.value)} />
          {areaError && <p className="text-xs text-red-500 mt-1">{areaError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Высота потолка (м)' : 'Ceiling Height (m)'}
          </label>
          <input type="number" className="input w-full" value={ceilingHeight} onChange={(e) => handleCeilingHeightChange(e.target.value)} />
          {ceilingHeightError && <p className="text-xs text-red-500 mt-1">{ceilingHeightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Теплоизоляция' : 'Insulation'}
          </label>
          <select className="input w-full" value={insulation} onChange={(e) => setInsulation(e.target.value)}>
            <option value="good">{language === 'ru' ? 'Хорошая' : 'Good'}</option>
            <option value="average">{language === 'ru' ? 'Средняя' : 'Average'}</option>
            <option value="poor">{language === 'ru' ? 'Плохая' : 'Poor'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Количество окон' : 'Number of Windows'}
          </label>
          <input type="number" className="input w-full" value={windows} onChange={(e) => handleWindowsChange(e.target.value)} />
          {windowsError && <p className="text-xs text-red-500 mt-1">{windowsError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Мощность vs BTU */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Мощность vs BTU' : 'Power vs BTU'}
              </h3>
              <DonutChartWidget 
                data={[
                  { name: 'Watts', value: result.watts },
                  { name: 'BTU', value: Math.round(result.btu / 3.412) },
                ]}
                height={250}
                centerLabel={language === 'ru' ? 'Мощность' : 'Power'}
                centerValue={`${result.watts} W`}
              />
            </div>

            {/* Сравнение площадей */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Мощность для разных площадей' : 'Power for Different Areas'}
              </h3>
              <BarChartWidget 
                data={areaComparison}
                dataKeys={[
                  { key: language === 'ru' ? 'Мощность (Вт)' : 'Power (W)', color: '#6366f1' },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Рекомендация */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендуемая модель' : 'Recommended Model'}
            </h3>
            <p className="text-3xl font-bold text-primary">{result.recommendedModel}</p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
