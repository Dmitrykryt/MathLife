'use client'

import { useState, useCallback, useMemo } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useSettingsStore } from '@/store/settingsStore'
import { t } from '@/i18n'

type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTY_CONFIG = {
  easy: { min: 1, max: 100 },
  medium: { min: 1, max: 500 },
  hard: { min: 1, max: 1000 },
}

interface Hint {
  guess: number
  direction: 'higher' | 'lower' | 'correct'
}

export function GuessNumberGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [target, setTarget] = useState(0)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [hints, setHints] = useState<Hint[]>([])
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState<Difficulty | 'all'>('all')

  const addScore = useGameStore((s) => s.addScore)
  const scores = useGameStore((s) => s.scores)
  const currentPlayerName = useGameStore((s) => s.currentPlayerName)
  const language = useSettingsStore((s) => s.language)

  // Топ по счёту (один игрок = одна строка с лучшим результатом)
  const topByScore = useMemo(() => {
    let filtered = scores.filter((s) => s.game === 'guess-number')
    if (leaderboardDifficulty !== 'all') {
      filtered = filtered.filter((s) => s.difficulty === leaderboardDifficulty)
    }
    // Группируем по имени и берём лучший результат
    const bestByPlayer = new Map<string, typeof filtered[0]>()
    filtered.forEach((s) => {
      const existing = bestByPlayer.get(s.playerName)
      if (!existing || s.score > existing.score) {
        bestByPlayer.set(s.playerName, s)
      }
    })
    return [...bestByPlayer.values()].sort((a, b) => b.score - a.score).slice(0, 5)
  }, [scores, leaderboardDifficulty])

  // Топ по попыткам (один игрок = одна строка с минимумом попыток)
  const topByAttempts = useMemo(() => {
    let filtered = scores.filter((s) => s.game === 'guess-number' && s.attempts && s.attempts > 0)
    if (leaderboardDifficulty !== 'all') {
      filtered = filtered.filter((s) => s.difficulty === leaderboardDifficulty)
    }
    // Группируем по имени и берём минимум попыток
    const bestByPlayer = new Map<string, typeof filtered[0]>()
    filtered.forEach((s) => {
      const existing = bestByPlayer.get(s.playerName)
      if (!existing || (s.attempts || 999) < (existing.attempts || 999)) {
        bestByPlayer.set(s.playerName, s)
      }
    })
    return [...bestByPlayer.values()].sort((a, b) => (a.attempts || 999) - (b.attempts || 999)).slice(0, 5)
  }, [scores, leaderboardDifficulty])

  const config = DIFFICULTY_CONFIG[difficulty]

  const generateTarget = useCallback(() => {
    return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min
  }, [config])

  const startGame = useCallback(() => {
    if (!currentPlayerName) return
    setTarget(generateTarget())
    setGameState('playing')
    setAttempts(0)
    setHints([])
    setGuess('')
  }, [generateTarget, currentPlayerName])

  const handleGuess = useCallback(() => {
    const n = Number(guess)
    if (!Number.isFinite(n)) return

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let direction: Hint['direction']
    if (n === target) {
      direction = 'correct'
      setGameState('won')

      const score = Math.max(1000 - newAttempts * 10, 100)
      if (currentPlayerName) {
        addScore({ 
          game: 'guess-number', 
          score, 
          playerName: currentPlayerName,
          difficulty,
          attempts: newAttempts
        })
      }
    } else if (n < target) {
      direction = 'higher'
    } else {
      direction = 'lower'
    }

    setHints((h) => [...h, { guess: n, direction }].slice(-10))
    setGuess('')
  }, [guess, target, attempts, currentPlayerName, addScore, difficulty])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && guess.trim()) {
      handleGuess()
    }
  }

  const getDifficultyLabel = (d: Difficulty) => {
    const key = `games.${d}` as const
    return t(language, key)
  }

  const getDifficultyBadge = (d: Difficulty) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-500',
      medium: 'bg-yellow-500/20 text-yellow-500',
      hard: 'bg-red-500/20 text-red-500'
    }
    return colors[d]
  }

  if (gameState === 'idle') {
    return (
      <div className="glass-card space-y-4">
        <h2 className="text-2xl font-bold">{t(language, 'games.guessNumber')}</h2>
        <p className="text-muted">{t(language, 'games.guessNumberDesc')}</p>

        <div className="space-y-2">
          <label className="block text-sm text-muted">{t(language, 'games.range')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 rounded-lg border transition ${difficulty === d ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'}`}>
                {DIFFICULTY_CONFIG[d].min}-{DIFFICULTY_CONFIG[d].max}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn-primary w-full text-lg py-3" 
          onClick={startGame}
          disabled={!currentPlayerName}
        >
          {t(language, 'games.startGame')}
        </button>

        {/* Таблица лидеров - всегда показываем */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted">{t(language, 'games.topScores')}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setLeaderboardDifficulty('all')}
                className={`px-2 py-1 text-xs rounded transition ${
                  leaderboardDifficulty === 'all' ? 'bg-primary text-white' : 'bg-muted/20 hover:bg-muted/30'
                }`}
              >
                {language === 'ru' ? 'Все' : 'All'}
              </button>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setLeaderboardDifficulty(d)}
                  className={`px-2 py-1 text-xs rounded transition ${
                    leaderboardDifficulty === d ? 'bg-primary text-white' : 'bg-muted/20 hover:bg-muted/30'
                  }`}
                >
                  {DIFFICULTY_CONFIG[d].min}-{DIFFICULTY_CONFIG[d].max}
                </button>
              ))}
            </div>
          </div>
          
          {topByScore.length === 0 && topByAttempts.length === 0 ? (
            <div className="text-center py-6 text-muted">
              <p className="text-2xl mb-2">🎯</p>
              <p className="text-sm">
                {language === 'ru' 
                  ? 'На данный момент нет результатов' 
                  : 'No results at the moment'}
              </p>
              <p className="text-xs mt-1 text-muted/60">
                {language === 'ru' 
                  ? 'Станьте первым!' 
                  : 'Be the first!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Топ по счёту */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-primary flex items-center gap-1">
                  🏆 {language === 'ru' ? 'По счёту' : 'By Score'}
                </h4>
                <div className="space-y-1">
                  {topByScore.length > 0 ? topByScore.map((s, i) => (
                    <div key={s.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-4 text-muted text-xs">{i + 1}.</span>
                        <span className="truncate max-w-[60px]">{s.playerName}</span>
                      </div>
                      <span className="font-mono font-medium text-primary">{s.score}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-muted py-2">
                      {language === 'ru' ? 'Пока пусто' : 'Empty'}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Топ по попыткам */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-green-500 flex items-center gap-1">
                  🎯 {language === 'ru' ? 'По попыткам' : 'By Attempts'}
                </h4>
                <div className="space-y-1">
                  {topByAttempts.length > 0 ? topByAttempts.map((s, i) => (
                    <div key={s.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-4 text-muted text-xs">{i + 1}.</span>
                        <span className="truncate max-w-[60px]">{s.playerName}</span>
                      </div>
                      <span className="font-mono font-medium text-green-500">{s.attempts}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-muted py-2">
                      {language === 'ru' ? 'Пока пусто' : 'Empty'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (gameState === 'won') {
    return (
      <div className="glass-card space-y-4 text-center">
        <h2 className="text-2xl font-bold">{t(language, 'games.youWon')}</h2>

        <div className="p-6 rounded-lg bg-green-500/20">
          <p className="text-4xl font-bold mb-2">{target}</p>
          <p className="text-muted">{attempts} {attempts === 1 ? (language === 'ru' ? 'попытку' : 'attempt') : (language === 'ru' ? 'попыток' : 'attempts')}</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/20">
          <p className="text-sm text-muted">{t(language, 'games.score')}</p>
          <p className="text-3xl font-bold text-primary">{Math.max(1000 - attempts * 10, 100)}</p>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-sm ${getDifficultyBadge(difficulty)}`}>
          {getDifficultyLabel(difficulty)} ({config.min}-{config.max})
        </div>

        <button className="btn-primary w-full" onClick={startGame}>{t(language, 'games.playAgain')}</button>
        <button className="w-full text-sm text-muted hover:text-primary" onClick={() => setGameState('idle')}>{t(language, 'games.backToMenu')}</button>
      </div>
    )
  }

  return (
    <div className="glass-card space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t(language, 'games.guessNumber')}</h2>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded ${getDifficultyBadge(difficulty)}`}>
            {config.min}-{config.max}
          </span>
          <span className="text-sm text-muted">{t(language, 'games.attempts')}: {attempts}</span>
        </div>
      </div>

      <p className="text-center text-muted">{t(language, 'games.range')}: {config.min} - {config.max}</p>

      <div className="flex gap-2">
        <input type="number" className="input flex-1 text-xl text-center" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={handleKeyDown} placeholder="?" min={config.min} max={config.max} autoFocus />
        <button className="btn-primary px-6" onClick={handleGuess} disabled={!guess.trim()}>{t(language, 'games.check')}</button>
      </div>

      {hints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted">{t(language, 'games.hints')}</h3>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {hints.map((h, i) => (
              <div key={i} className={`flex justify-between text-sm p-2 rounded ${h.direction === 'correct' ? 'bg-green-500/20 text-green-500' : 'bg-muted/20'}`}>
                <span>{h.guess}</span>
                <span>{h.direction === 'correct' ? '✓' : h.direction === 'higher' ? t(language, 'games.higher') : t(language, 'games.lower')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
