import { NextResponse } from 'next/server'
import { fetchExchangeRates } from '@/lib/api/exchangeRates'

export const dynamic = 'force-dynamic'

export async function GET() {
 const data = await fetchExchangeRates('USD')
 return NextResponse.json(data)
}

