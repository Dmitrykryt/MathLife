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

export function SalaryNetCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [salary, setSalary] = useState('100000')
  const [type, setType] = useState<'net-to-gross' | 'gross-to-net'>('gross-to-net')
  const [salaryError, setSalaryError] = useState('')

  const s = Number(salary)
  const taxRate = 0.13

  // Обработчик для валидации
  const handleSalaryChange = (value: string) => {
    setSalary(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setSalaryError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setSalaryError('')
      }
    } else {
      setSalaryError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (salaryError || !salary) return null
    if (s > 0) {
      if (type === 'gross-to-net') {
        const net = s * (1 - taxRate)
        const tax = s - net
        return { gross: s, net, tax }
      } else {
        const gross = s / (1 - taxRate)
        const tax = gross - s
        return { gross, net: s, tax }
      }
    }
    return null
  }, [s, type, salaryError, salary])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'На руки' : 'Net Pay', value: Math.round(result.net) },
      { name: language === 'ru' ? 'Налог (13%)' : 'Tax (13%)', value: Math.round(result.tax) },
    ]
  }, [result, language])

  // Месячная и годовая разбивка
  const periodBreakdown = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'В месяц (до налогов)' : 'Monthly (gross)', value: Math.round(result.gross), color: '#6366f1' },
      { label: language === 'ru' ? 'В месяц (на руки)' : 'Monthly (net)', value: Math.round(result.net), color: '#22c55e' },
      { label: language === 'ru' ? 'Налог в месяц' : 'Monthly Tax', value: Math.round(result.tax), color: '#ef4444' },
    ]
  }, [result, language])

  // Годовые данные
  const yearlyData = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Годовой доход (до налогов)' : 'Yearly Gross', value: Math.round(result.gross * 12), color: '#6366f1' },
      { label: language === 'ru' ? 'Годовой доход (на руки)' : 'Yearly Net', value: Math.round(result.net * 12), color: '#22c55e' },
      { label: language === 'ru' ? 'Налог за год' : 'Yearly Tax', value: Math.round(result.tax * 12), color: '#ef4444' },
    ]
  }, [result, language])

  // Сравнение зарплат
  const salaryComparison = useMemo(() => {
    const salaries = [50000, 75000, 100000, 150000, 200000, 300000]
    
    return salaries.map(s => ({
      name: `${(s / 1000)}K`,
      [language === 'ru' ? 'До налогов' : 'Gross']: s,
      [language === 'ru' ? 'На руки' : 'Net']: Math.round(s * 0.87),
    }))
  }, [language])

  // Процент налога
  const taxPercent = 13

  // Почасовая ставка
  const hourlyRate = useMemo(() => {
    if (!result) return null
    // Предполагаем 168 рабочих часов в месяц (21 день * 8 часов)
    const hoursPerMonth = 168
    return {
      gross: Math.round(result.gross / hoursPerMonth),
      net: Math.round(result.net / hoursPerMonth)
    }
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result || !hourlyRate) return []
    
    return [
      { label: language === 'ru' ? 'До налогов' : 'Gross', value: formatCurrency(result.gross, language) },
      { label: language === 'ru' ? 'На руки' : 'Net Pay', value: formatCurrency(result.net, language) },
      { label: language === 'ru' ? 'Налог' : 'Tax', value: formatCurrency(result.tax, language) },
      { label: language === 'ru' ? 'В час (на руки)' : 'Hourly (net)', value: `${hourlyRate.net} ₽` },
    ]
  }, [result, hourlyRate, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded-lg border transition ${type === 'gross-to-net' ? 'bg-primary text-white border-primary' : 'border-border'}`}
            onClick={() => setType('gross-to-net')}
          >
            {language === 'ru' ? 'До налогов → На руки' : 'Gross → Net'}
          </button>
          <button
            className={`flex-1 py-2 rounded-lg border transition ${type === 'net-to-gross' ? 'bg-primary text-white border-primary' : 'border-border'}`}
            onClick={() => setType('net-to-gross')}
          >
            {language === 'ru' ? 'На руки → До налогов' : 'Net → Gross'}
          </button>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">
            {type === 'gross-to-net' 
              ? (language === 'ru' ? 'Зарплата до налогов' : 'Gross Salary (before taxes)')
              : (language === 'ru' ? 'Зарплата на руки' : 'Net Salary (after taxes)')
            }
          </label>
          <input type="number" className="input w-full" value={salary} onChange={(e) => handleSalaryChange(e.target.value)} />
          {salaryError && <p className="text-xs text-red-500 mt-1">{salaryError}</p>}
        </div>

        <p className="text-sm text-muted">
          {language === 'ru' ? 'Налог: 13% (НДФЛ)' : 'Tax: 13% (income tax)'}
        </p>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Круговая диаграмма */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение зарплаты' : 'Salary Distribution'}
            </h3>
            <DonutChartWidget 
              data={pieData} 
              height={250}
              centerLabel={language === 'ru' ? 'До налогов' : 'Gross'}
              centerValue={formatCurrency(result.gross, language)}
            />
          </div>

          {/* Месячная разбивка */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Месячная разбивка' : 'Monthly Breakdown'}
            </h3>
            <HorizontalBarWidget data={periodBreakdown} />
          </div>

          {/* Годовые данные */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Годовые показатели' : 'Yearly Figures'}
            </h3>
            <ProgressBarsWidget data={yearlyData} />
          </div>

          {/* Сравнение зарплат */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение зарплат до и после налогов' : 'Salary Comparison Gross vs Net'}
            </h3>
            <BarChartWidget 
              data={salaryComparison}
              dataKeys={[
                { key: language === 'ru' ? 'До налогов' : 'Gross', color: '#6366f1' },
                { key: language === 'ru' ? 'На руки' : 'Net', color: '#22c55e' },
              ]}
              height={250}
            />
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{hourlyRate?.gross} ₽</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'В час (до налогов)' : 'Hourly (gross)'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{hourlyRate?.net} ₽</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'В час (на руки)' : 'Hourly (net)'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(result.gross * 12 / 1000)}K</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'В год (до налогов)' : 'Yearly (gross)'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{Math.round(result.net * 12 / 1000)}K</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'В год (на руки)' : 'Yearly (net)'}</div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
