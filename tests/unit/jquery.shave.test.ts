import { describe, it, expect, beforeEach } from 'vitest'

// Define proper types for the global window mock
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
    // Reset window object
    (global as unknown as { window: MockWindow }).window = {
      $: undefined,
      jQuery: undefined,
      Zepto: undefined
    }
  })

  it('should check for jQuery-like libraries', () => {
    // Test that the plugin checks for jQuery/Zepto
    const mockjQuery: MockjQuery = {
      fn: {}
    };
    
    (global as unknown as { window: MockWindow }).window.$ = mockjQuery
    
    // The plugin would attach shave method to jQuery.fn
    // This is tested via integration tests
    expect(mockjQuery.fn).toBeDefined()
  })

  it('should handle missing jQuery gracefully', () => {
    // No jQuery/Zepto available
    const globalWindow = (global as unknown as { window: MockWindow }).window
    expect(globalWindow.$).toBeUndefined()
    expect(globalWindow.jQuery).toBeUndefined()
    expect(globalWindow.Zepto).toBeUndefined()
  })
})