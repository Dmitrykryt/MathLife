'use client'

import { realLifeCalculators } from '@/constants/realLifeCalculators'
import { useFavoritesStore } from '@/store/favoritesStore'
import { CalculatorGrid } from '@/components/calculators/shared/CalculatorGrid'
import { useSettingsStore } from '@/store/settingsStore'
import { t } from '@/i18n'
import { Calculator } from '@/types'

export function FavoritesSection() {
  const favorites = useFavoritesStore((s) => s.favorites)
  const language = useSettingsStore((s) => s.language)
  const favCalculators = realLifeCalculators.filter((c: Calculator) => favorites.includes(c.id))

  if (!favCalculators.length) return null

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        {t(language, 'common.favorites')}
      </h2>
      <CalculatorGrid calculators={favCalculators} />
    </section>
  )
}
