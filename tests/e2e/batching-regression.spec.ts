import { test, expect } from '@playwright/test'
import { openFixture } from './fixtures.ts'

const layouts = [
  'block',
  'isolated-block',
  'flex',
  'grid',
  'nested-flex',
  'table',
  'columns',
  'float',
  'intrinsic',
  'overlap',
  'duplicate',
]

test('preserves sequential truncation across layouts and repeated calls', async ({ page }) => {
  await openFixture(page)
  const results = await page.evaluate(async (layouts) => {
    const fixturePath = '/tests/e2e/batching-fixtures.ts'
    const { compareLayouts } = await import(fixturePath)
    const comparisons = await compareLayouts(layouts)
    return comparisons
  }, layouts)
  expect(results.filter((result) => !result.matches)).toEqual([])
})

test('preserves wrapping around floats inside and outside the parent', async ({ page }) => {
  await openFixture(page)
  const results = await page.evaluate(async () => {
    const fixturePath = '/tests/e2e/batching-fixtures.ts'
    const { compareFloatingLayouts } = await import(fixturePath)
    const comparisons = await compareFloatingLayouts()
    return comparisons
  })
  results.forEach((result) => {
    expect(result.after).toEqual(result.before)
    expect(result.after.textHeight).toBeLessThanOrEqual(60)
  })
})
