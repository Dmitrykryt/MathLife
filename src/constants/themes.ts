// Theme definitions for MathLife

import { ThemeName } from '@/types'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  muted: string
  border: string
  gradient?: string
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    muted: '#64748b',
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#a78bfa',
    accent: '#22d3ee',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    muted: '#94a3b8',
    border: '#334155',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  'neon-blue': {
    primary: '#00d4ff',
    secondary: '#7c3aed',
    accent: '#00ff88',
    background: '#0a0e27',
    surface: '#151b3d',
    text: '#e0f2fe',
    muted: '#7dd3fc',
    border: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
  },
  'neon-green': {
    primary: '#00ff88',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#022c22',
    surface: '#064e3b',
    text: '#ecfdf5',
    muted: '#6ee7b7',
    border: '#065f46',
    gradient: 'linear-gradient(135deg, #00ff88 0%, #10b981 100%)',
  },
  'purple-premium': {
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#f472b6',
    background: '#1a1625',
    surface: '#2d2640',
    text: '#faf5ff',
    muted: '#c4b5fd',
    border: '#581c87',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  },
  'orange-energy': {
    primary: '#f97316',
    secondary: '#ef4444',
    accent: '#fbbf24',
    background: '#1c1917',
    surface: '#292524',
    text: '#fef3c7',
    muted: '#fdba74',
    border: '#78350f',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
  },
}

export const defaultTheme: ThemeName = 'dark'
