import { fetchExchangeRates } from '@/lib/api/exchangeRates'

export const dynamic = 'force-dynamic'

const STREAM_INTERVAL_MS = 15_000
const HEARTBEAT_INTERVAL_MS = 10_000

const encoder = new TextEncoder()

const formatSseMessage = (data: unknown) => `data: ${JSON.stringify(data)}\n\n`

export async function GET() {
 let ratesInterval: ReturnType<typeof setInterval> | null = null
 let heartbeatInterval: ReturnType<typeof setInterval> | null = null

 const stream = new ReadableStream<Uint8Array>({
 async start(controller) {
 const sendRates = async () => {
 try {
 const rates = await fetchExchangeRates('USD')
 controller.enqueue(encoder.encode(formatSseMessage(rates)))
 } catch {
 controller.enqueue(
 encoder.encode(
 formatSseMessage({
 rates: { USD: 1, EUR: 0.92, RUB: 90 },
 time_last_update_utc: new Date().toISOString(),
 })
 )
 )
 }
 }

 await sendRates()

 ratesInterval = setInterval(() => {
 void sendRates()
 }, STREAM_INTERVAL_MS)

 heartbeatInterval = setInterval(() => {
 controller.enqueue(encoder.encode(': keepalive\n\n'))
 }, HEARTBEAT_INTERVAL_MS)
 },
 cancel() {
 if (ratesInterval) clearInterval(ratesInterval)
 if (heartbeatInterval) clearInterval(heartbeatInterval)
 },
 })

 return new Response(stream, {
 headers: {
 'Content-Type': 'text/event-stream; charset=utf-8',
 'Cache-Control': 'no-cache, no-transform',
 Connection: 'keep-alive',
 },
 })
}
