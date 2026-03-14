'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useSettingsStore } from '@/store/settingsStore'
import { isNicknameAllowed } from '@/lib/forbiddenWordsFilter'

interface NicknameModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NicknameModal({ isOpen, onClose }: NicknameModalProps) {
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  
  const language = useSettingsStore((s) => s.language)
  const currentPlayerName = useGameStore((s) => s.currentPlayerName)
  const setCurrentPlayerName = useGameStore((s) => s.setCurrentPlayerName)
  const isNameTaken = useGameStore((s) => s.isNameTaken)
  
  // Заполняем текущий ник при открытии
  useEffect(() => {
    if (isOpen) {
      setNickname(currentPlayerName || '')
      setError('')
    }
  }, [isOpen, currentPlayerName])
  
  const handleSubmit = () => {
    const trimmed = nickname.trim()
    
    if (!trimmed) {
      setError(language === 'ru' ? 'Введите ник' : 'Enter nickname')
      return
    }
    
    if (trimmed.length < 2) {
      setError(language === 'ru' ? 'Минимум 2 символа' : 'Minimum 2 characters')
      return
    }
    
    if (trimmed.length > 20) {
      setError(language === 'ru' ? 'Максимум 20 символов' : 'Maximum 20 characters')
      return
    }
    
    if (!isNicknameAllowed(trimmed)) {
      setError(language === 'ru' ? 'Ник содержит запрещённые слова' : 'Nickname contains forbidden words')
      return
    }
    
    if (isNameTaken(trimmed)) {
      setError(language === 'ru' ? 'Это имя уже занято' : 'This name is already taken')
      return
    }
    
    const success = setCurrentPlayerName(trimmed)
    if (success) {
      onClose()
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-card p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted hover:text-primary transition text-xl"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="text-xl font-bold">
            {language === 'ru' ? 'Ваш ник' : 'Your Nickname'}
          </h2>
        </div>
        
        {/* Current nickname display */}
        {currentPlayerName && (
          <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-border text-center">
            <p className="text-xs text-muted mb-1">
              {language === 'ru' ? 'Текущий ник:' : 'Current nickname:'}
            </p>
            <p className="text-xl font-bold text-primary">{currentPlayerName}</p>
          </div>
        )}
        
        {/* Input form */}
        <div className="space-y-3">
          <label className="block text-sm text-muted">
            {currentPlayerName 
              ? (language === 'ru' ? 'Новый ник:' : 'New nickname:')
              : (language === 'ru' ? 'Введите ник:' : 'Enter nickname:')
            }
          </label>
          
          <input
            className="input w-full text-lg py-3 text-center"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder={language === 'ru' ? 'Ваш ник...' : 'Your nickname...'}
            autoFocus
            maxLength={20}
          />
          
          {/* Character counter */}
          <div className="flex justify-between text-xs text-muted">
            <span>{language === 'ru' ? '2-20 символов' : '2-20 characters'}</span>
            <span>{nickname.length}/20</span>
          </div>
          
          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center animate-in fade-in">{error}</p>
          )}
          
        {/* Buttons */}
        <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              {language === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1"
              disabled={!nickname.trim() || nickname === currentPlayerName}
            >
              {currentPlayerName 
                ? (language === 'ru' ? 'Сохранить' : 'Save')
                : (language === 'ru' ? 'Установить' : 'Set')
              }
            </button>
          </div>
          
          {/* Кнопка для очистки ника (только если ник установлен) */}
          {currentPlayerName && (
            <button
              onClick={() => {
                useGameStore.getState().clearCurrentPlayerName()
                setNickname('')
                setError('')
              }}
              className="w-full mt-3 text-sm text-red-500 hover:text-red-400 transition"
            >
              {language === 'ru' ? '❌ Удалить ник' : '❌ Remove nickname'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
