import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { CalculationHistory } from '@/types'

interface HistoryState {
  history: CalculationHistory[]
  addHistoryItem: (payload: Omit<CalculationHistory, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  removeHistoryItem: (id: string) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistoryItem: (payload) =>
        set((state) => ({
          history: [
            {
              id: uuidv4(),
              timestamp: new Date(),
              ...payload,
            },
            ...state.history,
          ].slice(0, 20),
        })),
      clearHistory: () => set({ history: [] }),
      removeHistoryItem: (id) => set((state) => ({ history: state.history.filter((h) => h.id !== id) })),
    }),
    { name: 'mathlife-history' }
  )
)
