'use client'

import { themes } from '@/constants/themes'
import { useSettingsStore } from '@/store/settingsStore'

export function ThemeSwitcher() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  return (
    <select className="input max-w-[170px]" value={theme} onChange={(e) => setTheme(e.target.value as keyof typeof themes)}>
      {Object.keys(themes).map((key) => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </select>
  )
}
