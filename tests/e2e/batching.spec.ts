import { test, expect } from '@playwright/test'
import { openFixture } from './fixtures.ts'

test.skip(process.env.SHAVE_BATCHING_EXPERIMENT !== '1', 'Opt-in browser performance experiment')

test('compares production Shave with the sequential baseline in a real browser', async ({ page }, testInfo) => {
  test.setTimeout(180_000)
  await openFixture(page)
  const results = await page.evaluate(async () => {
    const fixturePath = '/tests/e2e/batching-fixtures.ts'
    const { benchmarkBatching } = await import(fixturePath)
    const measurements = await benchmarkBatching()
    return measurements
  })
  const { name: browser } = testInfo.project
  const body = JSON.stringify({ browser, ...results }, null, 2)
  await testInfo.attach('batching-results', { body, contentType: 'application/json' })
  const { initial, resize } = results
  const timings = { initial, resize }
  const rows = Object.entries(timings).map(([phase, timing]) => {
    const baselineMs = timing.baselineMs.toFixed(2)
    const currentMs = timing.currentMs.toFixed(2)
    const speedup = `${timing.speedup.toFixed(2)}x`
    const row = { browser, phase, 'baseline (ms)': baselineMs, 'current (ms)': currentMs, speedup }
    return row
  })
  console.table(rows)
  Object.entries(timings).forEach(([phase, timing]) => {
    const limitMs = timing.baselineMs * 1.2
    expect(timing.baselineMs, `${phase} baseline must be measurable`).toBeGreaterThan(0)
    expect(timing.currentMs, `${phase} must stay within 20% of the baseline`).toBeLessThanOrEqual(limitMs)
  })
  results.independent.forEach((result) => {
    expect(result.initialMatches).toBe(true)
    expect(result.resizeMatches).toBe(true)
  })
  results.coupled.forEach((result) => {
    expect(result.initialMatches).toBe(true)
    expect(result.resizeMatches).toBe(true)
  })
})
