import ru from './ru.json'
import en from './en.json'
import { Locale } from '@/types'

export type Translations = typeof ru

const translations: Record<Locale, Translations> = {
  ru,
  en,
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.ru
}

// Helper function to get nested translation by path
export function t(locale: Locale, path: string): string {
  const dict = getTranslations(locale)
  const keys = path.split('.')
  
  let result: unknown = dict
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path // Return path if not found
    }
  }
  
  return typeof result === 'string' ? result : path
}

// Get translated calculator name by id
export function getCalculatorName(locale: Locale, calculatorId: string): string {
  const name = t(locale, `calculatorNames.${calculatorId}`)
  return name !== `calculatorNames.${calculatorId}` ? name : calculatorId
}

// Get translated calculator description by id
export function getCalculatorDescription(locale: Locale, calculatorId: string): string {
  const desc = t(locale, `calculatorDescriptions.${calculatorId}`)
  return desc !== `calculatorDescriptions.${calculatorId}` ? desc : ''
}

// Get translated tag
export function getTagTranslation(locale: Locale, tag: string): string {
  const translated = t(locale, `tags.${tag}`)
  return translated !== `tags.${tag}` ? translated : tag
}
