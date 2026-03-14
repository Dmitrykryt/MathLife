import { create } from 'zustand'

interface VisualState {
  lastResultValue: number
  setLastResultValue: (value: number) => void
}

export const useVisualStore = create<VisualState>((set) => ({
  lastResultValue: 0,
  setLastResultValue: (lastResultValue) => set({ lastResultValue }),
}))
