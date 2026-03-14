'use client'

import { useMemo } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

interface Surface3DChartProps {
  expression?: string
  xRange?: [number, number]
  yRange?: [number, number]
  step?: number
}

export function Surface3DChart({ 
  expression = 'sin(x) * cos(y)', 
  xRange = [-5, 5], 
  yRange = [-5, 5],
  step = 0.5 
}: Surface3DChartProps) {
  const language = useSettingsStore((s) => s.language)

  // Generate surface points
  const surfaceData = useMemo(() => {
    const points: Array<{ x: number; y: number; z: number }> = []
    
    // Simple expression parser for basic math functions
    const evalExpr = (x: number, y: number): number => {
      try {
        // Replace common functions and variables
        let expr = expression
          .replace(/x/g, String(x))
          .replace(/y/g, String(y))
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/abs/g, 'Math.abs')
          .replace(/exp/g, 'Math.exp')
          .replace(/log/g, 'Math.log')
          .replace(/\^/g, '**')
        
        const result = eval(expr)
        return Number.isFinite(result) ? result : NaN
      } catch {
        return NaN
      }
    }

    for (let x = xRange[0]; x <= xRange[1]; x += step) {
      for (let y = yRange[0]; y <= yRange[1]; y += step) {
        const z = evalExpr(x, y)
        if (Number.isFinite(z) && Math.abs(z) < 100) {
          points.push({ x, y, z })
        }
      }
    }

    return points
  }, [expression, xRange, yRange, step])

  // Find min/max for color scaling
  const zRange = useMemo(() => {
    const values = surfaceData.map(p => p.z)
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [surfaceData])

  // Project 3D to 2D with rotation
  const projectedPoints = useMemo(() => {
    const angleX = 0.6 // tilt
    const angleZ = 0.8 // rotation
    const scale = 25
    const centerX = 200
    const centerY = 150

    return surfaceData.map(p => {
      // Apply rotation
      const cosZ = Math.cos(angleZ)
      const sinZ = Math.sin(angleZ)
      const cosX = Math.cos(angleX)
      const sinX = Math.sin(angleX)

      // Rotate around Z axis
      const x1 = p.x * cosZ - p.y * sinZ
      const y1 = p.x * sinZ + p.y * cosZ
      const z1 = p.z

      // Rotate around X axis (tilt)
      const y2 = y1 * cosX - z1 * sinX
      const z2 = y1 * sinX + z1 * cosX

      // Project to 2D
      const projX = centerX + x1 * scale
      const projY = centerY - y2 * scale - z2 * scale * 0.5

      return { ...p, projX, projY, depth: z2 }
    }).sort((a, b) => a.depth - b.depth) // Sort by depth for proper rendering
  }, [surfaceData])

  // Get color based on z value
  const getColor = (z: number) => {
    const normalized = (z - zRange.min) / (zRange.max - zRange.min || 1)
    const hue = 200 + normalized * 60 // Blue to cyan
    const lightness = 40 + normalized * 20
    return `hsl(${hue}, 70%, ${lightness}%)`
  }

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">
          {language === 'ru' ? '3D-поверхность' : '3D Surface'}
        </h3>
        <code className="text-xs text-muted bg-muted/20 px-2 py-1 rounded">
          z = {expression}
        </code>
      </div>
      
      <div className="relative bg-muted/10 rounded-lg overflow-hidden" style={{ height: '320px' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 320">
          {/* Grid lines */}
          <g stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3">
            {[0, 100, 200, 300, 400].map(x => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={320} />
            ))}
            {[0, 80, 160, 240, 320].map(y => (
              <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} />
            ))}
          </g>

          {/* Surface points */}
          {projectedPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.projX}
              cy={p.projY}
              r={3}
              fill={getColor(p.z)}
              opacity={0.8}
            />
          ))}
        </svg>

        {/* Axis labels */}
        <div className="absolute bottom-2 left-2 text-xs text-muted">X</div>
        <div className="absolute bottom-2 right-2 text-xs text-muted">Y</div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-muted">Z</div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-muted">
        <span>
          {language === 'ru' ? 'Точек:' : 'Points:'} {surfaceData.length}
        </span>
        <span>
          Z: [{zRange.min.toFixed(2)}, {zRange.max.toFixed(2)}]
        </span>
      </div>
    </div>
  )
}

