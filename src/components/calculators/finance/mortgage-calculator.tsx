'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { 
  PieChartWidget, 
  AreaChartWidget, 
  BarChartWidget,
  ProgressBarsWidget, 
  StatsCardsWidget,
  CircularProgressWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function MortgageCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [price, setPrice] = useState('5000000')
  const [downPayment, setDownPayment] = useState('1000000')
  const [rate, setRate] = useState('12')
  const [term, setTerm] = useState('240')
  const [priceError, setPriceError] = useState('')
  const [downPaymentError, setDownPaymentError] = useState('')
  const [rateError, setRateError] = useState('')
  const [termError, setTermError] = useState('')

  const P = Number(price) - Number(downPayment)
  const r = Number(rate) / 100 / 12
  const n = Number(term)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(priceError || downPaymentError || rateError || termError)
  const hasEmptyValues = !price || !downPayment || !rate || !term

  // Обработчики для валидации и округления значений
  const handlePriceChange = (value: string) => {
    setPrice(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setPriceError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else if (num % 1 !== 0) {
        setPriceError(language === 'ru' ? 'Значение должно быть кратно 1' : 'Value must be a multiple of 1')
      } else {
        setPriceError('')
      }
    } else {
      setPriceError('')
    }
  }

  const handlePriceBlur = () => {
    const value = Number(price)
    if (!isNaN(value) && price !== '') {
      const rounded = Math.max(0, Math.round(value))
      setPrice(String(rounded))
      setPriceError('')
    }
  }

  const handleDownPaymentChange = (value: string) => {
    setDownPayment(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setDownPaymentError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else if (num % 1 !== 0) {
        setDownPaymentError(language === 'ru' ? 'Значение должно быть кратно 1' : 'Value must be a multiple of 1')
      } else {
        setDownPaymentError('')
      }
    } else {
      setDownPaymentError('')
    }
  }

  const handleDownPaymentBlur = () => {
    const value = Number(downPayment)
    if (!isNaN(value) && downPayment !== '') {
      const rounded = Math.max(0, Math.round(value))
      setDownPayment(String(rounded))
      setDownPaymentError('')
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
      const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const totalPayment = monthlyPayment * n
      const overpayment = totalPayment - P
      return { monthlyPayment, totalPayment, overpayment }
    }
    return null
  }, [P, r, n, hasErrors, hasEmptyValues])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    return [
      { name: language === 'ru' ? 'Первоначальный взнос' : 'Down Payment', value: Math.round(Number(downPayment)) },
      { name: language === 'ru' ? 'Тело кредита' : 'Principal', value: Math.round(P) },
      { name: language === 'ru' ? 'Проценты' : 'Interest', value: Math.round(result?.overpayment || 0) },
    ]
  }, [result, P, downPayment, language])

  // Данные для графика погашения по месяцам (максимум 24 точки)
  const monthlyData = useMemo(() => {
    if (!result) return []
    
    const step = n <= 36 ? 1 : Math.ceil(n / 24)
    
    // Определяем какие месяцы показывать
    const monthsToShow: number[] = []
    for (let m = step; m <= n; m += step) {
      monthsToShow.push(m)
    }
    // Всегда добавляем последний месяц, если его нет
    if (monthsToShow[monthsToShow.length - 1] !== n) {
      monthsToShow.push(n)
    }
    
    const data = []
    let remainingBalance = P
    let currentMonth = 0
    let totalInterest = 0
    
    for (const targetMonth of monthsToShow) {
      let principalThisPeriod = 0
      let interestThisPeriod = 0
      
      while (currentMonth < targetMonth) {
        const interestPayment = remainingBalance * r
        const principalPayment = result.monthlyPayment - interestPayment
        interestThisPeriod += interestPayment
        principalThisPeriod += principalPayment
        totalInterest += interestPayment
        remainingBalance = Math.max(0, remainingBalance - principalPayment)
        currentMonth++
      }
      
      const remainingInterest = result.overpayment - totalInterest
      
      data.push({
        name: `${targetMonth}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Основной долг' : 'Principal']: Math.round(principalThisPeriod),
        [language === 'ru' ? 'Проценты' : 'Interest']: Math.round(interestThisPeriod),
        [language === 'ru' ? 'Остаток тела' : 'Principal Remaining']: Math.round(remainingBalance),
        [language === 'ru' ? 'Остаток процентов' : 'Interest Remaining']: Math.round(remainingInterest),
      })
    }
    
    return data
  }, [result, P, r, n, language])

  // Данные для прогресс-баров
  const progressData = useMemo(() => {
    if (!result) return []
    
    return [
      { 
        label: language === 'ru' ? 'Первоначальный взнос' : 'Down Payment', 
        value: Math.round(Number(downPayment)), 
        color: '#22c55e' 
      },
      { 
        label: language === 'ru' ? 'Тело кредита' : 'Principal', 
        value: Math.round(P), 
        color: '#6366f1' 
      },
      { 
        label: language === 'ru' ? 'Проценты' : 'Interest', 
        value: Math.round(result.overpayment), 
        color: '#ef4444' 
      },
    ]
  }, [result, P, downPayment, language])

  // Процент переплаты
  const overpaymentPercent = useMemo(() => {
    if (!result) return 0
    return ((result.overpayment / P) * 100)
  }, [result, P])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { 
        label: language === 'ru' ? 'Ежемесячный платёж' : 'Monthly Payment', 
        value: formatCurrency(result.monthlyPayment, language) 
      },
      { 
        label: language === 'ru' ? 'Сумма кредита' : 'Loan Amount', 
        value: formatCurrency(P, language) 
      },
      { 
        label: language === 'ru' ? 'Переплата' : 'Overpayment', 
        value: formatCurrency(result.overpayment, language) 
      },
      { 
        label: language === 'ru' ? 'Переплата %' : 'Overpayment %', 
        value: formatPercent(overpaymentPercent) 
      },
    ]
  }, [result, P, overpaymentPercent, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Стоимость квартиры' : 'Property Price'}
          </label>
          <input 
            type="number" 
            className="input w-full" 
            value={price} 
            onChange={(e) => handlePriceChange(e.target.value)} 
            onBlur={handlePriceBlur} 
          />
          {priceError && <p className="text-xs text-red-500 mt-1">{priceError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Первоначальный взнос' : 'Down Payment'}
          </label>
          <input 
            type="number" 
            className="input w-full" 
            value={downPayment} 
            onChange={(e) => handleDownPaymentChange(e.target.value)} 
            onBlur={handleDownPaymentBlur} 
          />
          {downPaymentError && <p className="text-xs text-red-500 mt-1">{downPaymentError}</p>}
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

      {result && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Круговая диаграмма */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Структура стоимости' : 'Cost Structure'}
              </h3>
              <PieChartWidget data={pieData} height={280} />
            </div>

            {/* Процент переплаты */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Процент переплаты' : 'Overpayment Rate'}
              </h3>
              <CircularProgressWidget 
                value={overpaymentPercent} 
                maxValue={200} 
                label={language === 'ru' ? 'переплата' : 'overpayment'}
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

          {/* Прогресс-бары */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение выплат' : 'Payment Distribution'}
            </h3>
            <ProgressBarsWidget data={progressData} maxValue={result.totalPayment + Number(downPayment)} />
          </div>

          {/* График погашения по месяцам */}
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

          {/* Остаток долга */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Остаток долга' : 'Remaining Balance'}
            </h3>
 <AreaChartWidget 
 data={monthlyData}
 dataKeys={[
 { key: language === 'ru' ? 'Остаток тела' : 'Principal Remaining', color: '#6366f1' },
 { key: language === 'ru' ? 'Остаток процентов' : 'Interest Remaining', color: '#ef4444' },
 ]}
 tooltipDataKeys={[
 { key: language === 'ru' ? 'Остаток процентов' : 'Interest Remaining', color: '#ef4444' },
 { key: language === 'ru' ? 'Остаток тела' : 'Principal Remaining', color: '#6366f1' },
 ]}
 height={250}
 stacked
 />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
