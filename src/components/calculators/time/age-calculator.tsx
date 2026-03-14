'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { 
  RadialBarWidget,
  ProgressBarsWidget, 
  StatsCardsWidget,
  CircularProgressWidget,
  HorizontalBarWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

export function AgeCalculator({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [birthDate, setBirthDate] = useState('1990-01-01')

  // Автоматический расчёт
  const result = useMemo(() => {
    const birth = new Date(birthDate)
    const today = new Date()
    
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))

    return { years, months, days, totalDays }
  }, [birthDate])

  // Дополнительные вычисления
  const additionalData = useMemo(() => {
    if (!result) return null
    
    const birth = new Date(birthDate)
    const today = new Date()
    
    // Общее количество недель, часов, минут
    const totalWeeks = Math.floor(result.totalDays / 7)
    const totalHours = result.totalDays * 24
    const totalMinutes = totalHours * 60
    const totalSeconds = totalMinutes * 60
    
    // До следующего дня рождения
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    // Знак зодиака
    const zodiacSigns = [
      { name: language === 'ru' ? 'Козерог' : 'Capricorn', start: [1, 1], end: [1, 19] },
      { name: language === 'ru' ? 'Водолей' : 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: language === 'ru' ? 'Рыбы' : 'Pisces', start: [2, 19], end: [3, 20] },
      { name: language === 'ru' ? 'Овен' : 'Aries', start: [3, 21], end: [4, 19] },
      { name: language === 'ru' ? 'Телец' : 'Taurus', start: [4, 20], end: [5, 20] },
      { name: language === 'ru' ? 'Близнецы' : 'Gemini', start: [5, 21], end: [6, 21] },
      { name: language === 'ru' ? 'Рак' : 'Cancer', start: [6, 22], end: [7, 22] },
      { name: language === 'ru' ? 'Лев' : 'Leo', start: [7, 23], end: [8, 22] },
      { name: language === 'ru' ? 'Дева' : 'Virgo', start: [8, 23], end: [9, 22] },
      { name: language === 'ru' ? 'Весы' : 'Libra', start: [9, 23], end: [10, 23] },
      { name: language === 'ru' ? 'Скорпион' : 'Scorpio', start: [10, 24], end: [11, 21] },
      { name: language === 'ru' ? 'Стрелец' : 'Sagittarius', start: [11, 22], end: [12, 21] },
      { name: language === 'ru' ? 'Козерог' : 'Capricorn', start: [12, 22], end: [12, 31] },
    ]
    
    const month = birth.getMonth() + 1
    const day = birth.getDate()
    
    const zodiac = zodiacSigns.find(sign => {
      const [startMonth, startDay] = sign.start
      const [endMonth, endDay] = sign.end
      return (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)
    })
    
    // День недели рождения
    const dayOfWeek = birth.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long' })
    
    // Високосный год
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
    const birthYear = birth.getFullYear()
    const leapYear = isLeapYear(birthYear)
    
    // Ожидаемая продолжительность жизни (средняя)
    const lifeExpectancy = 80
    const lifeProgress = (result.years / lifeExpectancy) * 100
    
    return {
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilBirthday,
      zodiac: zodiac?.name || '',
      dayOfWeek,
      leapYear,
      lifeProgress
    }
  }, [result, birthDate, language])

  // Данные для визуализации времени
  const timeBreakdown = useMemo(() => {
    if (!result) return []
    
    return [
      { label: language === 'ru' ? 'Дни' : 'Days', value: result.totalDays, color: '#6366f1' },
      { label: language === 'ru' ? 'Недели' : 'Weeks', value: Math.floor(result.totalDays / 7), color: '#8b5cf6' },
      { label: language === 'ru' ? 'Месяцы' : 'Months', value: result.years * 12 + result.months, color: '#22c55e' },
    ]
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result || !additionalData) return []
    
    return [
      { 
        label: language === 'ru' ? 'Лет' : 'Years', 
        value: result.years 
      },
      { 
        label: language === 'ru' ? 'Месяцев' : 'Months', 
        value: result.years * 12 + result.months 
      },
      { 
        label: language === 'ru' ? 'Недель' : 'Weeks', 
        value: additionalData.totalWeeks.toLocaleString() 
      },
      { 
        label: language === 'ru' ? 'Дней' : 'Days', 
        value: result.totalDays.toLocaleString() 
      },
    ]
  }, [result, additionalData, language])

  return (
    <CalculatorShell calculator={calculator}>
      <div>
        <label className="block text-sm text-muted mb-1">
          {language === 'ru' ? 'Дата рождения' : 'Date of Birth'}
        </label>
        <input
          type="date"
          className="input w-full"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      {result && additionalData && (
        <div className="space-y-6 mt-6">
          {/* Статистика */}
          <StatsCardsWidget stats={stats} />

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Прогресс жизни */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Прогресс жизни' : 'Life Progress'}
              </h3>
              <CircularProgressWidget 
                value={additionalData.lifeProgress} 
                maxValue={100} 
                label={language === 'ru' ? `${result.years} из 80 лет` : `${result.years} of 80 years`}
                color={additionalData.lifeProgress < 50 ? '#22c55e' : additionalData.lifeProgress < 75 ? '#f59e0b' : '#ef4444'}
                size={180}
              />
            </div>

            {/* До дня рождения */}
            <div className="glass-card p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'До дня рождения' : 'Until Birthday'}
              </h3>
              <div className="text-center">
                <div className="text-6xl font-bold text-primary">
                  {additionalData.daysUntilBirthday}
                </div>
                <div className="text-xl text-muted mt-2">
                  {language === 'ru' ? 'дней' : 'days'}
                </div>
              </div>
            </div>
          </div>

          {/* Время в разных единицах */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Время жизни в разных единицах' : 'Life Time in Different Units'}
            </h3>
            <HorizontalBarWidget data={timeBreakdown} />
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalData.totalHours.toLocaleString()}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Часов' : 'Hours'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalData.totalMinutes.toLocaleString()}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Минут' : 'Minutes'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{additionalData.zodiac}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'Знак зодиака' : 'Zodiac Sign'}</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary capitalize">{additionalData.dayOfWeek}</div>
              <div className="text-sm text-muted">{language === 'ru' ? 'День недели' : 'Day of Week'}</div>
            </div>
          </div>

          {/* Интересные факты */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Интересные факты' : 'Interesting Facts'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{language === 'ru' ? 'Вы родились в' : 'You were born on'}</span>
                <span className="font-medium capitalize">{additionalData.dayOfWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{language === 'ru' ? 'Знак зодиака' : 'Zodiac Sign'}</span>
                <span className="font-medium">{additionalData.zodiac}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{language === 'ru' ? 'Високосный год рождения' : 'Leap Year Birth'}</span>
                <span className="font-medium">{additionalData.leapYear ? (language === 'ru' ? 'Да' : 'Yes') : (language === 'ru' ? 'Нет' : 'No')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{language === 'ru' ? 'До следующего дня рождения' : 'Until next birthday'}</span>
                <span className="font-medium">{additionalData.daysUntilBirthday} {language === 'ru' ? 'дней' : 'days'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{language === 'ru' ? 'Сердце сократилось ~' : 'Heartbeats ~'}</span>
                <span className="font-medium">{Math.round(result.totalDays * 24 * 60 * 70 / 1000000)}M {language === 'ru' ? 'раз' : 'times'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{language === 'ru' ? 'Сделано вдохов ~' : 'Breaths taken ~'}</span>
                <span className="font-medium">{Math.round(result.totalDays * 24 * 60 * 16 / 1000000)}M</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  )
}
