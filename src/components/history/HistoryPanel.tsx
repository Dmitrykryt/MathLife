'use client'

import { useHistoryStore } from '@/store/historyStore'
import { useSettingsStore } from '@/store/settingsStore'

export function HistoryPanel() {
  const history = useHistoryStore((s) => s.history)
  const language = useSettingsStore((s) => s.language)

  return (
    <div className='glass-card'>
      <h3 className='font-semibold mb-3'>
        {language === 'ru' ? 'История' : 'History'}
      </h3>
      <div className='space-y-2 max-h-64 overflow-auto'>
        {history.map((h) => (
          <div key={h.id} className='p-2 rounded border border-border text-sm'>
            <div>{h.expression ?? h.calculatorId}</div>
            <div className='text-muted'>
              {language === 'ru' ? 'Результат' : 'Result'}: {String(h.result)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

