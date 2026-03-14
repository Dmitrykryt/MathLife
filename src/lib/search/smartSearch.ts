import { realLifeCalculators } from '@/constants/realLifeCalculators'
import { Calculator } from '@/types'

export function smartSearch(query: string): Calculator[] {
 const q = query.toLowerCase().trim()
 if (!q) return []

 return realLifeCalculators
 .map((calc) => {
 let score = 0
 if (calc.name.toLowerCase().includes(q)) score += 6
 if (calc.description.toLowerCase().includes(q)) score += 3
 for (const k of calc.keywords) if (k.toLowerCase().includes(q)) score += 4
 return { calc, score }
 })
 .filter((x) => x.score > 0)
 .sort((a, b) => b.score - a.score)
 .map((x) => x.calc)
}

