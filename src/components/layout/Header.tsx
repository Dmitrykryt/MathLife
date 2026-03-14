'use client'

import Link from 'next/link'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          MathLife
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

