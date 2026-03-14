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

export function WaterBillCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [coldWater, setColdWater] = useState('10')
  const [hotWater, setHotWater] = useState('5')
  const [coldRate, setColdRate] = useState('45')
  const [hotRate, setHotRate] = useState('180')
  const [drainage, setDrainage] = useState('25')
  const [coldWaterError, setColdWaterError] = useState('')
  const [hotWaterError, setHotWaterError] = useState('')
  const [coldRateError, setColdRateError] = useState('')
  const [hotRateError, setHotRateError] = useState('')
  const [drainageError, setDrainageError] = useState('')

  const cw = Number(coldWater)
  const hw = Number(hotWater)
  const cr = Number(coldRate)
  const hr = Number(hotRate)
  const dr = Number(drainage)

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
    const coldCost = cw * cr
    const hotCost = hw * hr
    const drainageCost = (cw + hw) * dr
    const total = coldCost + hotCost + drainageCost
    const totalVolume = cw + hw
    return { coldCost, hotCost, drainageCost, total, totalVolume }
  }, [cw, hw, cr, hr, dr])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Холодная вода' : 'Cold Water', value: result.coldCost },
      { name: language === 'ru' ? 'Горячая вода' : 'Hot Water', value: result.hotCost },
      { name: language === 'ru' ? 'Водоотведение' : 'Drainage', value: result.drainageCost },
    ]
  }, [result, language])

  // Сравнение расходов
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Холодная вода' : 'Cold Water', value: result.coldCost, color: '#3b82f6' },
      { label: language === 'ru' ? 'Горячая вода' : 'Hot Water', value: result.hotCost, color: '#ef4444' },
      { label: language === 'ru' ? 'Водоотведение' : 'Drainage', value: result.drainageCost, color: '#8b5cf6' },
    ]
  }, [result, language])

  // Прогноз годовых расходов (детерминированные сезонные коэффициенты)
  const yearlyProjection = useMemo(() => {
    if (!result) return []
    
    // Сезонные коэффициенты (летом больше расходов на воду)
    const seasonalFactors = [0.95, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.05, 1.0, 0.95, 0.95]
    
    const months = language === 'ru' 
      ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    return months.map((month, i) => ({
      name: month,
      [language === 'ru' ? 'Стоимость' : 'Cost']: Math.round(result.total * seasonalFactors[i]),
    }))
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Холодная вода' : 'Cold Water', value: `${Math.round(result.coldCost)} ₽` },
      { label: language === 'ru' ? 'Горячая вода' : 'Hot Water', value: `${Math.round(result.hotCost)} ₽` },
      { label: language === 'ru' ? 'Водоотведение' : 'Drainage', value: `${Math.round(result.drainageCost)} ₽` },
      { label: language === 'ru' ? 'Итого' : 'Total', value: `${Math.round(result.total)} ₽` },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Холодная вода (м³)' : 'Cold Water (m³)'}
          </label>
          <input type="number" className="input w-full" value={coldWater} onChange={(e) => { const v = e.target.value; setColdWater(v); validateField(v, setColdWaterError); }} />
          {coldWaterError && <p className="text-xs text-red-500 mt-1">{coldWaterError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Горячая вода (м³)' : 'Hot Water (m³)'}
          </label>
          <input type="number" className="input w-full" value={hotWater} onChange={(e) => { const v = e.target.value; setHotWater(v); validateField(v, setHotWaterError); }} />
          {hotWaterError && <p className="text-xs text-red-500 mt-1">{hotWaterError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Тариф холодной (₽/м³)' : 'Cold Rate (₽/m³)'}
          </label>
          <input type="number" className="input w-full" value={coldRate} onChange={(e) => { const v = e.target.value; setColdRate(v); validateField(v, setColdRateError); }} />
          {coldRateError && <p className="text-xs text-red-500 mt-1">{coldRateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Тариф горячей (₽/м³)' : 'Hot Rate (₽/m³)'}
          </label>
          <input type="number" className="input w-full" value={hotRate} onChange={(e) => { const v = e.target.value; setHotRate(v); validateField(v, setHotRateError); }} />
          {hotRateError && <p className="text-xs text-red-500 mt-1">{hotRateError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Водоотведение (₽/м³)' : 'Drainage Rate (₽/m³)'}
          </label>
          <input type="number" className="input w-full" value={drainage} onChange={(e) => { const v = e.target.value; setDrainage(v); validateField(v, setDrainageError); }} />
          {drainageError && <p className="text-xs text-red-500 mt-1">{drainageError}</p>}
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
                {language === 'ru' ? 'Распределение расходов' : 'Cost Distribution'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={`${Math.round(result.total)} ₽`}
              />
            </div>

            {/* Объём воды */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Объём воды' : 'Water Volume'}
              </h3>
              <PieChartWidget 
                data={[
                  { name: language === 'ru' ? 'Холодная' : 'Cold', value: cw },
                  { name: language === 'ru' ? 'Горячая' : 'Hot', value: hw },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение расходов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение расходов' : 'Cost Comparison'}
            </h3>
            <HorizontalBarWidget data={costComparison} />
          </div>

          {/* Прогноз годовых расходов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Прогноз годовых расходов' : 'Yearly Projection'}
            </h3>
            <BarChartWidget 
              data={yearlyProjection}
              dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#3b82f6' }]}
              height={250}
            />
          </div>

          {/* Советы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Советы по экономии' : 'Saving Tips'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Установите водосберегающие насадки на краны' : 'Install water-saving faucet aerators'}</li>
              <li>• {language === 'ru' ? 'Проверьте счётчики на исправность' : 'Check meters for proper function'}</li>
              <li>• {language === 'ru' ? 'Исправьте протечки сразу' : 'Fix leaks immediately'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
