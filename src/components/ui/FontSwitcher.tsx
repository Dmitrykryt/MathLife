'use client'

import { useSettingsStore } from '@/store/settingsStore'
import { fonts } from '@/constants/fonts'
import { FontFamily } from '@/types'

export function FontSwitcher() {
  const font = useSettingsStore((s) => s.font)
  const setFont = useSettingsStore((s) => s.setFont)

  return (
    <select
      className="input max-w-[100px] text-sm"
      value={font}
      onChange={(e) => setFont(e.target.value as FontFamily)}
    >
      {fonts.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  )
}

