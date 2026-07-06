import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,
  snapshotDir: './screenshots/expected',
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://89.169.184.251/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // Название проекта для отчётов
      name: 'Desktop chrome - 1920',
      // Настройки для этого проекта
      use: {
        browserName: 'chromium',         // используем браузер Chromium
        viewport: { width: 1920, height: 1080 }  // разрешение экрана как у десктопа
      },
    },
    // {
    //   name: 'Tablet chrome - 1024',
    //   use: {
    //     browserName: 'chromium',
    //     viewport: { width: 1024, height: 1080 }    // разрешение планшета
    //   },
    // },
    {
      name: 'Mobile chrome - 768',
      use: {
        browserName: 'chromium',
        viewport: { width: 768, height: 1080 }     // разрешение мобильного устройства
      },
    },
    {
      name: 'Mobile chrome - 360',
      use: {
        browserName: 'chromium',
        viewport: { width: 360, height: 1080 }     // разрешение мобильного устройства
      },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },     // Эмуляция мобильного девайса iphone 12 safari
    // }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  expect: {
    toHaveScreenshot: {
      threshold: 0.2, // 0.2% отличий (по умолчанию)
        maxDiffPixels: 100, // максимум отличий по пикселям
        maxDiffPixelRatio: 0.02, // 2% отличий от общей площади скриншота
      }
  }

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
