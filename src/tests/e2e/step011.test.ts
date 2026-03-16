import { test, expect } from '@playwright/test'

test.describe('Step 11: 1D Finite-Difference Laplacian', () => {
  test('loads pre-formatted content with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#11')
    await page.waitForSelector('#d3-sim', { timeout: 10_000 })

    const text = await page.textContent('pre')
    expect(text).toBeTruthy()

    expect(errors).toHaveLength(0)
  })
})