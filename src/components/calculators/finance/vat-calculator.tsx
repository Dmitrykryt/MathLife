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
  CircularProgressWidget,
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function VATCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [amount, setAmount] = useState('1000')
  const [rate, setRate] = useState('20')
  const [action, setAction] = useState<'add' | 'remove'>('add')
  const [amountError, setAmountError] = useState('')
  const [rateError, setRateError] = useState('')

  const a = Number(amount)
  const r = Number(rate) / 100

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(amountError || rateError)
  const hasEmptyValues = !amount || !rate

  // Обработчики для валидации и округления значений
  const handleAmountChange = (value: string) => {
    setAmount(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setAmountError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else if (num % 1 !== 0) {
        setAmountError(language === 'ru' ? 'Значение должно быть кратно 1' : 'Value must be a multiple of 1')
      } else {
        setAmountError('')
      }
    } else {
      setAmountError('')
    }
  }

  const handleAmountBlur = () => {
    const value = Number(amount)
    if (!isNaN(value) && amount !== '') {
      const rounded = Math.max(0, Math.round(value))
      setAmount(String(rounded))
      setAmountError('')
    }
  }

  const handleRateChange = (value: string) => {
    setRate(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        const rounded = Math.round(num * 100) / 100
        if (num !== rounded) {
          setRateError(language === 'ru' ? 'Значение должно быть кратно 0,01' : 'Value must be a multiple of 0.01')
        } else {
          setRateError('')
        }
      }
    } else {
      setRateError('')
    }
  }

  const handleRateBlur = () => {
    const value = Number(rate)
    if (!isNaN(value) && rate !== '') {
      const rounded = Math.max(0, Math.round(value * 100) / 100)
      setRate(String(rounded))
      setRateError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (hasErrors || hasEmptyValues) return null
    if (action === 'add') {
      const vat = a * r
      return { vat, total: a + vat, base: a }
    } else {
      const base = a / (1 + r)
      const vat = a - base
      return { vat, total: a, base }
    }
  }, [a, r, action, hasErrors, hasEmptyValues])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Сумма без НДС' : 'Amount excl. VAT', value: Math.round(result.base) },
      { name: 'НДС / VAT', value: Math.round(result.vat) },
    ]
  }, [result, language])

  // Сравнение ставок НДС
  const rateComparisonData = useMemo(() => {
    const rates = [10, 12, 18, 20, 23, 25]
    
    return rates.map(rt => ({
      name: `${rt}%`,
      vat: Math.round(a * rt / 100),
      total: Math.round(a * (1 + rt / 100)),
    }))
  }, [a])

  // Прогресс данных
  const progressData = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Сумма без НДС' : 'Base Amount', value: Math.round(result.base), color: '#6366f1' },
      { label: 'НДС / VAT', value: Math.round(result.vat), color: '#ef4444' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Сумма без НДС' : 'Base Amount', value: formatCurrency(Math.round(result.base), language) },
      { label: 'НДС / VAT', value: formatCurrency(Math.round(result.vat), language) },
      { label: language === 'ru' ? 'Итого с НДС' : 'Total with VAT', value: formatCurrency(Math.round(result.total), language) },
      { label: language === 'ru' ? 'Ставка' : 'Rate', value: formatPercent(Number(rate)) },
    ]
  }, [result, rate, language])

  // Процент НДС от суммы
  const vatPercent = useMemo(() => {
    if (!result) return 0
    return (result.vat / result.total) * 100
  }, [result])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAction('add')}
          className={`flex-1 p-2 rounded ${action === 'add' ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          {language === 'ru' ? 'Начислить НДС' : 'Add VAT'}
        </button>
        <button
          onClick={() => setAction('remove')}
          className={`flex-1 p-2 rounded ${action === 'remove' ? 'bg-primary text-white' : 'bg-muted'}`}
        >
          {language === 'ru' ? 'Выделить НДС' : 'Extract VAT'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Сумма' : 'Amount'}</label>
          <input 
            type="number" 
            className="input w-full" 
            value={amount} 
            onChange={(e) => handleAmountChange(e.target.value)} 
            onBlur={handleAmountBlur}
          />
          {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{language === 'ru' ? 'Ставка (%)' : 'Rate (%)'}</label>
          <input 
            type="number" 
            className="input w-full" 
            value={rate} 
            onChange={(e) => handleRateChange(e.target.value)} 
            onBlur={handleRateBlur}
          />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
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
                {language === 'ru' ? 'Структура суммы' : 'Amount Structure'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={formatCurrency(Math.round(result.total), language)}
              />
            </div>

            {/* Процент НДС */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Доля НДС' : 'VAT Share'}
              </h3>
              <CircularProgressWidget 
                value={vatPercent} 
                maxValue={50} 
                label={language === 'ru' ? 'доля НДС' : 'VAT share'}
                size={160}
              />
              {/* Цветовая шкала */}
              <div className="mt-4 w-full">
                <div className="h-2 rounded-full" style={{
                  background: 'linear-gradient(to right, #22c55e, #3b82f6, #a855f7, #ec4899, #f97316, #eab308)'
                }} />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>0%</span>
                  <span>12.5%</span>
                  <span>25%</span>
                  <span>37.5%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Сравнение ставок */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение ставок НДС' : 'VAT Rate Comparison'}
            </h3>
            <BarChartWidget 
              data={rateComparisonData}
              dataKeys={[
                { key: 'vat', name: 'НДС / VAT', color: '#ef4444' },
                { key: 'total', name: language === 'ru' ? 'Итого' : 'Total', color: '#6366f1' },
              ]}
              xKey="name"
              height={250}
            />
          </div>

          {/* Прогресс */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение суммы' : 'Amount Distribution'}
            </h3>
            <ProgressBarsWidget data={progressData} maxValue={result.total} />
          </div>


        </div>
      )}
    </CalculatorShell>
  )
}
