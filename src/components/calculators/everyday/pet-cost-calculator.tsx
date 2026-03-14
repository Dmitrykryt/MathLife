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
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function PetCostCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [petType, setPetType] = useState('dog')
  const [food, setFood] = useState('5000')
  const [vet, setVet] = useState('15000')
  const [toys, setToys] = useState('3000')
  const [grooming, setGrooming] = useState('6000')
  const [foodError, setFoodError] = useState('')
  const [vetError, setVetError] = useState('')
  const [toysError, setToysError] = useState('')
  const [groomingError, setGroomingError] = useState('')

  const f = Number(food)
  const v = Number(vet)
  const t = Number(toys)
  const g = Number(grooming)

  // Обработчики для валидации
  const handleFoodChange = (value: string) => {
    setFood(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setFoodError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setFoodError('')
      }
    } else {
      setFoodError('')
    }
  }

  const handleVetChange = (value: string) => {
    setVet(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setVetError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setVetError('')
      }
    } else {
      setVetError('')
    }
  }

  const handleToysChange = (value: string) => {
    setToys(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setToysError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setToysError('')
      }
    } else {
      setToysError('')
    }
  }

  const handleGroomingChange = (value: string) => {
    setGrooming(value)
    const num = Number(value)
    if (!isNaN(num) && value !== '') {
      if (num < 0) {
        setGroomingError(language === 'ru' ? 'Значение не может быть отрицательным' : 'Value cannot be negative')
      } else {
        setGroomingError('')
      }
    } else {
      setGroomingError('')
    }
  }

  // Автоматический расчёт
  const result = useMemo(() => {
    const monthly = f + (v + t + g) / 12
    const yearly = monthly * 12
    const lifetime = yearly * (petType === 'dog' ? 12 : petType === 'cat' ? 15 : 10)
    return { 
      monthly, 
      yearly, 
      lifetime,
      breakdown: { food: f * 12, vet: v, toys: t, grooming: g }
    }
  }, [f, v, t, g, petType])

  // Данные для круговой диаграммы
  const pieData = useMemo(() => {
    if (!result) return []
    return [
      { name: language === 'ru' ? 'Корм' : 'Food', value: Math.round(result.breakdown.food) },
      { name: language === 'ru' ? 'Ветеринар' : 'Vet', value: Math.round(result.breakdown.vet) },
      { name: language === 'ru' ? 'Игрушки' : 'Toys', value: Math.round(result.breakdown.toys) },
      { name: language === 'ru' ? 'Уход' : 'Grooming', value: Math.round(result.breakdown.grooming) },
    ]
  }, [result, language])

  // Сравнение расходов
  const costComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Корм' : 'Food', value: Math.round(result.breakdown.food), color: '#22c55e' },
      { label: language === 'ru' ? 'Ветеринар' : 'Vet', value: Math.round(result.breakdown.vet), color: '#ef4444' },
      { label: language === 'ru' ? 'Игрушки' : 'Toys', value: Math.round(result.breakdown.toys), color: '#6366f1' },
      { label: language === 'ru' ? 'Уход' : 'Grooming', value: Math.round(result.breakdown.grooming), color: '#f59e0b' },
    ]
  }, [result, language])

  // Сравнение периодов
  const periodComparison = useMemo(() => {
    if (!result) return []
    return [
      { label: language === 'ru' ? 'Месяц' : 'Month', value: Math.round(result.monthly), color: '#6366f1' },
      { label: language === 'ru' ? 'Год' : 'Year', value: Math.round(result.yearly), color: '#8b5cf6' },
      { label: language === 'ru' ? 'Жизнь' : 'Lifetime', value: Math.round(result.lifetime), color: '#ef4444' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'В месяц' : 'Monthly', value: formatCurrency(Math.round(result.monthly), language) },
      { label: language === 'ru' ? 'В год' : 'Yearly', value: formatCurrency(Math.round(result.yearly), language) },
      { label: language === 'ru' ? 'За жизнь' : 'Lifetime', value: formatCurrency(Math.round(result.lifetime), language) },
      { label: language === 'ru' ? 'Тип питомца' : 'Pet Type', value: petType === 'dog' ? (language === 'ru' ? 'Собака' : 'Dog') : petType === 'cat' ? (language === 'ru' ? 'Кошка' : 'Cat') : (language === 'ru' ? 'Другое' : 'Other') },
    ]
  }, [result, petType, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Тип питомца' : 'Pet Type'}
          </label>
          <select className="input w-full" value={petType} onChange={(e) => setPetType(e.target.value)}>
            <option value="dog">{language === 'ru' ? 'Собака' : 'Dog'}</option>
            <option value="cat">{language === 'ru' ? 'Кошка' : 'Cat'}</option>
            <option value="other">{language === 'ru' ? 'Другое' : 'Other'}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Корм (₽/мес)' : 'Food (₽/mo)'}
          </label>
          <input type="number" className="input w-full" value={food} onChange={(e) => handleFoodChange(e.target.value)} />
          {foodError && <p className="text-xs text-red-500 mt-1">{foodError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Ветеринар (₽/год)' : 'Vet (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={vet} onChange={(e) => handleVetChange(e.target.value)} />
          {vetError && <p className="text-xs text-red-500 mt-1">{vetError}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Игрушки (₽/год)' : 'Toys (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={toys} onChange={(e) => handleToysChange(e.target.value)} />
          {toysError && <p className="text-xs text-red-500 mt-1">{toysError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Уход/груминг (₽/год)' : 'Grooming (₽/year)'}
          </label>
          <input type="number" className="input w-full" value={grooming} onChange={(e) => handleGroomingChange(e.target.value)} />
          {groomingError && <p className="text-xs text-red-500 mt-1">{groomingError}</p>}
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
                centerLabel={language === 'ru' ? 'Год' : 'Year'}
                centerValue={`${Math.round(result.yearly / 1000)}K`}
              />
            </div>

            {/* По периодам */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Расходы по периодам' : 'Cost by Period'}
              </h3>
              <BarChartWidget 
                data={[
                  { name: language === 'ru' ? 'Месяц' : 'Month', value: Math.round(result.monthly) },
                  { name: language === 'ru' ? 'Год' : 'Year', value: Math.round(result.yearly / 1000) },
                  { name: language === 'ru' ? 'Жизнь' : 'Lifetime', value: Math.round(result.lifetime / 1000) },
                ].map(d => ({ name: d.name, [language === 'ru' ? 'Тыс. ₽' : 'K ₽']: d.value }))}
                dataKeys={[{ key: language === 'ru' ? 'Тыс. ₽' : 'K ₽', color: '#6366f1' }]}
                height={250}
              />
            </div>
          </div>

          {/* Сравнение расходов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Годовые расходы по категориям' : 'Yearly Costs by Category'}
            </h3>
            <HorizontalBarWidget data={costComparison} />
          </div>

          {/* Сравнение периодов */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение периодов' : 'Period Comparison'}
            </h3>
            <HorizontalBarWidget data={periodComparison} />
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
