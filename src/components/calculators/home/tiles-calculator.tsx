'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
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

export function TilesCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [area, setArea] = useState('20')
  const [tileWidth, setTileWidth] = useState('30')
  const [tileHeight, setTileHeight] = useState('30')
  const [pricePerTile, setPricePerTile] = useState('150')
  const [waste, setWaste] = useState('10')
  const [areaError, setAreaError] = useState('')
  const [tileWidthError, setTileWidthError] = useState('')
  const [tileHeightError, setTileHeightError] = useState('')
  const [pricePerTileError, setPricePerTileError] = useState('')
  const [wasteError, setWasteError] = useState('')

  const a = Number(area)
  const tw = Number(tileWidth) / 100
  const th = Number(tileHeight) / 100
  const ppt = Number(pricePerTile)
  const w = Number(waste) / 100

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

  const handleTileWidthChange = (value: string) => {
    setTileWidth(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setTileWidthError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setTileWidthError('')
      }
    } else {
      setTileWidthError('')
    }
  }

  const handleTileHeightChange = (value: string) => {
    setTileHeight(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setTileHeightError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setTileHeightError('')
      }
    } else {
      setTileHeightError('')
    }
  }

  const handlePricePerTileChange = (value: string) => {
    setPricePerTile(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setPricePerTileError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setPricePerTileError('')
      }
    } else {
      setPricePerTileError('')
    }
  }

  const handleWasteChange = (value: string) => {
    setWaste(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setWasteError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setWasteError('')
      }
    } else {
      setWasteError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const tileArea = tw * th
    const tilesNeeded = Math.ceil(a / tileArea)
    const tilesWithWaste = Math.ceil(tilesNeeded * (1 + w))
    const totalCost = tilesNeeded * ppt
    const costWithWaste = tilesWithWaste * ppt
    return { tilesNeeded, totalCost, tilesWithWaste, costWithWaste }
  }, [a, tw, th, ppt, w])

  // Сравнение
  const comparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Без запаса' : 'No Waste', value: result.tilesNeeded, color: '#6366f1' },
      { label: language === 'ru' ? 'С запасом' : 'With Waste', value: result.tilesWithWaste, color: '#22c55e' },
    ]
  }, [result, language])

  // Стоимость
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Без запаса' : 'No Waste', value: Math.round(result.totalCost), color: '#6366f1' },
      { label: language === 'ru' ? 'С запасом' : 'With Waste', value: Math.round(result.costWithWaste), color: '#ef4444' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Плиток нужно' : 'Tiles Needed', value: result.tilesNeeded.toString() },
      { label: language === 'ru' ? 'С запасом' : 'With Waste', value: result.tilesWithWaste.toString() },
      { label: language === 'ru' ? 'Стоимость' : 'Cost', value: formatCurrency(Math.round(result.totalCost), language) },
      { label: language === 'ru' ? 'С запасом' : 'With Waste Cost', value: formatCurrency(Math.round(result.costWithWaste), language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Площадь (м²)' : 'Area (m²)'}
          </label>
          <input type="number" className="input w-full" value={area} onChange={(e) => handleAreaChange(e.target.value)} />
          {areaError && <p className="text-xs text-red-500 mt-1">{areaError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ширина плитки (см)' : 'Tile Width (cm)'}
          </label>
          <input type="number" className="input w-full" value={tileWidth} onChange={(e) => handleTileWidthChange(e.target.value)} />
          {tileWidthError && <p className="text-xs text-red-500 mt-1">{tileWidthError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Высота плитки (см)' : 'Tile Height (cm)'}
          </label>
          <input type="number" className="input w-full" value={tileHeight} onChange={(e) => handleTileHeightChange(e.target.value)} />
          {tileHeightError && <p className="text-xs text-red-500 mt-1">{tileHeightError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена плитки (₽)' : 'Tile Price (₽)'}
          </label>
          <input type="number" className="input w-full" value={pricePerTile} onChange={(e) => handlePricePerTileChange(e.target.value)} />
          {pricePerTileError && <p className="text-xs text-red-500 mt-1">{pricePerTileError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Запас на подрезку (%)' : 'Waste Margin (%)'}
          </label>
          <input type="number" className="input w-full" value={waste} onChange={(e) => handleWasteChange(e.target.value)} />
          {wasteError && <p className="text-xs text-red-500 mt-1">{wasteError}</p>}
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Количество плиток */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Количество плиток' : 'Tiles Count'}
              </h3>
              <DonutChartWidget 
                data={comparison}
                height={250}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={`${result.tilesWithWaste}`}
              />
            </div>

            {/* Стоимость */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Стоимость' : 'Cost'}
              </h3>
              <BarChartWidget 
                data={[
                  { name: language === 'ru' ? 'Без запаса' : 'No Waste', value: Math.round(result.totalCost) },
                  { name: language === 'ru' ? 'С запасом' : 'With Waste', value: Math.round(result.costWithWaste) },
                ]}
                dataKeys={[{ key: 'value', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Количество плиток' : 'Tiles Count'}
            </h3>
            <HorizontalBarWidget data={comparison} />
          </div>

          {/* Стоимость */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Стоимость' : 'Cost'}
            </h3>
            <HorizontalBarWidget data={costComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
