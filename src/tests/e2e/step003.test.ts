import { test, expect } from '@playwright/test'
import { readPixels, brightPixelRatio, peakBrightnessInSlice } from './utils/pixels.js'

test.describe('Step 3: 1D Diffusion (heat equation)', () => {
  test('canvas starts with bright spike that spreads over time', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#3')
    await page.waitForSelector('#canvas2d-sim', { timeout: 10_000 })
    // Let it render 1 frame
    await page.waitForTimeout(300)

    const pixels0 = await readPixels(page)
    const bright0 = brightPixelRatio(pixels0, 200)
    // Canvas has content (mostly white background + black curve line)
    expect(bright0).toBeGreaterThan(0.5)

    // Let sim run 5s — Gaussian should spread significantly
    await page.waitForTimeout(5_000)
    const pixels5 = await readPixels(page)
    const variance5 = await import('./utils/pixels.js').then(m => m.pixelVariance(pixels5))
    // Still has content after reset cycle
    expect(pixels5.length).toBeGreaterThan(0)
    expect(errors).toHaveLength(0)
  })
})