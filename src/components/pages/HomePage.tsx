'use client'

import { realLifeCalculators } from '@/constants/realLifeCalculators'
import { DashboardHero } from '@/components/three/DashboardHero'
import { SmartSearch } from '@/components/search/SmartSearch'
import { CalculatorGrid } from '@/components/calculators/shared/CalculatorGrid'
import { FavoritesSection } from '@/components/pages/sections/FavoritesSection'
import { useSettingsStore } from '@/store/settingsStore'
import { t } from '@/i18n'

export function HomePage() {
  const language = useSettingsStore((s) => s.language)

  return (
    <main className="container-page space-y-8">
      <DashboardHero />
      <SmartSearch />
      <FavoritesSection />

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {t(language, 'home.popularCalculators')}
        </h2>
        <CalculatorGrid calculators={realLifeCalculators.slice(0, 12)} />
      </section>

      <section className="glass-card">
        <h2 className="text-xl font-semibold mb-3">
          {t(language, 'home.aboutPlatform')}
        </h2>
        <p className="text-muted leading-relaxed">
          {t(language, 'home.aboutDescription')}
        </p>
      </section>
    </main>
  )
}

