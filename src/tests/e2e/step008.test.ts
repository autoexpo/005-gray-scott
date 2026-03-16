import { test, expect } from '@playwright/test'

test.describe('Step 8: Parameter Map', () => {
  test('D3 SVG shows parameter map with scatter points', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#8')
    await page.waitForSelector('#d3-sim circle', { timeout: 10_000 })

    const circles = await page.$$('#d3-sim circle')
    expect(circles.length).toBeGreaterThanOrEqual(4) // At least 4 preset points

    // Check for background regions (rectangles)
    const rects = await page.$$('#d3-sim rect')
    expect(rects.length).toBeGreaterThanOrEqual(3) // Background regions

    // Check for axis elements
    const axisElements = await page.$$('#d3-sim g')
    expect(axisElements.length).toBeGreaterThan(0)

    expect(errors).toHaveLength(0)
  })
})