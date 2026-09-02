import { defineConfig, devices } from '@playwright/test'

// The sandbox can't reach Supabase, ArcGIS or CARTO, so the dev server runs
// with stub credentials and every network call the page makes is answered
// from real-data fixtures captured from production (see e2e/fixtures).
const PORT = 3100
const ENV =
  'NEXT_PUBLIC_SUPABASE_URL=https://stub.supabase.co ' +
  'NEXT_PUBLIC_SUPABASE_ANON_KEY=stub ' +
  'SUPABASE_SERVICE_ROLE_KEY=stub ' +
  'NEXT_TELEMETRY_DISABLED=1'

export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: {
      executablePath: '/opt/pw-browsers/chromium',
      // Container runs as root; Chromium's setuid sandbox is unavailable there.
      args: [
        '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
        // Software WebGL so MapLibre can draw without a GPU.
        '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
      ],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // Pixel 5 is Chromium-based; iPhone descriptors default to WebKit, which isn't installed here.
    { name: 'mobile', use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `${ENV} npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/pipeline`,
    timeout: 180_000,
    reuseExistingServer: true,
  },
})
