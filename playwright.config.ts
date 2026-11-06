import { defineConfig, devices } from '@playwright/test';

/** 生产文档通过浏览器验证，报告和截图作为可复查的构建证据。 */
export default defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'reports/browser.json' }]],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run docs:preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
  ],
});
