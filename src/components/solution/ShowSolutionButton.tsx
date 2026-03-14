'use client'

import { useSettingsStore } from '@/store/settingsStore'

interface Props {
  onClick: () => void
  isShowing: boolean
}

export function ShowSolutionButton({ onClick, isShowing }: Props) {
  const language = useSettingsStore((s) => s.language)

  return (
    <button
      className="btn-primary flex items-center gap-2"
      onClick={onClick}
    >
      <span>{isShowing ? '📋' : '🔍'}</span>
      {isShowing
        ? (language === 'ru' ? 'Скрыть решение' : 'Hide solution')
        : (language === 'ru' ? 'Показать решение' : 'Show solution')
      }
    </button>
  )
}
