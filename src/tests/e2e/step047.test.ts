import { test, expect } from '@playwright/test'
import { readPixels, pixelVariance } from './utils/pixels.js'

test.describe('Step 47: Live f and k Sliders', () => {
  test('GPU simulation renders with visual content', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('computeBoundingSphere')) errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#47')
    await page.waitForSelector('#three-canvas', { timeout: 15_000 })
    await page.waitForSelector('.lil-gui', { timeout: 10_000, state: 'attached' })
    const guiEls = await page.$$('.lil-gui')
    expect(guiEls.length).toBeGreaterThan(0)
    await page.waitForTimeout(3_000)

    const pixels = await readPixels(page, '#three-canvas')
    const variance = pixelVariance(pixels)
    expect(variance).toBeGreaterThan(10)
    expect(errors).toHaveLength(0)
  })
})