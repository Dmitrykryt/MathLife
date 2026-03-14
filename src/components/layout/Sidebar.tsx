'use client'

import Link from 'next/link'
import { realLifeCategoryLabels } from '@/constants/realLifeCalculators'
import { useSettingsStore } from '@/store/settingsStore'
import { useGameStore } from '@/store/gameStore'
import { getTranslations, t } from '@/i18n'

const DEVELOPER_DEVICE_IDS = [
  'device-mmm2qhrf-frg5i7sox',
]

export function Sidebar() {
  const language = useSettingsStore((s) => s.language)
  const deviceId = useGameStore((s) => s.deviceId)
  const getDeviceId = useGameStore((s) => s.getDeviceId)
  const currentDeviceId = deviceId || getDeviceId()
  const isDeveloper = DEVELOPER_DEVICE_IDS.includes(currentDeviceId)

  return (
    <aside className="hidden lg:block w-64 border-r border-border min-h-[calc(100vh-73px)] sticky top-[73px] p-4">
      <nav className="space-y-2">
        <Link href="/" className="block glass-card">
          {t(language, 'nav.dashboard')}
        </Link>
        <Link href="/games" className="block glass-card">
          {t(language, 'nav.miniGames')}
        </Link>
        {Object.entries(realLifeCategoryLabels).map(([key, label]) => (
          <Link key={key} href={`/categories/${key}`} className="block glass-card">
            {language === 'ru' ? label.ru : label.en}
          </Link>
        ))}
        {isDeveloper && (
          <Link href="/dev" className="block glass-card bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-purple-400">Dev</span>
            </span>
          </Link>
        )}
      </nav>
    </aside>
  )
}


