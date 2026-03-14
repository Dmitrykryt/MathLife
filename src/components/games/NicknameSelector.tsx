'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useSettingsStore } from '@/store/settingsStore'
import { NicknameModal } from './NicknameModal'

interface NicknameSelectorProps {
  showRequiredError?: boolean
  onClearError?: () => void
}

export function NicknameSelector({ showRequiredError = false, onClearError }: NicknameSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const language = useSettingsStore((s) => s.language)
  const currentPlayerName = useGameStore((s) => s.currentPlayerName)
  const getDeviceId = useGameStore((s) => s.getDeviceId)
  
  useEffect(() => {
    getDeviceId()
  }, [getDeviceId])
  
  // Очищаем ошибку при открытии модалки
  useEffect(() => {
    if (showRequiredError && isModalOpen) {
      onClearError?.()
    }
  }, [isModalOpen, showRequiredError, onClearError])
  
  return (
    <>
      {/* Карточка с ником */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="text-xs text-muted">
                {language === 'ru' ? 'Ваш ник' : 'Your nickname'}
              </p>
              {currentPlayerName ? (
                <p className="text-lg font-bold text-primary">{currentPlayerName}</p>
              ) : (
                <p className="text-lg text-red-500">
                  {language === 'ru' ? 'Не выбран' : 'Not selected'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-4 py-2"
          >
            {currentPlayerName 
              ? (language === 'ru' ? 'Изменить' : 'Edit')
              : (language === 'ru' ? 'Выбрать' : 'Choose')
            }
          </button>
        </div>
        
        {/* Ошибка если ник не выбран */}
        {showRequiredError && !currentPlayerName && (
          <p className="text-sm text-red-500 mt-3 text-center animate-in fade-in">
            {language === 'ru' ? '⚠️ Выберите ник для начала игры' : '⚠️ Choose a nickname to start playing'}
          </p>
        )}
      </div>
      
      {/* Модальное окно */}
      <NicknameModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
