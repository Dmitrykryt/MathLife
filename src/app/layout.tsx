import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { AppProviders } from '@/components/providers/AppProviders'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#6366f1' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'MathLife — Enterprise Math Platform',
    template: '%s | MathLife',
  },
  description: 'Professional platform with 50+ mathematical calculators, 3D visualizations, and interactive graphs',
  keywords: ['калькулятор', 'математика', 'калькуляторы', 'матрицы', 'статистика', 'финансы', 'геометрия', 'алгебра'],
  authors: [{ name: 'MathLife Team' }],
  creator: 'MathLife',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MathLife',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'MathLife',
    title: 'MathLife — Enterprise Math Platform',
    description: '50+ professional calculators with 3D visualization',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathLife — Enterprise Math Platform',
    description: '50+ professional calculators with 3D visualization',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
