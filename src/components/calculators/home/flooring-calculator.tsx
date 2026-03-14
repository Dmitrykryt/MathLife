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

export function FlooringCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [area, setArea] = useState('40')
  const [flooringType, setFlooringType] = useState('laminate')
  const [pricePerSqm, setPricePerSqm] = useState('800')
  const [waste, setWaste] = useState('8')
  const [areaError, setAreaError] = useState('')
  const [pricePerSqmError, setPricePerSqmError] = useState('')
  const [wasteError, setWasteError] = useState('')

  const a = Number(area)
  const pps = Number(pricePerSqm)
  const w = Number(waste) / 100
  const packSize = flooringType === 'laminate' ? 2.5 : flooringType === 'parquet' ? 1 : 3

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

  const handlePricePerSqmChange = (value: string) => {
    setPricePerSqm(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setPricePerSqmError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setPricePerSqmError('')
      }
    } else {
      setPricePerSqmError('')
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
    const requiredArea = a * (1 + w)
    const packsNeeded = Math.ceil(requiredArea / packSize)
    const totalCost = packsNeeded * packSize * pps
    return { requiredArea, totalCost, packsNeeded }
  }, [a, w, packSize, pps])

  // Сравнение
  const comparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Площадь комнаты' : 'Room Area', value: Math.round(Number(area) * 10) / 10, color: '#6366f1' },
      { label: language === 'ru' ? 'С запасом' : 'With Waste', value: Math.round(result.requiredArea * 10) / 10, color: '#22c55e' },
    ]
  }, [result, area, language])

  // Сравнение типов
  const typeComparison = useMemo(() => {
    const types = [
      { name: language === 'ru' ? 'Ламинат' : 'Laminate', price: 800 },
      { name: language === 'ru' ? 'Паркет' : 'Parquet', price: 2500 },
      { name: language === 'ru' ? 'Линолеум' : 'Linoleum', price: 500 },
      { name: language === 'ru' ? 'Винил' : 'Vinyl', price: 1200 },
    ]
    
    return types.map(t => ({
      name: t.name,
      [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(a * (1 + w) * t.price),
    }))
  }, [a, w, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Площадь' : 'Area', value: `${a} м²` },
      { label: language === 'ru' ? 'С запасом' : 'With Waste', value: `${result.requiredArea.toFixed(1)} м²` },
      { label: language === 'ru' ? 'Упаковок' : 'Packs', value: result.packsNeeded.toString() },
      { label: language === 'ru' ? 'Стоимость' : 'Cost', value: formatCurrency(Math.round(result.totalCost), language) },
    ]
  }, [result, a, language])

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
            {language === 'ru' ? 'Тип покрытия' : 'Flooring Type'}
          </label>
          <select className="input w-full" value={flooringType} onChange={(e) => setFlooringType(e.target.value)}>
            <option value="laminate">{language === 'ru' ? 'Ламинат' : 'Laminate'}</option>
            <option value="parquet">{language === 'ru' ? 'Паркет' : 'Parquet'}</option>
            <option value="linoleum">{language === 'ru' ? 'Линолеум' : 'Linoleum'}</option>
            <option value="vinyl">{language === 'ru' ? 'Винил' : 'Vinyl'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена за м² (₽)' : 'Price per m² (₽)'}
          </label>
          <input type="number" className="input w-full" value={pricePerSqm} onChange={(e) => handlePricePerSqmChange(e.target.value)} />
          {pricePerSqmError && <p className="text-xs text-red-500 mt-1">{pricePerSqmError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Запас (%)' : 'Waste (%)'}
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
            {/* Площадь */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Площадь' : 'Area'}
              </h3>
              <DonutChartWidget 
                data={comparison}
                height={250}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={`${result.requiredArea.toFixed(1)} м²`}
              />
            </div>

            {/* Сравнение типов */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение типов' : 'Types Comparison'}
              </h3>
              <BarChartWidget 
                data={typeComparison}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение площадей */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Площадь покрытия' : 'Flooring Area'}
            </h3>
            <HorizontalBarWidget data={comparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
