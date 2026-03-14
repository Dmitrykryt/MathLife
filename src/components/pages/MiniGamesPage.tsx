'use client'

import { QuickMathGame } from '@/components/games/QuickMathGame'
import { GuessNumberGame } from '@/components/games/GuessNumberGame'
import { NicknameSelector } from '@/components/games/NicknameSelector'
import { useSettingsStore } from '@/store/settingsStore'
import { t } from '@/i18n'

export function MiniGamesPage() {
  const language = useSettingsStore((s) => s.language)

  return (
    <main className="container-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {t(language, 'games.title')}
        </h1>
      </div>
      
      {/* Поле выбора ника на всю ширину */}
      <div className="mb-6">
        <NicknameSelector />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickMathGame />
        <GuessNumberGame />
      </div>
    </main>
  )
}
