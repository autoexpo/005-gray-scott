import { test, expect } from '@playwright/test'

test.describe('Step 11: 1D Finite-Difference Laplacian', () => {
  test('loads math content with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#11')
    await page.waitForSelector('.math-section', { timeout: 10_000 })

    const sections = await page.$$('.math-section')
    expect(sections.length).toBeGreaterThan(0)

    expect(errors).toHaveLength(0)
  })
})