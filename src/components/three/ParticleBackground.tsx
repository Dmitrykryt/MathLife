'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

export function ParticleBackground() {
  const enabled = useSettingsStore((s) => s.particlesEnabled)
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const particles = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }))
  }, [mounted])

  if (!enabled || !mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-primary/30 ${animationsEnabled ? 'animate-pulse' : ''}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
    </div>
  )
}
