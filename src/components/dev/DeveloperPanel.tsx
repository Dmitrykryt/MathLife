'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useSettingsStore } from '@/store/settingsStore'

// ID устройств разработчиков (добавьте свой deviceId сюда)
const DEVELOPER_DEVICE_IDS = [
  'device-mmm2qhrf-frg5i7sox', // Основной девайс разработчика
]

type AdminAction = 'clearAll' | 'clearByNick' | 'clearAllNicks' | 'removeNick' | null

export function DeveloperPanel() {
  const language = useSettingsStore((s) => s.language)
  const clearScores = useGameStore((s) => s.clearScores)
  const clearScoresByNickname = useGameStore((s) => s.clearScoresByNickname)
  const clearAllNicknames = useGameStore((s) => s.clearAllNicknames)
  const removeNickname = useGameStore((s) => s.removeNickname)
  const getAllNicknames = useGameStore((s) => s.getAllNicknames)
  const deviceId = useGameStore((s) => s.deviceId)
  const getDeviceId = useGameStore((s) => s.getDeviceId)
  const scores = useGameStore((s) => s.scores)
  const currentPlayerName = useGameStore((s) => s.currentPlayerName)

  const [adminAction, setAdminAction] = useState<AdminAction>(null)
  const [inputNick, setInputNick] = useState('')

  const currentDeviceId = deviceId || getDeviceId()
  const isDeveloper = DEVELOPER_DEVICE_IDS.includes(currentDeviceId)
  const allNicknames = getAllNicknames()

  const handleAction = () => {
    switch (adminAction) {
      case 'clearAll':
        clearScores()
        break
      case 'clearByNick':
        if (inputNick.trim()) {
          clearScoresByNickname(inputNick.trim())
        }
        break
      case 'clearAllNicks':
        clearAllNicknames()
        break
      case 'removeNick':
        if (inputNick.trim()) {
          removeNickname(inputNick.trim())
        }
        break
    }
    setAdminAction(null)
    setInputNick('')
  }

  const renderConfirmDialog = () => {
    if (!adminAction) return null

    const needsInput = adminAction === 'clearByNick' || adminAction === 'removeNick'

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={() => setAdminAction(null)} />
        <div className="relative glass-card p-6 w-full max-w-md animate-in fade-in zoom-in">
          <h3 className="text-lg font-bold mb-4">
            {adminAction === 'clearAll' && (language === 'ru' ? 'Сбросить все результаты?' : 'Clear all scores?')}
            {adminAction === 'clearByNick' && (language === 'ru' ? 'Удалить результаты по нику' : 'Clear scores by nickname')}
            {adminAction === 'clearAllNicks' && (language === 'ru' ? 'Сбросить все ники?' : 'Clear all nicknames?')}
            {adminAction === 'removeNick' && (language === 'ru' ? 'Удалить ник и результаты' : 'Remove nickname and scores')}
          </h3>

          {needsInput && (
            <div className="mb-4">
              <input
                type="text"
                className="input w-full"
                placeholder={language === 'ru' ? 'Введите ник...' : 'Enter nickname...'}
                value={inputNick}
                onChange={(e) => setInputNick(e.target.value)}
                list="nicknames-list"
              />
              <datalist id="nicknames-list">
                {allNicknames.map((nick) => (
                  <option key={nick} value={nick} />
                ))}
              </datalist>
              <p className="text-xs text-muted mt-1">
                {language === 'ru' ? 'Найдено ников:' : 'Found nicknames:'} {allNicknames.length}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setAdminAction(null)} className="btn-secondary flex-1">
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button
              onClick={handleAction}
              className="btn-primary flex-1 bg-red-500 hover:bg-red-600"
              disabled={needsInput && !inputNick.trim()}
            >
              {language === 'ru' ? 'Подтвердить' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isDeveloper) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2">
          {language === 'ru' ? 'Доступ запрещён' : 'Access Denied'}
        </h2>
        <p className="text-muted mb-4">
          {language === 'ru'
            ? 'Эта страница доступна только разработчикам.'
            : 'This page is only available to developers.'}
        </p>
        <p className="text-xs text-muted/60">Device ID: {currentDeviceId}</p>
        <p className="text-xs text-muted/40 mt-2">
          {language === 'ru'
            ? 'Добавьте свой Device ID в DEVELOPER_DEVICE_IDS для доступа.'
            : 'Add your Device ID to DEVELOPER_DEVICE_IDS to get access.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🔐</span>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'ru' ? 'Панель разработчика' : 'Developer Panel'}
            </h1>
            <p className="text-sm text-muted">
              {language === 'ru' ? 'Управление данными и отладка' : 'Data management and debugging'}
            </p>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/10 text-xs font-mono text-muted">
          Device ID: {currentDeviceId}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-primary">{scores.length}</p>
          <p className="text-sm text-muted">{language === 'ru' ? 'Всего записей' : 'Total records'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-green-500">{allNicknames.length}</p>
          <p className="text-sm text-muted">{language === 'ru' ? 'Уников' : 'Unique players'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">
            {scores.filter((s) => s.game === 'quick-math').length}
          </p>
          <p className="text-sm text-muted">Quick Math</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">
            {scores.filter((s) => s.game === 'guess-number').length}
          </p>
          <p className="text-sm text-muted">Guess Number</p>
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-muted mb-2">
          {language === 'ru' ? 'Текущий игрок' : 'Current player'}
        </h3>
        <p className="text-lg font-medium">
          {currentPlayerName || <span className="text-muted">(не выбран)</span>}
        </p>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-muted mb-3">
          {language === 'ru' ? 'Действия' : 'Actions'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => setAdminAction('clearAll')}
            className="text-sm px-4 py-2.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition text-left"
          >
            🗑️ {language === 'ru' ? 'Сбросить все результаты' : 'Clear all scores'}
          </button>
          <button
            onClick={() => setAdminAction('clearByNick')}
            className="text-sm px-4 py-2.5 rounded-lg bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 transition text-left"
          >
            📊 {language === 'ru' ? 'Сбросить по нику' : 'Clear scores by nick'}
          </button>
          <button
            onClick={() => setAdminAction('clearAllNicks')}
            className="text-sm px-4 py-2.5 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition text-left"
          >
            👥 {language === 'ru' ? 'Сбросить все ники' : 'Clear all nicknames'}
          </button>
          <button
            onClick={() => setAdminAction('removeNick')}
            className="text-sm px-4 py-2.5 rounded-lg bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 transition text-left"
          >
            ❌ {language === 'ru' ? 'Удалить ник' : 'Remove nickname'}
          </button>
        </div>
      </div>

      {allNicknames.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted mb-3">
            {language === 'ru' ? 'Все ники' : 'All nicknames'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {allNicknames.map((nick) => (
              <span key={nick} className="px-2 py-1 text-xs rounded bg-muted/20">
                {nick}
              </span>
            ))}
          </div>
        </div>
      )}

      {scores.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-muted mb-3">
            {language === 'ru' ? 'Последние записи' : 'Recent records'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="pb-2">Game</th>
                  <th className="pb-2">Player</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Difficulty</th>
                  <th className="pb-2">Device</th>
                </tr>
              </thead>
              <tbody>
                {scores.slice(0, 10).map((s) => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-2">{s.game}</td>
                    <td className="py-2">{s.playerName}</td>
                    <td className="py-2 font-mono">{s.score}</td>
                    <td className="py-2">{s.difficulty}</td>
                    <td className="py-2 text-xs text-muted font-mono">{s.deviceId.slice(0, 15)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {renderConfirmDialog()}
    </div>
  )
}
