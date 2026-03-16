import { test, expect } from '@playwright/test'
import { readPixels, darkPixelRatio, pixelVariance } from './utils/pixels.js'

test.describe('Step 4: 2D Diffusion', () => {
  test('canvas shows diffusing blob (non-trivial dark pixels)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#4')
    await page.waitForSelector('#canvas2d-sim', { timeout: 10_000 })
    await page.waitForTimeout(3_000)

    const pixels = await readPixels(page)
    const dark = darkPixelRatio(pixels, 50)
    const variance = pixelVariance(pixels)

    // Should have visible dark content (the diffusing blob)
    expect(dark).toBeGreaterThan(0.003)
    expect(variance).toBeGreaterThan(10)
    expect(errors).toHaveLength(0)
  })
})