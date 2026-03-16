import { test, expect } from '@playwright/test'

test.describe('Step 14: STEPTITLE', () => {
  test('TESTDESC', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#14')
    await page.waitForSelector('SELECTOR', { timeout: 10_000 })
    await page.waitForTimeout(1_000)

    // Basic assertion - exists
    const element = await page.$('SELECTOR')
    expect(element).toBeTruthy()

    expect(errors).toHaveLength(0)
  })
})
