import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getRealLifeCalculatorBySlug, realLifeCalculators, realLifeCategoryLabels } from '@/constants/realLifeCalculators'
import { CalculatorPage } from '@/components/pages/CalculatorPage'

export async function generateStaticParams() {
  return realLifeCalculators.map((calc) => ({
    slug: calc.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const calculator = getRealLifeCalculatorBySlug(slug)

  if (!calculator) {
    return {
      title: 'Calculator not found',
    }
  }

  return {
    title: calculator.name,
    description: calculator.description,
    keywords: [...calculator.keywords, ...calculator.tags, calculator.category],
    openGraph: {
      title: `${calculator.name} — MathLife`,
      description: calculator.description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: calculator.name,
      description: calculator.description,
    },
    alternates: {
      canonical: `/calculator/${calculator.slug}`,
    },
  }
}

export default async function CalculatorSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const calculator = getRealLifeCalculatorBySlug(slug)

  if (!calculator) {
    notFound()
  }

  return <CalculatorPage calculator={calculator} />
}
