import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { realLifeCategoryLabels, getRealLifeCalculatorsByCategory, realLifeCalculators } from '@/constants/realLifeCalculators'
import { CategoryPageContent } from '@/components/pages/CategoryPageContent'

export async function generateStaticParams() {
  return Object.keys(realLifeCategoryLabels).map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const label = realLifeCategoryLabels[category as keyof typeof realLifeCategoryLabels]

  if (!label) {
    return {
      title: 'Category not found',
    }
  }

  const categoryCalculators = getRealLifeCalculatorsByCategory(category as keyof typeof realLifeCategoryLabels)

  return {
    title: `${label.ru} / ${label.en} — MathLife`,
    description: `${categoryCalculators.length} calculators in "${label.en}" category`,
    openGraph: {
      title: `${label.ru} / ${label.en} — MathLife`,
      description: `${categoryCalculators.length} calculators available`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const label = realLifeCategoryLabels[category as keyof typeof realLifeCategoryLabels]
  const list = getRealLifeCalculatorsByCategory(category as keyof typeof realLifeCategoryLabels)

  if (!label) {
    notFound()
  }

  return <CategoryPageContent label={label} calculators={list} />
}
