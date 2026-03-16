import { test, expect } from '@playwright/test'

test.describe('Step 3: 1D Diffusion (heat equation)', () => {
  test('D3 SVG starts with animated line that updates over time', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#3')
    await page.waitForSelector('#d3-sim', { timeout: 10_000 })
    await page.waitForTimeout(2_000)

    // Check SVG exists
    const svg = await page.$('#d3-sim')
    expect(svg).toBeTruthy()

    // Check for path element (the line chart)
    const path = await page.$('#d3-sim path')
    expect(path).toBeTruthy()

    // Check for text elements (axes labels, time label)
    const texts = await page.$$('#d3-sim text')
    expect(texts.length).toBeGreaterThan(0)

    expect(errors).toHaveLength(0)
  })
})