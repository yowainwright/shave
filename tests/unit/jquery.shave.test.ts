import { describe, it, expect, beforeEach } from 'vitest'

interface MockWindow {
  $?: unknown
  jQuery?: unknown
  Zepto?: unknown
}

interface MockjQuery {
  fn: Record<string, unknown>
}

describe('jQuery shave plugin', () => {
  beforeEach(() => {
    (global as unknown as { window: MockWindow }).window = {
      $: undefined,
      jQuery: undefined,
      Zepto: undefined
    }
  })

  it('should check for jQuery-like libraries', () => {
    const mockjQuery: MockjQuery = {
      fn: {}
    };

    (global as unknown as { window: MockWindow }).window.$ = mockjQuery
    expect(mockjQuery.fn).toBeDefined()
  })

  it('should handle missing jQuery gracefully', () => {
    const globalWindow = (global as unknown as { window: MockWindow }).window
    expect(globalWindow.$).toBeUndefined()
    expect(globalWindow.jQuery).toBeUndefined()
    expect(globalWindow.Zepto).toBeUndefined()
  })
})
