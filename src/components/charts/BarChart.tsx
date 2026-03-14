'use client'

import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function BarChart({ data }: { data: Array<{ name: string; value: number }> }) {
 return (
 <div className='glass-card h-80'>
 <ResponsiveContainer width='100%' height='100%'>
 <RBarChart data={data}>
 <CartesianGrid strokeDasharray='33' />
 <XAxis dataKey='name' />
 <YAxis />
 <Tooltip />
 <Bar dataKey='value' fill='var(--color-secondary)' radius={[6,6,0,0]} />
 </RBarChart>
 </ResponsiveContainer>
 </div>
 )
}
