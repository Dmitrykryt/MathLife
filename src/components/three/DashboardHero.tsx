'use client'

import { Interactive3DObject } from '@/components/three/Interactive3DObject'
import { ParticleBackground } from '@/components/three/ParticleBackground'
import { useSettingsStore } from '@/store/settingsStore'
import { t } from '@/i18n'

export function DashboardHero() {
  const language = useSettingsStore((s) => s.language)

  return (
    <section className="glass-card relative overflow-hidden min-h-[320px]">
      <ParticleBackground />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">{t(language, 'app.name')}</h1>
          <p className="text-muted text-lg">
            {t(language, 'home.aboutDescription')}
          </p>
        </div>
        <Interactive3DObject />
      </div>
    </section>
  )
}
