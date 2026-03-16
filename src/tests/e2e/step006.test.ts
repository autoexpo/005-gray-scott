import { test, expect } from '@playwright/test'
import { readPixels, darkPixelRatio, pixelVariance } from './utils/pixels.js'

test.describe('Step 6: Full Gray-Scott GPU Simulation', () => {
  test('starts mostly white (bw mode) then develops pattern variance', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('computeBoundingSphere')) errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#6')
    await page.waitForSelector('#three-canvas', { timeout: 15_000 })
    await page.waitForTimeout(1_000)

    // Visualization uses 'bw' mode: step(0.5, u) — u=1 → white, u=0 → black
    // Initial state (u≈1 everywhere, small V seed) should be mostly bright
    const pixels0 = await readPixels(page, '#three-canvas')
    const dark0 = darkPixelRatio(pixels0, 200)
    expect(dark0).toBeLessThan(0.3)

    // After 10s, Gray-Scott forms spots — variance should increase significantly
    await page.waitForTimeout(10_000)
    const pixels10 = await readPixels(page, '#three-canvas')
    const variance10 = pixelVariance(pixels10)
    expect(variance10).toBeGreaterThan(100)
    expect(errors).toHaveLength(0)
  })
})