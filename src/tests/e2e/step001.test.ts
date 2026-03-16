import { test, expect } from '@playwright/test'

test.describe('Step 1: What is Gray-Scott', () => {
  test('loads with math sections and no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#1')
    await page.waitForSelector('.math-section h3', { timeout: 10_000 })

    const headings = await page.$$('.math-section h3')
    expect(headings.length).toBeGreaterThan(0)
    expect(errors).toHaveLength(0)
  })
})