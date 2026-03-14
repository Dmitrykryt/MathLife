'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import {
 BarChartWidget,
 ProgressBarsWidget,
 StatsCardsWidget,
 HorizontalBarWidget,
 DonutChartWidget,
} from '../shared/CalculatorCharts'

interface Props {
 calculator: Calculator
}

interface ExchangeRatesApiResponse {
 rates?: Record<string, number>
 time_last_update_utc?: string
}

const SUPPORTED_CURRENCIES = ['RUB', 'USD', 'EUR', 'KZT', 'BYN', 'UAH', 'GBP', 'CNY'] as const

type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

const FALLBACK_RATES_USD: Record<SupportedCurrency, number> = {
 USD: 1,
 RUB: 90,
 EUR: 0.92,
 KZT: 450,
 BYN: 3.25,
 UAH: 41,
 GBP: 0.79,
 CNY: 7.25,
}

function normalizeRates(data: ExchangeRatesApiResponse): Record<SupportedCurrency, number> {
 const nextRates: Record<SupportedCurrency, number> = { ...FALLBACK_RATES_USD }

 SUPPORTED_CURRENCIES.forEach((currency) => {
 const value = Number(data.rates?.[currency])
 if (Number.isFinite(value) && value > 0) {
 nextRates[currency] = value
 }
 })

 nextRates.USD = 1

 return nextRates
}

export function CurrencyConverter({ calculator }: Props) {
 const language = useSettingsStore((s) => s.language)
 const [amount, setAmount] = useState('1000')
 const [from, setFrom] = useState<SupportedCurrency>('RUB')
 const [to, setTo] = useState<SupportedCurrency>('USD')
 const [ratesUsd, setRatesUsd] = useState<Record<SupportedCurrency, number>>(FALLBACK_RATES_USD)
 const [lastUpdated, setLastUpdated] = useState<string | null>(null)
 const [ratesError, setRatesError] = useState<string | null>(null)
 const [amountError, setAmountError] = useState('')

 // Обработчик для валидации
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

 useEffect(() => {
 let isMounted = true

 const applyRates = (payload: ExchangeRatesApiResponse) => {
 if (!isMounted || !payload?.rates || typeof payload.rates !== 'object') return

 setRatesUsd(normalizeRates(payload))
 setLastUpdated(payload.time_last_update_utc ?? new Date().toISOString())
 setRatesError(null)
 }

 const fetchInitialRates = async () => {
 try {
 const res = await fetch('/api/exchange-rate', { cache: 'no-store' })
 if (!res.ok) throw new Error('Failed to fetch exchange rates')

 const data = (await res.json()) as ExchangeRatesApiResponse
 applyRates(data)
 } catch {
 if (!isMounted) return
 setRatesError(language === 'ru' ? 'Не удалось получить актуальные курсы' : 'Failed to fetch live rates')
 }
 }

 void fetchInitialRates()

 const source = new EventSource('/api/exchange-rate/stream')

 source.onmessage = (event) => {
 try {
 const data = JSON.parse(event.data) as ExchangeRatesApiResponse
 applyRates(data)
 } catch {
 if (!isMounted) return
 setRatesError(language === 'ru' ? 'Ошибка потока курсов' : 'Rates stream error')
 }
 }

 source.onerror = () => {
 if (!isMounted) return
 setRatesError(language === 'ru' ? 'Поток курсов временно недоступен' : 'Rates stream is temporarily unavailable')
 }

 return () => {
 isMounted = false
 source.close()
 }
 }, [language])

 const numericAmount = useMemo(() => Number(amount), [amount])

 const result = useMemo(() => {
 if (!Number.isFinite(numericAmount)) return null

 const rateFrom = ratesUsd[from]
 const rateTo = ratesUsd[to]

 if (!rateFrom || !rateTo) return null

 return (numericAmount / rateFrom) * rateTo
 }, [numericAmount, ratesUsd, from, to])

 const currentRate = useMemo(() => {
 const rateFrom = ratesUsd[from]
 const rateTo = ratesUsd[to]

 if (!rateFrom || !rateTo) return null

 return rateTo / rateFrom
 }, [ratesUsd, from, to])

 const rateData = useMemo(() => {
 const rubRate = ratesUsd.RUB || FALLBACK_RATES_USD.RUB

 return SUPPORTED_CURRENCIES.map((currency) => ({
 label: currency,
 value: rubRate / (ratesUsd[currency] || 1),
 color: currency === from ? '#6366f1' : currency === to ? '#22c55e' : '#8b5cf6',
 }))
 }, [ratesUsd, from, to])

 const conversionComparison = useMemo(() => {
 if (result === null || !Number.isFinite(numericAmount)) return []

 return [
 { label: language === 'ru' ? 'Исходная сумма' : 'Original Amount', value: numericAmount, color: '#6366f1' },
 { label: language === 'ru' ? 'Конвертированная' : 'Converted', value: result, color: '#22c55e' },
 ]
 }, [result, numericAmount, language])

 const allConversions = useMemo(() => {
 if (!Number.isFinite(numericAmount)) return []

 const rateFrom = ratesUsd[from]
 if (!rateFrom) return []

 const baseUsdAmount = numericAmount / rateFrom
 const key = language === 'ru' ? 'Конвертация' : 'Conversion'

 return SUPPORTED_CURRENCIES.filter((currency) => currency !== from)
 .map((currency) => ({
 name: currency,
 [key]: Number((baseUsdAmount * (ratesUsd[currency] || 0)).toFixed(2)),
 }))
 .sort((a, b) => (b[key] as number) - (a[key] as number))
 }, [numericAmount, ratesUsd, from, language])

 const stats = useMemo(() => {
 if (result === null || currentRate === null || !Number.isFinite(numericAmount)) return []

 const locale = language === 'ru' ? 'ru-RU' : 'en-US'
 const updated = lastUpdated
 ? new Date(lastUpdated).toLocaleString(locale)
 : language === 'ru'
 ? 'только что'
 : 'just now'

 return [
 { label: language === 'ru' ? 'Исходная сумма' : 'Original', value: `${numericAmount.toLocaleString(locale)} ${from}` },
 { label: language === 'ru' ? 'Результат' : 'Result', value: `${result.toFixed(2)} ${to}` },
 { label: language === 'ru' ? 'Курс' : 'Rate', value: `1 ${from} = ${currentRate.toFixed(4)} ${to}` },
 { label: language === 'ru' ? 'Обратный курс' : 'Reverse Rate', value: `1 ${to} = ${(1 / currentRate).toFixed(4)} ${from}` },
 { label: language === 'ru' ? 'Обновлено' : 'Updated', value: updated },
 ]
 }, [result, currentRate, numericAmount, from, to, language, lastUpdated])

 return (
 <CalculatorShell calculator={calculator}>
 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
 <div>
 <label className="mb-1 block text-sm text-muted">{language === 'ru' ? 'Сумма' : 'Amount'}</label>
 <input type="number" className="input w-full" value={amount} onChange={(e) => handleAmountChange(e.target.value)} />
 {amountError && <p className="text-xs text-red-500 mt-1">{amountError}</p>}
 </div>

 <div>
 <label className="mb-1 block text-sm text-muted">{language === 'ru' ? 'Из' : 'From'}</label>
 <select className="input w-full" value={from} onChange={(e) => setFrom(e.target.value as SupportedCurrency)}>
 {SUPPORTED_CURRENCIES.map((currency) => (
 <option key={currency} value={currency}>
 {currency}
 </option>
 ))}
 </select>
 </div>

 <div>
 <label className="mb-1 block text-sm text-muted">{language === 'ru' ? 'В' : 'To'}</label>
 <select className="input w-full" value={to} onChange={(e) => setTo(e.target.value as SupportedCurrency)}>
 {SUPPORTED_CURRENCIES.map((currency) => (
 <option key={currency} value={currency}>
 {currency}
 </option>
 ))}
 </select>
 </div>
 </div>

 <p className="mt-3 text-xs text-muted">
 {language === 'ru'
 ? 'Курсы обновляются в реальном времени через поток данных (SSE).'
 : 'Exchange rates update in real time via a server stream (SSE).'}
 </p>

 {ratesError && <p className="mt-1 text-xs text-red-500">{ratesError}</p>}

 {result !== null && (
 <div className="mt-6 space-y-6">
 <StatsCardsWidget stats={stats} />

 <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
 <div className="glass-card p-4">
 <h3 className="mb-4 text-lg font-semibold">{language === 'ru' ? 'Конвертация' : 'Conversion'}</h3>
 <DonutChartWidget
 data={[
 { name: from, value: numericAmount },
 { name: to, value: result },
 ]}
 height={220}
 centerLabel={to}
 centerValue={result.toFixed(2)}
 />
 </div>

 <div className="glass-card p-4">
 <h3 className="mb-4 text-lg font-semibold">
 {language === 'ru' ? 'Курсы валют (1 единица в RUB)' : 'Exchange Rates (1 unit in RUB)'}
 </h3>
 <HorizontalBarWidget data={rateData} />
 </div>
 </div>

 <div className="glass-card p-4">
 <h3 className="mb-4 text-lg font-semibold">
 {language === 'ru' ? `Конвертация ${amount} ${from} во все валюты` : `Convert ${amount} ${from} to all currencies`}
 </h3>
 <BarChartWidget
 data={allConversions}
 dataKeys={[{ key: language === 'ru' ? 'Конвертация' : 'Conversion', color: '#6366f1' }]}
 height={280}
 />
 </div>

 <div className="glass-card p-4">
 <h3 className="mb-4 text-lg font-semibold">{language === 'ru' ? 'Сравнение сумм' : 'Amount Comparison'}</h3>
 <ProgressBarsWidget data={conversionComparison} />
 </div>
 </div>
 )}
 </CalculatorShell>
 )
}
