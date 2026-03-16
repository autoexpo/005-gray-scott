import { test, expect } from '@playwright/test'
import { readPixels, darkPixelRatio, countDistinctGreyLevels } from './utils/pixels.js'

test.describe('Step 5: Reaction / Autocatalysis (phase plane)', () => {
  test('phase plane has multiple grey levels (trajectory curves visible)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#5')
    await page.waitForSelector('#sim-canvas', { timeout: 10_000 })
    await page.waitForTimeout(1_000)

    const pixels = await readPixels(page)
    const dark = darkPixelRatio(pixels, 100)
    const greyLevels = countDistinctGreyLevels(pixels, 20)

    // Phase plane should show axis lines + 3 trajectory curves
    expect(dark).toBeGreaterThan(0.01)
    expect(greyLevels).toBeGreaterThanOrEqual(3)
    expect(errors).toHaveLength(0)
  })
})