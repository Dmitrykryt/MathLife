import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favorites: string[]
  toggleFavorite: (calculatorId: string) => void
  addFavorite: (calculatorId: string) => void
  removeFavorite: (calculatorId: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (calculatorId) =>
        set((state) => ({
          favorites: state.favorites.includes(calculatorId)
            ? state.favorites.filter((id) => id !== calculatorId)
            : [...state.favorites, calculatorId],
        })),
      addFavorite: (calculatorId) =>
        set((state) => ({
          favorites: state.favorites.includes(calculatorId)
            ? state.favorites
            : [...state.favorites, calculatorId],
        })),
      removeFavorite: (calculatorId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== calculatorId),
        })),
    }),
    { name: 'mathlife-favorites' }
  )
)
