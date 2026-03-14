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
  CircularProgressWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function PaintCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [length, setLength] = useState('5')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.8')
  const [windows, setWindows] = useState('2')
  const [doorsCount, setDoorsCount] = useState('1')
  const [coverage, setCoverage] = useState('10')
  const [lengthError, setLengthError] = useState('')
  const [widthError, setWidthError] = useState('')
  const [heightError, setHeightError] = useState('')
  const [windowsError, setWindowsError] = useState('')
  const [doorsCountError, setDoorsCountError] = useState('')
  const [coverageError, setCoverageError] = useState('')

  const l = Number(length)
  const w = Number(width)
  const h = Number(height)
  const win = Number(windows)
  const doors = Number(doorsCount)
  const cov = Number(coverage)

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

  const handleDoorsCountChange = (value: string) => {
    setDoorsCount(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDoorsCountError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setDoorsCountError('')
      }
    } else {
      setDoorsCountError('')
    }
  }

  const handleCoverageChange = (value: string) => {
    setCoverage(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setCoverageError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setCoverageError('')
      }
    } else {
      setCoverageError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const wallArea = 2 * (l + w) * h
    const windowArea = win * 1.5
    const doorArea = doors * 2
    const totalArea = wallArea - windowArea - doorArea
    const liters = Math.ceil(totalArea / cov)
    return { liters, totalArea, wallArea, windowArea, doorArea }
  }, [l, w, h, win, doors, cov])

  // Данные для круговой диаграммы
  const areaPieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Стены (для покраски)' : 'Walls (to paint)', value: result.totalArea },
      { name: language === 'ru' ? 'Окна' : 'Windows', value: result.windowArea },
      { name: language === 'ru' ? 'Двери' : 'Doors', value: result.doorArea },
    ]
  }, [result, language])

  // Данные для столбчатой диаграммы
  const areaBarData = useMemo(() => {
    if (!result) return []
    return [
      { 
        name: language === 'ru' ? 'Общая площадь стен' : 'Total Wall Area', 
        [language === 'ru' ? 'Площадь (м²)' : 'Area (m²)']: Math.round(result.wallArea * 10) / 10 
      },
      { 
        name: language === 'ru' ? 'Для покраски' : 'To Paint', 
        [language === 'ru' ? 'Площадь (м²)' : 'Area (m²)']: Math.round(result.totalArea * 10) / 10 
      },
      { 
        name: language === 'ru' ? 'Вычеты (окна/двери)' : 'Deductions', 
        [language === 'ru' ? 'Площадь (м²)' : 'Area (m²)']: Math.round((result.windowArea + result.doorArea) * 10) / 10 
      },
    ]
  }, [result, language])

  // Данные для прогресс-баров (расчёт по слоям)
  const coatsData = useMemo(() => {
    if (!result) return []
    const oneCoat = result.liters
    const twoCoats = oneCoat * 2
    const threeCoats = oneCoat * 3
    
    return [
      { label: language === 'ru' ? '1 слой' : '1 coat', value: oneCoat, color: '#22c55e' },
      { label: language === 'ru' ? '2 слоя' : '2 coats', value: twoCoats, color: '#6366f1' },
      { label: language === 'ru' ? '3 слоя' : '3 coats', value: threeCoats, color: '#8b5cf6' },
    ]
  }, [result, language])

  // Расчёт стоимости
  const costData = useMemo(() => {
    if (!result) return null
    
    const pricePerLiter = 500 // примерная цена за литр
    const primerNeeded = Math.ceil(result.totalArea / 12) // грунтовка
    const paintCost = result.liters * pricePerLiter
    const primerCost = primerNeeded * 300
    const totalCost = paintCost + primerCost
    
    return {
      paintCost,
      primerCost,
      totalCost,
      primerNeeded
    }
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result || !costData) return []
    
    return [
      { 
        label: language === 'ru' ? 'Необходимая краска' : 'Paint Needed', 
        value: `${result.liters} л` 
      },
      { 
        label: language === 'ru' ? 'Площадь покраски' : 'Area to Paint', 
        value: `${result.totalArea.toFixed(1)} м²` 
      },
      { 
        label: language === 'ru' ? 'Грунтовка' : 'Primer Needed', 
        value: `${costData.primerNeeded} л` 
      },
      { 
        label: language === 'ru' ? 'Примерная стоимость' : 'Estimated Cost', 
        value: `${costData.totalCost.toLocaleString('ru-RU')} ₽` 
      },
    ]
  }, [result, costData, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Длина (м)' : 'Length (m)'}</label>
          <input type="number" className="input w-full" value={length} onChange={(e) => handleLengthChange(e.target.value)} />
          {lengthError && <p className="text-xs text-red-500 mt-1">{lengthError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Ширина (м)' : 'Width (m)'}</label>
          <input type="number" className="input w-full" value={width} onChange={(e) => handleWidthChange(e.target.value)} />
          {widthError && <p className="text-xs text-red-500 mt-1">{widthError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Высота (м)' : 'Height (m)'}</label>
          <input type="number" className="input w-full" value={height} onChange={(e) => handleHeightChange(e.target.value)} />
          {heightError && <p className="text-xs text-red-500 mt-1">{heightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Окон' : 'Windows'}</label>
          <input type="number" className="input w-full" value={windows} onChange={(e) => handleWindowsChange(e.target.value)} />
          {windowsError && <p className="text-xs text-red-500 mt-1">{windowsError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Дверей' : 'Doors'}</label>
          <input type="number" className="input w-full" value={doorsCount} onChange={(e) => handleDoorsCountChange(e.target.value)} />
          {doorsCountError && <p className="text-xs text-red-500 mt-1">{doorsCountError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Расход (м²/л)' : 'Coverage (m²/L)'}</label>
          <input type="number" className="input w-full" value={coverage} onChange={(e) => handleCoverageChange(e.target.value)} />
          {coverageError && <p className="text-xs text-red-500 mt-1">{coverageError}</p>}
        </div>
      </div>

      {result && costData && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма площадей */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Распределение площади' : 'Area Distribution'}
              </h3>
              <PieChartWidget data={areaPieData} height={250} />
            </div>

            {/* Столбчатая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение площадей' : 'Area Comparison'}
              </h3>
              <BarChartWidget 
                data={areaBarData}
                dataKeys={[{ key: language === 'ru' ? 'Площадь (м²)' : 'Area (m²)', name: 'м²' }]}
                height={250}
              />
            </div>
          </div>

          {/* Краска по слоям */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Количество краски по слоям' : 'Paint by Number of Coats'}
            </h3>
            <ProgressBarsWidget data={coatsData} />
          </div>

          {/* Рекомендации */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Рекомендации' : 'Recommendations'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Рекомендуется наносить 2 слоя краски для равномерного покрытия' : 'It is recommended to apply 2 coats of paint for even coverage'}</li>
              <li>• {language === 'ru' ? 'Не забудьте купить грунтовку перед покраской' : "Don't forget to buy primer before painting"}</li>
              <li>• {language === 'ru' ? 'Добавьте 10-15% запас на случай ошибок' : 'Add 10-15% extra for mistakes'}</li>
              <li>• {language === 'ru' ? 'Проверьте расход краски на упаковке производителя' : 'Check the paint coverage on the manufacturer\'s package'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
