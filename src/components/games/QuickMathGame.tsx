'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useSettingsStore } from '@/store/settingsStore'
import { t } from '@/i18n'

type Difficulty = 'easy' | 'medium' | 'hard'
type Operation = '+' | '-' | '×' | '÷'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const DIFFICULTY_CONFIG = {
  easy: { maxNum: 10, timeLimit: 30, operations: ['+', '-'] as Operation[] },
  medium: { maxNum: 20, timeLimit: 45, operations: ['+', '-', '×'] as Operation[] },
  hard: { maxNum: 50, timeLimit: 60, operations: ['+', '-', '×', '÷'] as Operation[] },
}

export function QuickMathGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answer, setAnswer] = useState('')
  const [taskSeed, setTaskSeed] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [leaderboardDifficulty, setLeaderboardDifficulty] = useState<Difficulty | 'all'>('all')

  const addScore = useGameStore((s) => s.addScore)
  const scores = useGameStore((s) => s.scores)
  const currentPlayerName = useGameStore((s) => s.currentPlayerName)
  const language = useSettingsStore((s) => s.language)

  // Топ по счёту (один игрок = одна строка с лучшим результатом)
  const topByScore = useMemo(() => {
    let filtered = scores.filter((s) => s.game === 'quick-math')
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

  // Топ по серии (один игрок = одна строка с лучшей серией)
  const topByStreak = useMemo(() => {
    let filtered = scores.filter((s) => s.game === 'quick-math' && s.streak && s.streak > 0)
    if (leaderboardDifficulty !== 'all') {
      filtered = filtered.filter((s) => s.difficulty === leaderboardDifficulty)
    }
    // Группируем по имени и берём лучшую серию
    const bestByPlayer = new Map<string, typeof filtered[0]>()
    filtered.forEach((s) => {
      const existing = bestByPlayer.get(s.playerName)
      if (!existing || (s.streak || 0) > (existing.streak || 0)) {
        bestByPlayer.set(s.playerName, s)
      }
    })
    return [...bestByPlayer.values()].sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5)
  }, [scores, leaderboardDifficulty])

  const config = DIFFICULTY_CONFIG[difficulty]

  const task = useMemo(() => {
    const operations = DIFFICULTY_CONFIG[difficulty].operations
    const maxNum = DIFFICULTY_CONFIG[difficulty].maxNum
    const op = operations[randomInt(0, operations.length - 1)]
    let a: number, b: number, result: number

    switch (op) {
      case '+':
        a = randomInt(1, maxNum)
        b = randomInt(1, maxNum)
        result = a + b
        break
      case '-':
        a = randomInt(2, maxNum)
        // В сложном режиме возможны отрицательные ответы
        if (difficulty === 'hard') {
          b = randomInt(1, maxNum)  // b может быть больше a
        } else {
          b = randomInt(1, a)  // b всегда ≤ a (без отрицательных)
        }
        result = a - b
        break
      case '×':
        a = randomInt(1, Math.min(12, maxNum))
        b = randomInt(1, Math.min(12, maxNum))
        result = a * b
        break
      case '÷':
        b = randomInt(1, 12)
        result = randomInt(1, 12)
        a = b * result
        break
      default:
        a = 1
        b = 1
        result = 2
    }

    return { a, b, op, result }
    // taskSeed triggers regeneration, difficulty changes config
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskSeed, difficulty])

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState('finished')
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState])

  useEffect(() => {
    if (gameState === 'finished' && score > 0 && currentPlayerName) {
      addScore({ 
        game: 'quick-math', 
        score, 
        playerName: currentPlayerName,
        difficulty,
        streak: bestStreak
      })
    }
  }, [gameState]) // eslint-disable-line react-hooks/exhaustive-deps

  const startGame = useCallback(() => {
    if (!currentPlayerName) return
    setGameState('playing')
    setTimeLeft(config.timeLimit)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setAnswer('')
    setTaskSeed(0)
    setFeedback(null)
  }, [config.timeLimit, currentPlayerName])

  const checkAnswer = useCallback(() => {
    const userAnswer = Number(answer)
    const isCorrect = userAnswer === task.result

    if (isCorrect) {
      const points = 10 + streak * 2
      setScore((s) => s + points)
      setStreak((s) => {
        const newStreak = s + 1
        setBestStreak((best) => Math.max(best, newStreak))
        return newStreak
      })
      setFeedback('correct')
    } else {
      setStreak(0)
      setFeedback('wrong')
    }

    setAnswer('')
    setTaskSeed((s) => s + 1)

    setTimeout(() => setFeedback(null), 300)
  }, [answer, task.result, streak])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.trim()) {
      checkAnswer()
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
        <h2 className="text-2xl font-bold">{t(language, 'games.quickMath')}</h2>
        <p className="text-muted">{t(language, 'games.quickMathDesc')}</p>

        <div className="space-y-2">
          <label className="block text-sm text-muted">{t(language, 'games.difficulty')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg border transition ${
                  difficulty === d ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'
                }`}
              >
                {getDifficultyLabel(d)}
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
                  {getDifficultyLabel(d)}
                </button>
              ))}
            </div>
          </div>
          
          {topByScore.length === 0 && topByStreak.length === 0 ? (
            <div className="text-center py-6 text-muted">
              <p className="text-2xl mb-2">🏆</p>
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
              
              {/* Топ по серии */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-orange-500 flex items-center gap-1">
                  🔥 {language === 'ru' ? 'По серии' : 'By Streak'}
                </h4>
                <div className="space-y-1">
                  {topByStreak.length > 0 ? topByStreak.map((s, i) => (
                    <div key={s.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-4 text-muted text-xs">{i + 1}.</span>
                        <span className="truncate max-w-[60px]">{s.playerName}</span>
                      </div>
                      <span className="font-mono font-medium text-orange-500">{s.streak}</span>
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

  if (gameState === 'finished') {
    return (
      <div className="glass-card space-y-4 text-center">
        <h2 className="text-2xl font-bold">{t(language, 'games.gameOver')}</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/20">
            <p className="text-sm text-muted">{t(language, 'games.score')}</p>
            <p className="text-3xl font-bold text-primary">{score}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/20">
            <p className="text-sm text-muted">{t(language, 'games.bestStreak')}</p>
            <p className="text-3xl font-bold">{bestStreak}</p>
          </div>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-sm ${getDifficultyBadge(difficulty)}`}>
          {getDifficultyLabel(difficulty)}
        </div>

        <button className="btn-primary w-full" onClick={startGame}>
          {t(language, 'games.playAgain')}
        </button>
        <button className="w-full text-sm text-muted hover:text-primary" onClick={() => setGameState('idle')}>
          {t(language, 'games.backToMenu')}
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t(language, 'games.quickMath')}</h2>
        <div className="flex items-center gap-4">
          <span className={`text-xs px-2 py-1 rounded ${getDifficultyBadge(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
          <span className="text-sm text-muted">{t(language, 'games.streak')}: {streak}</span>
          <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2">
        <span className="text-sm text-muted">{t(language, 'games.score')}:</span>
        <span className="text-2xl font-bold text-primary">{score}</span>
      </div>

      <div
        className={`text-center py-8 rounded-lg transition ${
          feedback === 'correct' ? 'bg-green-500/20 scale-105' : feedback === 'wrong' ? 'bg-red-500/20' : 'bg-muted/10'
        }`}
      >
        <p className="text-4xl font-mono font-bold">{task.a} {task.op} {task.b} = ?</p>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          className="input flex-1 text-xl text-center"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="?"
          autoFocus
        />
        <button className="btn-primary px-6" onClick={checkAnswer} disabled={!answer.trim()}>
          {t(language, 'common.calculate')}
        </button>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(timeLeft / config.timeLimit) * 100}%` }} />
      </div>
    </div>
  )
}
