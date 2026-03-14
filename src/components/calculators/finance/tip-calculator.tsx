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

export function TipCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [bill, setBill] = useState('1500')
  const [tipPercent, setTipPercent] = useState('10')
  const [people, setPeople] = useState('2')
  const [billError, setBillError] = useState('')
  const [tipPercentError, setTipPercentError] = useState('')
  const [peopleError, setPeopleError] = useState('')

  const b = Number(bill)
  const p = Number(tipPercent)
  const n = Number(people)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(billError || tipPercentError || peopleError)
  const hasEmptyValues = !bill || !tipPercent || !people

  // Обработчики для валидации
  const handleBillChange = (value: string) => {
    setBill(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setBillError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setBillError('')
      }
    } else {
      setBillError('')
    }
  }

  const handleTipPercentChange = (value: string) => {
    setTipPercent(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setTipPercentError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setTipPercentError('')
      }
    } else {
      setTipPercentError('')
    }
  }

  const handlePeopleChange = (value: string) => {
    setPeople(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setPeopleError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setPeopleError('')
      }
    } else {
      setPeopleError('')
    }
  }

  const presets = [5, 10, 15, 18, 20, 25]

  // Автоматический расчёт
  const result = useMemo(() => {
    if (hasErrors || hasEmptyValues) return null
    if (b > 0 && p >= 0 && n > 0) {
      const tip = b * p / 100
      const total = b + tip
      const perPerson = total / n
      return { tip, total, perPerson }
    }
    return null
  }, [b, p, n, hasErrors, hasEmptyValues])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Счёт' : 'Bill', value: Math.round(b) },
      { name: language === 'ru' ? 'Чаевые' : 'Tip', value: Math.round(result.tip) },
    ]
  }, [result, b, language])

  // Сравнение чаевых при разных процентах
  const tipComparisonData = useMemo(() => {
    return presets.map(pct => ({
      name: `${pct}%`,
      tip: Math.round(b * pct / 100),
      total: Math.round(b * (1 + pct / 100)),
    }))
  }, [b])

  // Распределение на человека
  const perPersonData = useMemo(() => {
    if (!result) return []
    return Array.from({ length: n }, (_, i) => ({
      label: language === 'ru' ? `Человек ${i + 1}` : `Person ${i + 1}`,
      value: Math.round(result.perPerson),
      color: ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6'][i % 6],
    }))
  }, [result, n, language])

  // Прогресс чаевых
  const tipProgressData = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Счёт' : 'Bill', value: Math.round(b), color: '#6366f1' },
      { label: language === 'ru' ? 'Чаевые' : 'Tip', value: Math.round(result.tip), color: '#22c55e' },
    ]
  }, [result, b, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Счёт' : 'Bill', value: formatCurrency(b, language) },
      { label: language === 'ru' ? 'Чаевые' : 'Tip', value: formatCurrency(result.tip, language) },
      { label: language === 'ru' ? 'Всего' : 'Total', value: formatCurrency(result.total, language) },
      { label: language === 'ru' ? 'С человека' : 'Per Person', value: formatCurrency(result.perPerson, language) },
    ]
  }, [result, b, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Счёт в ресторане' : 'Restaurant Bill'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={bill}
            onChange={(e) => handleBillChange(e.target.value)}
          />
          {billError && <p className="text-xs text-red-500 mt-1">{billError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Чаевые (%)' : 'Tip (%)'}
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {presets.map((pct) => (
              <button
                key={pct}
                onClick={() => setTipPercent(String(pct))}
                className={`px-2 py-1 text-xs rounded ${
                  tipPercent === String(pct) ? 'bg-primary text-white' : 'bg-muted'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <input
            type="number"
            className="input w-full"
            value={tipPercent}
            onChange={(e) => handleTipPercentChange(e.target.value)}
          />
          {tipPercentError && <p className="text-xs text-red-500 mt-1">{tipPercentError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Количество человек' : 'Number of People'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={people}
            onChange={(e) => handlePeopleChange(e.target.value)}
          />
          {peopleError && <p className="text-xs text-red-500 mt-1">{peopleError}</p>}
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
                {language === 'ru' ? 'Структура оплаты' : 'Payment Structure'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Всего' : 'Total'}
                centerValue={formatCurrency(result.total, language)}
              />
            </div>

            {/* Процент чаевых */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Размер чаевых' : 'Tip Size'}
              </h3>
              <CircularProgressWidget 
                value={Number(tipPercent)} 
                maxValue={30} 
                label={`${tipPercent}%`}
                color="#22c55e"
                size={160}
              />
            </div>
          </div>

          {/* Сравнение чаевых */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение чаевых при разных процентах' : 'Tip Comparison at Different Rates'}
            </h3>
            <BarChartWidget 
              data={tipComparisonData}
              dataKeys={[
                { key: 'tip', name: language === 'ru' ? 'Чаевые' : 'Tip', color: '#22c55e' },
                { key: 'total', name: language === 'ru' ? 'Всего' : 'Total', color: '#6366f1' },
              ]}
              xKey="name"
              height={250}
            />
          </div>

          {/* Распределение на человека */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение суммы' : 'Amount Distribution'}
            </h3>
            <ProgressBarsWidget data={tipProgressData} maxValue={result.total} />
          </div>

          {/* Сумма на каждого */}
          {Number(people) > 1 && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сумма на каждого' : 'Amount Per Person'}
              </h3>
              <HorizontalBarWidget data={perPersonData} maxValue={result.total} />
            </div>
          )}

          {/* Таблица чаевых */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Таблица чаевых' : 'Tip Table'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted">%</th>
                    <th className="text-right py-2 text-muted">{language === 'ru' ? 'Чаевые' : 'Tip'}</th>
                    <th className="text-right py-2 text-muted">{language === 'ru' ? 'Всего' : 'Total'}</th>
                    <th className="text-right py-2 text-muted">{language === 'ru' ? 'С человека' : 'Per Person'}</th>
                  </tr>
                </thead>
                <tbody>
                  {tipComparisonData.map((row, i) => (
                    <tr key={i} className={`border-b border-border/50 ${tipPercent === presets[i].toString() ? 'bg-primary/10' : ''}`}>
                      <td className="py-2">{row.name}</td>
                      <td className="text-right py-2">{formatCurrency(row.tip, language)}</td>
                      <td className="text-right py-2 font-medium">{formatCurrency(row.total, language)}</td>
                      <td className="text-right py-2 text-primary">{formatCurrency(row.total / n, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
