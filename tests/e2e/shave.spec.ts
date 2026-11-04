import { test, expect, type Page } from '@playwright/test'
import { openFixture } from './fixtures.ts'

type PageContext = { page: Page }

test.describe('Shave DOM tests', () => {
  test.beforeEach(prepareDOMFixture)

  test('should truncate text on a paragraph with a class', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test', 50)
    })

    const shavedElements = await page.locator('.js-shave').count()
    expect(shavedElements).toBeGreaterThan(0)
  })

  test('should use custom classname', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('#test', 70, { classname: 'js-test' })
    })

    const customElements = await page.locator('.js-test').count()
    expect(customElements).toBe(1)
  })

  test('should use custom character', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('#test-2', 70, { character: '🐔', classname: 'js-chicken' })
    })

    const chickenElements = await page.locator('.js-chicken').count()
    expect(chickenElements).toBe(1)
    const text = await page.locator('.js-shave-char').textContent()
    expect(text).toBe('🐔')
  })

  test('should preserve link attributes', verifyShouldPreserveLinkAttributes)

  test('should handle multiple elements with same class', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-2', 30, { character: '🙌', classname: 'js-iteration-works' })
    })

    const iterationElements = await page.locator('.js-iteration-works').count()
    expect(iterationElements).toBe(4)
  })
})

test.describe('Delimiter functionality tests', () => {
  test.beforeEach(prepareDelimiterFixture)

  test('should split text by newline delimiter', verifyShouldSplitTextByNewlineDelimiter)

  test('should split text by pipe delimiter', verifyShouldSplitTextByPipeDelimiter)

  test('should maintain backwards compatibility with default space splitting', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-no-delimiter', 25, { classname: 'js-default-shave' })
    })

    const shavedElements = await page.locator('.js-default-shave').count()
    expect(shavedElements).toBe(1)
    const ellipsisElements = await page.locator('.js-shave-char').count()
    expect(ellipsisElements).toBe(1)
  })

  test('should handle delimiter with custom character', verifyShouldHandleDelimiterWithCustomCharacter)

  test('should not shave when content fits with delimiter', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-delimiter', 200, {
        delimiter: '\n',
        classname: 'js-no-shave-needed',
      })
    })
    const shavedElements = await page.locator('.js-no-shave-needed').count()
    expect(shavedElements).toBe(0)

    const ellipsisElements = await page.locator('.js-shave-char').count()
    expect(ellipsisElements).toBe(0)
  })

  test('should handle empty delimiter gracefully', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-no-delimiter', 25, {
        delimiter: '',
        classname: 'js-empty-delimiter',
      })
    })

    const shavedElements = await page.locator('.js-empty-delimiter').count()
    expect(shavedElements).toBe(1)
  })
})

test.describe('jQuery shave plugin', () => {
  test.beforeEach(prepareDOMFixture)

  test('should work with jQuery plugin', async ({ page }) => {
    await page.evaluate(() => {
      $('#test-4').shave(50, { classname: 'js-jquery-shave' })
    })

    const jqueryElements = await page.locator('.js-jquery-shave').count()
    expect(jqueryElements).toBe(1)
  })
})

async function verifyShouldPreserveLinkAttributes({ page }: PageContext) {
  const attributes = {
    href: 'https://example.com/read-more',
    target: '_blank',
    className: 'custom-link',
    'data-kind': 'more',
    textContent: 'Read more',
  }
  await page.evaluate((link) => {
    const options = { link }
    window.shave('#test', 70, options)
  }, attributes)
  const firstHiddenText = await page.locator('#test .js-shave').textContent()
  await page.evaluate((link) => {
    const options = { link }
    window.shave('#test', 70, options)
  }, attributes)
  const link = page.locator('a.custom-link')
  await expect(link).toHaveCount(1)
  await expect(page.locator('#test .js-shave')).toHaveCount(1)
  await expect(page.locator('#test .js-shave')).toHaveText(firstHiddenText ?? '')
  await expect(link).toHaveAttribute('href', 'https://example.com/read-more')
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('data-kind', 'more')
  await expect(link).toHaveText('Read more')
}

async function verifyShouldSplitTextByNewlineDelimiter({ page }: PageContext) {
  await page.evaluate(() => {
    window.shave('.test-delimiter', 25, { delimiter: '\n', classname: 'js-newline-shave' })
  })

  const shavedElements = await page.locator('.js-newline-shave').count()
  expect(shavedElements).toBe(1)
  const ellipsisElements = await page.locator('.js-shave-char').count()
  expect(ellipsisElements).toBe(1)
}

async function verifyShouldSplitTextByPipeDelimiter({ page }: PageContext) {
  await page.evaluate(() => {
    window.shave('.test-pipe', 15, { delimiter: '|', classname: 'js-pipe-shave' })
  })

  const shavedElements = await page.locator('.js-pipe-shave').count()
  expect(shavedElements).toBe(1)
  const ellipsisElements = await page.locator('.js-shave-char').count()
  expect(ellipsisElements).toBe(1)
}

async function verifyShouldHandleDelimiterWithCustomCharacter({ page }: PageContext) {
  await page.evaluate(() => {
    window.shave('.test-delimiter', 25, {
      delimiter: '\n',
      character: '...',
      classname: 'js-custom-char-delimiter',
    })
  })

  const shavedElements = await page.locator('.js-custom-char-delimiter').count()
  expect(shavedElements).toBe(1)
  const customChar = await page.locator('.js-shave-char').textContent()
  expect(customChar).toBe('...')
}

async function prepareDelimiterFixture({ page }: PageContext) {
  await openFixture(page, 'delimiter')
}

async function prepareDOMFixture({ page }: PageContext) {
  await openFixture(page)
}
