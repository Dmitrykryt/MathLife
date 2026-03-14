'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { 
  PieChartWidget, 
  BarChartWidget, 
  LineChartWidget, 
  AreaChartWidget,
  ProgressBarsWidget, 
  StatsCardsWidget,
  CircularProgressWidget,
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function InvestmentCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [initial, setInitial] = useState('100000')
  const [monthly, setMonthly] = useState('10000')
  const [rate, setRate] = useState('12')
  const [term, setTerm] = useState('120')
  const [initialError, setInitialError] = useState('')
  const [monthlyError, setMonthlyError] = useState('')
  const [rateError, setRateError] = useState('')
  const [termError, setTermError] = useState('')

  const P = Number(initial)
  const PMT = Number(monthly)
  const r = Number(rate) / 100 / 12
  const n = Number(term)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(initialError || monthlyError || rateError || termError)
  const hasEmptyValues = !initial || !monthly || !rate || !term

  // Обработчики для валидации и округления значений
  const handleInitialChange = (value: string) => {
    setInitial(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setInitialError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else if (num % 1 !== 0) {
        setInitialError(language === 'ru' ? 'Значение должно быть кратно 1' : 'Value must be a multiple of 1')
      } else {
        setInitialError('')
      }
    } else {
      setInitialError('')
    }
  }

  const handleInitialBlur = () => {
    const value = Number(initial)
    if (!isNaN(value) && initial !== '') {
      const rounded = Math.max(0, Math.round(value))
      setInitial(String(rounded))
      setInitialError('')
    }
  }

  const handleMonthlyChange = (value: string) => {
    setMonthly(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setMonthlyError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else if (num % 1 !== 0) {
        setMonthlyError(language === 'ru' ? 'Значение должно быть кратно 1' : 'Value must be a multiple of 1')
      } else {
        setMonthlyError('')
      }
    } else {
      setMonthlyError('')
    }
  }

  const handleMonthlyBlur = () => {
    const value = Number(monthly)
    if (!isNaN(value) && monthly !== '') {
      const rounded = Math.max(0, Math.round(value))
      setMonthly(String(rounded))
      setMonthlyError('')
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
    if (P >= 0 && r >= 0 && n > 0) {
      const fvInitial = P * Math.pow(1 + r, n)
      const fvContributions = PMT * ((Math.pow(1 + r, n) - 1) / r)
      const finalAmount = fvInitial + fvContributions
      const totalInvested = P + PMT * n
      const totalProfit = finalAmount - totalInvested
      return { finalAmount, totalInvested, totalProfit }
    }
    return null
  }, [P, PMT, r, n, hasErrors, hasEmptyValues])
      
  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Внесённые средства' : 'Invested Capital', value: Math.round(result.totalInvested) },
      { name: language === 'ru' ? 'Доход' : 'Profit', value: Math.round(result.totalProfit) },
    ]
  }, [result, language])

  // Данные для графика роста капитала по месяцам (максимум 24 точки)
  const monthlyGrowthData = useMemo(() => {
    const totalMonths = n
    const step = totalMonths <= 36 ? 1 : Math.ceil(totalMonths / 24)
    
    // Определяем какие месяцы показывать (включая 0)
    const monthsToShow: number[] = [0]
    for (let m = step; m <= totalMonths; m += step) {
      monthsToShow.push(m)
    }
    // Всегда добавляем последний месяц, если его нет
    if (monthsToShow[monthsToShow.length - 1] !== totalMonths) {
      monthsToShow.push(totalMonths)
    }
    
    const data = []
    let cumulativeInvested = P
    let cumulativeValue = P
    let currentMonth = 0
    
    for (const targetMonth of monthsToShow) {
      while (currentMonth < targetMonth) {
        cumulativeValue = cumulativeValue * (1 + r) + PMT
        cumulativeInvested += PMT
        currentMonth++
      }
      
      data.push({
        name: `${targetMonth}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Капитал' : 'Capital']: Math.round(cumulativeValue),
        [language === 'ru' ? 'Вложено' : 'Invested']: Math.round(cumulativeInvested),
        [language === 'ru' ? 'Доход' : 'Profit']: Math.round(cumulativeValue - cumulativeInvested),
      })
    }
    
    return data
  }, [P, PMT, r, n, language])

  // Сравнение разных ставок доходности
  const rateComparisonData = useMemo(() => {
    const rates = [5, 8, 10, 12, 15, 20]
    
    return rates.map(rt => {
      const monthlyRate = rt / 100 / 12
      const fvInitial = P * Math.pow(1 + monthlyRate, n)
      const fvContributions = PMT * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
      const finalAmount = fvInitial + fvContributions
      
      return {
        name: `${rt}%`,
        [language === 'ru' ? 'Итоговая сумма' : 'Final Amount']: Math.round(finalAmount),
      }
    })
  }, [P, PMT, n, language])

  // Сравнение с банковским вкладом
  const comparisonData = useMemo(() => {
    if (!result) return []
    
    const bankRate = 8 / 100 / 12
    const bankFV = P * Math.pow(1 + bankRate, n) + PMT * ((Math.pow(1 + bankRate, n) - 1) / bankRate)
    
    return [
      { label: language === 'ru' ? 'Ваш инвестиции' : 'Your Investment', value: Math.round(result.finalAmount), color: '#6366f1' },
      { label: language === 'ru' ? 'Банковский вклад (8%)' : 'Bank Deposit (8%)', value: Math.round(bankFV), color: '#22c55e' },
      { label: language === 'ru' ? 'Без инвестиций' : 'No Investment', value: Math.round(result.totalInvested), color: '#ef4444' },
    ]
  }, [result, P, PMT, n, language])

  // Прогресс данных
  const progressData = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Внесённые средства' : 'Invested', value: Math.round(result.totalInvested), color: '#6366f1' },
      { label: language === 'ru' ? 'Доход от инвестиций' : 'Profit', value: Math.round(result.totalProfit), color: '#22c55e' },
    ]
  }, [result, language])

  // Доходность в процентах
  const profitPercent = useMemo(() => {
    if (!result) return 0
    return (result.totalProfit / result.totalInvested) * 100
  }, [result])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Итоговая сумма' : 'Final Amount', value: formatCurrency(result.finalAmount, language) },
      { label: language === 'ru' ? 'Внесено всего' : 'Total Invested', value: formatCurrency(result.totalInvested, language) },
      { label: language === 'ru' ? 'Доход' : 'Profit', value: formatCurrency(result.totalProfit, language) },
      { label: language === 'ru' ? 'Доходность' : 'Return', value: formatPercent(profitPercent) },
    ]
  }, [result, profitPercent, language])

  // Эффект сложного процента
  const compoundEffectData = useMemo(() => {
    if (!result) return []
    
    const yearsCount = n / 12
    const simpleInterest = P + P * (Number(rate) / 100) * yearsCount + PMT * n
    
    return [
      { label: language === 'ru' ? 'Простой процент' : 'Simple Interest', value: Math.round(simpleInterest), color: '#f59e0b' },
      { label: language === 'ru' ? 'Сложный процент' : 'Compound Interest', value: Math.round(result.finalAmount), color: '#6366f1' },
    ]
  }, [result, P, PMT, n, rate, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Начальная сумма' : 'Initial Investment'}
          </label>
          <input 
            type="number" 
            className="input w-full" 
            value={initial} 
            onChange={(e) => handleInitialChange(e.target.value)} 
            onBlur={handleInitialBlur} 
          />
          {initialError && <p className="text-xs text-red-500 mt-1">{initialError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ежемесячный взнос' : 'Monthly Contribution'}
          </label>
          <input 
            type="number" 
            className="input w-full" 
            value={monthly} 
            onChange={(e) => handleMonthlyChange(e.target.value)} 
            onBlur={handleMonthlyBlur} 
          />
          {monthlyError && <p className="text-xs text-red-500 mt-1">{monthlyError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Годовая доходность (%)' : 'Annual Return (%)'}
          </label>
          <input 
            type="number" 
            className="input w-full" 
            value={rate} 
            onChange={(e) => handleRateChange(e.target.value)} 
            onBlur={handleRateBlur} 
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
                {language === 'ru' ? 'Структура капитала' : 'Capital Structure'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Итого' : 'Total'}
                centerValue={formatCurrency(result.finalAmount)}
              />
            </div>

            {/* Доходность */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Общая доходность' : 'Total Return'}
              </h3>
              <CircularProgressWidget 
                value={profitPercent} 
                maxValue={200} 
                label={language === 'ru' ? 'доходность' : 'yield'}
                size={160}
              />
              {/* Цветовая шкала */}
              <div className="mt-4 w-full">
                <div className="h-2 rounded-full" style={{
                  background: 'linear-gradient(to right, #22c55e, #3b82f6, #a855f7, #ec4899, #f97316, #eab308)'
                }} />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                  <span>150%</span>
                  <span>200%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Рост капитала по месяцам */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Рост капитала' : 'Capital Growth'}
            </h3>
            <AreaChartWidget 
              data={monthlyGrowthData}
              dataKeys={[
                { key: language === 'ru' ? 'Капитал' : 'Capital', color: '#6366f1' },
                { key: language === 'ru' ? 'Вложено' : 'Invested', color: '#f59e0b' },
                { key: language === 'ru' ? 'Доход' : 'Profit', color: '#22c55e' },
              ]}
              height={300}
              stacked
            />
          </div>

          {/* Сравнение ставок */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение ставок доходности' : 'Return Rate Comparison'}
            </h3>
            <BarChartWidget 
              data={rateComparisonData}
              dataKeys={[{ key: language === 'ru' ? 'Итоговая сумма' : 'Final Amount', color: '#6366f1' }]}
              height={250}
            />
          </div>

          {/* Сравнение с вкладом */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение стратегий' : 'Strategy Comparison'}
            </h3>
            <HorizontalBarWidget data={comparisonData} />
          </div>

          {/* Эффект сложного процента */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Эффект сложного процента' : 'Compound Interest Effect'}
            </h3>
            <ProgressBarsWidget data={compoundEffectData} />
            <p className="text-xs text-muted mt-4 text-center">
              * {language === 'ru' 
                ? 'Разница показывает преимущество реинвестирования доходов' 
                : 'Difference shows the advantage of reinvesting profits'}
            </p>
          </div>


        </div>
      )}
    </CalculatorShell>
  )
}
