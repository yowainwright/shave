import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

const forbidOnly = Boolean(process.env.CI)
const retries = forbidOnly ? 2 : 0
const workers = forbidOnly ? 1 : undefined
const trace = 'on-first-retry' as const
const use = { baseURL: 'http://localhost:8080', trace }
const reuseExistingServer = !forbidOnly
const stdout = 'ignore' as const
const stderr = 'ignore' as const
const webServer = {
  command: 'pnpm exec vite --host 127.0.0.1 --port 8080',
  cwd: '..',
  port: 8080,
  reuseExistingServer,
  timeout: 30_000,
  stdout,
  stderr,
}
const projects = ['chromium', 'firefox', 'webkit'].map(createProject)

export default defineConfig({
  testDir: '../tests/e2e',
  fullyParallel: true,
  forbidOnly,
  retries,
  workers,
  reporter: 'html',
  use,
  webServer,
  projects,
})

function createProject(name: string): NonNullable<PlaywrightTestConfig['projects']>[number] {
  const deviceNames: Record<string, string> = {
    chromium: 'Desktop Chrome',
    firefox: 'Desktop Firefox',
    webkit: 'Desktop Safari',
  }
  const use = { ...devices[deviceNames[name]] }
  const project = { name, use }
  return project
}
