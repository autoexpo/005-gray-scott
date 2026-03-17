import { test, expect } from '@playwright/test'

test.describe('Step 23: Initial Conditions for 2D', () => {
  test('renders 2D initial conditions reference with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#23')
    await page.waitForSelector('#text-panel', { timeout: 10_000 })
    expect(errors).toHaveLength(0)
  })
})
