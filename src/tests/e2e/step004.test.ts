import { test, expect } from '@playwright/test'

test.describe('Step 4: Laplacian Grid', () => {
  test('D3 SVG shows interactive grid with rectangles', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#4')
    await page.waitForSelector('#d3-sim rect', { timeout: 10_000 })

    const rects = await page.$$('#d3-sim rect')
    expect(rects.length).toBeGreaterThan(0)

    // Test hover interaction by moving mouse over SVG
    await page.hover('#d3-sim')
    await page.waitForTimeout(500)

    // Should still have rectangles after interaction
    const rectsAfter = await page.$$('#d3-sim rect')
    expect(rectsAfter.length).toBeGreaterThanOrEqual(rects.length)

    expect(errors).toHaveLength(0)
  })
})