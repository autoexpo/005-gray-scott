import { test, expect } from '@playwright/test'

test.describe('Step 22: Implementing 5-Point Stencil (Periodic BC)', () => {
  test('renders stencil implementation reference with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#22')
    await page.waitForSelector('#text-panel', { timeout: 10_000 })
    expect(errors).toHaveLength(0)
  })
})
