'use client'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - fixed on desktop, hidden on mobile */}
      <div className="hidden md:block md:fixed md:left-0 md:top-[73px] md:h-[calc(100vh-73px)] md:w-64 md:z-40">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 md:ml-64">
        <Header />
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
