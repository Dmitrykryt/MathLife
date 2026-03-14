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

export function CarMaintenanceCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [service, setService] = useState('15000')
  const [fuel, setFuel] = useState('60000')
  const [insurance, setInsurance] = useState('45000')
  const [repairs, setRepairs] = useState('30000')
  const [serviceError, setServiceError] = useState('')
  const [fuelError, setFuelError] = useState('')
  const [insuranceError, setInsuranceError] = useState('')
  const [repairsError, setRepairsError] = useState('')

  const s = Number(service)
  const f = Number(fuel)
  const i = Number(insurance)
  const r = Number(repairs)

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
    const yearly = s + f + i + r
    const monthly = yearly / 12
    const perKm = yearly / 15000 // средний пробег
    return { yearly, monthly, perKm }
  }, [s, f, i, r])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'ТО' : 'Service', value: Math.round(s) },
      { name: language === 'ru' ? 'Топливо' : 'Fuel', value: Math.round(f) },
      { name: language === 'ru' ? 'Страховка' : 'Insurance', value: Math.round(i) },
      { name: language === 'ru' ? 'Ремонт' : 'Repairs', value: Math.round(r) },
    ]
  }, [result, s, f, i, r, language])

  // Сравнение расходов
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'ТО' : 'Service', value: Math.round(s), color: '#6366f1' },
      { label: language === 'ru' ? 'Топливо' : 'Fuel', value: Math.round(f), color: '#22c55e' },
      { label: language === 'ru' ? 'Страховка' : 'Insurance', value: Math.round(i), color: '#f59e0b' },
      { label: language === 'ru' ? 'Ремонт' : 'Repairs', value: Math.round(r), color: '#ef4444' },
    ]
  }, [result, s, f, i, r, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'В год' : 'Yearly', value: formatCurrency(Math.round(result.yearly), language) },
      { label: language === 'ru' ? 'В месяц' : 'Monthly', value: formatCurrency(Math.round(result.monthly), language) },
      { label: language === 'ru' ? 'За км' : 'Per km', value: formatCurrency(Math.round(result.perKm * 10) / 10, language) },
      { label: language === 'ru' ? 'За 5 лет' : 'For 5 years', value: formatCurrency(Math.round(result.yearly * 5), language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'ТО (₽/год)' : 'Service (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={service} onChange={(e) => { const v = e.target.value; setService(v); validateField(v, setServiceError); }} />
          {serviceError && <p className="text-xs text-red-500 mt-1">{serviceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Топливо (₽/год)' : 'Fuel (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={fuel} onChange={(e) => { const v = e.target.value; setFuel(v); validateField(v, setFuelError); }} />
          {fuelError && <p className="text-xs text-red-500 mt-1">{fuelError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Страховка (₽/год)' : 'Insurance (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={insurance} onChange={(e) => { const v = e.target.value; setInsurance(v); validateField(v, setInsuranceError); }} />
          {insuranceError && <p className="text-xs text-red-500 mt-1">{insuranceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ремонт (₽/год)' : 'Repairs (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={repairs} onChange={(e) => { const v = e.target.value; setRepairs(v); validateField(v, setRepairsError); }} />
          {repairsError && <p className="text-xs text-red-500 mt-1">{repairsError}</p>}
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
                centerLabel={language === 'ru' ? 'В год' : 'Yearly'}
                centerValue={`${Math.round(result.yearly / 1000)}K`}
              />
            </div>

            {/* По периодам */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Расходы по периодам' : 'Cost by Period'}
              </h3>
              <BarChartWidget 
                data={[
                  { name: language === 'ru' ? 'Месяц' : 'Month', value: Math.round(result.monthly / 1000) },
                  { name: language === 'ru' ? 'Квартал' : 'Quarter', value: Math.round(result.monthly * 3 / 1000) },
                  { name: language === 'ru' ? 'Год' : 'Year', value: Math.round(result.yearly / 1000) },
                  { name: language === 'ru' ? '5 лет' : '5 Years', value: Math.round(result.yearly * 5 / 1000) },
                ]}
                dataKeys={[{ key: 'value', color: '#6366f1' }]}
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
        </div>
      )}
    </CalculatorShell>
  )
}
