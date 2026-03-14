'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { 
  PieChartWidget, 
  LineChartWidget, 
  BarChartWidget, 
  ProgressBarsWidget, 
  StatsCardsWidget,
  CircularProgressWidget 
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function DepositCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [amount, setAmount] = useState('100000')
  const [rate, setRate] = useState('8')
  const [term, setTerm] = useState('12')
  const [capitalization, setCapitalization] = useState(true)
  const [amountError, setAmountError] = useState('')
  const [rateError, setRateError] = useState('')
  const [termError, setTermError] = useState('')

  const P = Number(amount)
  const r = Number(rate) / 100
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
      let total: number
      if (capitalization) {
        total = P * Math.pow(1 + r / 12, n)
      } else {
        total = P + (P * r * n / 12)
      }
      const income = total - P
      return { income, total }
    }
    return null
  }, [P, r, n, capitalization, hasErrors, hasEmptyValues])
      
  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Первоначальный вклад' : 'Initial Deposit', value: Math.round(P) },
      { name: language === 'ru' ? 'Доход' : 'Income', value: Math.round(result.income) },
    ]
  }, [result, P, language])

  // Данные для графика роста вклада по месяцам
  const monthlyGrowthData = useMemo(() => {
    if (!result) return []
    
    const monthlyRate = r / 12
    const step = n <= 36 ? 1 : Math.ceil(n / 24)
    
    // Определяем какие месяцы показывать
    const monthsToShow: number[] = [0]
    for (let m = step; m <= n; m += step) {
      monthsToShow.push(m)
    }
    // Всегда добавляем последний месяц, если его нет
    if (monthsToShow[monthsToShow.length - 1] !== n) {
      monthsToShow.push(n)
    }
    
    const data = []
    for (const month of monthsToShow) {
      let balance: number
      if (month === 0) {
        balance = P
      } else if (capitalization) {
        balance = P * Math.pow(1 + monthlyRate, month)
      } else {
        balance = P + (P * monthlyRate * month)
      }
      
      data.push({
        name: `${month}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Баланс' : 'Balance']: Math.round(balance),
        [language === 'ru' ? 'Доход' : 'Income']: Math.round(balance - P),
      })
    }
    
    return data
  }, [result, P, r, n, capitalization, language])

  // Сравнение с капитализацией и без
  const comparisonData = useMemo(() => {
    if (!result) return null
    
    const withCapitalization = P * Math.pow(1 + r / 12, n)
    const withoutCapitalization = P + (P * r * n / 12)
    
    return [
      { 
        label: language === 'ru' ? 'С капитализацией' : 'With Capitalization', 
        value: Math.round(withCapitalization - P), 
        color: '#22c55e' 
      },
      { 
        label: language === 'ru' ? 'Без капитализации' : 'Without Capitalization', 
        value: Math.round(withoutCapitalization - P), 
        color: '#6366f1' 
      },
    ]
  }, [result, P, r, n, language])

  // Процент доходности
  const incomePercent = useMemo(() => {
    if (!result) return 0
    return ((result.income / P) * 100)
  }, [result, P])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    return [
      { 
        label: language === 'ru' ? 'Первоначальный вклад' : 'Initial Deposit', 
        value: formatCurrency(Math.round(P), language) 
      },
      { 
        label: language === 'ru' ? 'Доход' : 'Income', 
        value: formatCurrency(Math.round(result.income), language) 
      },
      { 
        label: language === 'ru' ? 'Итого к выдаче' : 'Total Payout', 
        value: formatCurrency(Math.round(result.total), language) 
      },
      { 
        label: language === 'ru' ? 'Доходность' : 'Yield', 
        value: formatPercent(incomePercent) 
      },
    ]
  }, [result, P, language, incomePercent])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Сумма вклада' : 'Deposit Amount'}
          </label>
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
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ставка (% годовых)' : 'Interest Rate (% per year)'}
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

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="capitalization"
          checked={capitalization}
          onChange={(e) => setCapitalization(e.target.checked)}
        />
        <label htmlFor="capitalization" className="text-sm">
          {language === 'ru' ? 'Капитализация процентов' : 'Compound Interest'}
        </label>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговой прогресс */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Доходность вклада' : 'Deposit Yield'}
              </h3>
              <CircularProgressWidget 
                value={incomePercent} 
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

            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Структура итоговой суммы' : 'Final Amount Structure'}
              </h3>
              <PieChartWidget data={pieData} height={220} />
            </div>
          </div>

          {/* График роста вклада */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Рост вклада' : 'Deposit Growth'}
            </h3>
            <LineChartWidget 
              data={monthlyGrowthData}
              dataKeys={[
                { key: language === 'ru' ? 'Баланс' : 'Balance', color: '#6366f1', name: language === 'ru' ? 'Баланс' : 'Balance' },
                { key: language === 'ru' ? 'Доход' : 'Income', color: '#22c55e', name: language === 'ru' ? 'Доход' : 'Income' },
              ]}
              height={300}
            />
          </div>

          {/* Сравнение капитализации */}
          {comparisonData && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Сравнение дохода' : 'Income Comparison'}
              </h3>
              <ProgressBarsWidget data={comparisonData} />
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  )
}
