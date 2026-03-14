'use client'

import { useMemo } from 'react'
import { useVisualStore } from '@/store/visualStore'
import { useSettingsStore } from '@/store/settingsStore'

// Temporary fallback - React Three Fiber has compatibility issues with Next.js 15
// TODO: Update @react-three/fiber when compatible version is available

export function Interactive3DObject() {
  const value = useVisualStore((s) => s.lastResultValue)
  const language = useSettingsStore((s) => s.language)
  const scale = useMemo(() => Math.max(0.8, Math.min(1.4, 1 + Math.abs(value % 100) / 250)), [value])
  const hue = useMemo(() => Math.floor(Math.abs(value * 7) % 360), [value])
  const rotation = useMemo(() => value % 360, [value])

  return (
    <div className="h-80 w-full rounded-2xl border border-border bg-black/5 relative overflow-hidden grid place-items-center">
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          background: `conic-gradient(from 90deg, hsl(${hue}, 90%, 60%), hsl(${(hue + 120) % 360}, 90%, 60%), hsl(${(hue + 240) % 360}, 90%, 60%))`,
        }}
        className="w-40 h-40 rounded-[30%] shadow-2xl transition-all duration-500"
      />
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-muted opacity-50">
          {language === 'ru' ? 'Визуализация результата' : 'Visualizing Result State'}
        </p>
        <p className="text-xs text-muted mt-1">
          {language === 'ru' ? 'Значение' : 'Value'}: {value.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
