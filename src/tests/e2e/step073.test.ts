import { test, expect } from '@playwright/test'

test.describe('Step 73: RK4 Integration: Four-Stage Derivation', () => {
  test('loads content with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#73')
    // Wait for the step navigation to show we're on step 73
    await page.waitForSelector('div:has-text("73 / 100")', { timeout: 10_000 })
    // Wait a bit longer for any async content to load
    await page.waitForTimeout(2_000)
    expect(errors).toHaveLength(0)
  })
})
