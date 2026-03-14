'use client'

import { PieChart as RPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#60a5fa', '#a78bfa', '#22d3ee', '#34d399', '#f59e0b']

export function PieChart({ data }: { data: Array<{ name: string; value: number }> }) {
 return (
 <div className='glass-card h-80'>
 <ResponsiveContainer width='100%' height='100%'>
 <RPieChart>
 <Pie data={data} dataKey='value' nameKey='name' outerRadius={110}>
 {data.map((_, i) => (
 <Cell key={i} fill={COLORS[i % COLORS.length]} />
 ))}
 </Pie>
 <Tooltip />
 </RPieChart>
 </ResponsiveContainer>
 </div>
 )
}
