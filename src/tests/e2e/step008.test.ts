import { test, expect } from '@playwright/test'
import { readPixels, darkPixelRatio, pixelVariance } from './utils/pixels.js'

test.describe('Step 8: Dot Seeding', () => {
  test('canvas shows seeded dots and evolving Gray-Scott pattern', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#8')
    await page.waitForSelector('#canvas2d-sim', { timeout: 15_000 })
    await page.waitForTimeout(1_000)

    // Initial state: should have visible seed dots
    const pixels0 = await readPixels(page)
    const dark0 = darkPixelRatio(pixels0, 100)
    expect(dark0).toBeGreaterThan(0.001)

    // After 8s: dots should have evolved into patterns
    await page.waitForTimeout(8_000)
    const pixels8 = await readPixels(page)
    const variance8 = pixelVariance(pixels8)
    expect(variance8).toBeGreaterThan(50)
    expect(errors).toHaveLength(0)
  })
})