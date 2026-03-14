// Core types for MathLife project

export type ThemeName = 'light' | 'dark' | 'neon-blue' | 'neon-green' | 'purple-premium' | 'orange-energy'

export type Locale = 'ru' | 'en'

export type FontFamily = 
  | 'Inter'
  | 'Poppins'
  | 'Roboto'
  | 'Open Sans'
  | 'Lato'
  | 'Montserrat'
  | 'Source Sans Pro'
  | 'Oswald'
  | 'Raleway'
  | 'Merriweather'
  | 'Nunito'
  | 'Playfair Display'
  | 'Work Sans'
  | 'Quicksand'
  | 'Fira Code'

export type CalculatorCategory = 
  | 'basic'
  | 'scientific'
  | 'algebra'
  | 'geometry'
  | 'matrices'
  | 'statistics'
  | 'finance'
  | 'converters'
  | 'engineering'
  | 'specialized'
  | 'everyday'
  | 'health'
  | 'home'
  | 'auto'
  | 'education'
  | 'time'

export interface Calculator {
  id: string
  slug: string
  name: string
  description: string
  category: CalculatorCategory
  icon: string
  keywords: string[]
  formula?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface CalculationHistory {
  id: string
  calculatorId: string
  timestamp: Date
  inputs: Record<string, unknown>
  result: unknown
  expression?: string
}

export interface UserSettings {
  theme: ThemeName
  font: FontFamily
  fontSize: number
  language: Locale
  animationsEnabled: boolean
  particlesEnabled: boolean
  autoCalculate: boolean
  precision: number
  scientificNotation: boolean
}

export interface FavoriteCalculator {
  calculatorId: string
  addedAt: Date
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  fill?: boolean
}

export type ChartType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'surface3d'
  | 'heatmap'
  | 'boxplot'

export interface Matrix {
  rows: number
  cols: number
  data: number[][]
}

export interface Point2D {
  x: number
  y: number
}

export interface Point3D {
  x: number
  y: number
  z: number
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface CalculatorProps {
  onResult?: (result: unknown) => void
  initialInputs?: Record<string, unknown>
}

export interface InputField {
  name: string
  label: string
  type: 'number' | 'text' | 'select' | 'slider' | 'checkbox'
  placeholder?: string
  defaultValue?: unknown
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
  required?: boolean
  validation?: (value: unknown) => ValidationResult
}
