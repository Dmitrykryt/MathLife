'use client'

import { lazy, useMemo, useState } from 'react'
import { Calculator } from '@/types'
import { useSettingsStore } from '@/store/settingsStore'
import { CalculatorShell } from './shared/CalculatorShell'

// Finance
const LoanCalculator = lazy(() => import('./finance/loan-calculator').then((m) => ({ default: m.LoanCalculator })))
const DepositCalculator = lazy(() => import('./finance/deposit-calculator').then((m) => ({ default: m.DepositCalculator })))
const TipCalculator = lazy(() => import('./finance/tip-calculator').then((m) => ({ default: m.TipCalculator })))
const VATCalculator = lazy(() => import('./finance/vat-calculator').then((m) => ({ default: m.VATCalculator })))
const CurrencyConverter = lazy(() => import('./finance/currency-converter').then((m) => ({ default: m.CurrencyConverter })))
const MortgageCalculator = lazy(() => import('./finance/mortgage-calculator').then((m) => ({ default: m.MortgageCalculator })))
const InvestmentCalculator = lazy(() => import('./finance/investment-calculator').then((m) => ({ default: m.InvestmentCalculator })))
const InflationCalculator = lazy(() => import('./finance/inflation-calculator').then((m) => ({ default: m.InflationCalculator })))
const ProfitMarginCalculator = lazy(() => import('./finance/profit-margin-calculator').then((m) => ({ default: m.ProfitMarginCalculator })))
const SalaryNetCalculator = lazy(() => import('./finance/salary-net-calculator').then((m) => ({ default: m.SalaryNetCalculator })))
const DiscountCalculator = lazy(() => import('./finance/discount-calculator').then((m) => ({ default: m.DiscountCalculator })))

// Health
const BMICalculator = lazy(() => import('./health/bmi-calculator').then((m) => ({ default: m.BMICalculator })))
const CalorieCalculator = lazy(() => import('./health/calorie-calculator').then((m) => ({ default: m.CalorieCalculator })))
const WaterIntakeCalculator = lazy(() => import('./health/water-intake-calculator').then((m) => ({ default: m.WaterIntakeCalculator })))
const IdealWeightCalculator = lazy(() => import('./health/ideal-weight-calculator').then((m) => ({ default: m.IdealWeightCalculator })))
const SleepCalculator = lazy(() => import('./health/sleep-calculator').then((m) => ({ default: m.SleepCalculator })))
const HeartRateCalculator = lazy(() => import('./health/heart-rate-calculator').then((m) => ({ default: m.HeartRateCalculator })))

// Everyday
const FuelConsumptionCalculator = lazy(() => import('./everyday/fuel-consumption-calculator').then((m) => ({ default: m.FuelConsumptionCalculator })))
const ElectricityBillCalculator = lazy(() => import('./everyday/electricity-bill-calculator').then((m) => ({ default: m.ElectricityBillCalculator })))
const TripCostCalculator = lazy(() => import('./everyday/trip-cost-calculator').then((m) => ({ default: m.TripCostCalculator })))
const WaterBillCalculator = lazy(() => import('./everyday/water-bill-calculator').then((m) => ({ default: m.WaterBillCalculator })))
const HeatingCostCalculator = lazy(() => import('./everyday/heating-cost-calculator').then((m) => ({ default: m.HeatingCostCalculator })))
const PricePerUnitCalculator = lazy(() => import('./everyday/price-per-unit-calculator').then((m) => ({ default: m.PricePerUnitCalculator })))
const SplitBillCalculator = lazy(() => import('./everyday/split-bill-calculator').then((m) => ({ default: m.SplitBillCalculator })))
const MovingCostCalculator = lazy(() => import('./everyday/moving-cost-calculator').then((m) => ({ default: m.MovingCostCalculator })))
const ParkingFeeCalculator = lazy(() => import('./everyday/parking-fee-calculator').then((m) => ({ default: m.ParkingFeeCalculator })))
const PhonePlanCalculator = lazy(() => import('./everyday/phone-plan-calculator').then((m) => ({ default: m.PhonePlanCalculator })))
const RentVsBuyCalculator = lazy(() => import('./everyday/rent-vs-buy-calculator').then((m) => ({ default: m.RentVsBuyCalculator })))
const PetCostCalculator = lazy(() => import('./everyday/pet-cost-calculator').then((m) => ({ default: m.PetCostCalculator })))
const WarrantyValueCalculator = lazy(() => import('./everyday/warranty-value-calculator').then((m) => ({ default: m.WarrantyValueCalculator })))

// Home
const PaintCalculator = lazy(() => import('./home/paint-calculator').then((m) => ({ default: m.PaintCalculator })))
const TilesCalculator = lazy(() => import('./home/tiles-calculator').then((m) => ({ default: m.TilesCalculator })))
const FlooringCalculator = lazy(() => import('./home/flooring-calculator').then((m) => ({ default: m.FlooringCalculator })))
const HvacCalculator = lazy(() => import('./home/hvac-calculator').then((m) => ({ default: m.HvacCalculator })))
const HomeAffordabilityCalculator = lazy(() => import('./home/home-affordability-calculator').then((m) => ({ default: m.HomeAffordabilityCalculator })))
const PropertyTaxCalculator = lazy(() => import('./home/property-tax-calculator').then((m) => ({ default: m.PropertyTaxCalculator })))
const MortgageAffordabilityCalculator = lazy(() => import('./home/mortgage-affordability-calculator').then((m) => ({ default: m.MortgageAffordabilityCalculator })))
const RoomAreaCalculator = lazy(() => import('./home/room-area-calculator').then((m) => ({ default: m.RoomAreaCalculator })))

// Auto
const CarLoanCalculator = lazy(() => import('./auto/car-loan-calculator').then((m) => ({ default: m.CarLoanCalculator })))
const FuelEconomyCalculator = lazy(() => import('./auto/fuel-economy-calculator').then((m) => ({ default: m.FuelEconomyCalculator })))
const EvChargingCalculator = lazy(() => import('./auto/ev-charging-calculator').then((m) => ({ default: m.EvChargingCalculator })))
const TireSizeCalculator = lazy(() => import('./auto/tire-size-calculator').then((m) => ({ default: m.TireSizeCalculator })))
const CarMaintenanceCalculator = lazy(() => import('./auto/car-maintenance-calculator').then((m) => ({ default: m.CarMaintenanceCalculator })))

// Education
const GradeCalculator = lazy(() => import('./education/grade-calculator').then((m) => ({ default: m.GradeCalculator })))
const StudentLoanCalculator = lazy(() => import('./education/student-loan-calculator').then((m) => ({ default: m.StudentLoanCalculator })))
const StudyTimeCalculator = lazy(() => import('./education/study-time-calculator').then((m) => ({ default: m.StudyTimeCalculator })))
const ExamScoreCalculator = lazy(() => import('./education/exam-score-calculator').then((m) => ({ default: m.ExamScoreCalculator })))

// Time
const AgeCalculator = lazy(() => import('./time/age-calculator').then((m) => ({ default: m.AgeCalculator })))
const DateDifferenceCalculator = lazy(() => import('./time/date-difference-calculator').then((m) => ({ default: m.DateDifferenceCalculator })))
const TimezoneConverter = lazy(() => import('./time/timezone-converter').then((m) => ({ default: m.TimezoneConverter })))

type FieldType = 'number' | 'date' | 'time' | 'select'

type FieldConfig = {
 key: string
 type: FieldType
 defaultValue: string
 labelRu: string
 labelEn: string
 options?: { value: string; labelRu: string; labelEn: string }[]
}

type CalcConfig = {
 fields: FieldConfig[]
 resultLabelsRu: Record<string, string>
 resultLabelsEn: Record<string, string>
 calculate: (values: Record<string, string>) => Record<string, string | number>
}

const num = (v?: string) => Number(v ?? '0')
const round = (n: number) => (Number.isFinite(n) ? Number(n.toFixed(2)) :0)

const annuity = (principal: number, annualRate: number, months: number) => {
 if (months <=0) return 0
 const r = annualRate /12 /100
 if (r ===0) return principal / months
 const f = Math.pow(1 + r, months)
 return (principal * r * f) / (f -1)
}

const F: Record<string, CalcConfig> = {
 'discount-calculator': {
 fields: [
 { key: 'price', type: 'number', defaultValue: '1000', labelRu: 'Цена', labelEn: 'Price' },
 { key: 'discount', type: 'number', defaultValue: '10', labelRu: 'Скидка (%)', labelEn: 'Discount (%)' },
 ],
 resultLabelsRu: { final: 'Итоговая цена', saved: 'Экономия' },
 resultLabelsEn: { final: 'Final price', saved: 'Saved' },
 calculate: (v) => {
 const saved = num(v.price) * num(v.discount) /100
 return { final: round(num(v.price) - saved), saved: round(saved) }
 },
 },
 'trip-cost-calculator': {
 fields: [
 { key: 'distance', type: 'number', defaultValue: '250', labelRu: 'Расстояние (км)', labelEn: 'Distance (km)' },
 { key: 'consumption', type: 'number', defaultValue: '8', labelRu: 'Расход (л/100)', labelEn: 'Consumption (l/100)' },
 { key: 'fuelPrice', type: 'number', defaultValue: '60', labelRu: 'Цена топлива', labelEn: 'Fuel price' },
 { key: 'other', type: 'number', defaultValue: '3000', labelRu: 'Прочие расходы', labelEn: 'Other costs' },
 ],
 resultLabelsRu: { fuel: 'Топливо', total: 'Итого поездка' },
 resultLabelsEn: { fuel: 'Fuel', total: 'Total trip cost' },
 calculate: (v) => {
 const fuel = (num(v.distance) /100) * num(v.consumption) * num(v.fuelPrice)
 return { fuel: round(fuel), total: round(fuel + num(v.other)) }
 },
 },
 'grocery-calculator': {
 fields: [
 { key: 'daily', type: 'number', defaultValue: '1200', labelRu: 'В день', labelEn: 'Per day' },
 { key: 'days', type: 'number', defaultValue: '7', labelRu: 'Дней', labelEn: 'Days' },
 ],
 resultLabelsRu: { total: 'Бюджет на продукты' },
 resultLabelsEn: { total: 'Grocery budget' },
 calculate: (v) => ({ total: round(num(v.daily) * num(v.days)) }),
 },
 'water-bill-calculator': {
 fields: [
 { key: 'volume', type: 'number', defaultValue: '12', labelRu: 'Объём (м³)', labelEn: 'Volume (m³)' },
 { key: 'tariff', type: 'number', defaultValue: '55', labelRu: 'Тариф', labelEn: 'Tariff' },
 ],
 resultLabelsRu: { total: 'Счёт за воду' },
 resultLabelsEn: { total: 'Water bill' },
 calculate: (v) => ({ total: round(num(v.volume) * num(v.tariff)) }),
 },
 'heating-cost-calculator': {
 fields: [
 { key: 'area', type: 'number', defaultValue: '50', labelRu: 'Площадь (м²)', labelEn: 'Area (m²)' },
 { key: 'rate', type: 'number', defaultValue: '45', labelRu: 'Тариф за м²', labelEn: 'Rate per m²' },
 ],
 resultLabelsRu: { total: 'Стоимость отопления' },
 resultLabelsEn: { total: 'Heating cost' },
 calculate: (v) => ({ total: round(num(v.area) * num(v.rate)) }),
 },
 'subscription-cost-calculator': {
 fields: [{ key: 'monthly', type: 'number', defaultValue: '2500', labelRu: 'В месяц', labelEn: 'Monthly' }],
 resultLabelsRu: { yearly: 'За год' },
 resultLabelsEn: { yearly: 'Per year' },
 calculate: (v) => ({ yearly: round(num(v.monthly) *12) }),
 },
 'price-per-unit-calculator': {
 fields: [
 { key: 'price', type: 'number', defaultValue: '300', labelRu: 'Цена', labelEn: 'Price' },
 { key: 'amount', type: 'number', defaultValue: '1.5', labelRu: 'Количество', labelEn: 'Amount' },
 ],
 resultLabelsRu: { perUnit: 'Цена за единицу' },
 resultLabelsEn: { perUnit: 'Price per unit' },
 calculate: (v) => ({ perUnit: round(num(v.price) / Math.max(num(v.amount),0.0001)) }),
 },
 'split-bill-calculator': {
 fields: [
 { key: 'bill', type: 'number', defaultValue: '5000', labelRu: 'Счёт', labelEn: 'Bill' },
 { key: 'tip', type: 'number', defaultValue: '10', labelRu: 'Чаевые (%)', labelEn: 'Tip (%)' },
 { key: 'people', type: 'number', defaultValue: '4', labelRu: 'Людей', labelEn: 'People' },
 ],
 resultLabelsRu: { total: 'Итого', each: 'С человека' },
 resultLabelsEn: { total: 'Total', each: 'Per person' },
 calculate: (v) => {
 const total = num(v.bill) * (1 + num(v.tip) /100)
 return { total: round(total), each: round(total / Math.max(num(v.people),1)) }
 },
 },
 'moving-cost-calculator': {
 fields: [
 { key: 'transport', type: 'number', defaultValue: '10000', labelRu: 'Транспорт', labelEn: 'Transport' },
 { key: 'workers', type: 'number', defaultValue: '7000', labelRu: 'Грузчики', labelEn: 'Workers' },
 { key: 'other', type: 'number', defaultValue: '3000', labelRu: 'Прочее', labelEn: 'Other' },
 ],
 resultLabelsRu: { total: 'Стоимость переезда' },
 resultLabelsEn: { total: 'Moving cost' },
 calculate: (v) => ({ total: round(num(v.transport) + num(v.workers) + num(v.other)) }),
 },
 'parking-fee-calculator': {
 fields: [
 { key: 'hours', type: 'number', defaultValue: '5', labelRu: 'Часы', labelEn: 'Hours' },
 { key: 'rate', type: 'number', defaultValue: '120', labelRu: 'Тариф', labelEn: 'Rate' },
 ],
 resultLabelsRu: { total: 'Стоимость парковки' },
 resultLabelsEn: { total: 'Parking fee' },
 calculate: (v) => ({ total: round(num(v.hours) * num(v.rate)) }),
 },
 'phone-plan-calculator': {
 fields: [
 { key: 'base', type: 'number', defaultValue: '600', labelRu: 'Абонплата', labelEn: 'Base fee' },
 { key: 'minExtra', type: 'number', defaultValue: '40', labelRu: 'Лишние минуты', labelEn: 'Extra minutes' },
 { key: 'minRate', type: 'number', defaultValue: '2', labelRu: 'Цена минуты', labelEn: 'Minute price' },
 { key: 'gbExtra', type: 'number', defaultValue: '5', labelRu: 'Лишние ГБ', labelEn: 'Extra GB' },
 { key: 'gbRate', type: 'number', defaultValue: '90', labelRu: 'Цена ГБ', labelEn: 'GB price' },
 ],
 resultLabelsRu: { total: 'Стоимость тарифа' },
 resultLabelsEn: { total: 'Plan cost' },
 calculate: (v) => ({ total: round(num(v.base) + num(v.minExtra) * num(v.minRate) + num(v.gbExtra) * num(v.gbRate)) }),
 },
 'rent-vs-buy-calculator': {
 fields: [
 { key: 'rent', type: 'number', defaultValue: '45000', labelRu: 'Аренда/мес', labelEn: 'Rent/month' },
 { key: 'mortgage', type: 'number', defaultValue: '52000', labelRu: 'Ипотека/мес', labelEn: 'Mortgage/month' },
 { key: 'years', type: 'number', defaultValue: '5', labelRu: 'Лет', labelEn: 'Years' },
 ],
 resultLabelsRu: { rentTotal: 'Аренда за период', buyTotal: 'Покупка за период', diff: 'Разница' },
 resultLabelsEn: { rentTotal: 'Rent total', buyTotal: 'Buy total', diff: 'Difference' },
 calculate: (v) => {
 const rentTotal = num(v.rent) *12 * num(v.years)
 const buyTotal = num(v.mortgage) *12 * num(v.years)
 return { rentTotal: round(rentTotal), buyTotal: round(buyTotal), diff: round(rentTotal - buyTotal) }
 },
 },
 'pet-cost-calculator': {
 fields: [
 { key: 'food', type: 'number', defaultValue: '5000', labelRu: 'Корм/мес', labelEn: 'Food/month' },
 { key: 'vet', type: 'number', defaultValue: '12000', labelRu: 'Вет/год', labelEn: 'Vet/year' },
 { key: 'other', type: 'number', defaultValue: '5000', labelRu: 'Прочее/год', labelEn: 'Other/year' },
 ],
 resultLabelsRu: { yearly: 'Годовые расходы' },
 resultLabelsEn: { yearly: 'Yearly cost' },
 calculate: (v) => ({ yearly: round(num(v.food) *12 + num(v.vet) + num(v.other)) }),
 },
 'warranty-value-calculator': {
 fields: [
 { key: 'price', type: 'number', defaultValue: '100000', labelRu: 'Цена', labelEn: 'Price' },
 { key: 'depr', type: 'number', defaultValue: '20', labelRu: 'Износ (%/год)', labelEn: 'Depreciation (%/year)' },
 { key: 'years', type: 'number', defaultValue: '2', labelRu: 'Лет', labelEn: 'Years' },
 ],
 resultLabelsRu: { value: 'Остаточная стоимость' },
 resultLabelsEn: { value: 'Residual value' },
 calculate: (v) => ({ value: round(num(v.price) * Math.pow(1 - num(v.depr) /100, num(v.years))) }),
 },
 'sleep-calculator': {
 fields: [{ key: 'wake', type: 'time', defaultValue: '07:00', labelRu: 'Подъём', labelEn: 'Wake time' }],
 resultLabelsRu: { bedtime6: 'Сон6 циклов', bedtime5: 'Сон5 циклов' },
 resultLabelsEn: { bedtime6: '6 cycles bedtime', bedtime5: '5 cycles bedtime' },
 calculate: (v) => {
 const [h, m] = (v.wake || '07:00').split(':').map(Number)
 const wake = h *60 + m
 const b6 = (wake -6 *90 -15 +1440) %1440
 const b5 = (wake -5 *90 -15 +1440) %1440
 const fmt = (mins: number) => `${String(Math.floor(mins /60)).padStart(2, '0')}:${String(mins %60).padStart(2, '0')}`
 return { bedtime6: fmt(b6), bedtime5: fmt(b5) }
 },
 },
 'heart-rate-calculator': {
 fields: [{ key: 'age', type: 'number', defaultValue: '30', labelRu: 'Возраст', labelEn: 'Age' }],
 resultLabelsRu: { max: 'Макс. пульс', zone: 'Рабочая зона (60–80%)' },
 resultLabelsEn: { max: 'Max HR', zone: 'Target zone (60–80%)' },
 calculate: (v) => {
 const max =220 - num(v.age)
 return { max: round(max), zone: `${round(max *0.6)}-${round(max *0.8)}` }
 },
 },
 'ovulation-calculator': {
 fields: [
 { key: 'lastPeriod', type: 'date', defaultValue: '2026-01-01', labelRu: 'Последние месячные', labelEn: 'Last period date' },
 { key: 'cycle', type: 'number', defaultValue: '28', labelRu: 'Длина цикла', labelEn: 'Cycle length' },
 ],
 resultLabelsRu: { ovulation: 'Овуляция', fertile: 'Фертильное окно' },
 resultLabelsEn: { ovulation: 'Ovulation', fertile: 'Fertile window' },
 calculate: (v) => {
 const start = new Date(v.lastPeriod)
 const ov = new Date(start)
 ov.setDate(start.getDate() + num(v.cycle) -14)
 const fs = new Date(ov)
 fs.setDate(ov.getDate() -5)
 const fe = new Date(ov)
 fe.setDate(ov.getDate() +1)
 const fmt = (d: Date) => d.toISOString().slice(0,10)
 return { ovulation: fmt(ov), fertile: `${fmt(fs)} - ${fmt(fe)}` }
 },
 },
 'ideal-weight-calculator': {
 fields: [
 { key: 'height', type: 'number', defaultValue: '175', labelRu: 'Рост (см)', labelEn: 'Height (cm)' },
 {
 key: 'gender',
 type: 'select',
 defaultValue: 'male',
 labelRu: 'Пол',
 labelEn: 'Gender',
 options: [
 { value: 'male', labelRu: 'Мужской', labelEn: 'Male' },
 { value: 'female', labelRu: 'Женский', labelEn: 'Female' },
 ],
 },
 ],
 resultLabelsRu: { ideal: 'Идеальный вес (кг)' },
 resultLabelsEn: { ideal: 'Ideal weight (kg)' },
 calculate: (v) => {
 const hIn = num(v.height) /2.54
 const base = v.gender === 'female' ?45.5 :50
 return { ideal: round(base +2.3 * Math.max(0, hIn -60)) }
 },
 },
 'tiles-calculator': {
 fields: [
 { key: 'area', type: 'number', defaultValue: '30', labelRu: 'Площадь (м²)', labelEn: 'Area (m²)' },
 { key: 'tileArea', type: 'number', defaultValue: '0.09', labelRu: 'Плитка (м²)', labelEn: 'Tile area (m²)' },
 { key: 'waste', type: 'number', defaultValue: '10', labelRu: 'Запас (%)', labelEn: 'Waste (%)' },
 ],
 resultLabelsRu: { count: 'Плиток (шт)' },
 resultLabelsEn: { count: 'Tiles (pcs)' },
 calculate: (v) => ({ count: Math.ceil((num(v.area) / Math.max(num(v.tileArea),0.0001)) * (1 + num(v.waste) /100)) }),
 },
 'flooring-calculator': {
 fields: [
 { key: 'area', type: 'number', defaultValue: '40', labelRu: 'Площадь (м²)', labelEn: 'Area (m²)' },
 { key: 'waste', type: 'number', defaultValue: '8', labelRu: 'Запас (%)', labelEn: 'Waste (%)' },
 ],
 resultLabelsRu: { required: 'Нужно покрытия (м²)' },
 resultLabelsEn: { required: 'Required flooring (m²)' },
 calculate: (v) => ({ required: round(num(v.area) * (1 + num(v.waste) /100)) }),
 },
 'hvac-calculator': {
 fields: [{ key: 'area', type: 'number', defaultValue: '25', labelRu: 'Площадь', labelEn: 'Area' }],
 resultLabelsRu: { watts: 'Мощность (Вт)', btu: 'Мощность (BTU/h)' },
 resultLabelsEn: { watts: 'Power (W)', btu: 'Power (BTU/h)' },
 calculate: (v) => {
 const watts = num(v.area) *100
 return { watts: round(watts), btu: round(watts *3.412) }
 },
 },
 'home-affordability-calculator': {
 fields: [
 { key: 'income', type: 'number', defaultValue: '200000', labelRu: 'Доход/мес', labelEn: 'Income/month' },
 { key: 'rate', type: 'number', defaultValue: '12', labelRu: 'Ставка (%)', labelEn: 'Rate (%)' },
 { key: 'years', type: 'number', defaultValue: '20', labelRu: 'Лет', labelEn: 'Years' },
 ],
 resultLabelsRu: { payment: 'Комфортный платёж', home: 'Доступная стоимость жилья' },
 resultLabelsEn: { payment: 'Affordable payment', home: 'Affordable home price' },
 calculate: (v) => {
 const payment = num(v.income) *0.35
 const coeff = annuity(1, num(v.rate), num(v.years) *12)
 return { payment: round(payment), home: round(coeff >0 ? payment / coeff :0) }
 },
 },
 'property-tax-calculator': {
 fields: [
 { key: 'value', type: 'number', defaultValue: '6000000', labelRu: 'Стоимость', labelEn: 'Value' },
 { key: 'rate', type: 'number', defaultValue: '0.3', labelRu: 'Ставка (%)', labelEn: 'Rate (%)' },
 ],
 resultLabelsRu: { tax: 'Налог' },
 resultLabelsEn: { tax: 'Tax' },
 calculate: (v) => ({ tax: round(num(v.value) * num(v.rate) /100) }),
 },
 'mortgage-affordability-calculator': {
 fields: [
 { key: 'income', type: 'number', defaultValue: '180000', labelRu: 'Доход/мес', labelEn: 'Income/month' },
 { key: 'rate', type: 'number', defaultValue: '12', labelRu: 'Ставка (%)', labelEn: 'Rate (%)' },
 { key: 'years', type: 'number', defaultValue: '25', labelRu: 'Лет', labelEn: 'Years' },
 ],
 resultLabelsRu: { payment: 'Макс платеж', loan: 'Макс ипотека' },
 resultLabelsEn: { payment: 'Max payment', loan: 'Max mortgage' },
 calculate: (v) => {
 const payment = num(v.income) *0.4
 const coeff = annuity(1, num(v.rate), num(v.years) *12)
 return { payment: round(payment), loan: round(coeff >0 ? payment / coeff :0) }
 },
 },
 'room-area-calculator': {
 fields: [
 { key: 'length', type: 'number', defaultValue: '5', labelRu: 'Длина', labelEn: 'Length' },
 { key: 'width', type: 'number', defaultValue: '4', labelRu: 'Ширина', labelEn: 'Width' },
 { key: 'height', type: 'number', defaultValue: '2.7', labelRu: 'Высота', labelEn: 'Height' },
 ],
 resultLabelsRu: { floor: 'Пол (м²)', walls: 'Стены (м²)', ceiling: 'Потолок (м²)' },
 resultLabelsEn: { floor: 'Floor (m²)', walls: 'Walls (m²)', ceiling: 'Ceiling (m²)' },
 calculate: (v) => {
 const l = num(v.length)
 const w = num(v.width)
 const h = num(v.height)
 return { floor: round(l * w), walls: round(2 * (l + w) * h), ceiling: round(l * w) }
 },
 },
 'car-loan-calculator': {
 fields: [
 { key: 'amount', type: 'number', defaultValue: '1500000', labelRu: 'Сумма', labelEn: 'Amount' },
 { key: 'rate', type: 'number', defaultValue: '14', labelRu: 'Ставка (%)', labelEn: 'Rate (%)' },
 { key: 'months', type: 'number', defaultValue: '60', labelRu: 'Срок (мес)', labelEn: 'Term (months)' },
 ],
 resultLabelsRu: { monthly: 'Платёж/мес', total: 'Всего выплат' },
 resultLabelsEn: { monthly: 'Monthly', total: 'Total' },
 calculate: (v) => {
 const monthly = annuity(num(v.amount), num(v.rate), num(v.months))
 return { monthly: round(monthly), total: round(monthly * num(v.months)) }
 },
 },
 'fuel-economy-calculator': {
 fields: [
 { key: 'liters', type: 'number', defaultValue: '40', labelRu: 'Топливо (л)', labelEn: 'Fuel (l)' },
 { key: 'distance', type: 'number', defaultValue: '500', labelRu: 'Расстояние (км)', labelEn: 'Distance (km)' },
 ],
 resultLabelsRu: { l100: 'Расход (л/100)' },
 resultLabelsEn: { l100: 'Consumption (l/100)' },
 calculate: (v) => ({ l100: round(num(v.liters) / Math.max(num(v.distance),1) *100) }),
 },
 'ev-charging-calculator': {
 fields: [
 { key: 'battery', type: 'number', defaultValue: '70', labelRu: 'Батарея (кВт⋅ч)', labelEn: 'Battery (kWh)' },
 { key: 'percent', type: 'number', defaultValue: '80', labelRu: 'Зарядить на (%)', labelEn: 'Charge to (%)' },
 { key: 'price', type: 'number', defaultValue: '8', labelRu: 'Цена за кВт⋅ч', labelEn: 'Price per kWh' },
 ],
 resultLabelsRu: { energy: 'Энергия (кВт⋅ч)', total: 'Стоимость' },
 resultLabelsEn: { energy: 'Energy (kWh)', total: 'Cost' },
 calculate: (v) => {
 const energy = num(v.battery) * num(v.percent) /100
 return { energy: round(energy), total: round(energy * num(v.price)) }
 },
 },
 'tire-size-calculator': {
 fields: [
 { key: 'width', type: 'number', defaultValue: '225', labelRu: 'Ширина', labelEn: 'Width' },
 { key: 'aspect', type: 'number', defaultValue: '45', labelRu: 'Профиль (%)', labelEn: 'Aspect (%)' },
 { key: 'rim', type: 'number', defaultValue: '17', labelRu: 'Диск (дюймы)', labelEn: 'Rim (inches)' },
 ],
 resultLabelsRu: { diameter: 'Диаметр (мм)', circumference: 'Окружность (мм)' },
 resultLabelsEn: { diameter: 'Diameter (mm)', circumference: 'Circumference (mm)' },
 calculate: (v) => {
 const side = num(v.width) * num(v.aspect) /100
 const d = num(v.rim) *25.4 +2 * side
 return { diameter: round(d), circumference: round(Math.PI * d) }
 },
 },
 'car-maintenance-calculator': {
 fields: [
 { key: 'service', type: 'number', defaultValue: '25000', labelRu: 'ТО/год', labelEn: 'Service/year' },
 { key: 'repair', type: 'number', defaultValue: '30000', labelRu: 'Ремонт/год', labelEn: 'Repair/year' },
 { key: 'insurance', type: 'number', defaultValue: '45000', labelRu: 'Страховка/год', labelEn: 'Insurance/year' },
 ],
 resultLabelsRu: { total: 'Годовые расходы на авто' },
 resultLabelsEn: { total: 'Yearly car expenses' },
 calculate: (v) => ({ total: round(num(v.service) + num(v.repair) + num(v.insurance)) }),
 },
 'gpa-calculator': {
 fields: [
 { key: 'points', type: 'number', defaultValue: '36', labelRu: 'Сумма баллов', labelEn: 'Total points' },
 { key: 'credits', type: 'number', defaultValue: '12', labelRu: 'Кредиты', labelEn: 'Credits' },
 ],
 resultLabelsRu: { gpa: 'GPA' },
 resultLabelsEn: { gpa: 'GPA' },
 calculate: (v) => ({ gpa: round(num(v.points) / Math.max(num(v.credits),1)) }),
 },
 'student-loan-calculator': {
 fields: [
 { key: 'amount', type: 'number', defaultValue: '800000', labelRu: 'Сумма', labelEn: 'Amount' },
 { key: 'rate', type: 'number', defaultValue: '9', labelRu: 'Ставка (%)', labelEn: 'Rate (%)' },
 { key: 'months', type: 'number', defaultValue: '120', labelRu: 'Срок (мес)', labelEn: 'Term (months)' },
 ],
 resultLabelsRu: { monthly: 'Платёж/мес', total: 'Всего' },
 resultLabelsEn: { monthly: 'Monthly', total: 'Total' },
 calculate: (v) => {
 const monthly = annuity(num(v.amount), num(v.rate), num(v.months))
 return { monthly: round(monthly), total: round(monthly * num(v.months)) }
 },
 },
 'study-time-calculator': {
 fields: [
 { key: 'topics', type: 'number', defaultValue: '20', labelRu: 'Тем', labelEn: 'Topics' },
 { key: 'hoursPerTopic', type: 'number', defaultValue: '1.5', labelRu: 'Часов на тему', labelEn: 'Hours/topic' },
 { key: 'days', type: 'number', defaultValue: '14', labelRu: 'Дней', labelEn: 'Days' },
 ],
 resultLabelsRu: { total: 'Всего часов', perDay: 'Часов в день' },
 resultLabelsEn: { total: 'Total hours', perDay: 'Hours per day' },
 calculate: (v) => {
 const total = num(v.topics) * num(v.hoursPerTopic)
 return { total: round(total), perDay: round(total / Math.max(num(v.days),1)) }
 },
 },
 'exam-score-calculator': {
 fields: [
 { key: 'current', type: 'number', defaultValue: '65', labelRu: 'Текущая оценка', labelEn: 'Current grade' },
 { key: 'target', type: 'number', defaultValue: '80', labelRu: 'Желаемая итоговая', labelEn: 'Target final' },
 { key: 'weight', type: 'number', defaultValue: '40', labelRu: 'Вес экзамена (%)', labelEn: 'Exam weight (%)' },
 ],
 resultLabelsRu: { required: 'Нужно на экзамене (%)' },
 resultLabelsEn: { required: 'Required exam score (%)' },
 calculate: (v) => {
 const w = num(v.weight) /100
 const required = (num(v.target) - num(v.current) * (1 - w)) / Math.max(w,0.0001)
 return { required: round(required) }
 },
 },
 'timezone-converter': {
 fields: [
 { key: 'time', type: 'time', defaultValue: '12:00', labelRu: 'Время', labelEn: 'Time' },
 { key: 'from', type: 'number', defaultValue: '3', labelRu: 'UTC от', labelEn: 'UTC from' },
 { key: 'to', type: 'number', defaultValue: '0', labelRu: 'UTC в', labelEn: 'UTC to' },
 ],
 resultLabelsRu: { converted: 'Конвертированное время' },
 resultLabelsEn: { converted: 'Converted time' },
 calculate: (v) => {
 const [h, m] = (v.time || '12:00').split(':').map(Number)
 const total = h *60 + m
 const c = (total - num(v.from) *60 + num(v.to) *60 +1440 *3) %1440
 return { converted: `${String(Math.floor(c /60)).padStart(2, '0')}:${String(Math.floor(c %60)).padStart(2, '0')}` }
 },
 },
}

function ConfigurableCalculator({ calculator }: { calculator: Calculator }) {
 const language = useSettingsStore((s) => s.language)
 const config = F[calculator.slug]

 const initialValues = useMemo(() => {
 if (!config) return {}
 return Object.fromEntries(config.fields.map((f) => [f.key, f.defaultValue])) as Record<string, string>
 }, [config])

 const [values, setValues] = useState<Record<string, string>>(initialValues)
 const [result, setResult] = useState<Record<string, string | number> | null>(null)

 const handleCalculate = () => {
 if (config) setResult(config.calculate(values))
 }

 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (e.key === 'Enter') {
 e.preventDefault()
 handleCalculate()
 }
 }

 if (!config) {
 return (
 <CalculatorShell calculator={calculator}>
 <div className="glass-card text-center">Нет конфигурации для этого калькулятора.</div>
 </CalculatorShell>
 )
 }

 return (
 <CalculatorShell calculator={calculator}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4" onKeyDown={handleKeyDown}>
 {config.fields.map((field) => (
 <div key={field.key}>
 <label className="block text-sm text-muted mb-1">
 {language === 'ru' ? field.labelRu : field.labelEn}
 </label>
 {field.type === 'select' && field.options ? (
 <select
 className="input"
 value={values[field.key] ?? ''}
 onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
 onKeyDown={handleKeyDown}
 >
 {field.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {language === 'ru' ? opt.labelRu : opt.labelEn}
 </option>
 ))}
 </select>
 ) : (
 <input
 type={field.type}
 className="input"
 value={values[field.key] ?? ''}
 onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
 onKeyDown={handleKeyDown}
 />
 )}
 </div>
 ))}
 </div>

 <button className="btn-primary mt-4" onClick={handleCalculate}>
 {language === 'ru' ? 'Рассчитать' : 'Calculate'}
 </button>

 {result && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
 {Object.entries(result).map(([key, value]) => (
 <div key={key} className="glass-card text-center">
 <p className="text-sm text-muted">
 {language === 'ru' ? config.resultLabelsRu[key] : config.resultLabelsEn[key]}
 </p>
 <p className="text-2xl font-bold text-primary">{String(value)}</p>
 </div>
 ))}
 </div>
 )}
 </CalculatorShell>
 )
}

export const realLifeCalculatorComponents: Record<string, React.ComponentType<{ calculator: Calculator }>> = {
 // Finance
 'loan-calculator': LoanCalculator,
 'deposit-calculator': DepositCalculator,
 'tip-calculator': TipCalculator,
 'vat-calculator': VATCalculator,
 'currency-converter': CurrencyConverter,
 'mortgage-calculator': MortgageCalculator,
 'investment-calculator': InvestmentCalculator,
 'inflation-calculator': InflationCalculator,
 'profit-margin-calculator': ProfitMarginCalculator,
 'salary-net-calculator': SalaryNetCalculator,
 'discount-calculator': DiscountCalculator,
 // Health
 'bmi-calculator': BMICalculator,
 'calorie-calculator': CalorieCalculator,
 'water-intake-calculator': WaterIntakeCalculator,
 'ideal-weight-calculator': IdealWeightCalculator,
 'sleep-calculator': SleepCalculator,
 'heart-rate-calculator': HeartRateCalculator,
 // Everyday
 'fuel-consumption-calculator': FuelConsumptionCalculator,
 'electricity-bill-calculator': ElectricityBillCalculator,
 'trip-cost-calculator': TripCostCalculator,
 'water-bill-calculator': WaterBillCalculator,
 'heating-cost-calculator': HeatingCostCalculator,
 'price-per-unit-calculator': PricePerUnitCalculator,
 'split-bill-calculator': SplitBillCalculator,
 'moving-cost-calculator': MovingCostCalculator,
 'parking-fee-calculator': ParkingFeeCalculator,
 'phone-plan-calculator': PhonePlanCalculator,
 'rent-vs-buy-calculator': RentVsBuyCalculator,
 'pet-cost-calculator': PetCostCalculator,
 'warranty-value-calculator': WarrantyValueCalculator,
 // Home
 'paint-calculator': PaintCalculator,
 'tiles-calculator': TilesCalculator,
 'flooring-calculator': FlooringCalculator,
 'hvac-calculator': HvacCalculator,
 'home-affordability-calculator': HomeAffordabilityCalculator,
 'property-tax-calculator': PropertyTaxCalculator,
 'mortgage-affordability-calculator': MortgageAffordabilityCalculator,
 'room-area-calculator': RoomAreaCalculator,
 // Auto
 'car-loan-calculator': CarLoanCalculator,
 'fuel-economy-calculator': FuelEconomyCalculator,
 'ev-charging-calculator': EvChargingCalculator,
 'tire-size-calculator': TireSizeCalculator,
 'car-maintenance-calculator': CarMaintenanceCalculator,
 // Education
 'grade-calculator': GradeCalculator,
 'student-loan-calculator': StudentLoanCalculator,
 'study-time-calculator': StudyTimeCalculator,
 'exam-score-calculator': ExamScoreCalculator,
 // Time
 'age-calculator': AgeCalculator,
 'date-difference-calculator': DateDifferenceCalculator,
 'timezone-converter': TimezoneConverter,
}

export function getCalculatorComponent(slug: string) {
 return realLifeCalculatorComponents[slug] || ConfigurableCalculator
}
