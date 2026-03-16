import { test, expect } from '@playwright/test'

test.describe('Step 79: Title', () => {
  test('D3 chart renders', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#79')
    await page.waitForSelector('#d3-sim', { timeout: 10_000 })

    const svg = await page.$('#d3-sim')
    expect(svg).toBeTruthy()

    // Check for chart elements (paths or rects)
    const elements = await page.$$('#d3-sim path, #d3-sim rect')
    expect(elements.length).toBeGreaterThan(0)

    expect(errors).toHaveLength(0)
  })
})
