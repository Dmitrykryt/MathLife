'use client'

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, ComposedChart, ScatterChart, Scatter,
  Treemap, FunnelChart, Funnel, LabelList
} from 'recharts'
import { useSettingsStore } from '@/store/settingsStore'

// Цветовая палитра
const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  orange: '#f97316',
  emerald: '#10b981',
}

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger,
  COLORS.info, COLORS.pink, COLORS.cyan, COLORS.orange, COLORS.emerald
]

interface ChartProps {
  data: Record<string, unknown>[]
  language: 'ru' | 'en'
}

// ==================== КАСТОМНЫЙ TOOLTIP ====================
// Tooltip, который показывает данные в порядке dataKeys (соответствует порядку цветов на графике)
function CustomTooltip({ 
  active, 
  payload, 
  label, 
  dataKeys 
}: { 
  active?: boolean
  payload?: Array<{ dataKey: string; name: string; value: number; color: string }>
  label?: string
  dataKeys: { key: string; color?: string; name?: string }[]
}) {
  if (!active || !payload || !payload.length) return null
  
  // Создаём карту значений по ключу
  const valueMap = new Map(payload.map(p => [p.dataKey, p]))
  
  // Показываем в порядке dataKeys
  const orderedItems = dataKeys
    .map(dk => {
      const item = valueMap.get(dk.key)
      if (!item) return null
      return {
        name: dk.name || item.name,
        value: item.value,
        color: dk.color || item.color
      }
    })
    .filter(Boolean) as Array<{ name: string; value: number; color: string }>
  
  // Вычисляем общую сумму для процентов
  const total = orderedItems.reduce((sum, item) => sum + (item.value || 0), 0)
  
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium mb-2">{label}</p>
      {orderedItems.map((entry, index) => {
        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0
        return (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toLocaleString('ru-RU')} ({percent}%)
          </p>
        )
      })}
    </div>
  )
}

// ==================== КРУГОВАЯ ДИАГРАММА ====================
export function PieChartWidget({ data, dataKey = 'value', nameKey = 'name', height = 300 }: {
  data: Record<string, unknown>[]
  dataKey?: string
  nameKey?: string
  height?: number
  showLegend?: boolean
}) {
  const language = useSettingsStore((s) => s.language)
  
  const total = data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0)
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => {
            const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0
            return `${value.toLocaleString('ru-RU')} (${percent}%)`
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ==================== СТОЛБЧАТАЯ ДИАГРАММА ====================
export function BarChartWidget({ data, dataKeys, xKey = 'name', height = 300, stacked = false }: {
  data: Record<string, unknown>[]
  dataKeys: { key: string; color?: string; name?: string }[]
  xKey?: string
  height?: number
  stacked?: boolean
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip dataKeys={dataKeys} />} />
        <Legend />
        {dataKeys.map((dk, index) => (
          <Bar 
            key={dk.key}
            dataKey={dk.key}
            name={dk.name || dk.key}
            fill={dk.color || CHART_COLORS[index % CHART_COLORS.length]}
            stackId={stacked ? 'stack' : undefined}
            radius={stacked ? undefined : [4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// ==================== ЛИНЕЙНЫЙ ГРАФИК ====================
export function LineChartWidget({ data, dataKeys, xKey = 'name', height = 300 }: {
  data: Record<string, unknown>[]
  dataKeys: { key: string; color?: string; name?: string }[]
  xKey?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip dataKeys={dataKeys} />} />
        <Legend />
        {dataKeys.map((dk, index) => (
          <Line
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            name={dk.name || dk.key}
            stroke={dk.color || CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            dot={{ fill: dk.color || CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// ==================== ПЛОЩАДНОЙ ГРАФИК ====================
export function AreaChartWidget({ data, dataKeys, tooltipDataKeys, xKey = 'name', height =300, stacked = false }: {
 data: Record<string, unknown>[]
 dataKeys: { key: string; color?: string; name?: string }[]
 tooltipDataKeys?: { key: string; color?: string; name?: string }[]
 xKey?: string
 height?: number
 stacked?: boolean
}) {
 const defaultTooltipDataKeys = stacked ? [...dataKeys].reverse() : dataKeys

 return (
 <ResponsiveContainer width="100%" height={height}>
 <AreaChart data={data} margin={{ top:20, right:30, left:20, bottom:5 }}>
 <CartesianGrid strokeDasharray="33" stroke="#374151" />
 <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize:12 }} interval={0} angle={-45} textAnchor="end" height={60} />
 <YAxis tick={{ fill: '#9ca3af', fontSize:12 }} />
 <Tooltip content={<CustomTooltip dataKeys={tooltipDataKeys || defaultTooltipDataKeys} />} />
 <Legend />
        {dataKeys.map((dk, index) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            name={dk.name || dk.key}
            stroke={dk.color || CHART_COLORS[index % CHART_COLORS.length]}
            fill={dk.color || CHART_COLORS[index % CHART_COLORS.length]}
            fillOpacity={0.3}
            stackId={stacked ? 'stack' : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ==================== РАДИАЛЬНАЯ ДИАГРАММА ====================
export function RadialBarWidget({ data, dataKey = 'value', height = 300 }: {
  data: Record<string, unknown>[]
  dataKey?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="20%" 
        outerRadius="90%" 
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background
          dataKey={dataKey}
          cornerRadius={10}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </RadialBar>
        <Tooltip />
        <Legend />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

// ==================== КОМБИНИРОВАННЫЙ ГРАФИК ====================
export function ComposedChartWidget({ data, bars, lines, areas, xKey = 'name', height = 300 }: {
  data: Record<string, unknown>[]
  bars?: { key: string; color?: string; name?: string }[]
  lines?: { key: string; color?: string; name?: string }[]
  areas?: { key: string; color?: string; name?: string }[]
  xKey?: string
  height?: number
}) {
  // Собираем все dataKeys в порядке отображения
  const allDataKeys = [
    ...(areas || []).map((a, i) => ({ ...a, color: a.color || CHART_COLORS[i] })),
    ...(bars || []).map((b, i) => ({ ...b, color: b.color || CHART_COLORS[(areas?.length || 0) + i] })),
    ...(lines || []).map((l, i) => ({ ...l, color: l.color || CHART_COLORS[(areas?.length || 0) + (bars?.length || 0) + i] })),
  ]
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip dataKeys={allDataKeys} />} />
        <Legend />
        {areas?.map((a, i) => (
          <Area key={a.key} type="monotone" dataKey={a.key} name={a.name} fill={a.color || CHART_COLORS[i]} stroke={a.color || CHART_COLORS[i]} fillOpacity={0.3} />
        ))}
        {bars?.map((b, i) => (
          <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color || CHART_COLORS[bars.length + i]} radius={[4, 4, 0, 0]} />
        ))}
        {lines?.map((l, i) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color || CHART_COLORS[(bars?.length || 0) + (areas?.length || 0) + i]} strokeWidth={2} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// ==================== ПРОГРЕСС-БАРЫ ====================
export function ProgressBarsWidget({ data, valueKey = 'value', labelKey = 'label', maxValue }: {
  data: { label: string; value: number; color?: string }[]
  valueKey?: string
  labelKey?: string
  maxValue?: number
}) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted">{item.label}</span>
              <span className="font-medium">{item.value.toLocaleString('ru-RU')}</span>
            </div>
            <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: item.color || CHART_COLORS[index % CHART_COLORS.length]
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ==================== КРУГОВОЙ ПРОГРЕСС С ГРАДИЕНТОМ ====================

// Ключевые точки градиента (5 цветов)
const GRADIENT_COLORS = [
  '#22c55e',  // зелёный
  '#3b82f6',  // синий
  '#a855f7',  // фиолетовый
  '#ec4899',  // розовый
  '#f97316',  // оранжевый
  '#eab308',  // жёлтый
]

// Интерполяция между двумя цветами
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)
  
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Получить цвет по значению относительно максимума (0-maxValue)
function getProgressColor(value: number, maxValue: number): string {
  const clampedValue = Math.min(Math.max(value, 0), maxValue)
  const percentage = (clampedValue / maxValue) * 100 // 0-100%
  
  // Распределяем 6 цветов по диапазону
  const colorCount = GRADIENT_COLORS.length - 1
  const position = (percentage / 100) * colorCount
  const colorIndex = Math.floor(position)
  const factor = position - colorIndex
  
  if (colorIndex >= colorCount) {
    return GRADIENT_COLORS[GRADIENT_COLORS.length - 1]
  }
  
  return interpolateColor(GRADIENT_COLORS[colorIndex], GRADIENT_COLORS[colorIndex + 1], factor)
}

export function CircularProgressWidget({ value, maxValue = 100, label, color, size = 120 }: {
  value: number
  maxValue?: number
  label?: string
  color?: string
  size?: number
}) {
  // Заполнение круга = остаток от деления на 100
  const fillPercentage = value % 100
  
  const radius = (size - 10) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (fillPercentage / 100) * circumference
  
  // Цвет вычисляется на основе значения относительно maxValue
  const progressColor = color || getProgressColor(value, maxValue)
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={8}
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={8}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{value.toFixed(1)}%</span>
        </div>
      </div>
      {label && <span className="text-sm text-muted mt-2">{label}</span>}
    </div>
  )
}

// ==================== СТатистические карточки ====================
export function StatsCardsWidget({ stats }: {
  stats: { label: string; value: string | number; change?: number; icon?: React.ReactNode }[]
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-4">
          <div className="text-sm text-muted mb-1">{stat.label}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
          {stat.change !== undefined && (
            <div className={`text-xs mt-1 ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ==================== DONUT CHART ====================
export function DonutChartWidget({ data, dataKey = 'value', nameKey = 'name', height = 300, centerLabel, centerValue }: {
  data: Record<string, unknown>[]
  dataKey?: string
  nameKey?: string
  height?: number
  centerLabel?: string
  centerValue?: string | number
}) {
  const total = data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0)
  
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => {
              const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0
              return `${value.toLocaleString('ru-RU')} (${percent}%)`
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div className="text-center">
            {centerValue && <div className="text-2xl font-bold">{centerValue}</div>}
            {centerLabel && <div className="text-sm text-muted">{centerLabel}</div>}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SCATTER CHART ====================
export function ScatterChartWidget({ data, xKey = 'x', yKey = 'y', height = 300 }: {
  data: Record<string, unknown>[]
  xKey?: string
  yKey?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <YAxis dataKey={yKey} tick={{ fill: '#9ca3af', fontSize: 12 }} />
        <Tooltip />
        <Scatter data={data} fill={COLORS.primary}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// ==================== FUNNEL CHART ====================
export function FunnelChartWidget({ data, dataKey = 'value', nameKey = 'name', height = 300 }: {
  data: Record<string, unknown>[]
  dataKey?: string
  nameKey?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <FunnelChart>
        <Tooltip />
        <Funnel
          dataKey={dataKey}
          data={data}
          isAnimationActive
        >
          <LabelList position="right" fill="#f3f4f6" stroke="none" dataKey={nameKey} />
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  )
}

// ==================== TREEMAP ====================
export function TreemapWidget({ data, dataKey = 'value', nameKey = 'name', height = 300 }: {
  data: Record<string, unknown>[]
  dataKey?: string
  nameKey?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        stroke="#1f2937"
        fill={COLORS.primary}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Treemap>
    </ResponsiveContainer>
  )
}

// ==================== GAUGE CHART (полукруглый датчик) ====================
export function GaugeChartWidget({ value, maxValue = 100, label, segments = 5, height = 200 }: {
  value: number
  maxValue?: number
  label?: string
  segments?: number
  height?: number
}) {
  const percentage = (value / maxValue) * 100
  const segmentData = Array.from({ length: segments }, (_, i) => ({
    name: `Segment ${i + 1}`,
    value: 100 / segments,
    fill: CHART_COLORS[i % CHART_COLORS.length]
  }))

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={segmentData}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
          >
            {segmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} opacity={index< Math.ceil(percentage / (100 / segments)) ? 1 : 0.3} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-end justify-center pb-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{value.toLocaleString('ru-RU')}</div>
          {label && <div className="text-sm text-muted">{label}</div>}
        </div>
      </div>
    </div>
  )
}

// ==================== HORIZONTAL BAR ====================
export function HorizontalBarWidget({ data, valueKey = 'value', labelKey = 'label', height, showValues = true, maxValue, minBarWidth = 2 }: {
  data: { label: string; value: number; color?: string }[]
  valueKey?: string
  labelKey?: string
  height?: number
  showValues?: boolean
  maxValue?: number
  minBarWidth?: number
}) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <div className="space-y-2" style={{ height }}>
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100
        const barWidth = Math.max(percentage, minBarWidth)
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm text-muted shrink-0">{item.label}</div>
            <div className="flex-1 h-6 bg-muted/20 rounded overflow-hidden">
              <div 
                className="h-full rounded transition-all duration-500"
                style={{ 
                  width: `${barWidth}%`,
                  backgroundColor: item.color || CHART_COLORS[index % CHART_COLORS.length]
                }}
              />
            </div>
            {showValues && (
              <span className="text-xs font-medium w-20 text-right">{item.value.toFixed(2)}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ==================== COMPARISON BARS (сравнение двух значений) ====================
export function ComparisonBarsWidget({ items, height = 200 }: {
  items: { label: string; value1: number; value2: number; label1?: string; label2?: string }[]
  height?: number
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const max = Math.max(item.value1, item.value2)
        const pct1 = (item.value1 / max) * 100
        const pct2 = (item.value2 / max) * 100
        
        return (
          <div key={index} className="space-y-1">
            <div className="text-sm text-muted">{item.label}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex justify-end">
                <div 
                  className="h-5 rounded-l transition-all duration-500"
                  style={{ width: `${pct1}%`, backgroundColor: COLORS.primary }}
                />
              </div>
              <div className="w-20 text-center text-xs font-medium">
                {item.value1.toLocaleString('ru-RU')}
              </div>
              <div className="w-20 text-center text-xs font-medium">
                {item.value2.toLocaleString('ru-RU')}
              </div>
              <div className="flex-1">
                <div 
                  className="h-5 rounded-r transition-all duration-500"
                  style={{ width: `${pct2}%`, backgroundColor: COLORS.secondary }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { COLORS, CHART_COLORS }
