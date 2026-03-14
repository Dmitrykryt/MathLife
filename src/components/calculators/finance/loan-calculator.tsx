'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { PieChartWidget, AreaChartWidget, ProgressBarsWidget, StatsCardsWidget, BarChartWidget } from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function LoanCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [amount, setAmount] = useState('3000000')
  const [rate, setRate] = useState('12')
  const [term, setTerm] = useState('240')
  const [amountError, setAmountError] = useState('')
  const [rateError, setRateError] = useState('')
  const [termError, setTermError] = useState('')

  const P = Number(amount)
  const r = Number(rate) / 100 / 12
  const n = Number(term)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(amountError || rateError || termError)
  const hasEmptyValues = !amount || !rate || !term

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

  const handleTermChange = (value: string) => {
    setTerm(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setTermError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else if (num % 1 !== 0) {
        setTermError(language === 'ru' ? 'Значение должно быть кратно 1' : 'Value must be a multiple of 1')
      } else {
        setTermError('')
      }
    } else {
      setTermError('')
    }
  }

  const handleTermBlur = () => {
    const value = Number(term)
    if (!isNaN(value) && term !== '') {
      const rounded = Math.max(0, Math.round(value))
      setTerm(String(rounded))
      setTermError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (hasErrors || hasEmptyValues) return null
    if (P > 0 && r > 0 && n > 0) {
      const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const total = monthly * n
      const overpayment = total - P
      return { monthly, total, overpayment }
    }
    return null
  }, [P, r, n, hasErrors, hasEmptyValues])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Основной долг' : 'Principal', value: Math.round(P) },
      { name: language === 'ru' ? 'Переплата' : 'Interest', value: Math.round(result.overpayment) },
    ]
  }, [result, P, language])

  // Данные для графика погашения по месяцам (максимум 24 точки)
  const monthlyData = useMemo(() => {
    if (!result) return []
    
    const monthlyPayment = result.monthly
    const step = n <= 36 ? 1 : Math.ceil(n / 24)
    
    const data = []
    let remainingBalance = P
    
    // Определяем какие месяцы показывать
    const monthsToShow: number[] = []
    for (let m = step; m <= n; m += step) {
      monthsToShow.push(m)
    }
    // Всегда добавляем последний месяц, если его нет
    if (monthsToShow[monthsToShow.length - 1] !== n) {
      monthsToShow.push(n)
    }
    
    let currentMonth = 0
    for (const targetMonth of monthsToShow) {
      let principalThisPeriod = 0
      let interestThisPeriod = 0
      
      while (currentMonth < targetMonth) {
        const interestPayment = remainingBalance * r
        const principalPayment = monthlyPayment - interestPayment
        interestThisPeriod += interestPayment
        principalThisPeriod += principalPayment
        remainingBalance = Math.max(0, remainingBalance - principalPayment)
        currentMonth++
      }
      
      data.push({
        name: `${targetMonth}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Основной долг' : 'Principal']: Math.round(principalThisPeriod),
        [language === 'ru' ? 'Проценты' : 'Interest']: Math.round(interestThisPeriod),
      })
    }
    
    return data
  }, [result, P, r, n, language])

  // Данные для прогресс-баров - округление до целых
  const progressData = useMemo(() => {
    if (!result) return []
    return [
      { 
        label: language === 'ru' ? 'Основной долг' : 'Principal', 
        value: Math.round(P), 
        color: '#6366f1' 
      },
      { 
        label: language === 'ru' ? 'Переплата' : 'Overpayment', 
        value: Math.round(result.overpayment), 
        color: '#ef4444' 
      },
    ]
  }, [result, P, language])

  // Данные для графика остатка долга по месяцам - разделено на основной долг и переплата
  const balanceBreakdownData = useMemo(() => {
    if (!result) return []
    
    const monthlyPayment = result.monthly
    const totalInterest = result.overpayment
    
    const step = n <= 36 ? 1 : Math.ceil(n / 24)
    
    // Определяем какие месяцы показывать (включая 0)
    const monthsToShow: number[] = [0]
    for (let m = step; m <= n; m += step) {
      monthsToShow.push(m)
    }
    // Всегда добавляем последний месяц, если его нет
    if (monthsToShow[monthsToShow.length - 1] !== n) {
      monthsToShow.push(n)
    }
    
    const data = []
    let remainingPrincipal = P
    let cumulativeInterestPaid = 0
    let currentMonth = 0
    
    for (const targetMonth of monthsToShow) {
      while (currentMonth < targetMonth) {
        const interestPayment = remainingPrincipal * r
        cumulativeInterestPaid += interestPayment
        const principalPayment = monthlyPayment - interestPayment
        remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment)
        currentMonth++
      }
      
      const remainingInterest = Math.max(0, totalInterest - cumulativeInterestPaid)
      
      data.push({
        name: `${targetMonth}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Остаток основного долга' : 'Principal Remaining']: Math.round(remainingPrincipal),
        [language === 'ru' ? 'Остаток переплаты' : 'Interest Remaining']: Math.round(remainingInterest),
      })
    }
    
    return data
  }, [result, P, r, n, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    const overpaymentPercent = ((result.overpayment / P) * 100)
    return [
      { 
        label: language === 'ru' ? 'Ежемесячный платёж' : 'Monthly Payment', 
        value: formatCurrency(result.monthly, language) 
      },
      { 
        label: language === 'ru' ? 'Общая сумма' : 'Total Amount', 
        value: formatCurrency(result.total, language) 
      },
      { 
        label: language === 'ru' ? 'Переплата' : 'Overpayment', 
        value: formatCurrency(result.overpayment, language) 
      },
      { 
        label: language === 'ru' ? 'Процент переплаты' : 'Overpayment Rate', 
        value: formatPercent(overpaymentPercent) 
      },
    ]
  }, [result, P, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Сумма кредита' : 'Loan Amount'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onBlur={handleAmountBlur}
            placeholder="3000000"
          />
          {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Процентная ставка (% годовых)' : 'Interest Rate (% per year)'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={rate}
            onChange={(e) => handleRateChange(e.target.value)}
            onBlur={handleRateBlur}
            placeholder="12"
          />
          {rateError && <p className="text-xs text-red-500 mt-1">{rateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Срок (месяцев)' : 'Term (months)'}
          </label>
          <input
            type="number"
            className="input w-full"
            value={term}
            onChange={(e) => handleTermChange(e.target.value)}
            onBlur={handleTermBlur}
            placeholder="240"
          />
          {termError && <p className="text-xs text-red-500 mt-1">{termError}</p>}
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
                {language === 'ru' ? 'Структура платежа' : 'Payment Structure'}
              </h3>
              <PieChartWidget data={pieData} height={280} />
            </div>

            {/* Прогресс-бары */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение выплат' : 'Payment Comparison'}
              </h3>
              <ProgressBarsWidget data={progressData} maxValue={Math.round(result.total)} />
            </div>
          </div>

          {/* График погашения */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Динамика погашения' : 'Payment Dynamics'}
            </h3>
            <BarChartWidget 
              data={monthlyData}
              dataKeys={[
                { key: language === 'ru' ? 'Основной долг' : 'Principal', color: '#6366f1' },
                { key: language === 'ru' ? 'Проценты' : 'Interest', color: '#ef4444' },
              ]}
              height={300}
            />
          </div>

          {/* График остатка долга */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Остаток долга' : 'Remaining Balance'}
            </h3>
            <AreaChartWidget 
              data={balanceBreakdownData}
              dataKeys={[
                { key: language === 'ru' ? 'Остаток основного долга' : 'Principal Remaining', color: '#6366f1' },
                { key: language === 'ru' ? 'Остаток переплаты' : 'Interest Remaining', color: '#ef4444' },
              ]}
              xKey="name"
              height={250}
              stacked
            />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
