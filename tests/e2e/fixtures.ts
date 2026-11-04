import type { Page } from '@playwright/test'

const delimiterMarkup = `
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
`

export async function openFixture(page: Page, variant: 'default' | 'delimiter' = 'default'): Promise<void> {
  if (variant === 'delimiter') {
    await page.setContent(delimiterMarkup)
    await page.addScriptTag({ path: './dist/shave.global.js' })
  } else {
    await page.goto('/tests/e2e/simple-test.html')
  }
  await page.waitForFunction("typeof window.shave === 'function'")
}
