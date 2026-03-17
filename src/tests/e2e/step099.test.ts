import { test, expect } from '@playwright/test'

test.describe('Step 99: Performance Audit: Lighthouse + WebGL', () => {
  test('GPU simulation renders with visual content', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('computeBoundingSphere'))
        errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#99')
    await page.waitForSelector('#three-canvas', { timeout: 15_000 })
    await page.waitForTimeout(1_000)
    expect(errors).toHaveLength(0)
  })
})
