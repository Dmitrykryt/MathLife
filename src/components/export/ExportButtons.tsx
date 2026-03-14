'use client'

import { exportResultToPdf } from '@/lib/export/pdfExport'
import { useSettingsStore } from '@/store/settingsStore'

export function ExportButtons({ title, result }: { title: string; result: string }) {
  const language = useSettingsStore((s) => s.language)

  return (
    <div className='flex gap-2'>
      <button className='btn-primary' onClick={() => navigator.clipboard.writeText(result)}>
        {language === 'ru' ? 'Копировать' : 'Copy'}
      </button>
      <button className='btn-primary' onClick={() => exportResultToPdf(title, result)}>
        {language === 'ru' ? 'Экспорт' : 'Export'}
      </button>
    </div>
  )
}

