import { test, expect } from '@playwright/test'

test.describe('Shave DOM tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/simple-test.html')
    
    // Wait a bit for scripts to execute
    await page.waitForTimeout(100)
    
    // Try to set up shave if needed
    await page.evaluate(() => {
      if (window.shave && typeof window.shave.default === 'function') {
        window.shave = window.shave.default
      }
    })
    
    // Wait for the shave function to be available
    await page.waitForFunction(() => typeof window.shave === 'function', { timeout: 5000 })
  })

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
    // The character is in the .js-shave-char element, not .js-chicken
    const text = await page.locator('.js-shave-char').textContent()
    expect(text).toBe('🐔')
  })

  test('should handle multiple elements with same class', async ({ page }) => {
    await page.evaluate(() => {
      // Use a lower height to ensure elements get shaved
      window.shave('.test-2', 30, { character: '🙌', classname: 'js-iteration-works' })
    })
    
    const iterationElements = await page.locator('.js-iteration-works').count()
    expect(iterationElements).toBe(4)
  })
})

test.describe('jQuery shave plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/simple-test.html')
    
    // Wait a bit for scripts to execute
    await page.waitForTimeout(100)
    
    // Try to set up shave if needed
    await page.evaluate(() => {
      if (window.shave && typeof window.shave.default === 'function') {
        window.shave = window.shave.default
      }
    })
    
    // Wait for the shave function and jQuery to be available
    await page.waitForFunction(() => typeof window.shave === 'function' && typeof window.$ === 'function', { timeout: 5000 })
  })

  test('should work with jQuery plugin', async ({ page }) => {
    await page.evaluate(() => {
      $('#test-4').shave(50, { classname: 'js-jquery-shave' })
    })
    
    const jqueryElements = await page.locator('.js-jquery-shave').count()
    expect(jqueryElements).toBe(1)
  })
})