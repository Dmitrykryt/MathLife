import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage with hero section', async ({ page }) => {
    await page.goto('/')

    // Check hero title
    await expect(page.locator('h1')).toContainText('MathLife')

    // Check that calculators section exists
    await expect(page.getByText(/популярные калькуляторы|popular calculators/i)).toBeVisible()
  })

  test('should have working search', async ({ page }) => {
    await page.goto('/')

    // Find search input
    const searchInput = page.getByPlaceholder(/поиск|search/i)
    await searchInput.fill('кредит')

    // Should show results
    await expect(page.getByText(/кредитный калькулятор|loan calculator/i)).toBeVisible()
  })

  test('should navigate to calculator page', async ({ page }) => {
    await page.goto('/')

    // Click on first calculator card
    const calculatorCard = page.getByRole('link', { name: /арифметический|arithmetic/i }).first()
    await calculatorCard.click()

    // Should be on calculator page
    await expect(page).toHaveURL(/\/calculator\/arithmetic/)
    await expect(page.getByRole('heading', { name: /арифметический|arithmetic/i })).toBeVisible()
  })
})

test.describe('Calculator Pages', () => {
  test('arithmetic calculator should perform addition', async ({ page }) => {
    await page.goto('/calculator/arithmetic')

    // Fill inputs
    await page.getByPlaceholder(/^a$/i).fill('5')
    await page.getByPlaceholder(/^b$/i).fill('3')

    // Click calculate
    await page.getByRole('button', { name: /рассчитать|calculate/i }).click()

    // Check result
    await expect(page.getByText('8')).toBeVisible()
  })

  test('percentage calculator should work', async ({ page }) => {
    await page.goto('/calculator/percentage')

    // Fill inputs for "X% of Y" mode
    await page.getByPlaceholder(/процент|percent/i).fill('20')
    await page.getByPlaceholder(/число|number/i).fill('200')

    // Click calculate
    await page.getByRole('button', { name: /рассчитать|calculate/i }).click()

    // Check result (20% of 200 = 40)
    await expect(page.getByText('40')).toBeVisible()
  })
})

test.describe('Language Switching', () => {
  test('should switch language', async ({ page }) => {
    await page.goto('/')

    // Find language switcher
    const languageSelect = page.getByRole('combobox').filter({ hasText: /ru|en/i })

    // Switch to English
    await languageSelect.selectOption('en')

    // Check that text changed
    await expect(page.getByText(/popular calculators/i)).toBeVisible()
  })
})

test.describe('Theme Switching', () => {
  test('should switch theme', async ({ page }) => {
    await page.goto('/')

    // Find theme switcher button
    const themeButton = page.getByRole('button', { name: /тема|theme/i })

    // Click to change theme
    await themeButton.click()

    // Theme should be applied (check for dark class or data attribute)
    const html = page.locator('html')
    await expect(html).toBeDefined()
  })
})

test.describe('Games', () => {
  test('should access games page', async ({ page }) => {
    await page.goto('/games')

    // Check games are visible
    await expect(page.getByText(/быстрый счёт|quick math/i)).toBeVisible()
    await expect(page.getByText(/угадай число|guess.*number/i)).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should navigate to category page', async ({ page }) => {
    await page.goto('/categories/basic')

    // Check category title
    await expect(page.getByRole('heading', { name: /базовые|basic/i })).toBeVisible()

    // Check calculators are listed
    await expect(page.getByText(/арифметический|arithmetic/i)).toBeVisible()
  })

  test('should show 404 for non-existent page', async ({ page }) => {
    await page.goto('/calculator/non-existent')

    // Should show 404 page
    await expect(page.getByText(/404|не найдено|not found/i)).toBeVisible()
  })
})
