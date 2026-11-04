import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cli = fileURLToPath(import.meta.resolve('@playwright/test/cli'))
const args = [
  cli,
  'test',
  'tests/e2e/batching.spec.ts',
  '--config',
  'scripts/playwright.config.ts',
  '--workers=1',
  '--reporter=list',
]
const env = { ...process.env, SHAVE_BATCHING_EXPERIMENT: '1' }
const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
