'use client'

import { ScatterChart as RScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ScatterChart({ data }: { data: Array<{ x: number; y: number }> }) {
 return (
 <div className='glass-card h-80'>
 <ResponsiveContainer width='100%' height='100%'>
 <RScatterChart>
 <CartesianGrid />
 <XAxis type='number' dataKey='x' />
 <YAxis type='number' dataKey='y' />
 <Tooltip cursor={{ strokeDasharray: '33' }} />
 <Scatter data={data} fill='var(--color-accent)' />
 </RScatterChart>
 </ResponsiveContainer>
 </div>
 )
}
