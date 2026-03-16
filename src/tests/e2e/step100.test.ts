import { test, expect } from '@playwright/test'
import { readPixels, pixelVariance } from './utils/pixels.js'

test.describe('Step 100: Final capstone', () => {
  test('GPU simulation renders with lil-gui controls', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('computeBoundingSphere')) errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#100')
    await page.waitForSelector('#three-canvas', { timeout: 15_000 })
    await page.waitForSelector('.lil-gui', { timeout: 10_000, state: 'attached' })
    await page.waitForTimeout(5_000)

    // Check GPU simulation is rendering
    const pixels = await readPixels(page, '#three-canvas')
    const variance = pixelVariance(pixels)
    expect(variance).toBeGreaterThan(10)
    expect(errors).toHaveLength(0)
  })
})
