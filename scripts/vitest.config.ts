import { defineConfig } from 'vitest/config'

const reporter = ['text', 'html', 'lcov']
const include = ['src/**/*.ts']
const coverageExclude = ['node_modules/**', 'dist/**', 'tests/**', '**/*.d.ts', '**/*.config.*', '**/mockData.ts']
const provider = 'v8' as const
const coverage = { provider, reporter, include, exclude: coverageExclude }
const exclude = ['**/node_modules/**', '**/dist/**', '.git/**', '**/e2e/**', '**/performance/**']
const test = { environment: 'happy-dom', globals: true, exclude, coverage }

export default defineConfig({ test })
