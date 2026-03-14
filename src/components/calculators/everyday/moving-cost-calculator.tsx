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

export function MovingCostCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [transport, setTransport] = useState('12000')
  const [workers, setWorkers] = useState('8000')
  const [packaging, setPackaging] = useState('5000')
  const [insurance, setInsurance] = useState('3000')
  const [transportError, setTransportError] = useState('')
  const [workersError, setWorkersError] = useState('')
  const [packagingError, setPackagingError] = useState('')
  const [insuranceError, setInsuranceError] = useState('')

  const t = Number(transport)
  const w = Number(workers)
  const p = Number(packaging)
  const i = Number(insurance)

  // Обработчики для валидации
  const handleTransportChange = (value: string) => {
    setTransport(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setTransportError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setTransportError('')
      }
    } else {
      setTransportError('')
    }
  }

  const handleWorkersChange = (value: string) => {
    setWorkers(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setWorkersError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setWorkersError('')
      }
    } else {
      setWorkersError('')
    }
  }

  const handlePackagingChange = (value: string) => {
    setPackaging(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setPackagingError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setPackagingError('')
      }
    } else {
      setPackagingError('')
    }
  }

  const handleInsuranceChange = (value: string) => {
    setInsurance(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setInsuranceError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setInsuranceError('')
      }
    } else {
      setInsuranceError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const total = t + w + p + i
    return { transport: t, workers: w, packaging: p, insurance: i, total }
  }, [t, w, p, i])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Транспорт' : 'Transport', value: Math.round(result.transport) },
      { name: language === 'ru' ? 'Грузчики' : 'Workers', value: Math.round(result.workers) },
      { name: language === 'ru' ? 'Упаковка' : 'Packaging', value: Math.round(result.packaging) },
      { name: language === 'ru' ? 'Страховка' : 'Insurance', value: Math.round(result.insurance) },
    ]
  }, [result, language])

  // Сравнение расходов
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Транспорт' : 'Transport', value: Math.round(result.transport), color: '#6366f1' },
      { label: language === 'ru' ? 'Грузчики' : 'Workers', value: Math.round(result.workers), color: '#8b5cf6' },
      { label: language === 'ru' ? 'Упаковка' : 'Packaging', value: Math.round(result.packaging), color: '#22c55e' },
      { label: language === 'ru' ? 'Страховка' : 'Insurance', value: Math.round(result.insurance), color: '#f59e0b' },
    ]
  }, [result, language])

  // Сравнение с DIY
  const diyComparison = useMemo(() => {
    if (!result) return []
    const diyCost = result.transport * 0.5 + result.packaging * 0.3
    return [
      { label: language === 'ru' ? 'С компанией' : 'With Company', value: Math.round(result.total), color: '#ef4444' },
      { label: language === 'ru' ? 'Самостоятельно' : 'DIY', value: Math.round(diyCost), color: '#22c55e' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Транспорт' : 'Transport', value: formatCurrency(Math.round(result.transport), language) },
      { label: language === 'ru' ? 'Грузчики' : 'Workers', value: formatCurrency(Math.round(result.workers), language) },
      { label: language === 'ru' ? 'Упаковка' : 'Packaging', value: formatCurrency(Math.round(result.packaging), language) },
      { label: language === 'ru' ? 'Итого' : 'Total', value: formatCurrency(Math.round(result.total), language) },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Транспорт (₽)' : 'Transport (₽)'}
          </label>
          <input type="number" className="input w-full" value={transport} onChange={(e) => handleTransportChange(e.target.value)} />
          {transportError && <p className="text-xs text-red-500 mt-1">{transportError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Грузчики (₽)' : 'Workers (₽)'}
          </label>
          <input type="number" className="input w-full" value={workers} onChange={(e) => handleWorkersChange(e.target.value)} />
          {workersError && <p className="text-xs text-red-500 mt-1">{workersError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Упаковка (₽)' : 'Packaging (₽)'}
          </label>
          <input type="number" className="input w-full" value={packaging} onChange={(e) => handlePackagingChange(e.target.value)} />
          {packagingError && <p className="text-xs text-red-500 mt-1">{packagingError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Страховка (₽)' : 'Insurance (₽)'}
          </label>
          <input type="number" className="input w-full" value={insurance} onChange={(e) => handleInsuranceChange(e.target.value)} />
          {insuranceError && <p className="text-xs text-red-500 mt-1">{insuranceError}</p>}
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
                centerValue={formatCurrency(result.total, language)}
              />
            </div>

            {/* Сравнение */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'С компанией vs Самостоятельно' : 'Company vs DIY'}
              </h3>
              <BarChartWidget 
                data={[
                  { name: language === 'ru' ? 'С компанией' : 'Company', value: Math.round(result.total) },
                  { name: language === 'ru' ? 'Самостоятельно' : 'DIY', value: Math.round(result.transport * 0.5 + result.packaging * 0.3) },
                ].map(d => ({ name: d.name, [language === 'ru' ? 'Стоимость' : 'Cost']: d.value }))}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#6366f1' }]}
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

          {/* Сравнение DIY */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Варианты переезда' : 'Moving Options'}
            </h3>
            <HorizontalBarWidget data={diyComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
