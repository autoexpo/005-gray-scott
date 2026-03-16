import { test, expect } from '@playwright/test'

test.describe('Step 9: 1D Grid: Typed Arrays', () => {
  test('D3 SVG renders animated line chart', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#9')
    await page.waitForSelector('#d3-sim', { timeout: 10_000 })
    await page.waitForTimeout(1_000)

    const svg = await page.$('#d3-sim')
    expect(svg).toBeTruthy()

    const paths = await page.$$('#d3-sim path')
    expect(paths.length).toBeGreaterThan(0)

    expect(errors).toHaveLength(0)
  })
})