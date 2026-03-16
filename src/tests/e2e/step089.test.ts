import { test, expect } from '@playwright/test'

test.describe('Step 89: Symmetry breaking', () => {
  test('CPU canvas simulation renders', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#89')
    await page.waitForSelector('canvas', { timeout: 10_000 })

    // This step has TWO canvases (canvas2d-a and canvas2d-b, CPU sims NOT GPU)
    const canvases = await page.$$('canvas')
    expect(canvases.length).toBeGreaterThanOrEqual(1)

    expect(errors).toHaveLength(0)
  })
})