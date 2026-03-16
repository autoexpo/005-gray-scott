import { test, expect } from '@playwright/test'

test.describe('Step 2: KaTeX Math Rendering', () => {
  test('renders KaTeX elements with no JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/#2')
    await page.waitForSelector('.katex', { timeout: 10_000 })

    const katexEls = await page.$$('.katex')
    expect(katexEls.length).toBeGreaterThan(0)
    expect(errors).toHaveLength(0)
  })
})