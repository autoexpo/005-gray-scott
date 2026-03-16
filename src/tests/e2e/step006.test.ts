import { test, expect } from '@playwright/test'
import { readPixels, darkPixelRatio, brightPixelRatio } from './utils/pixels.js'

test.describe('Step 6: Full Gray-Scott GPU Simulation', () => {
  test('starts mostly white then develops dark pattern', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#6')
    await page.waitForSelector('#sim-canvas canvas', { timeout: 15_000 })
    await page.waitForTimeout(1_000)

    const pixels0 = await readPixels(page)
    const bright0 = brightPixelRatio(pixels0, 200)
    // Initially mostly white (u=1 everywhere)
    expect(bright0).toBeGreaterThan(0.5)

    // After 10s, Gray-Scott should form dark spots/rings
    await page.waitForTimeout(10_000)
    const pixels10 = await readPixels(page)
    const dark10 = darkPixelRatio(pixels10, 100)
    expect(dark10).toBeGreaterThan(0.05)
    expect(errors).toHaveLength(0)
  })
})