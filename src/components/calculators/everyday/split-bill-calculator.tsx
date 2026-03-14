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

export function SplitBillCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [bill, setBill] = useState('5000')
  const [tip, setTip] = useState('10')
  const [people, setPeople] = useState('4')
  const [billError, setBillError] = useState('')
  const [tipError, setTipError] = useState('')
  const [peopleError, setPeopleError] = useState('')

  const b = Number(bill)
  const t = Number(tip) / 100
  const p = Number(people)

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

  const handleTipChange = (value: string) => {
    setTip(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setTipError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setTipError('')
      }
    } else {
      setTipError('')
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

  // Автоматический расчёт
  const result = useMemo(() => {
    if (billError || tipError || peopleError || !bill || !tip || !people) return null
    const tipAmount = b * t
    const total = b + tipAmount
    const perPerson = total / p
    const tipPerPerson = tipAmount / p
    return { tipAmount, total, perPerson, tipPerPerson }
  }, [b, t, p, billError, tipError, peopleError, bill, tip, people])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Счёт' : 'Bill', value: Math.round(Number(bill)) },
      { name: language === 'ru' ? 'Чаевые' : 'Tip', value: Math.round(result.tipAmount) },
    ]
  }, [result, bill, language])

  // Распределение по людям
  const peopleDistribution = useMemo(() => {
    if (!result) return []
    
    return Array.from({ length: p }, (_, i) => ({
      name: `${language === 'ru' ? 'Чел.' : 'Person'} ${i + 1}`,
      [language === 'ru' ? 'Сумма' : 'Amount']: Math.round(result.perPerson),
    }))
  }, [result, p, language])

  // Сравнение чаевых
  const tipComparison = useMemo(() => {
    const tips = [5, 10, 15, 18, 20, 25]
    
    return tips.map(t => ({
      name: `${t}%`,
      [language === 'ru' ? 'Чаевые' : 'Tip']: Math.round(b * t / 100),
      [language === 'ru' ? 'Итого' : 'Total']: Math.round(b * (1 + t / 100)),
    }))
  }, [b, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Счёт' : 'Bill', value: formatCurrency(b, language) },
      { label: language === 'ru' ? 'Чаевые' : 'Tip', value: formatCurrency(Math.round(result.tipAmount), language) },
      { label: language === 'ru' ? 'Итого' : 'Total', value: formatCurrency(Math.round(result.total), language) },
      { label: language === 'ru' ? 'На человека' : 'Per Person', value: formatCurrency(Math.round(result.perPerson), language) },
    ]
  }, [result, b, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Счёт (₽)' : 'Bill (₽)'}
          </label>
          <input type="number" className="input w-full" value={bill} onChange={(e) => handleBillChange(e.target.value)} />
          {billError && <p className="text-xs text-red-500 mt-1">{billError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Чаевые (%)' : 'Tip (%)'}
          </label>
          <input type="number" className="input w-full" value={tip} onChange={(e) => handleTipChange(e.target.value)} />
          {tipError && <p className="text-xs text-red-500 mt-1">{tipError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Людей' : 'People'}
          </label>
          <input type="number" className="input w-full" value={people} onChange={(e) => handlePeopleChange(e.target.value)} />
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
                {language === 'ru' ? 'Распределение' : 'Distribution'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={formatCurrency(Math.round(result.total), language)}
              />
            </div>

            {/* Процент чаевых */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Размер чаевых' : 'Tip Amount'}
              </h3>
              <CircularProgressWidget 
                value={Number(tip)} 
                maxValue={30} 
                label={`${tip}%`}
                color="#22c55e"
                size={160}
              />
            </div>
          </div>

          {/* Распределение по людям */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Каждый платит' : 'Each Person Pays'}
            </h3>
            <BarChartWidget 
              data={peopleDistribution}
              dataKeys={[{ key: language === 'ru' ? 'Сумма' : 'Amount', color: '#6366f1' }]}
              height={250}
            />
          </div>

          {/* Сравнение чаевых */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Разные размеры чаевых' : 'Different Tip Amounts'}
            </h3>
            <BarChartWidget 
              data={tipComparison}
              dataKeys={[
                { key: language === 'ru' ? 'Чаевые' : 'Tip', color: '#22c55e' },
                { key: language === 'ru' ? 'Итого' : 'Total', color: '#6366f1' },
              ]}
              height={250}
            />
          </div>

          {/* Итог */}
          <div className="glass-card p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Каждый платит' : 'Each Person Pays'}
            </h3>
            <p className="text-4xl font-bold text-primary">{formatCurrency(Math.round(result.perPerson), language)}</p>
            <p className="text-sm text-muted mt-2">
              {language === 'ru' ? `включая ${formatCurrency(Math.round(result.tipPerPerson), language)} чаевых` : `including ${formatCurrency(Math.round(result.tipPerPerson), language)} tip`}
            </p>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
