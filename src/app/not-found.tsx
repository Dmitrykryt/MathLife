'use client'

import Link from 'next/link'
import { useSettingsStore } from '@/store/settingsStore'

export default function NotFound() {
  const language = useSettingsStore((s) => s.language)

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-muted mb-6">
          {language === 'ru' ? 'Страница не найдена' : 'Page not found'}
        </p>
        <Link href="/" className="btn-primary">
          {language === 'ru' ? 'На главную' : 'Go home'}
        </Link>
      </div>
    </main>
  )
}
