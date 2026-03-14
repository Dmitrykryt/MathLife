declare module 'leo-profanity' {
  interface LeoProfanity {
    loadDictionary(lang: string): void
    check(text: string): boolean
    clean(text: string): string
    add(words: string[]): void
    remove(words: string[]): void
    list: string[]
  }

  const leoProfanity: LeoProfanity
  export default leoProfanity
}

declare module 'obscenity' {
  export class RegExpMatcher {
    constructor(config?: Record<string, unknown>)
    getAllMatches(text: string): Array<{ startIndex: number; endIndex: number; termId: number }>
    hasMatch(text: string): boolean
  }

  export class TextCensor {
    censorText(text: string): string
  }

  export const englishDataset: {
    build(): Record<string, unknown>
  }

  export const englishRecommendedTransformers: Record<string, unknown>
}
