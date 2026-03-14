export async function fetchExchangeRates(base = 'USD') {
 try {
 const res = await fetch('https://open.er-api.com/v6/latest/' + base, {
 cache: 'no-store',
 })

 if (!res.ok) throw new Error('API error')

 return await res.json()
 } catch {
 return {
 rates: { USD: 1, EUR: 0.92, RUB: 90 },
 time_last_update_utc: new Date().toISOString(),
 }
 }
}

