import { defineConfig } from '@playwright/test';

const viewports = [
  { name: 'phone-320', viewport: { width: 320, height: 720 } },
  { name: 'phone-390', viewport: { width: 390, height: 844 } },
  { name: 'tablet-768', viewport: { width: 768, height: 1024 } },
  { name: 'desktop-1440', viewport: { width: 1440, height: 1000 } },
];

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8080',
    browserName: 'chromium',
    channel: 'chrome',
    colorScheme: 'dark',
    trace: 'retain-on-failure',
  },
  projects: viewports.map(({ name, viewport }) => ({ name, use: { viewport } })),
});
