'use client'

import { LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function LineChart({ data }: { data: Array<{ name: string; value: number }> }) {
 return (
 <div className='glass-card h-80'>
 <ResponsiveContainer width='100%' height='100%'>
 <RLineChart data={data}>
 <CartesianGrid strokeDasharray='33' />
 <XAxis dataKey='name' />
 <YAxis />
 <Tooltip />
 <Line type='monotone' dataKey='value' stroke='var(--color-primary)' strokeWidth={2} />
 </RLineChart>
 </ResponsiveContainer>
 </div>
 )
}
