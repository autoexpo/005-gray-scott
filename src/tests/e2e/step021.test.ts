import { test, expect } from '@playwright/test'

test.describe('Step 21: The 5-Point Laplacian Stencil in 2D', () => {
  test('renders stencil reference diagram with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/#21')
    await page.waitForSelector('#d3-sim', { timeout: 10_000 })

    const svgElements = await page.locator('#d3-sim rect').count()
    expect(svgElements).toBeGreaterThan(10)

    expect(errors).toHaveLength(0)
  })
})
