import { test, expect } from '@playwright/test'
import { readPixels, pixelVariance } from './utils/pixels.js'

test.describe('Step 7: Parameter Explorer', () => {
  test('GUI controls present and canvas shows active simulation', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('computeBoundingSphere')) errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#7')
    await page.waitForSelector('#sim-canvas canvas', { timeout: 15_000 })
    // Wait for lil-gui to mount
    await page.waitForSelector('.lil-gui', { timeout: 10_000 })

    const guiEls = await page.$$('.lil-gui')
    expect(guiEls.length).toBeGreaterThan(0)

    await page.waitForTimeout(5_000)
    const pixels = await readPixels(page)
    const variance = pixelVariance(pixels)
    // Simulation should have non-trivial visual content
    expect(variance).toBeGreaterThan(50)
    expect(errors).toHaveLength(0)
  })
})