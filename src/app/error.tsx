'use client'

import { useSettingsStore } from '@/store/settingsStore'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const language = useSettingsStore((s) => s.language)

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-3">
          {language === 'ru' ? 'Что-то пошло не так' : 'Something went wrong'}
        </h1>
        <p className="text-muted mb-4">{error.message}</p>
        <button className="btn-primary" onClick={reset}>
          {language === 'ru' ? 'Попробовать снова' : 'Try again'}
        </button>
      </div>
    </main>
  )
}
