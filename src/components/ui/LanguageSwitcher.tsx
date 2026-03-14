'use client'

import { useSettingsStore } from '@/store/settingsStore'

export function LanguageSwitcher() {
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  return (
    <select className="input max-w-[100px]" value={language} onChange={(e) => setLanguage(e.target.value as 'ru' | 'en')}>
      <option value="ru">RU</option>
      <option value="en">EN</option>
    </select>
  )
}
