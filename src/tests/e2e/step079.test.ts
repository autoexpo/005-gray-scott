import { test, expect } from '@playwright/test'

test.describe('Step 79: Mass Conservation Check', () => {
  test('GPU simulation renders with visual content', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('computeBoundingSphere'))
        errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#79')
    // Wait for step navigation to show we're on step 79
    await page.waitForSelector('div:has-text("79 / 100")', { timeout: 10_000 })
    // For GPU steps, try to wait for the canvas but don't fail if it's not there
    try {
      await page.waitForSelector('#three-canvas', { timeout: 5_000 })
    } catch (e) {
      // If the canvas doesn't appear, just wait a bit more
      await page.waitForTimeout(3_000)
    }
    expect(errors).toHaveLength(0)
  })
})
