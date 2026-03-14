'use client'

import { useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useSettingsStore } from '@/store/settingsStore'
import { themes } from '@/constants/themes'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore()

  useEffect(() => {
    const current = themes[theme]
    const root = document.documentElement

    root.style.setProperty('--color-primary', current.primary)
    root.style.setProperty('--color-secondary', current.secondary)
    root.style.setProperty('--color-accent', current.accent)
    root.style.setProperty('--color-background', current.background)
    root.style.setProperty('--color-surface', current.surface)
    root.style.setProperty('--color-text', current.text)
    root.style.setProperty('--color-muted', current.muted)
    root.style.setProperty('--color-border', current.border)
  }, [theme])

  return <AppShell>{children}</AppShell>
}
