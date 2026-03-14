import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isNicknameAllowed } from '@/lib/forbiddenWordsFilter'

export interface GameScore {
  id: string
  game: 'quick-math' | 'guess-number'
  score: number
  timestamp: Date
  playerName: string
  difficulty: 'easy' | 'medium' | 'hard'
  attempts?: number // для guess-number
  streak?: number // для quick-math
  deviceId: string // ID устройства игрока
}

type Difficulty = 'easy' | 'medium' | 'hard'

interface GameState {
  scores: GameScore[]
  deviceId: string // Уникальный ID устройства
  currentPlayerName: string | null // Ник текущего игрока
  addScore: (score: Omit<GameScore, 'id' | 'timestamp' | 'deviceId'>) => void
  getTopScores: (game: GameScore['game'], difficulty?: Difficulty, limit?: number) => GameScore[]
  getAllTopScores: (game: GameScore['game'], limit?: number) => GameScore[]
  clearScores: (game?: GameScore['game']) => void
  // Работа с ником
  setCurrentPlayerName: (name: string) => boolean // true если успешно
  clearCurrentPlayerName: () => void // Очистить ник текущего игрока
  isNameTaken: (name: string) => boolean
  getDeviceId: () => string
  hasPlayerName: () => boolean
  // Админ-функции (только для разработчиков)
  clearScoresByNickname: (nickname: string) => void // Удалить результаты по нику
  clearAllNicknames: () => void // Сбросить все ники
  removeNickname: (nickname: string) => void // Удалить конкретный ник
  getAllNicknames: () => string[] // Получить все ники
}

// Генерация уникального ID устройства
function generateDeviceId(): string {
  return 'device-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11)
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      scores: [],
      deviceId: '',
      currentPlayerName: null,

      getDeviceId: () => {
        let id = get().deviceId
        if (!id) {
          id = generateDeviceId()
          set({ deviceId: id })
        }
        return id
      },

      isNameTaken: (name) => {
        const deviceId = get().deviceId
        const normalizedName = name.trim().toLowerCase()
        
        // Проверяем все ники в таблице лидеров (кроме своих)
        const takenInScores = get().scores.some((s) => 
          s.playerName.toLowerCase() === normalizedName && s.deviceId !== deviceId
        )
        
        if (takenInScores) return true
        
        // Также проверяем currentPlayerName (если игрок ещё не играл, но уже сохранил ник)
        // Это проверяется через scores, но на всякий случай добавляем дополнительную проверку
        return false
      },

      setCurrentPlayerName: (name) => {
        const trimmedName = name.trim()
        if (!trimmedName) return false
        
        // Проверяем на запрещённые слова через ИИ-фильтр
        if (!isNicknameAllowed(trimmedName)) return false
        
        // Проверяем, не занят ли ник другим устройством (без учёта регистра)
        const deviceId = get().deviceId
        const currentName = get().currentPlayerName
        
        // Разрешаем смену регистра своего ника (Noname -> NoName)
        const isSameNameDifferentCase = currentName && 
          currentName.toLowerCase() === trimmedName.toLowerCase()
        
        if (!isSameNameDifferentCase && get().isNameTaken(trimmedName)) return false
        
        set({ currentPlayerName: trimmedName })
        
        // Обновляем все записи текущего устройства
        set((state) => ({
          scores: state.scores.map((s) => 
            s.deviceId === deviceId ? { ...s, playerName: trimmedName } : s
          )
        }))
        
        return true
      },

      hasPlayerName: () => {
        return !!get().currentPlayerName
      },

      clearCurrentPlayerName: () => {
        set({ currentPlayerName: null })
      },

      addScore: (score) => {
        const deviceId = get().deviceId || get().getDeviceId()
        const playerName = get().currentPlayerName || score.playerName
        
        const newScore: GameScore = {
          ...score,
          playerName,
          deviceId,
          id: `${score.game}-${score.difficulty}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: new Date(),
        }
        set((state) => ({
          scores: [...state.scores, newScore].sort((a, b) => b.score - a.score).slice(0, 150),
        }))
      },

      getTopScores: (game, difficulty, limit = 10) => {
        let filtered = get().scores.filter((s) => s.game === game)
        if (difficulty) {
          filtered = filtered.filter((s) => s.difficulty === difficulty)
        }
        return filtered.slice(0, limit)
      },

      getAllTopScores: (game, limit = 10) => {
        return get()
          .scores.filter((s) => s.game === game)
          .slice(0, limit)
      },

      clearScores: (game) => {
        set((state) => ({
          scores: game ? state.scores.filter((s) => s.game !== game) : [],
        }))
      },

      // Админ-функции
      clearScoresByNickname: (nickname) => {
        const normalized = nickname.trim().toLowerCase()
        set((state) => ({
          scores: state.scores.filter((s) => s.playerName.toLowerCase() !== normalized),
        }))
      },

      clearAllNicknames: () => {
        // Сбрасываем текущий ник
        set({ currentPlayerName: null })
        // Очищаем имена во всех записях
        set((state) => ({
          scores: state.scores.map((s) => ({ ...s, playerName: 'Unknown' })),
        }))
      },

      removeNickname: (nickname) => {
        const normalized = nickname.trim().toLowerCase()
        // Если это текущий ник игрока - сбрасываем
        const currentName = get().currentPlayerName
        if (currentName && currentName.toLowerCase() === normalized) {
          set({ currentPlayerName: null })
        }
        // Удаляем все записи с этим ником
        set((state) => ({
          scores: state.scores.filter((s) => s.playerName.toLowerCase() !== normalized),
        }))
      },

      getAllNicknames: () => {
        const nicknames = new Set<string>()
        get().scores.forEach((s) => {
          if (s.playerName && s.playerName !== 'Unknown') {
            nicknames.add(s.playerName)
          }
        })
        return Array.from(nicknames)
      },
    }),
    { 
      name: 'mathlife-games',
      // Миграция старых данных
      migrate: (persistedState, version) => {
        const state = persistedState as GameState
        
        // Если есть записи без deviceId, присваиваем им временный ID
        if (state?.scores?.length) {
          const tempDeviceId = 'legacy-' + Date.now().toString(36)
          const hasMissingDeviceId = state.scores.some((s: GameScore) => !s.deviceId)
          
          if (hasMissingDeviceId) {
            state.scores = state.scores.map((s: GameScore) => ({
              ...s,
              deviceId: s.deviceId || tempDeviceId
            }))
            
            // Берём имя первого игрока как текущее
            if (!state.currentPlayerName && state.scores[0]?.playerName) {
              state.currentPlayerName = state.scores[0].playerName
            }
            
            if (!state.deviceId) {
              state.deviceId = tempDeviceId
            }
          }
        }
        
        return state
      }
    }
  )
)
