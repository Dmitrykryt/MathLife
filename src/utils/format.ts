export const formatNumber = (n: number, digits = 6) => Number(n.toFixed(digits)).toString()

// Форматирование денег для калькуляторов (округление до целых)
export const formatCurrency = (val: number, language: 'ru' | 'en' = 'ru') => {
  return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'currency',
    currency: language === 'ru' ? 'RUB' : 'USD',
    maximumFractionDigits: 0,
  }).format(val)
}

// Форматирование процентов для калькуляторов (округление до десятых)
export const formatPercent = (val: number) => {
  return `${val.toFixed(1)}%`
}
