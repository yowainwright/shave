import { test, expect } from '@playwright/test'

const layouts = [
  'block',
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
  await page.goto('/tests/e2e/simple-test.html')
  const results = await page.evaluate(async (layouts) => {
    const fixturePath = '/tests/e2e/batching-fixtures.ts'
    const { compareLayouts } = await import(fixturePath)
    const comparisons = await compareLayouts(layouts)
    return comparisons
  }, layouts)
  expect(results.filter((result) => !result.matches)).toEqual([])
})
