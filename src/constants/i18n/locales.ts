export const locales = ['ru', 'en'] as const
export type AppLocale = (typeof locales)[number]
