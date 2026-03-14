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

export function PhonePlanCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [baseFee, setBaseFee] = useState('500')
  const [includedMinutes, setIncludedMinutes] = useState('300')
  const [usedMinutes, setUsedMinutes] = useState('450')
  const [minuteRate, setMinuteRate] = useState('2')
  const [includedGb, setIncludedGb] = useState('10')
  const [usedGb, setUsedGb] = useState('15')
  const [gbRate, setGbRate] = useState('50')
  const [baseFeeError, setBaseFeeError] = useState('')
  const [includedMinutesError, setIncludedMinutesError] = useState('')
  const [usedMinutesError, setUsedMinutesError] = useState('')
  const [minuteRateError, setMinuteRateError] = useState('')
  const [includedGbError, setIncludedGbError] = useState('')
  const [usedGbError, setUsedGbError] = useState('')
  const [gbRateError, setGbRateError] = useState('')

  const base = Number(baseFee)
  const incMin = Number(includedMinutes)
  const useMin = Number(usedMinutes)
  const minRate = Number(minuteRate)
  const incGb = Number(includedGb)
  const useGb = Number(usedGb)
  const gRate = Number(gbRate)

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

  const handleBaseFeeChange = (value: string) => { setBaseFee(value); validateField(value, setBaseFeeError) }
  const handleIncludedMinutesChange = (value: string) => { setIncludedMinutes(value); validateField(value, setIncludedMinutesError) }
  const handleUsedMinutesChange = (value: string) => { setUsedMinutes(value); validateField(value, setUsedMinutesError) }
  const handleMinuteRateChange = (value: string) => { setMinuteRate(value); validateField(value, setMinuteRateError) }
  const handleIncludedGbChange = (value: string) => { setIncludedGb(value); validateField(value, setIncludedGbError) }
  const handleUsedGbChange = (value: string) => { setUsedGb(value); validateField(value, setUsedGbError) }
  const handleGbRateChange = (value: string) => { setGbRate(value); validateField(value, setGbRateError) }

  // Автоматический расчёт
  const result = useMemo(() => {
    const extraMin = Math.max(0, useMin - incMin) * minRate
    const extraGb = Math.max(0, useGb - incGb) * gRate
    const total = base + extraMin + extraGb
    const overage = extraMin + extraGb
    return { base, extraMinutes: extraMin, extraGb: extraGb, total, overage }
  }, [base, incMin, useMin, minRate, incGb, useGb, gRate])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Абонплата' : 'Base Fee', value: result.base },
      { name: language === 'ru' ? 'Лишние минуты' : 'Extra Minutes', value: result.extraMinutes },
      { name: language === 'ru' ? 'Лишний трафик' : 'Extra Data', value: result.extraGb },
    ]
  }, [result, language])

  // Сравнение расходов
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Абонплата' : 'Base Fee', value: result.base, color: '#6366f1' },
      { label: language === 'ru' ? 'Перерасход' : 'Overage', value: result.overage, color: '#ef4444' },
    ]
  }, [result, language])

  // Годовой прогноз
  const yearlyProjection = useMemo(() => {
    if (!result) return []
    
    return [1, 3, 6, 12].map(months => ({
      name: language === 'ru' ? `${months} мес.` : `${months} mo.`,
      [language === 'ru' ? 'Стоимость' : 'Cost']: result.total * months,
    }))
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Абонплата' : 'Base Fee', value: `${result.base} ₽` },
      { label: language === 'ru' ? 'Перерасход' : 'Overage', value: `${result.overage} ₽` },
      { label: language === 'ru' ? 'Итого' : 'Total', value: `${result.total} ₽` },
      { label: language === 'ru' ? 'В год' : 'Yearly', value: `${result.total * 12} ₽` },
    ]
  }, [result, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Абонплата (₽/мес)' : 'Base Fee (₽/mo)'}
          </label>
          <input type="number" className="input w-full" value={baseFee} onChange={(e) => handleBaseFeeChange(e.target.value)} />
          {baseFeeError && <p className="text-xs text-red-500 mt-1">{baseFeeError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Включено минут' : 'Included Minutes'}
          </label>
          <input type="number" className="input w-full" value={includedMinutes} onChange={(e) => handleIncludedMinutesChange(e.target.value)} />
          {includedMinutesError && <p className="text-xs text-red-500 mt-1">{includedMinutesError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Использовано минут' : 'Used Minutes'}
          </label>
          <input type="number" className="input w-full" value={usedMinutes} onChange={(e) => handleUsedMinutesChange(e.target.value)} />
          {usedMinutesError && <p className="text-xs text-red-500 mt-1">{usedMinutesError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена минуты (₽)' : 'Minute Rate (₽)'}
          </label>
          <input type="number" className="input w-full" value={minuteRate} onChange={(e) => handleMinuteRateChange(e.target.value)} />
          {minuteRateError && <p className="text-xs text-red-500 mt-1">{minuteRateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Включено ГБ' : 'Included GB'}
          </label>
          <input type="number" className="input w-full" value={includedGb} onChange={(e) => handleIncludedGbChange(e.target.value)} />
          {includedGbError && <p className="text-xs text-red-500 mt-1">{includedGbError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Использовано ГБ' : 'Used GB'}
          </label>
          <input type="number" className="input w-full" value={usedGb} onChange={(e) => handleUsedGbChange(e.target.value)} />
          {usedGbError && <p className="text-xs text-red-500 mt-1">{usedGbError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Цена ГБ (₽)' : 'GB Rate (₽)'}
          </label>
          <input type="number" className="input w-full" value={gbRate} onChange={(e) => handleGbRateChange(e.target.value)} />
          {gbRateError && <p className="text-xs text-red-500 mt-1">{gbRateError}</p>}
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
                centerValue={`${result.total} ₽`}
              />
            </div>

            {/* Годовой прогноз */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Прогноз по периодам' : 'Period Projection'}
              </h3>
              <BarChartWidget 
                data={yearlyProjection}
                dataKeys={[{ key: language === 'ru' ? 'Стоимость' : 'Cost', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение расходов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Абонплата vs Перерасход' : 'Base vs Overage'}
            </h3>
            <HorizontalBarWidget data={costComparison} />
          </div>

          {/* Рекомендация */}
          {result.overage > result.base * 0.3 && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-2 text-yellow-500">
                {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
              </h3>
              <p className="text-sm text-muted">
                {language === 'ru' 
                  ? 'Перерасход составляет более 30% от абонплаты. Рассмотрите тариф с большим пакетом минут и трафика.'
                  : 'Overage is more than 30% of your base fee. Consider upgrading to a plan with more minutes and data.'}
              </p>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  )
}
