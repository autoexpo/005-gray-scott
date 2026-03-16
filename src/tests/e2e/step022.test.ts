import { test, expect } from '@playwright/test'

test.describe('Step 22: 5-Point Stencil Periodic BC', () => {
  test('2D canvas simulation renders', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#22')
    await page.waitForSelector('#canvas2d-sim', { timeout: 10_000 })
    await page.waitForTimeout(2_000)

    const canvas = await page.$('#canvas2d-sim')
    expect(canvas).toBeTruthy()

    expect(errors).toHaveLength(0)
  })
})