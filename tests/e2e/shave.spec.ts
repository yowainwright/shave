import { test, expect } from '@playwright/test'

test.describe('Shave DOM tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/simple-test.html')
    
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

test.describe('Delimiter functionality tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a test page with multiline content
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .test-delimiter {
            width: 100px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
          }
          .test-pipe {
            width: 80px;
            font-family: Arial, sans-serif;
            font-size: 14px;
          }
          .test-no-delimiter {
            width: 100px;
            font-family: Arial, sans-serif;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="test-delimiter">I am a cow.
Hear me moo!
I don't care.
What you do.</div>
        <div class="test-pipe">item1|item2|item3|item4|item5</div>
        <div class="test-no-delimiter">Regular text with spaces that should work normally</div>
      </body>
      </html>
    `)
    
    // Load the shave script
    await page.addScriptTag({ path: './dist/shave.global.js' })
    
    // Wait for shave to be available
    await page.waitForFunction(() => typeof window.shave === 'function', { timeout: 5000 })
  })

  test('should split text by newline delimiter', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-delimiter', 25, { delimiter: '\n', classname: 'js-newline-shave' })
    })
    
    const shavedElements = await page.locator('.js-newline-shave').count()
    expect(shavedElements).toBe(1)
    
    // Check that ellipsis was added
    const ellipsisElements = await page.locator('.js-shave-char').count()
    expect(ellipsisElements).toBe(1)
  })

  test('should split text by pipe delimiter', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-pipe', 20, { delimiter: '|', classname: 'js-pipe-shave' })
    })
    
    const shavedElements = await page.locator('.js-pipe-shave').count()
    expect(shavedElements).toBe(1)
    
    // Check that ellipsis was added
    const ellipsisElements = await page.locator('.js-shave-char').count()
    expect(ellipsisElements).toBe(1)
  })

  test('should maintain backwards compatibility with default space splitting', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-no-delimiter', 25, { classname: 'js-default-shave' })
    })
    
    const shavedElements = await page.locator('.js-default-shave').count()
    expect(shavedElements).toBe(1)
    
    // Check that ellipsis was added
    const ellipsisElements = await page.locator('.js-shave-char').count()
    expect(ellipsisElements).toBe(1)
  })

  test('should handle delimiter with custom character', async ({ page }) => {
    await page.evaluate(() => {
      window.shave('.test-delimiter', 25, { 
        delimiter: '\n', 
        character: '...',
        classname: 'js-custom-char-delimiter'
      })
    })
    
    const shavedElements = await page.locator('.js-custom-char-delimiter').count()
    expect(shavedElements).toBe(1)
    
    // Check that custom character was used
    const customChar = await page.locator('.js-shave-char').textContent()
    expect(customChar).toBe('...')
  })

  test('should not shave when content fits with delimiter', async ({ page }) => {
    // Set a large height so content should fit
    await page.evaluate(() => {
      window.shave('.test-delimiter', 200, { 
        delimiter: '\n', 
        classname: 'js-no-shave-needed'
      })
    })
    
    // Should not create shaved elements since content fits
    const shavedElements = await page.locator('.js-no-shave-needed').count()
    expect(shavedElements).toBe(0)
    
    const ellipsisElements = await page.locator('.js-shave-char').count()
    expect(ellipsisElements).toBe(0)
  })

  test('should handle empty delimiter gracefully', async ({ page }) => {
    // Test with empty string delimiter (should default to character splitting)
    await page.evaluate(() => {
      window.shave('.test-no-delimiter', 25, { 
        delimiter: '',
        classname: 'js-empty-delimiter'
      })
    })
    
    const shavedElements = await page.locator('.js-empty-delimiter').count()
    expect(shavedElements).toBe(1)
  })
})

test.describe('jQuery shave plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/simple-test.html')
    
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