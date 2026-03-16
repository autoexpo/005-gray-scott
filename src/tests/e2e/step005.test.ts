import { test, expect } from '@playwright/test'

test.describe('Step 5: Reaction / Autocatalysis (phase plane)', () => {
  test('D3 SVG shows phase plane with trajectory paths', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#5')
    await page.waitForSelector('#d3-sim path', { timeout: 10_000 })

    const paths = await page.$$('#d3-sim path')
    expect(paths.length).toBeGreaterThanOrEqual(3) // 3 trajectory paths

    // Check for circles (start/end points)
    const circles = await page.$$('#d3-sim circle')
    expect(circles.length).toBeGreaterThanOrEqual(3) // At least 3 circles

    expect(errors).toHaveLength(0)
  })
})