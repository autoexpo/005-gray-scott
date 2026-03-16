import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'src/tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.TEST_URL ?? 'https://gray-scott.pages.dev',
    headless: true,
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    }
  },
})