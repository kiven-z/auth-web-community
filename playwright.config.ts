import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const browserChannel = process.env.PLAYWRIGHT_CHANNEL as 'chrome' | 'msedge' | undefined;

const sharedBrowserUse = {
  ...devices['Desktop Chrome'],
  ...(browserChannel ? { channel: browserChannel } : {}),
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'zh-CN',
  },
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'smoke',
      testMatch: /tests\/smoke\/.*\.spec\.ts/,
      use: sharedBrowserUse,
    },
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: sharedBrowserUse,
    },
    {
      name: 'authenticated',
      testMatch: /tests\/authenticated\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...sharedBrowserUse,
        storageState: 'e2e/.auth/administrator.json',
      },
    },
  ],
});
