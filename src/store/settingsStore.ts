import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FontFamily, Locale, ThemeName, UserSettings } from '@/types'
import { defaultTheme } from '@/constants/themes'
import { defaultFont } from '@/constants/fonts'

interface SettingsState extends UserSettings {
  setTheme: (theme: ThemeName) => void
  setFont: (font: FontFamily) => void
  setLanguage: (language: Locale) => void
  setParticlesEnabled: (enabled: boolean) => void
  setAnimationsEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      font: defaultFont,
      fontSize: 16,
      language: 'ru',
      animationsEnabled: true,
      particlesEnabled: true,
      autoCalculate: false,
      precision: 6,
      scientificNotation: false,

      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setLanguage: (language) => set({ language }),
      setParticlesEnabled: (particlesEnabled) => set({ particlesEnabled }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
    }),
    { name: 'mathlife-settings' }
  )
)
