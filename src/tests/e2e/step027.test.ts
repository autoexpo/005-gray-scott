import { test, expect } from '@playwright/test'

test.describe('Step 27: The 9-Point Isotropic Laplacian', () => {
  test('renders 9-point isotropic Laplacian reference with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#27')
    await page.waitForSelector('#text-panel', { timeout: 10_000 })
    expect(errors).toHaveLength(0)
  })
})
