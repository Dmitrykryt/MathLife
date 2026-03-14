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

export function InflationCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [amount, setAmount] = useState('100000')
  const [inflationRate, setInflationRate] = useState('8')
  const [years, setYears] = useState('10')
  const [amountError, setAmountError] = useState('')
  const [inflationRateError, setInflationRateError] = useState('')
  const [yearsError, setYearsError] = useState('')

  const P = Number(amount)
  const r = Number(inflationRate) / 100
  const n = Number(years)

  // Проверка наличия ошибок и пустых значений
  const hasErrors = Boolean(amountError || inflationRateError || yearsError)
  const hasEmptyValues = !amount || !inflationRate || !years

  // Обработчики для валидации
  const handleAmountChange = (value: string) => {
    setAmount(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setAmountError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setAmountError('')
      }
    } else {
      setAmountError('')
    }
  }

  const handleInflationRateChange = (value: string) => {
    setInflationRate(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setInflationRateError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setInflationRateError('')
      }
    } else {
      setInflationRateError('')
    }
  }

  const handleYearsChange = (value: string) => {
    setYears(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setYearsError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setYearsError('')
      }
    } else {
      setYearsError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    if (hasErrors || hasEmptyValues) return null
    if (P > 0 && r >= 0 && n > 0) {
      const futureValue = P * Math.pow(1 + r, n)
      const purchasingPower = P / Math.pow(1 + r, n)
      const loss = P - purchasingPower
      return { futureValue, purchasingPower, loss }
    }
    return null
  }, [P, r, n, hasErrors, hasEmptyValues])

  // Данные для графика обесценивания по месяцам (максимум 24 точки)
  const depreciationData = useMemo(() => {
    const totalMonths = n * 12
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
    for (const month of monthsToShow) {
      const purchasingPower = P / Math.pow(1 + r, month / 12)
      const nominalValue = P * Math.pow(1 + r, month / 12)
      
      data.push({
        name: `${month}${language === 'ru' ? ' мес' : ' mo'}`,
        [language === 'ru' ? 'Покупательная способность' : 'Purchasing Power']: Math.round(purchasingPower),
        [language === 'ru' ? 'Номинальная стоимость' : 'Nominal Value']: Math.round(nominalValue),
      })
    }
    
    return data
  }, [P, r, n, language])

  // Сравнение разных уровней инфляции
  const inflationComparison = useMemo(() => {
    const rates = [3, 5, 8, 10, 12, 15]
    
    return rates.map(rt => ({
      name: `${rt}%`,
      [language === 'ru' ? 'Покупательная способность' : 'Purchasing Power']: Math.round(P / Math.pow(1 + rt / 100, n)),
    }))
  }, [P, n, language])

  // Потеря стоимости
  const valueLoss = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Первоначальная сумма' : 'Original Amount', value: Math.round(P), color: '#6366f1' },
      { label: language === 'ru' ? 'Покупательная способность' : 'Purchasing Power', value: Math.round(result.purchasingPower), color: '#22c55e' },
      { label: language === 'ru' ? 'Потеря от инфляции' : 'Inflation Loss', value: Math.round(result.loss), color: '#ef4444' },
    ]
  }, [result, P, language])

  // Круговая диаграмма
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Осталось (в текущих ценах)' : 'Remaining (in current prices)', value: Math.round(result.purchasingPower) },
      { name: language === 'ru' ? 'Потеря от инфляции' : 'Inflation Loss', value: Math.round(result.loss) },
    ]
  }, [result, language])

  // Процент потери
  const lossPercent = useMemo(() => {
    if (!result) return 0
    return ((result.loss / P) * 100)
  }, [result, P])

  // Правило 70
  const ruleOf70 = useMemo(() => {
    return Math.round(70 / (r * 100))
  }, [r])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Первоначальная сумма' : 'Original Amount', value: formatCurrency(P, language) },
      { label: language === 'ru' ? 'Покупательная способность' : 'Purchasing Power', value: formatCurrency(result.purchasingPower, language) },
      { label: language === 'ru' ? 'Потеря от инфляции' : 'Inflation Loss', value: formatCurrency(result.loss, language) },
      { label: language === 'ru' ? 'Потеря в %' : 'Loss %', value: formatPercent(lossPercent) },
    ]
  }, [result, P, lossPercent, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Сумма' : 'Amount'}
          </label>
          <input type="number" className="input w-full" value={amount} onChange={(e) => handleAmountChange(e.target.value)} />
          {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Инфляция (% в год)' : 'Inflation (% per year)'}
          </label>
          <input type="number" className="input w-full" value={inflationRate} onChange={(e) => handleInflationRateChange(e.target.value)} />
          {inflationRateError && <p className="text-xs text-red-500 mt-1">{inflationRateError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Лет' : 'Years'}
          </label>
          <input type="number" className="input w-full" value={years} onChange={(e) => handleYearsChange(e.target.value)} />
          {yearsError && <p className="text-xs text-red-500 mt-1">{yearsError}</p>}
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
                {language === 'ru' ? 'Влияние инфляции' : 'Inflation Impact'}
              </h3>
              <DonutChartWidget 
                data={pieData} 
                height={250}
                centerLabel={language === 'ru' ? 'Потеря' : 'Loss'}
                centerValue={formatPercent(lossPercent)}
              />
            </div>

            {/* Потеря стоимости */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Обесценивание' : 'Depreciation'}
              </h3>
              <CircularProgressWidget 
                value={lossPercent} 
                maxValue={100} 
                label={formatPercent(lossPercent)}
                color="#ef4444"
                size={160}
              />
            </div>
          </div>

          {/* График обесценивания по месяцам */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Динамика обесценивания' : 'Depreciation Dynamics'}
            </h3>
            <LineChartWidget 
              data={depreciationData}
              dataKeys={[
                { key: language === 'ru' ? 'Покупательная способность' : 'Purchasing Power', color: '#22c55e' },
                { key: language === 'ru' ? 'Номинальная стоимость' : 'Nominal Value', color: '#6366f1' },
              ]}
              height={300}
            />
          </div>

          {/* Сравнение уровней инфляции */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение уровней инфляции' : 'Inflation Rate Comparison'}
            </h3>
            <BarChartWidget 
              data={inflationComparison}
              dataKeys={[{ key: language === 'ru' ? 'Покупательная способность' : 'Purchasing Power', color: '#22c55e' }]}
              height={250}
            />
          </div>

          {/* Потеря стоимости */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Анализ потери стоимости' : 'Value Loss Analysis'}
            </h3>
            <HorizontalBarWidget data={valueLoss} />
          </div>

          {/* Правило 70 */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Правило 70' : 'Rule of 70'}
            </h3>
            <p className="text-sm text-muted">
              {language === 'ru' 
                ? `При текущей инфляции ${inflationRate}%, ваши деньги обесценятся вдвое примерно за ${ruleOf70} лет`
                : `At current inflation of ${inflationRate}%, your money will halve in about ${ruleOf70} years`}
            </p>
          </div>

          {/* Советы */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ru' ? 'Как защититься от инфляции' : 'How to Protect Against Inflation'}
            </h3>
            <ul className="text-sm text-muted space-y-2">
              <li>• {language === 'ru' ? 'Инвестируйте в инструменты с доходностью выше инфляции' : 'Invest in instruments with returns above inflation'}</li>
              <li>• {language === 'ru' ? 'Рассмотрите облигации с защитой от инфляции' : 'Consider inflation-protected bonds'}</li>
              <li>• {language === 'ru' ? 'Диверсифицируйте инвестиции' : 'Diversify your investments'}</li>
              <li>• {language === 'ru' ? 'Избегайте хранения крупных сумм в наличных' : 'Avoid storing large sums in cash'}</li>
            </ul>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
