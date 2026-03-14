import { useHistoryStore } from '@/store/historyStore'

export function useCalculatorHistory(calculatorId: string) {
 return useHistoryStore((s) => s.history.filter((h) => h.calculatorId === calculatorId))
}
