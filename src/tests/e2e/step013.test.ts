import { test, expect } from '@playwright/test'

test.describe('Step 13: 1D Animation Loop', () => {
  test('loads pre-formatted animation loop diagram', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#13')
    await page.waitForSelector('#d3-sim', { timeout: 10_000 })

    const text = await page.textContent('pre')
    expect(text).toBeTruthy()

    expect(errors).toHaveLength(0)
  })
})
